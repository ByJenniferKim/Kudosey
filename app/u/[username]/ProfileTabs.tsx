'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Role = 'buyer' | 'seller';

type Props = {
  profileId: string;
  username: string;
  role: Role;
};

type TabKey = 'portfolio' | 'services' | 'orders' | 'subscriptions' | 'about';

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
  'relative -mb-px px-4 py-2 text-sm font-semibold transition',
  'border border-zinc-200 dark:border-zinc-800',
  'rounded-t-xl',
  active
    ? 'bg-white text-black dark:bg-zinc-900 dark:text-white'
    : 'bg-zinc-50 text-zinc-700 hover:bg-white dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900',
].join(' ')}

    >
      {label}
    </button>
  );
}

export default function ProfileTabs({ profileId, username, role }: Props) {
  const [isOwner, setIsOwner] = useState(false);
  const [ready, setReady] = useState(false);

  const defaultTab: TabKey = role === 'seller' ? 'portfolio' : 'about';
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);

  useEffect(() => {
    let cancelled = false;

    async function checkOwner() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (cancelled) return;

      setIsOwner(!!user && user.id === profileId);
      setReady(true);
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

  // Tabs:
  // - Seller public: Portfolio, Services/Products
  // - Buyer public: About (minimal)
  // - Private (owner only): Orders, Subscriptions
  const tabs = useMemo(() => {
    const publicTabs: Array<{ key: TabKey; label: string }> =
      role === 'seller'
        ? [
            { key: 'portfolio', label: 'Portfolio' },
            { key: 'services', label: 'Services / Products' },
          ]
        : [{ key: 'about', label: 'About' }];

    const privateTabs: Array<{ key: TabKey; label: string }> = isOwner
      ? [
          { key: 'orders', label: 'Orders' },
          { key: 'subscriptions', label: 'Subscriptions' },
        ]
      : [];

    return [...publicTabs, ...privateTabs];
  }, [role, isOwner]);

  // If user logs in/out, ensure active tab is still allowed
  useEffect(() => {
    const allowedKeys = new Set(tabs.map((t) => t.key));
    if (!allowedKeys.has(activeTab)) {
      setActiveTab(defaultTab);
    }
  }, [tabs, activeTab, defaultTab]);

  return (
  <div className="w-full">
    {/* Folder-style tab row */}
    <div className="flex flex-wrap items-end gap-2 border-b border-zinc-200 dark:border-zinc-800">
      {tabs.map((t) => (
        <TabButton
          key={t.key}
          active={activeTab === t.key}
          label={t.label}
          onClick={() => setActiveTab(t.key)}
        />
      ))}
    </div>

    {/* Attached content panel */}
    <div className="rounded-b-2xl rounded-tr-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      {activeTab === 'portfolio' && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-black dark:text-white">Portfolio</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Public. This will showcase images, gifs, and embedded videos later.
          </p>

          <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            Portfolio grid placeholder
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Services / Products
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Public. This will list active listings later.
          </p>

          <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            Listings placeholder
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-black dark:text-white">Orders</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Private. This will show placed orders (buyers) or customer orders (sellers) later.
          </p>

          <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            Orders placeholder
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Subscriptions
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Private. This will show donation tier + history later.
          </p>

          <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            Subscription tier placeholder
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-black dark:text-white">About</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Public. Basic profile info only.
          </p>

          <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            About placeholder
          </div>
        </div>
      )}
    </div>
  </div>
);

}
