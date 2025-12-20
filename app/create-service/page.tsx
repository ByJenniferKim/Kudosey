'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import {
  Camera,
  Video,
  Star,
  DollarSign,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function CreateServicePage() {
  const router = useRouter();

  // Access gate state
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      setCheckingAccess(true);
      setAccessError(null);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (cancelled) return;

      if (userErr) {
        setAccessError(userErr.message);
        setCheckingAccess(false);
        return;
      }

      const user = userData.user;
      setIsLoggedIn(!!user);

      if (!user) {
        setIsSeller(false);
        setCheckingAccess(false);
        return;
      }

      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (profErr) {
        setAccessError(profErr.message);
        setCheckingAccess(false);
        return;
      }

      setIsSeller(profile?.role === 'seller');
      setCheckingAccess(false);
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'photography',
    deliveryTime: '1-3',
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const categories = [
    { id: 'photography', label: 'Photography', icon: <Camera size={18} /> },
    { id: 'content', label: 'Content Creation', icon: <Video size={18} /> },
    { id: 'showcasing', label: 'Showcasing', icon: <Star size={18} /> },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

    if (errors.tags) {
      setErrors((prev) => ({ ...prev, tags: '' }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title is too long (max 100 characters)';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 50)
      newErrors.description = 'Please provide a more detailed description (min 50 characters)';
    if (formData.description.length > 1000)
      newErrors.description = 'Description is too long (max 1000 characters)';

    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      newErrors.price = 'Please enter a valid price';

    if (selectedTags.length === 0) newErrors.tags = 'Please select at least one tag';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category,
      tags: selectedTags,
      delivery_time: formData.deliveryTime,
    };

    const { error } = await supabase.from('services').insert(payload);

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      router.push('/browse');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />

      {checkingAccess ? (
        <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-700 dark:text-zinc-300">Checking access…</p>
            </div>
          </div>
        </main>
      ) : accessError ? (
        <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              <p className="font-semibold">Could not verify access</p>
              <p className="mt-2 text-sm opacity-90">{accessError}</p>
            </div>
          </div>
        </main>
      ) : !isLoggedIn ? (
        <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h1 className="text-2xl font-bold text-black dark:text-white">Please log in</h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                You need to be logged in (and approved as a seller) to list services.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/account"
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-sm font-semibold text-white text-center hover:opacity-95"
                >
                  Go to Account
                </Link>
                <Link
                  href="/browse"
                  className="rounded-full border border-zinc-300 bg-white px-6 py-2 text-sm font-semibold text-zinc-700 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Back to Browse
                </Link>
              </div>
            </div>
          </div>
        </main>
      ) : !isSeller ? (
        <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h1 className="text-2xl font-bold text-black dark:text-white">Sellers only</h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                You must be an approved seller to list services.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/account"
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-sm font-semibold text-white text-center hover:opacity-95"
                >
                  Go to Account (apply as seller)
                </Link>

                <Link
                  href="/browse"
                  className="rounded-full border border-zinc-300 bg-white px-6 py-2 text-sm font-semibold text-zinc-700 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Back to Browse
                </Link>
              </div>

              <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
                If you already applied, approval is manual. Once approved, this page will unlock automatically.
              </p>
            </div>
          </div>
        </main>
      ) : (
        <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
          <div className="mx-auto max-w-6xl">
            {/* Page Header */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-black dark:text-white md:text-5xl">
                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  List Your Service
                </span>
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Share your skills with the VRChat community and start getting clients
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Form */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
                <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
                  Service Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Professional VRChat Avatar Photography"
                      className={`w-full rounded-xl border ${
                        errors.title ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                      } bg-white dark:bg-zinc-800 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <XCircle size={14} /> {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                      Description *
                      <span className="ml-2 text-xs text-zinc-500">
                        ({formData.description.length}/1000 characters)
                      </span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe your service in detail. What do you offer? What makes you unique?"
                      className={`w-full rounded-xl border ${
                        errors.description ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                      } bg-white dark:bg-zinc-800 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <XCircle size={14} /> {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Price & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                        Price (USD) *
                      </label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"
                          size={20}
                        />
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="50.00"
                          className={`w-full rounded-xl border ${
                            errors.price ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                          } bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <XCircle size={14} /> {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                        Category *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, category: cat.id }))}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border ${
                              formData.category === cat.id
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-zinc-300 dark:border-zinc-700'
                            } transition-colors`}
                          >
                            {cat.icon}
                            <span className="mt-1 text-xs">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div>
                    <label className="block text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">
                      Select Tags *
                      <span className="ml-2 text-xs text-zinc-500">
                        Choose all that apply to your service
                      </span>
                    </label>

                    <div className="space-y-2.5">
                      <div>
                        <h4 className="text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
                          Content Rating
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {['NSFW', 'SFW'].map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`px-2.5 py-1 rounded-full border text-xs ${
                                selectedTags.includes(tag)
                                  ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                                  : 'bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                              } transition-colors hover:scale-105`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
                          Body Type
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['FBT', 'Half-body'].map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`px-2.5 py-1 rounded-full border text-xs ${
                                selectedTags.includes(tag)
                                  ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                                  : 'bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                              } transition-colors hover:scale-105`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
                          Platform
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['TikTok', 'YouTube', 'Twitter', 'Instagram'].map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`px-2.5 py-1 rounded-full border text-xs ${
                                selectedTags.includes(tag)
                                  ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                                  : 'bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                              } transition-colors hover:scale-105`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
                          Content Type
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['Edits', 'Renders'].map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`px-2.5 py-1 rounded-full border text-xs ${
                                selectedTags.includes(tag)
                                  ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                                  : 'bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                              } transition-colors hover:scale-105`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
                          VR Platform
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['PC', 'Quest'].map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`px-2.5 py-1 rounded-full border text-xs ${
                                selectedTags.includes(tag)
                                  ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                                  : 'bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                              } transition-colors hover:scale-105`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedTags.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">
                          Selected tags:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-0.5"
                            >
                              <span className="text-sm text-purple-700 dark:text-purple-300">
                                {tag}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className="ml-1 text-purple-500 hover:text-purple-700"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.tags && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <XCircle size={14} /> {errors.tags}
                      </p>
                    )}
                  </div>

                  {/* Delivery Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                      Delivery Time (days)
                    </label>
                    <select
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="1-3">1 - 3 days</option>
                      <option value="4-6">4 - 6 days</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>

                  {submitError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-4 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Creating Listing...
                      </span>
                    ) : (
                      'List Your Service'
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Preview */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
                <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Preview</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  This is how your service will appear to clients
                </p>

                <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all hover:shadow-xl">
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Camera className="text-white/70" size={48} />
                  </div>

                  <div className="p-6">
                    <span className="inline-block rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
                      {categories.find((c) => c.id === formData.category)?.label || 'Photography'}
                    </span>

                    <h3 className="mt-4 text-xl font-bold text-black dark:text-white">
                      {formData.title || 'Your Service Title'}
                    </h3>

                    <p className="mt-3 text-zinc-700 dark:text-zinc-300">
                      {formData.description || 'Service description will appear here...'}
                    </p>

                    {selectedTags.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {selectedTags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs text-zinc-600 dark:text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {selectedTags.length > 5 && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            +{selectedTags.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-black dark:text-white">
                          ${formData.price || '50'}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400">/service</span>
                      </div>
                      <div className="text-zinc-600 dark:text-zinc-400">
                        Delivery:{' '}
                        {formData.deliveryTime === '1-3'
                          ? '1 - 3 days'
                          : formData.deliveryTime === '4-6'
                          ? '4 - 6 days'
                          : `${formData.deliveryTime} day${
                              formData.deliveryTime !== '1' ? 's' : ''
                            }`}
                      </div>
                    </div>

                    <button className="mt-6 w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white">
                      View Details
                    </button>
                  </div>
                </div>

                <div className="mt-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-6">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                    💡 Tips for a Great Listing
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                    <li>• Be specific about what you offer</li>
                    <li>• Set realistic delivery times</li>
                    <li>• Use relevant tags to help clients find you</li>
                    <li>• Price competitively for the VRChat market</li>
                  </ul>
                </div>
              </div>
            </div>

            {showSuccess && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="mx-4 rounded-2xl border border-green-200 bg-white p-8 text-center shadow-xl dark:border-green-800 dark:bg-zinc-900">
                  <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                  <h3 className="text-2xl font-bold text-black dark:text-white">
                    Service Listed Successfully!
                  </h3>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Your service is now visible to the VRChat community.
                  </p>
                  <div className="mt-6">
                    <div className="inline-block h-1 w-24 rounded-full bg-gradient-to-r from-green-400 to-blue-400"></div>
                  </div>
                  <p className="mt-4 text-sm text-zinc-500">Redirecting to browse page...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
