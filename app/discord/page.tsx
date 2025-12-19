import Navbar from "../components/Navbar";
import Link from "next/link";
import Footer from "../components/Footer";

export default function DiscordPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      
      <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white md:text-5xl">
              Join Our Discord Community
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Connect with other VRChat creators and service providers
            </p>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Discord Info Card */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-6 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#5865F2] text-4xl">
                  <span className="mb-1">Discord</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Why Join Our Discord?
              </h2>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-500">✓</span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    <strong>Direct Communication:</strong> Chat with service providers before hiring
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-500">✓</span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    <strong>Community Showcases:</strong> See featured avatars and work
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-500">✓</span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    <strong>Announcements:</strong> Be first to know about new features
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-500">✓</span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    <strong>Support:</strong> Get help from community moderators
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-500">✓</span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    <strong>Networking:</strong> Connect with other avatar creators
                  </span>
                </li>
              </ul>
            </div>

            {/* Join Discord Card */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#5865F2] to-[#404EED] p-8 text-white">
              <h2 className="text-2xl font-bold">Ready to Join?</h2>
              <p className="mt-3 opacity-90">
                Click the button below to join our Discord server. Make sure to read the rules and introduce yourself in #introductions!
              </p>
              
              <div className="mt-8">
                <a
                  href="https://discord.gg/4vW5YVgHhd" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 font-semibold text-[#5865F2] transition-all hover:scale-105 hover:shadow-lg"
                >
                  <span className="text-2xl">🎮</span>
                  Join Discord Server
                </a>
              </div>
              
              <div className="mt-8 rounded-lg bg-white/10 p-4">
                <h3 className="font-semibold">Server Stats:</h3>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm opacity-80">Members</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-sm opacity-80">Service Providers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Channels Preview */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
              Popular Channels
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "#showcase", desc: "Featured avatar work" },
                { name: "#services", desc: "Service providers list their work" },
                { name: "#requests", desc: "Looking for specific services" },
                { name: "#feedback", desc: "Get critiques on your avatar" },
                { name: "#help", desc: "Technical support" },
                { name: "#off-topic", desc: "General chat and hangout" },
              ].map((channel, index) => (
                <div 
                  key={index}
                  className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="font-mono font-semibold text-[#5865F2]">
                    {channel.name}
                  </div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {channel.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-12 text-center">
            <Link 
              href="/" 
              className="inline-block text-purple-600 hover:text-purple-700 dark:text-purple-400"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}