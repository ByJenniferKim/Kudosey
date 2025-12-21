'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

type AppRow = {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;

  discord_name: string | null;
  vrchat_name: string | null;
  contact_email: string | null;
  store_or_social_link: string | null;

  decision_note: string | null;
};

export default function AdminSellerApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  const [apps, setApps] = useState<AppRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if current user is admin
  async function checkAdminStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setNotAuthorized(true);
      setLoading(false);
      return false;
    }

    // NEW: Check if user has is_admin = true
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (error || !profile?.is_admin) {
      setNotAuthorized(true);
      setLoading(false);
      return false;
    }

    setUserIsAdmin(true);
    return true;
  }

  async function loadQueue() {
    setLoading(true);
    setErrorMsg(null);

    // Check admin status first
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      return;
    }

    setNotAuthorized(false);

    const { data, error } = await supabase
      .from('seller_applications')
      .select(
        'id, user_id, status, created_at, discord_name, vrchat_name, contact_email, store_or_social_link, decision_note'
      )
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      setErrorMsg(error.message);
      setApps([]);
      setLoading(false);
      return;
    }

    setApps((data as AppRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function approve(appId: string) {
    setErrorMsg(null);
    const note = window.prompt('Approval note (optional):') ?? null;

    const { error } = await supabase.rpc('approve_seller_application', {
      p_app_id: appId,
      p_note: note,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    await loadQueue();
  }

  async function reject(appId: string) {
    setErrorMsg(null);
    const note = window.prompt('Rejection note (optional but recommended):') ?? null;

    const { error } = await supabase.rpc('reject_seller_application', {
      p_app_id: appId,
      p_note: note,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    await loadQueue();
  }

  const count = useMemo(() => apps.length, [apps.length]);

  // Show loading or unauthorized message
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <Navbar />
        <main className="pt-32 px-4 pb-20 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Checking permissions...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (notAuthorized) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <Navbar />
        <main className="pt-32 px-4 pb-20 text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-900/40 dark:bg-red-900/20">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">Access Denied</h2>
            <p className="mt-2 text-red-600 dark:text-red-400">
              You need administrator privileges to view this page.
            </p>
            <a
              href="/"
              className="mt-4 inline-block rounded-full bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
            >
              Back to Home
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />

      <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Seller Applications
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Pending queue: <span className="font-semibold">{count}</span>
              <span className="mx-2">•</span>
              <span className="text-sm text-purple-600 dark:text-purple-400">
                Admin access granted
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>
            ) : (
              <div className="space-y-4">
                {errorMsg && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                    {errorMsg}
                  </div>
                )}

                {apps.length === 0 ? (
                  <p className="text-zinc-600 dark:text-zinc-400">
                    No pending applications.
                  </p>
                ) : (
                  apps.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Submitted {new Date(a.created_at).toLocaleString()}
                          </p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            <span className="font-semibold">Discord:</span>{' '}
                            {a.discord_name ?? '—'}
                          </p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            <span className="font-semibold">VRChat:</span>{' '}
                            {a.vrchat_name ?? '—'}
                          </p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            <span className="font-semibold">Email:</span>{' '}
                            {a.contact_email ?? '—'}
                          </p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 break-all">
                            <span className="font-semibold">Link:</span>{' '}
                            {a.store_or_social_link ?? '—'}
                          </p>
                          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 break-all">
                            user_id: {a.user_id}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approve(a.id)}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reject(a.id)}
                            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
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