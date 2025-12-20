'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Props = {
  profileId: string;
  username: string;
};

export default function ProfileActions({ profileId, username }: Props) {
  const [isOwner, setIsOwner] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkOwner() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (cancelled) return;

      setIsOwner(!!user && user.id === profileId);
      setChecked(true);
    }

    checkOwner();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      checkOwner();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [profileId]);

  if (!checked) return null;

  // Only the owner sees Settings
  if (!isOwner) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href="/account"
        className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
      >
        Settings
      </Link>
    </div>
  );
}
