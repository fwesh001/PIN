'use client';

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon, PencilIcon, ShieldIcon, CheckIcon, CrossIcon } from '@/components/Icons';
import { useToast } from '@/components/Toast';

interface Profile {
  name: string;
  email: string;
  phone: string;
  affiliation: string;
  country: string;
  profilePicture: string | null;
}

const inputClass =
  'w-full rounded-md border border-blue-200 bg-white px-4 py-2.5 text-sm text-blue-950 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400 outline-none transition-all';

const labelClass =
  'block text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1.5';

export default function AuthorSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  // Prefilled from the logged-in author (passed via initial props in a
  // server wrapper). For now we read from the session on the client.
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    phone: '',
    affiliation: '',
    country: '',
    profilePicture: null,
  });
  const [loaded, setLoaded] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Password section
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Load current profile from the session-backed settings endpoint.
  async function loadProfile() {
    try {
      const res = await fetch('/api/user/settings');
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          affiliation: data.affiliation ?? '',
          country: data.country ?? '',
          profilePicture: data.profilePicture ?? null,
        });
      }
    } catch {
      /* ignore */
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        update('profilePicture', data.url);
        toast.success('Profile picture uploaded.');
      } else {
        toast.error(data.error || 'Upload failed.');
      }
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          affiliation: profile.affiliation,
          country: profile.country,
          profilePicture: profile.profilePicture,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Profile updated successfully.');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to update profile.');
      }
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter both current and new passwords.');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setShowPassword(false);
      } else {
        toast.error(data.error || 'Failed to change password.');
      }
    } catch {
      toast.error('Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  }

  const initial = (profile.name || 'A').charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-1 text-2xl font-bold text-blue-950 dark:text-blue-100">
        Account Settings
      </h1>
      <p className="mb-6 text-sm text-blue-600 dark:text-blue-400">
        Manage your profile, contact details, and password.
      </p>

      {/* ── Profile picture ─────────────────────────────────────── */}
      <div className="mb-8 flex items-center gap-4 rounded-xl border border-blue-200 bg-white p-4 dark:border-blue-800 dark:bg-blue-900/40">
        {profile.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt={profile.name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-300"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            {initial}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            Profile Picture
          </p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/60"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            {uploading ? 'Uploading…' : 'Upload / Change'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* ── Card 1: Name & Contact Info ────────────────────────── */}
      <form onSubmit={saveProfile} className="mb-6 rounded-xl border border-blue-200 bg-white p-5 dark:border-blue-800 dark:bg-blue-900/40">
        <div className="mb-4 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-blue-950 dark:text-blue-100">
            Name &amp; Contact Info
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>Name</label>
            <input id="name" value={profile.name} onChange={(e) => update('name', e.target.value)} className={inputClass} placeholder="Full name" />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input id="email" type="email" value={profile.email} onChange={(e) => update('email', e.target.value)} className={inputClass} placeholder="email@university.edu" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className={labelClass}>Phone Number</label>
            <input id="phone" value={profile.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} placeholder="+234 …" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" disabled={savingProfile} className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300">
            {savingProfile ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* ── Card 2: Affiliation & Country ─────────────────────── */}
      <form onSubmit={saveProfile} className="mb-6 rounded-xl border border-blue-200 bg-white p-5 dark:border-blue-800 dark:bg-blue-900/40">
        <div className="mb-4 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-blue-950 dark:text-blue-100">
            Affiliation &amp; Country
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="affiliation" className={labelClass}>Affiliation</label>
            <input id="affiliation" value={profile.affiliation} onChange={(e) => update('affiliation', e.target.value)} className={inputClass} placeholder="Institution" />
          </div>
          <div>
            <label htmlFor="country" className={labelClass}>Country</label>
            <input id="country" value={profile.country} onChange={(e) => update('country', e.target.value)} className={inputClass} placeholder="Country" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" disabled={savingProfile} className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300">
            {savingProfile ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* ── Card 3: Change Password ───────────────────────────── */}
      <div className="rounded-xl border border-blue-200 bg-white p-5 dark:border-blue-800 dark:bg-blue-900/40">
        <div className="mb-4 flex items-center gap-2">
          <ShieldIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-blue-950 dark:text-blue-100">
            Change Password
          </h2>
        </div>

        {!showPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/60"
          >
            <PencilIcon className="h-4 w-4" />
            Change Password
          </button>
        ) : (
          <form onSubmit={savePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className={labelClass}>Current Password</label>
              <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
            </div>
            <div>
              <label htmlFor="newPassword" className={labelClass}>New Password</label>
              <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-blue-300 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/60"
              >
                <CrossIcon className="h-3.5 w-3.5" />
                Cancel
              </button>
              <button type="submit" disabled={savingPassword} className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:text-blue-950 dark:hover:bg-green-400">
                <CheckIcon className="h-3.5 w-3.5" />
                {savingPassword ? 'Saving…' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
