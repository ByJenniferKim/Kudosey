import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function DonatePage() {
  const donationOptions = [
    {
      title: "Supporter",
      amount: "$5",
      description: "Help keep Kudose running and accessible to everyone",
      perks: ["Platform supporter badge", "Our sincere thanks"],
      popular: false,
      paymentLink: "PAYMENT LINK"
    },
    {
      title: "User",
      amount: "$10",
      description: "Support new features and community events",
      perks: ["Special Discord role", "Early access to new features", "Thank you shoutout"],
      popular: true,
      paymentLink: "PAYMENT LINK"
    },
    {
      title: "Trusted User",
      amount: "$25",
      description: "Help us expand and improve the platform long-term",
      perks: ["All previous perks", "", ""],
      popular: false,
      paymentLink: "PAYMENT LINK"
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      
      <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white md:text-5xl">
              Support <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Kudose</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Help us build and maintain this platform for the VRChat community
            </p>
          </div>

          {/* Why Donate Section */}
          <div className="mb-16 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
              Why Donate?
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
                <div className="mb-4 text-3xl">🚀</div>
                <h3 className="mb-2 text-xl font-semibold">Development</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Funds go directly into improving the platform with new features and fixes.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
                <div className="mb-4 text-3xl">🆓</div>
                <h3 className="mb-2 text-xl font-semibold">Keep It Free</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Your donations help keep the platform free for all VRChat creators.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
                <div className="mb-4 text-3xl">🤝</div>
                <h3 className="mb-2 text-xl font-semibold">Community</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Support community events, contests, and special features.
                </p>
              </div>
            </div>
          </div>

          {/* Donation Options */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-black dark:text-white">
              Choose Your Support Level
            </h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {donationOptions.map((option, index) => (
                <div 
                  key={index}
                  className={`relative rounded-2xl border p-8 transition-all hover:scale-[1.02] hover:shadow-xl ${
                    option.popular 
                      ? 'border-purple-500 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-900' 
                      : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                  }`}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-black dark:text-white">
                      {option.title}
                    </h3>
                    <div className="my-4">
                      <span className="text-4xl font-bold text-black dark:text-white">
                        {option.amount}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400"> / Month</span>
                    </div>
                    
                    <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                      {option.description}
                    </p>
                    
                    <ul className="mb-8 space-y-3 text-left">
                      {option.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1 text-green-500">✓</span>
                          <span className="text-zinc-700 dark:text-zinc-300">{perk}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <a
                    href={option.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg text-center block"
                    >
                        Donate {option.amount}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Amount Section */}
          <div className="mb-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Custom Amount</h2>
              <p className="mt-2 opacity-90">
                Want to give a different amount? Enter any amount below.
              </p>
              
              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-2xl font-bold text-white">$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="25.00"
                    className="relative rounded-full border-0 bg-white/30 pl-12 pr-6 py-3 text-white placeholder-white/70 focus:ring-white/50 focus:outline-none"
                  />
                </div>
                <button className="rounded-full bg-white px-8 py-3 font-semibold text-purple-600 transition-all hover:scale-105">
                  Donate Custom Amount
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
              Donation FAQ
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Where does my money go?
                </h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Donations are used for development, along with server and website costs.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Is my donation tax-deductible?
                </h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Currently, Kudose is not a registered non-profit, so donations are not tax-deductible.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Can I donate anonymously?
                </h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Yes! You can choose to remain anonymous during the donation process.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center">
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