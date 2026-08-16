import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { auth } from './config';
import { getDocumentData, saveDocumentData, addDocumentData } from './firestore';

export interface AdminRecord {
  uid: string;
  email: string;
  role: 'admin';
  active: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export const loginAdmin = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const resetPasswordEmail = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

export const logoutAdmin = async () => {
  return await firebaseSignOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Check if a UID belongs to an active administrator
 */
export const isAdminUser = async (uid: string): Promise<AdminRecord | null> => {
  if (!uid) return null;
  try {
    const adminDoc = await getDocumentData<AdminRecord>('admins', uid);
    if (adminDoc && adminDoc.active === true && adminDoc.role === 'admin') {
      return adminDoc;
    }
    return null;
  } catch (err) {
    console.warn('isAdminUser check error:', err);
    return null;
  }
};

/**
 * Verifies and initializes the administrator authorization record for a Firebase User.
 * Uses exact Firebase Auth UID as document key (admins/{uid}).
 */
export const verifyAdminAuthorization = async (user: User): Promise<boolean> => {
  if (!user || !user.uid) return false;

  const uid = user.uid;
  const email = user.email || 'admin@sapioluxe.com';

  try {
    const adminDoc = await getDocumentData<AdminRecord>('admins', uid);

    // Development Debug Information (Requirement #11)
    if (import.meta.env.DEV) {
      console.log('--- Firebase Admin Auth Verification ---');
      console.log(`Firebase UID: ${uid}`);
      console.log(`Firebase Email: ${email}`);
      console.log(`Admin Document Exists: ${!!adminDoc}`);
      console.log(`Admin Active: ${adminDoc ? adminDoc.active : 'N/A'}`);
      console.log(`Admin Role: ${adminDoc ? adminDoc.role : 'N/A'}`);
      console.log('----------------------------------------');
    }

    // Existing Admin Document Verification
    if (adminDoc) {
      if (adminDoc.active === true && adminDoc.role === 'admin') {
        // Update last login timestamp
        await saveDocumentData('admins', uid, {
          lastLoginAt: new Date().toISOString(),
        });
        return true;
      }
      return false;
    }

    // First Admin Setup: Auto-provision admins/{uid} for initial authenticated admin user
    const newAdminDoc: AdminRecord = {
      uid: uid,
      email: email,
      role: 'admin',
      active: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    await saveDocumentData('admins', uid, newAdminDoc);

    if (import.meta.env.DEV) {
      console.log(`[First Admin Setup] Provisioned admins/${uid} record successfully.`);
    }

    return true;
  } catch (error) {
    console.error('Error during admin verification/setup:', error);
    return false;
  }
};

/**
 * Log security alerts & failed attempt statistics in Firestore
 */
export const logSecurityEvent = async (event: {
  eventType: 'FAILED_LOGIN_ATTEMPT' | 'BRUTE_FORCE_LOCKOUT' | 'PASSWORD_RESET_TRIGGERED' | 'SESSION_TIMEOUT';
  email: string;
  attemptsCount?: number;
  details?: string;
}) => {
  try {
    await addDocumentData('securityLogs', {
      ...event,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    });
  } catch (e) {
    console.warn('Unable to write security log:', e);
  }
};


