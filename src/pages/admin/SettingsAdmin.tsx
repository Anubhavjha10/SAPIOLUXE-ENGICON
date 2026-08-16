import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle, Shield, Server } from 'lucide-react';

export const SettingsAdmin: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-outline-variant pb-4">
        <h1 className="font-headline-lg text-2xl font-bold text-primary">Site Settings & Security</h1>
        <p className="font-body-md text-xs text-secondary">
          Manage administrative portal session preferences and operational system security status.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> Settings Saved!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest ghost-border p-6 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Shield className="w-5 h-5 text-tertiary-fixed-dim" />
            <h3 className="font-headline-md text-base">Current Admin Account</h3>
          </div>
          <div className="space-y-1 text-xs font-mono-technical text-secondary pt-2">
            <p>Admin Email: <span className="text-primary font-bold">{user?.email}</span></p>
            <p>Admin Name: <span className="text-primary font-bold">{user?.displayName}</span></p>
            <p>Role: <span className="text-tertiary-fixed-dim font-bold uppercase">{user?.role}</span></p>
          </div>
        </div>

        <div className="bg-surface-container-lowest ghost-border p-6 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Server className="w-5 h-5 text-tertiary-fixed-dim" />
            <h3 className="font-headline-md text-base">Media & Security Status</h3>
          </div>
          <div className="space-y-1 text-xs font-mono-technical text-secondary pt-2">
            <p>Data Synchronization: <span className="text-emerald-500 font-bold">Active & Live</span></p>
            <p>Media Library System: <span className="text-emerald-500 font-bold">Operational</span></p>
            <p>Security Protocols: <span className="text-emerald-500 font-bold">Enforced (5-Min Inactivity Timeout)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

