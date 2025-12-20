'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function OwnerSettingsButton({ profileId }: { profileId: string }) {
  const [isOwner, setIsOwner] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (cancelled) return;

      setIsOwner(!!user && user.id === profileId);
      setReady(true);
    }

    check();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      check();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [profileId]);

  if (!ready || !isOwner) return null;

  return (
    <Link
      href="/account"
      className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
    >
      Settings
    </Link>
  );
}
