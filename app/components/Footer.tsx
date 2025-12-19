import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Kudosey
              </span>
            </div>
            <p className="max-w-md text-zinc-600 dark:text-zinc-400">
              Connecting VRChat avatar creators with skilled photographers, 
              content creators, and showcasers. Find the perfect talent for your avatar.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/browse" 
                  className="text-zinc-600 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-zinc-600 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/discord" 
                  className="text-zinc-600 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
                >
                  Discord Community
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-zinc-600 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-zinc-600 dark:text-zinc-400">
                  Photography
                </span>
              </li>
              <li>
                <span className="text-zinc-600 dark:text-zinc-400">
                  Content Creation
                </span>
              </li>
              <li>
                <span className="text-zinc-600 dark:text-zinc-400">
                  Showcasing
                </span>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-zinc-600 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
                >
                  Become a Supporter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-zinc-200 pt-8 dark:border-zinc-800 md:flex-row">
          {/* Social Media Links */}
          <div className="flex gap-6 mb-6 md:mb-0">
            <a 
              href="https://discord.gg/4vW5YVgHhd" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
              aria-label="Discord"
            >
              <i className="fa-brands fa-discord"></i>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-zinc-600 dark:text-zinc-400 md:text-right">
            <p>© {new Date().getFullYear()} Kudosey. All rights reserved.</p>
            <p className="mt-1 text-sm">Made for the VRChat community</p>
          </div>
        </div>
      </div>
    </footer>
  );
}