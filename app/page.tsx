'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Navbar />

      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between pt-40 py-32 px-16 pb-40 bg-white dark:bg-black sm:items-start">
        <div className="flex items-center gap-3">
          </div>

        <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left">
          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                VRChat Creator Hub
              </span>
            </h1>
            <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
              Where Creators connect with talent
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A dedicated marketplace for VRChat creators to find photographers, content creators, and showcasers. Need promotional content for you avatar?
            You're in the right place.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
            onClick={() => setIsLoginModalOpen(true)}
            className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-3 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </button>

            <Link
            href="/gallery"
            className="rounded-full border-2 border-purple-500 px-8 py-3 text-lg font-semibold text-purple-600 transition-all hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/30 text-center">
            Gallery
            </Link>

            <Link
            href="/create-service"
            className="rounded-full bg-white border-2 border-purple-500 px-8 py-3 text-lg font-semibold text-purple-600 transition-all hover:bg-purple-50 dark:bg-zinc-900 dark:text-purple-400 dark:hover:bg-purple-900/30 text-center"
            >
              List Your Service
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
          {/* PHOTOGRAPHERS TILE/CARD */}
          <Link
          href="/browse?filter=photography"
          className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800 transition-all hover:scale-[1.02] hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700"
          >
            <div className="mb-4 text-3xl">📸</div>
            <h3 className="mb-2 text-xl font-semibold">Photographers</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Beautiful photography of your creation!
            </p>
            <div className="mt-4 text-sm text-purple-600 dark:text-purple-400">
              Browse photographers →
            </div>
          </Link>

          {/* CONTENT CREATORS TILE/CARD */}
          <Link
          href="/browse?filter=content"
          className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800 transition-all hover:scale-[1.02] hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700"
          >
            <div className="mb-4 text-3xl">🎬</div>
            <h3 className="mb-2 text-xl font-semibold">Content Creators</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Videos, edits, and promotional content
            </p>
            <div className="mt-4 text-sm text-purple-600 dark:text-purple-400">
              Browse content creators →
            </div>
          </Link>

          {/* SHOWCASERS TILE/CARD */}
          <Link
          href="/browse?filter=showcasing"
          className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800 transition-all hover:scale-[1.02] hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700"
          >
            <div className="mb-4 text-3xl">🌟</div>
            <h3 className="mb-2 text-xl font-semibold">Showcasers</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Show what your avatar has to offer!
            </p>
            <div className="mt-4 text-sm text-purple-600 dark:text-purple-400">
              Browse showcasers →
            </div>
          </Link>
        </div>
      </main>

      <Footer />

      <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)} />

    </div>
  );
}
