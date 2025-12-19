'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;

      setUser(data.user ?? null);
      setLoading(false);
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

  const provider =
    (user?.app_metadata as any)?.provider ||
    (user?.app_metadata as any)?.providers?.[0] ||
    'unknown';

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />

      <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white md:text-5xl">
              Account
            </h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Your login + profile basics
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
            ) : !user ? (
              <div className="space-y-4">
                <p className="text-zinc-700 dark:text-zinc-300">
                  You’re not logged in.
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Use the <span className="font-medium">Login</span> button in the
                  navbar to sign in.
                </p>
                <Link
                  href="/browse"
                  className="inline-block text-purple-600 hover:text-purple-700 dark:text-purple-400"
                >
                  ← Back to Browse
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Signed in with
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {String(provider)}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Email
                    </p>
                    <p className="font-medium text-black dark:text-white">
                      {user.email ?? 'No email found'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      User ID
                    </p>
                    <p className="break-all font-mono text-sm text-black dark:text-white">
                      {user.id}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Notes
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    Next we’ll add a real profile: display name, avatar, bio, and role
                    (buyer/creator/showcaser).
                  </p>
                </div>

                <Link
                  href="/browse"
                  className="inline-block text-purple-600 hover:text-purple-700 dark:text-purple-400"
                >
                  ← Back to Browse
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
