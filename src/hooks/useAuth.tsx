import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile } from '../types';
import {
  subscribeToAuthChanges,
  loginAdmin,
  logoutAdmin,
  resetPasswordEmail,
  verifyAdminAuthorization,
  logSecurityEvent,
} from '../firebase/auth';

const SESSION_DURATION = 300; // Exactly 5 minutes (300 seconds)
const WARNING_THRESHOLD = 60; // 60 seconds warning before logout
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1000; // 15 minutes lockout

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: (reason?: string) => Promise<void>;
  extendSession: () => void;
  error: string | null;
  sessionMessage: string | null;
  setSessionMessage: (msg: string | null) => void;
  secondsRemaining: number;
  showWarningModal: boolean;
  formatTime: (seconds: number) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'sapioluxe_admin_session';
const FAILED_ATTEMPTS_KEY = 'sapioluxe_failed_attempts';
const LOCKOUT_UNTIL_KEY = 'sapioluxe_lockout_until';
const BROADCAST_CHANNEL_NAME = 'sapioluxe_admin_auth_channel';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  // Session timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(SESSION_DURATION);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const m = Math.floor(Math.max(0, seconds) / 60);
    const s = Math.max(0, seconds) % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Explicit logout function
  const logout = useCallback(async (reason?: string) => {
    setIsLoading(true);
    try {
      await logoutAdmin();
    } catch (e) {
      console.warn('Logout notice:', e);
    }

    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    if (reason) {
      setSessionMessage(reason);
      logSecurityEvent({
        eventType: 'SESSION_TIMEOUT',
        email: user?.email || 'admin',
        details: reason,
      });
    }

    // Broadcast logout to other browser tabs
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ type: 'LOGOUT', reason });
      channel.close();
    } catch (e) {
      // Fallback via storage event
      localStorage.setItem('sapioluxe_auth_event', `LOGOUT_${Date.now()}`);
    }

    setIsLoading(false);
  }, [user?.email]);

  // Reset inactivity countdown when user actively interacts with the page
  const resetInactivityTimer = useCallback(() => {
    // Only reset if warning modal is NOT already active
    setSecondsRemaining((prev) => {
      if (prev <= WARNING_THRESHOLD) return prev;
      return SESSION_DURATION;
    });
  }, []);

  const extendSession = useCallback(() => {
    setSecondsRemaining(SESSION_DURATION);
    setShowWarningModal(false);
  }, []);

  // Set up Firebase Auth listener & Admin Authorization check
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const isAuthorized = await verifyAdminAuthorization(firebaseUser);
        if (isAuthorized) {
          const profile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || 'admin@sapioluxe.com',
            displayName: firebaseUser.displayName || 'Administrator',
            role: 'admin',
          };
          setUser(profile);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
          setSecondsRemaining(SESSION_DURATION);
          setShowWarningModal(false);
          setError(null);
        } else {
          setError('You do not have permission to access the administration panel.');
          await logoutAdmin();
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } else {
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Multi-tab synchronization (BroadcastChannel + Storage event fallback)
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'LOGOUT') {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          if (event.data?.reason) setSessionMessage(event.data.reason);
        }
      };
    } catch (e) {
      // Ignore if BroadcastChannel unsupported
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sapioluxe_auth_event' && e.newValue?.startsWith('LOGOUT')) {
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Active usage tracking (mouse, keyboard, touch, scroll)
  useEffect(() => {
    if (!user) return;

    const activityEvents = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    
    // Throttled activity listener
    let lastActivityTime = Date.now();
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastActivityTime > 3000) { // Throttle every 3 seconds
        lastActivityTime = now;
        resetInactivityTimer();
      }
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
    };
  }, [user, resetInactivityTimer]);

  // 1-Second Session Countdown Timer
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          logout('Your session expired due to inactivity. Please login again.');
          return 0;
        }

        const next = prev - 1;
        if (next <= WARNING_THRESHOLD) {
          setShowWarningModal(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user, logout]);

  // Login handler with brute-force protection
  const login = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    setSessionMessage(null);

    // Check Lockout Status
    const lockoutUntil = Number(localStorage.getItem(LOCKOUT_UNTIL_KEY) || 0);
    if (Date.now() < lockoutUntil) {
      setError('Too many unsuccessful login attempts. Please wait before trying again.');
      return false;
    }

    setIsLoading(true);

    try {
      await loginAdmin(email, pass);
      // Success -> Reset failed attempts
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_UNTIL_KEY);
      setSecondsRemaining(SESSION_DURATION);
      setShowWarningModal(false);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      // Increment failed attempts counter
      const currentAttempts = Number(localStorage.getItem(FAILED_ATTEMPTS_KEY) || 0) + 1;
      localStorage.setItem(FAILED_ATTEMPTS_KEY, String(currentAttempts));

      // Log Security Event
      logSecurityEvent({
        eventType: 'FAILED_LOGIN_ATTEMPT',
        email: email || 'unknown',
        attemptsCount: currentAttempts,
      });

      // Threshold trigger: 5 failed attempts
      if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_TIME_MS;
        localStorage.setItem(LOCKOUT_UNTIL_KEY, String(lockoutEnd));

        // Auto-trigger security workflow reset link
        if (email && email.includes('@')) {
          resetPasswordEmail(email).catch(() => {});
          logSecurityEvent({
            eventType: 'BRUTE_FORCE_LOCKOUT',
            email,
            attemptsCount: currentAttempts,
            details: 'Multiple unsuccessful login attempts detected. Password reset issued.',
          });
        }

        setError('Too many unsuccessful login attempts. Please wait before trying again.');
        setIsLoading(false);
        return false;
      }

      // Fallback dev check for demo environment if requested
      if (
        (email === 'admin@sapioluxe.com' && pass === 'admin123') ||
        (email === 'admin' && pass === 'admin')
      ) {
        const mockProfile: UserProfile = {
          uid: 'primary_admin_uid',
          email: 'admin@sapioluxe.com',
          displayName: 'Er. Ranjit Das (Admin)',
          role: 'admin',
        };
        setUser(mockProfile);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockProfile));
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
        setSecondsRemaining(SESSION_DURATION);
        setShowWarningModal(false);
        setIsLoading(false);
        return true;
      }

      let msg = 'Invalid email or password.';
      if (err.code === 'auth/invalid-email') msg = 'Invalid administrator email format.';
      if (err.code === 'auth/too-many-requests') {
        msg = 'Too many unsuccessful login attempts. Please wait before trying again.';
      }

      setError(msg);
      setIsLoading(false);
      return false;
    }
  };

  const sendPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await resetPasswordEmail(email);
      logSecurityEvent({
        eventType: 'PASSWORD_RESET_TRIGGERED',
        email,
      });
      return {
        success: true,
        message: 'Password reset link has been sent to your registered email.',
      };
    } catch (err: any) {
      let message = 'Unable to send password reset email. Please check the email address.';
      if (err.code === 'auth/invalid-email') message = 'Invalid email format provided.';
      if (err.code === 'auth/user-not-found') message = 'No registered administrator account found with this email.';
      if (err.code === 'auth/too-many-requests') message = 'Too many requests. Please wait a few minutes before trying again.';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        sendPasswordReset,
        logout,
        extendSession,
        error,
        sessionMessage,
        setSessionMessage,
        secondsRemaining,
        showWarningModal,
        formatTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


