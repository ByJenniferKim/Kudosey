import Navbar from "../components/Navbar";
import Link from "next/link";
import Footer from "../components/Footer";

export default function FAQPage() {
  const faqs = [
    {
      question: "How does Kudose work?",
      answer: "Kudose connects VRChat avatar creators with service providers. Creators can browse listings, compare services, and hire photographers, content creators, or showcasers directly through the platform."
    },
    {
      question: "Is Kudose free to use?",
      answer: "Yes, browsing and creating a profile is completely free. Service providers may charge for their services, and Kudose takes a small platform fee from completed transactions."
    },
    {
      question: "How do I become a service provider?",
      answer: "Click the 'Login' button, sign up, and select 'Service Provider' during registration. You'll be able to create a profile and list your services with pricing, portfolio, and availability."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We currently support PayPal and Stripe. All payments are held in escrow until the service is completed to your satisfaction, protecting both creators and providers."
    },
    {
      question: "Can I request custom services?",
      answer: "Yes! Many providers offer custom packages. Use the contact/messaging system to discuss your specific needs before placing an order."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We have a dispute resolution system. If you're not happy with the delivered work, you can request revisions through the platform. If issues persist, our support team will mediate."
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      
      <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white md:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Everything you need to know about Kudose
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-zinc-700 dark:text-zinc-300">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support Section */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-center text-white">
            <h2 className="text-2xl font-bold">Still have questions?</h2>
            <p className="mt-2 opacity-90">
              Our support team is here to help
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button className="rounded-full bg-white px-6 py-3 font-semibold text-purple-600 transition-all hover:scale-105">
                Contact Support
              </button>
              <button className="rounded-full border-2 border-white px-6 py-3 font-semibold transition-all hover:bg-white/20">
                Join Discord
              </button>
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