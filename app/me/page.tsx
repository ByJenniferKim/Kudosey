'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MePage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function go() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        router.replace('/browse');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, username_confirmed')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !profile?.username) {
        router.replace('/account'); // fallback to settings
        return;
      }

      if (!profile.username_confirmed) {
        router.replace('/account'); // force confirm first
        return;
      }

      router.replace(`/u/${profile.username}`);
    }

    go();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black flex items-center justify-center">
      <p className="text-zinc-600 dark:text-zinc-400">Loading your profile…</p>
    </div>
  );
}
