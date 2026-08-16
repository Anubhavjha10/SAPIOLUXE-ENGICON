import React, { useState, useEffect } from 'react';
import { getContactSettings, updateContactSettings } from '../../services/contactService';
import { ContactSettings } from '../../types';
import { Save, CheckCircle } from 'lucide-react';

export const ContactAdmin: React.FC = () => {
  const [contact, setContact] = useState<ContactSettings | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getContactSettings().then(setContact);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    await updateContactSettings(contact);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!contact) return <div className="p-8">Loading Contact Settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-outline-variant pb-4">
        <h1 className="font-headline-lg text-2xl font-bold text-primary">Contact Info CMS</h1>
        <p className="font-body-md text-xs text-secondary">
          Manage Headquarters Address, Desk Phone Lines, and Email.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> Contact Info Saved!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Headquarters Name</label>
          <input
            type="text"
            value={contact.headquarters}
            onChange={(e) => setContact({ ...contact, headquarters: e.target.value })}
            className="w-full bg-surface-container border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Office Address</label>
          <textarea
            rows={3}
            value={contact.address}
            onChange={(e) => setContact({ ...contact, address: e.target.value })}
            className="w-full bg-surface-container border px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-caps text-xs text-secondary mb-1">Primary Phone</label>
            <input
              type="text"
              value={contact.phonePrimary}
              onChange={(e) => setContact({ ...contact, phonePrimary: e.target.value })}
              className="w-full bg-surface-container border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block font-label-caps text-xs text-secondary mb-1">Secondary Phone</label>
            <input
              type="text"
              value={contact.phoneSecondary}
              onChange={(e) => setContact({ ...contact, phoneSecondary: e.target.value })}
              className="w-full bg-surface-container border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Official Email</label>
          <input
            type="email"
            value={contact.emailPrimary}
            onChange={(e) => setContact({ ...contact, emailPrimary: e.target.value })}
            className="w-full bg-surface-container border px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-on-primary px-8 py-3.5 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors flex items-center gap-2 font-bold"
        >
          <Save className="w-4 h-4" /> Save Contact Details
        </button>
      </form>
    </div>
  );
};
