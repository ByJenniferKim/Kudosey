import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProfileTabs from './ProfileTabs';
import OwnerSettingsButton from './OwnerSettingsButton';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  username_confirmed: boolean;
  role: 'buyer' | 'seller' | null;
};

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, {
    auth: { persistSession: false },
  });
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const supabase = getSupabaseClient();

  const { username: rawUsername } = await params;

  if (!rawUsername || typeof rawUsername !== 'string') {
    notFound();
  }

  const username = rawUsername.trim().toLowerCase();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, bio, username_confirmed, role')
    .eq('username', username)
    .eq('username_confirmed', true)
    .maybeSingle<ProfileRow>();

  if (error || !data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />

      <main className="pt-32 px-4 md:px-6 lg:px-10 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:items-stretch">
              {/* Left: identity */}
              <div className="flex h-full flex-col">
                {/* Top content */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar placeholder */}
                    <div className="h-16 w-16 rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800" />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h1 className="truncate text-2xl font-bold text-black dark:text-white">
                          {data.display_name || `@${data.username}`}
                        </h1>

                        {/* Badge placeholder + tooltip */}
                        <span className="relative inline-flex">
                          <span
                            tabIndex={0}
                            aria-label="Supporter badge (coming soon)."
                            className="group inline-flex h-6 w-6 cursor-default items-center justify-center rounded-full border border-zinc-200 bg-white text-xs text-zinc-700 outline-none transition hover:bg-zinc-50 focus:ring-1 focus:ring-zinc-400/60 dark:focus:ring-zinc-600/60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                          >
                            ★

                            {/* Tooltip */}
                            <span
                              className={[
                                'pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max -translate-x-1/2',
                                'rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 shadow-lg',
                                'opacity-0 transition group-hover:opacity-100 group-focus:opacity-100',
                                'dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200',
                              ].join(' ')}
                            >
                              Supporter badge (coming soon)
                              <span className="block text-[11px] text-zinc-500 dark:text-zinc-400">
                                Later: “Supporter since X days”
                              </span>
                            </span>
                          </span>
                        </span>
                      </div>

                      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                        @{data.username}
                      </p>
                    </div>
                  </div>

                  {/* Anchored Bio panel */}
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Bio
                      </h2>

                      {/* For later if you want a “Public” label */}
                      {/* <span className="text-xs text-zinc-500 dark:text-zinc-400">Public</span> */}
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                      {data.bio?.trim() || 'No bio yet.'}
                    </p>
                  </div>
                </div>

                {/* Bottom-left settings button */}
                <div className="mt-auto pt-4">
                  <div className="mb-4 border-t border-zinc-200/80 dark:border-zinc-800/80" />
                  <OwnerSettingsButton profileId={data.id} />
                </div>
              </div>

              {/* Right: tabs */}
              <div className="md:pt-1">
                <ProfileTabs
                  profileId={data.id}
                  username={data.username!}
                  role={data.role === 'seller' ? 'seller' : 'buyer'}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
