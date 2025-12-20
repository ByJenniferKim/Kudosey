'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UsernamePromptModal from '../components/UsernamePromptModal';

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  username_confirmed: boolean;
  bio: string | null;
  role: 'buyer' | 'seller';
};

const BIO_MAX= 200;

function prettyProvider(provider: string) {
  if (!provider) return 'Unknown';
  if (provider === 'discord') return 'Discord';
  if (provider === 'email') return 'Email';
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  type SellerApplicationRow = {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    decision_note: string | null;
  };

  const [sellerApp, setSellerApp] = useState<SellerApplicationRow | null>(null);
  const [loadingSellerApp, setLoadingSellerApp] = useState(false);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

  const [showSellerForm, setShowSellerForm] = useState(false);
  const [discordName, setDiscordName] = useState('');
  const [vrchatName, setVrchatName] = useState('');
  const [sellerContactEmail, setSellerContactEmail] = useState('');
  const [storeOrSocialLink, setStoreOrSocialLink] = useState('');
  const [tosAgreed, setTosAgreed] = useState(false);

  // 1) Load auth user
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoadingUser(true);
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;

      setUser(data.user ?? null);
      setLoadingUser(false);
    }

    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // 2) Load profile row once we have a user
  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    async function loadProfile() {

      if (!user?.id) return;

      setLoadingProfile(true);

      const { data: existing, error: readErr } = await supabase
      .from('profiles')
      .select('id, username, display_name, username_confirmed, bio, role')
      .eq('id', user.id)
      .maybeSingle();

      if (cancelled) return;

      if (readErr) {
        console.error('Error loading profile:', readErr);
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      if (!existing) {
        const { error: createErr } = await supabase.from('profiles').insert({
          id: user.id,
          display_name: null,
          username: null,
          username_confirmed: false,
          bio: null,
        });

        if (cancelled) return;

        if (createErr) {
          console.warn('Profile insert issue (may already existis):', createErr);
        }

        const { data: created, error: readErr2 } = await supabase
        .from('profiles')
        .select('id, username, display_name, username_confirmed, bio, role')
        .eq('id', user.id)
        .maybeSingle();

        if (cancelled) return;

        if (readErr2) {
          console.error('Error re-loading profile:', readErr2);
          setProfile(null);
          setLoadingProfile(false);
          return;
        }

        setProfile(created ?? null);
        setDisplayName(created?.display_name ?? '');
        setBio(created?.bio ?? '');

        // Loads latest seller application
        setLoadingSellerApp(true);
        const { data: apps, error: appsErr } = await supabase
        .from('seller_applications')
        .select('id, status, created_at, decision_note')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

        if (appsErr) {
          console.error('Error loading seller application:', appsErr);
          setSellerApp(null);
        } else {
          setSellerApp(apps?.[0] ?? null);
        }
        setLoadingSellerApp(false);

        setLoadingProfile(false);
        return;
      }

      setProfile(existing);
      setDisplayName(existing.display_name ?? '');
      setBio(existing.bio ?? '');

      // Loads latest seller application
      setLoadingSellerApp(true);
      const { data: apps, error: appsErr } = await supabase
      .from('seller_applications')
      .select('id, status, created_at, decision_note')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

      if (appsErr) {
        console.error('Error loading seller application:', appsErr);
        alert(
          'Seller applications error: ' +
          JSON.stringify(appsErr, Object.getOwnPropertyNames(appsErr ?? {}), 2)
        );
        setSellerApp(null);
      } else {
        setSellerApp(apps?.[0] ?? null);
      }
      setLoadingSellerApp(false);

      setLoadingProfile(false);
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const providerRaw =
    (user?.app_metadata as any)?.provider ||
    (user?.app_metadata as any)?.providers?.[0] ||
    '';

  const providerLabel = useMemo(() => prettyProvider(String(providerRaw)), [providerRaw]);

  const usernameConfirmed = !!profile?.username_confirmed;

  async function handleSave() {
    if (!user?.id) return;

    setSaving(true);
    setSaveMsg(null);
    setSaveErr(null);

    const payload = {
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
    };

    const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);

    if (error) {
      setSaveErr(error.message);
      setSaving(false);
      return;
    }

    setSaveMsg('Saved.');
    setSaving(false);

    // Refresh profile view so status stays accurate
    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, username_confirmed, bio, role')
      .eq('id', user.id)
      .maybeSingle();

    setProfile(data ?? null);
  }

  async function handleApplySeller() {
    if (!user?.id || !profile) return;

    if (!discordName.trim()) {
      setSaveErr('Please enter your Discord name.');
      return;
    }
    if (!vrchatName.trim()) {
      setSaveErr('Please enter your VRChat name.');
      return;
    }
    if (!sellerContactEmail.trim() && !user.email) {
      setSaveErr('Please enter a contact email.');
      return;
    }
    if (!storeOrSocialLink.trim()) {
      setSaveErr('Please provide a store or social link.');
      return;
    }
    if (!tosAgreed) {
      setSaveErr('You must agree to the Seller Terms & Fees to apply.');
      return;
    }

    setSaveMsg(null);
    setSaveErr(null);

    const { error } = await supabase.from('seller_applications').insert({
      user_id: user.id,
      display_name: profile.display_name ?? null,
      discord_name: discordName.trim() || null,
      vrchat_name: vrchatName.trim() || null,
      contact_email: sellerContactEmail.trim() || (user.email ?? null),
      store_or_social_link: storeOrSocialLink.trim() || null,
      tos_agreed: tosAgreed,
    });

    if (error) {
      setSaveErr(error.message);
      return;
    }

    // Re-fetch latest application so UI updates without reload
    setLoadingSellerApp(true);
    const { data: apps, error: appsErr } = await supabase
    .from('seller_applications')
    .select('id, status, created_at, decision_note')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1);

    if (appsErr) {
      console.error('Error reloading seller application:', appsErr);
      setSellerApp(null);
    } else {
      setSellerApp(apps?.[0] ?? null);
    }
    setLoadingSellerApp(false);

    setSaveMsg('Application submitted.');
    setShowSellerForm(false);
  }

  function onUsernameModalClose() {
    setIsUsernameModalOpen(false);
  }

  // When modal finishes saving, we want to re-fetch the profile so the status flips to confirmed
  async function refreshProfile() {
    if (!user?.id) return;
    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, username_confirmed, bio, role')
      .eq('id', user.id)
      .maybeSingle();
    setProfile(data ?? null);
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />

      <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white md:text-5xl">
              Account Settings
            </h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Manage your profile and account settings
            </p>
          </div>

          {/* Logged out / loading states */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            {loadingUser ? (
              <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
            ) : !user ? (
              <div className="space-y-4">
                <p className="text-zinc-700 dark:text-zinc-300">You’re not logged in.</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Use the <span className="font-medium">Login</span> button in the navbar to sign in.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Status */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Profile status</p>

                      {!loadingProfile && profile ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={[
                              'inline-flex items-center rounded-full border px-3 py-1 text-sm',
                              usernameConfirmed
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200'
                                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200',
                            ].join(' ')}
                          >
                            {usernameConfirmed ? '✅ Username confirmed' : '⚠️ Username not confirmed'}
                          </span>

                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            Logged in with {providerLabel}
                          </span>
                        </div>
                      ) : loadingProfile ? (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading profile…</p>
                      ) : (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          No profile found yet.
                        </p>
                      )}
                    </div>

                    {!loadingProfile && profile && !usernameConfirmed && (
                      <button
                        onClick={() => setIsUsernameModalOpen(true)}
                        className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                      >
                        Confirm username
                      </button>
                    )}
                  </div>

                  {/* Helpful note */}
                  {!loadingProfile && profile && !usernameConfirmed && (
                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                      You’ll need to confirm your username before it becomes your public @handle.
                    </p>
                  )}
                </div>

                {/* 2-column layout */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Public Profile */}
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                      Public profile
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      This is what other people will see.
                    </p>

                    <div className="mt-5 space-y-4">
                      <div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Username</p>
                        <p className="mt-1 text-base font-semibold text-black dark:text-white">
                          {profile?.username ? `@${profile.username}` : 'Not set'}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          Your username becomes locked after confirmation.
                        </p>
                      </div>

                      <div>
                        <label className="text-sm text-zinc-500 dark:text-zinc-400">
                          Display name
                        </label>
                        <input
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Your name"
                          className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-zinc-500 dark:text-zinc-400">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
                          maxLength={BIO_MAX}
                          placeholder="Write a short bio…"
                          rows={4}
                          className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                        />
                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            <span>Tell us about yourself. </span>
                            <span>
                                {bio.length}/{BIO_MAX}
                            </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleSave}
                          disabled={saving || loadingProfile || !profile}
                          className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
                        >
                          {saving ? 'Saving…' : 'Save'}
                        </button>

                        {saveMsg && (
                          <span className="text-sm text-emerald-600 dark:text-emerald-400">
                            {saveMsg}
                          </span>
                        )}
                        {saveErr && (
                          <span className="text-sm text-red-600 dark:text-red-400">
                            {saveErr}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account & Security */}
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                      Account & security
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Private account details.
                    </p>

                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Seller Status
                        </p>

                        {loadingProfile || loadingSellerApp ? (
                          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            Loading...
                          </p>
                        ) : profile?.role === 'seller' ? (
                          <p className="mt-1 font-medium text-black dark:text-white">
                            ✅ You are a seller.
                          </p>
                        ) : sellerApp?.status === 'pending' ? (
                          <p className="mt-1 font-medium text-black dark:text-white">
                            ⏳ Application pending review.
                          </p>
                        ) : (
                          <div className="mt-3">
                            {!showSellerForm ? (
                              <div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                  Apply to become a seller to unlock portfolio and listings.
                                </p>

                                <button
                                onClick={() => {
                                  setShowSellerForm(true);
                                  setSaveErr(null);
                                  setSaveMsg(null);

                                  // prefills contact email from login
                                  setSellerContactEmail(user.email ?? '');
                                }}
                                className="mt-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95">
                                Start seller application
                                </button>
                              </div>
                            ) : (
                              <div className="mt-3 space-y-3">
                                <div>
                                  <label className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Discord name
                                  </label>
                                  <input
                                  value={discordName}
                                  onChange={(e) => setDiscordName(e.target.value)}
                                  placeholder="example: name#1234"
                                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" />
                                </div>

                                <div>
                                  <label className="text-sm text-zinc-500 dark:text-zinc-400">
                                    VRChat name
                                  </label>
                                  <input
                                  value={vrchatName}
                                  onChange={(e) => setVrchatName(e.target.value)}
                                  placeholder="Example: YourVRChatName"
                                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" />
                                </div>

                                <div>
                                  <label className="text-sm text-zinc-500 dark:text-zinc-400">Contact email</label>
                                  <input
                                  value={sellerContactEmail}
                                  onChange={(e) => setSellerContactEmail(e.target.value)}
                                  placeholder="you@example.com"
                                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" />
                                </div>

                                <div>
                                  <label className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Store or social link
                                  </label>
                                  <input
                                  value={storeOrSocialLink}
                                  onChange={(e) => setStoreOrSocialLink(e.target.value)}
                                  placeholder="Gumroad / Jinxxy / Payhip / Twitter / etc."
                                  className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" />
                                </div>

                                <label className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                                  <input
                                  type="checkbox"
                                  className="mt-1"
                                  checked={tosAgreed}
                                  onChange={(e) => setTosAgreed(e.target.checked)} />
                                  <span>
                                    I agree to the{' '}
                                    <Link
                                    href="/terms/sellers"
                                    className="text-purple-600 hover:underline dark:text-purple-400"
                                    target="_blank"
                                    rel="noreferrer" >
                                      Seller Terms & Fees
                                    </Link>
                                    . (Coming soon)
                                  </span>
                                </label>

                                <div className="flex items-center gap-2">
                                  <button
                                  onClick={handleApplySeller}
                                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95" >
                                    Submit application
                                  </button>

                                  <button
                                  onClick={() => setShowSellerForm(false)}
                                  className="rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900">
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Provider</p>
                        <p className="mt-1 font-medium text-black dark:text-white">
                          {providerLabel}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Email</p>
                        <p className="mt-1 font-medium text-black dark:text-white">
                          {user.email ?? 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Username modal */}
                {user?.id && (
                  <UsernamePromptModal
                    isOpen={isUsernameModalOpen}
                    onClose={async () => {
                      onUsernameModalClose();
                      await refreshProfile();
                    }}
                    userId={user.id}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
