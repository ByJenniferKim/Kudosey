'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
};

function normalizeUsername(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

export default function UsernamePromptModal({ isOpen, onClose, userId }: Props) {
  const [username, setUsername] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const normalized = useMemo(() => normalizeUsername(username), [username]);
  const tooShort = normalized.length > 0 && normalized.length < 3;
  const tooLong = normalized.length > 20;

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
        setLoadingProfile(true);
        setErrorMsg(null);

        const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

        if (!error && data?.username) {
            setUsername(data.username);
        }

        setLoadingProfile(false);
    };

    load();
  }, [isOpen, userId]);

  if (!isOpen) return null;
  
  const save = async () => {
    setErrorMsg(null);

    if (!normalized) {
      setErrorMsg('Please enter a username.');
      return;
    }
    if (tooShort) {
      setErrorMsg('Username must be at least 3 characters.');
      return;
    }
    if (tooLong) {
      setErrorMsg('Username must be 20 characters or less.');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        username: normalized,
        display_name: normalized,
        username_confirmed: true,
      })
      .eq('id', userId);

    if (error) {
      // Unique violation in Postgres is often 23505
      if ((error as any).code === '23505') {
        setErrorMsg('That username is already taken. Try another.');
      } else {
        setErrorMsg(error.message);
      }
      setSaving(false);
      return;
    }

    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Create your Kudose username
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            This is how you’ll appear to others.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {errorMsg}
          </div>
        )}

        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. neon_fox"
          className="w-full rounded-full border border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
        />

        <div className="mt-2 text-xs text-zinc-500">
          Preview: <span className="font-medium">{normalized || '—'}</span>
          {tooShort && <span className="ml-2 text-red-600">Too short</span>}
          {tooLong && <span className="ml-2 text-red-600">Too long</span>}
        </div>

        <button
          type="button"
          disabled={saving || loadingProfile}
          onClick={save}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
        >
          {loadingProfile ? 'Loading...' : saving ? 'Saving...' : 'Save username'}
        </button>
      </div>
    </div>
  );
}
