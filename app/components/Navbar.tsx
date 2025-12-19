'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';
import UsernamePromptModal from './UsernamePromptModal';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
    
    useEffect(() => {
        let mounted = true;

        // Get current session on load
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setSession(data.session ?? null);
        });

        // Listen for login/out changes
        const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const user = session?.user;
        if (!user) return;

        let cancelled = false;

        const checkProfile = async () => {
            const { data, error } = await supabase
            .from('profiles')
            .select('username_confirmed')
            .eq('id', user.id)
            .single();

            if (cancelled || error) return;

            if (data?.username_confirmed === false) {
                setIsUsernameModalOpen(true);
            }
        };

        checkProfile();

        return () => {
            cancelled = true;
        };
    }, [session]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsMenuOpen(false);
        setIsLoginModalOpen(false);
        setIsUsernameModalOpen(false);
    };

    return (
        <>
        <nav className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
            <div className="mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-center md:justify-between">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-2">
                    <Image
                    src="/VRLogo1.png"
                    alt="Kudose Logo"
                    width={100}
                    height={100}
                    className="h-20 w-40 object-contain"
                    />
                    </Link>

                        {/* Desktop Navi Links */}
                        <div className="hidden items-center gap-8 md:flex">
                            <Link
                            href="/browse"
                            className="text-zinc-700 transition-colors hover:text-purple-600 dark:text-zinc-300 dark:hover:text-purple-400">
                                Browse
                            </Link>
                            <Link
                            href="/faq"
                            className="text-zinc-700 transition-colors hover:text-purple-600 dark:text-zinc-300 dark:hover:text-purple-400">
                                FAQ
                            </Link>
                            <Link
                            href="/discord"
                            className="text-zinc-700 transition-colors hover:text-purple-600 dark:text-zinc-300 dark:hover:text-purple-400">
                                Discord
                            </Link>
                            <Link
                            href="/donate"
                            className="text-zinc-700 transition-colors hover:text-purple-600 dark:text-zinc-300 dark:hover:text-purple-400">
                                Donate
                            </Link>
                        </div>

                        {/* Right side buttons */}
                        <div className="flex items-center gap-4">
                            {session ? (
                                <div className="hidden items-center gap-3 md:flex">
                                    <Link
                                    href="/account"
                                    className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                        Account
                                    </Link>

                                    <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                                    >
                                        Logout
                                    </button>
                                    </div>
                            ) : (
                                <button
                                type="button"
                                className="hidden md:block rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                                onClick={() => setIsLoginModalOpen(true)}
                                >
                                    Login
                                </button>
                            )}

                            {/* Mobile Menu button */}
                            <button className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <div className="space-y-1.5">
                                    <div className={`h-0.5 w-6 bg-zinc-700 transition-transform dark:bg-zinc-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                                    <div className={`h-0.5 w-6 bg-zinc-700 opacity-100 transition-opacity dark:bg-zinc-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                                    <div className={`h-0.5 w-6 bg-zinc-700 transition-transform dark:bg-zinc-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                                </div>
                            </button>
                        </div>
                </div>

                {/* Mobile Navigation HIDDEN BY DEFAULT*/}
                <div className={`mt-4 flex-col gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800 md:hidden ${isMenuOpen ? 'flex' : 'hidden'}`}>
                    <Link href="/browse" className="py-2 text-zinc-700 dark:text-zinc-300"
                    onClick={() => setIsMenuOpen(false)}>
                    Browse
                    </Link>
                    <Link href="/faq" className="py-2 text-zinc-700 dark:text-zinc-300"
                    onClick={() => setIsMenuOpen(false)}>
                    FAQ
                    </Link>
                    <Link href="/discord" className="py-2 text-zinc-700 dark:text-zinc-300"
                    onClick={() => setIsMenuOpen(false)}>
                    Discord
                    </Link>
                    <Link href="/donate" className="py-2 text-zinc-700 dark:text-zinc-300"
                    onClick={() => setIsMenuOpen(false)}>
                    Donate
                    </Link>
                    {session ? (
                        <>
                        <Link
                        href="/account"
                        className="py-2 text-zinc-700 dark:text-zinc-300"
                        onClick={() => setIsMenuOpen(false)}
                        >
                            Account
                            </Link>

                        <button
                        type="button"
                        className="mt-4 w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                        onClick={handleLogout}
                        >
                            Logout
                        </button>
                        </>
                    ) : (
                        <button
                        type="button"
                        className="mt-4 w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                        onClick={() => {
                            setIsMenuOpen(false);
                            setIsLoginModalOpen(true);
                        }}
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>

        {/*   */}
        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)} />

            {session?.user && (
                <UsernamePromptModal
                isOpen={isUsernameModalOpen}
                onClose={() => setIsUsernameModalOpen(false)}
                userId={session.user.id}
                />
            )}
        </>
    );
}