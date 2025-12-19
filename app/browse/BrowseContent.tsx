'use client';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from "../components/Navbar";
import Link from "next/link";
import Footer from "../components/Footer";

export default function BrowseContent() {
  const [activeFilter, setActiveFilter] = useState("all");
  type ServiceRow = {
    id: string;
    title: string;
    description: string;
    price: number;
    category: 'photography' | 'content' | 'showcasing';
    tags: string[];
    delivery_time: string;
    created_at: string;
  };

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDeliveryTimes, setSelectedDeliveryTimes] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Reads URL parameter on page load
  useEffect(() => {
    const filterFromUrl = searchParams.get('filter');
    
    // Checks the filter param
    if (filterFromUrl) {

      const validFilters = ['photography', 'content', 'showcasing', 'all'];
      if (validFilters.includes(filterFromUrl)) {
        setActiveFilter(filterFromUrl);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setLoadError('');

      const {data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

      if (error) {
        setLoadError(error.message);
        setServices([]);
        setLoading(false);
        return;
      }

      setServices(data || []);
      setLoading(false);
    }

    fetchServices();
  }, []);

  const allTags = Array.from(
    new Set(
      services.flatMap((s) => (Array.isArray(s.tags) ? s.tags : []))
    )
  ).sort((a, b) => a.localeCompare(b));

  const toggleBrowseTag = (tag: string) => {
    setSelectedTags((prev) =>
    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
  );
  };

  const deliveryTimeOptions: { value: string; label: string }[] = [
    { value: '1-3', label: '1-3 days' },
    { value: '4-6', label: '4-6 days' },
    { value: '7', label: '7 days' },
    { value: '14', label: '14 days' },
    { value: '30', label: '30 days' },
  ];

  const toggleDeliveryTime = (value: string) => {
    setSelectedDeliveryTimes((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
  );
  };

  const filteredServices = services.filter((service) => {
    // category filter
    const matchesCategory =
    activeFilter === 'all' ? true : service.category === activeFilter;

    // Search filter (title + desc)
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
    q.length === 0
    ? true:
    (service.title?.toLowerCase().includes(q) ||
  service.description?.toLowerCase().includes(q));

  // Tag filter
  const matchesTags =
  selectedTags.length === 0
  ? true: selectedTags.every((t) => (service.tags || []).includes(t));

  // Delivery Time filter
  const matchesDelivery =
  selectedDeliveryTimes.length === 0
  ? true: selectedDeliveryTimes.includes(service.delivery_time);

  return matchesCategory && matchesSearch && matchesTags && matchesDelivery;
  });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      
      <main className="pt-32 px-4 md:px-8 lg:px-16 pb-20">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white md:text-5xl">
              Browse Services
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Find photographers, content creators, and showcasers for your VRChat avatar
            </p>
          </div>

          {/* Filters */}
<div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
  {/* Top row: title + search + category buttons */}
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div className="w-full md:max-w-md">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search services by title or description..."
        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />
    </div>

    {/* Mobile Filters Button */}
    <div className="flex lg:hidden">
      <button
      type="button"
      onClick={() => setMobileFiltersOpen(true)}
      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        Filters
      </button>
    </div>

    {/* Category buttons */}
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => setActiveFilter("all")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
          activeFilter === "all"
            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        }`}
      >
        All Services
      </button>

      <button
        onClick={() => setActiveFilter("photography")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
          activeFilter === "photography"
            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        }`}
      >
        Photography
      </button>

      <button
        onClick={() => setActiveFilter("content")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
          activeFilter === "content"
            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        }`}
      >
        Content Creation
      </button>

      <button
        onClick={() => setActiveFilter("showcasing")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
          activeFilter === "showcasing"
            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        }`}
      >
        Showcasing
      </button>
    </div>
  </div>

  {/* Filter Counts */}
  <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
    <span>
      Showing: <strong>{filteredServices.length}</strong> services
    </span>
  </div>
</div>

{/* Mobile Filters Slide-over */}
{mobileFiltersOpen && (
  <div className="fixed inset-0 z-50 lg:hidden">
    {/* Backdrop */}
    <button
    type="button"
    aria-label="Close filters"
    onClick={() => setMobileFiltersOpen(false)}
    className="absolute inset-0 bg-black/40"
    />

    {/* Panel */}
    <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="text-lg font-semibold text-black dark:text-white">Filters</h3>

        <button
        type="button"
        onClick={() => setMobileFiltersOpen(false)}
        className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Close
        </button>
      </div>

      <div className="h-full overflow-y-auto p-4 pb-28">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black dark:text-white">Tags</h3>
            {(selectedTags.length > 0 || selectedDeliveryTimes.length > 0) && (
              <button
              type="button"
              onClick={() => {
                setSelectedTags([]);
                setSelectedDeliveryTimes([]);
              }}
              className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tag categories */}
{(() => {
  const tagGroups: { title: string; tags: string[] }[] = [
    { title: "Content Rating", tags: ["NSFW", "SFW"] },
    { title: "Body Type", tags: ["FBT", "Half-body"] },
    { title: "Platform", tags: ["TikTok", "YouTube", "Twitter", "Instagram"] },
    { title: "Content Type", tags: ["Edits", "Renders"] },
    { title: "VR Platform", tags: ["PC", "Quest"] },
  ];

  const existingTagSet = new Set(allTags);

  const visibleGroups = tagGroups
    .map((g) => ({
      ...g,
      tags: g.tags.filter((t) => existingTagSet.has(t)),
    }))
    .filter((g) => g.tags.length > 0);

  if (visibleGroups.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No tags found yet.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {visibleGroups.map((group) => (
        <div key={group.title}>
          <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {group.title}
          </h4>

          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag) => {
              const isSelected = selectedTags.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleBrowseTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300"
                      : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
})()}


          {/* Delivery Time */}
          <div className="mt-6">
            <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Delivery Time
            </h4>
            <div className="space-y-2">
              {deliveryTimeOptions.map((opt) => {
                const checked = selectedDeliveryTimes.includes(opt.value);

                return (
                  <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleDeliveryTime(opt.value)}
                  className={`group flex items-center gap-2 text-sm transition-colors ${
                    checked
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                    >
                      <span className="text-lg leading-none">{checked ? "💜" : "🤍"}</span>
                      <span>{opt.label}</span>
                    </button>
                );
              })}
            </div>
          </div>
      </div>
    </div>

    {/* Sticky bottom action */}
    <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <button
      type="button"
      onClick={() => setMobileFiltersOpen(false)}
      className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white"
      >
        View results
      </button>
      </div>
      </div>
      </div>
)}

{/* Tags Sidebar + Services Grid */}
<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
  {/* LEFT: Tag Sidebar */}
  <aside className="hidden lg:block lg:col-span-3">
  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-black dark:text-white">Tags</h3>

      {(selectedTags.length > 0 || selectedDeliveryTimes.length > 0) && (
  <button
    type="button"
    onClick={() => {
      setSelectedTags([]);
      setSelectedDeliveryTimes([]);
    }}
    className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
  >
    Clear
  </button>
      )}

    </div>

    {/* Tag categories (same layout as Create Service) */}
    {(() => {
      const tagGroups: { title: string; tags: string[] }[] = [
        { title: "Content Rating", tags: ["NSFW", "SFW"] },
        { title: "Body Type", tags: ["FBT", "Half-body"] },
        { title: "Platform", tags: ["TikTok", "YouTube", "Twitter", "Instagram"] },
        { title: "Content Type", tags: ["Edits", "Renders"] },
        { title: "VR Platform", tags: ["PC", "Quest"] },
      ];

      // Optional: Only show tags that exist in DB
      const existingTagSet = new Set(allTags);

      const visibleGroups = tagGroups
        .map((g) => ({
          ...g,
          tags: g.tags.filter((t) => existingTagSet.has(t)),
        }))
        .filter((g) => g.tags.length > 0);

      if (visibleGroups.length === 0) {
        return (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No tags found yet.
          </p>
        );
      }

      return (
        <div className="space-y-5">
          {visibleGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {group.title}
              </h4>

              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleBrowseTag(tag)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300"
                          : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    })()}

    {selectedTags.length > 0 && (
      <p className="mt-5 text-xs text-zinc-600 dark:text-zinc-400">
        Selected: <span className="font-medium">{selectedTags.join(", ")}</span>
      </p>
    )}

    {selectedDeliveryTimes.length > 0 && (
  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
    Delivery:{" "}
    <span className="font-medium">
      {selectedDeliveryTimes.join(", ")}
    </span>
  </p>
)}

{/* Delivery Time */}
<div className="mt-6">
  <div className="mb-2 flex items-center justify-between">
    <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
      Delivery time
    </h4>
  </div>

  <div className="space-y-2">
    {deliveryTimeOptions.map((opt) => {
      const checked = selectedDeliveryTimes.includes(opt.value);

      return (
        <div key={opt.value}>
          <button
          type="button"
          onClick={() => toggleDeliveryTime(opt.value)}
          className={`group flex items-center gap-2 text-sm transition-colors ${
            checked
            ? "text-pink-600 dark:text-pink-400"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
          >
            {/* Heart */}
            <span
            className={`
              relative text-lg leading-none
              transition-transform duration-200 ease-out
              ${checked ? "scale-110" : "scale-100"}
              group-active:scale-125
              `}
              >
                {/* Heart Pulse */}
                <span className={checked ? "animate-pulse" : ""}>
                  {checked ? "💜" : "🤍"}
                </span>
              </span>
            <span>{opt.label}</span>
          </button>
          </div>
      );
    })}
  </div>
  </div>
  </div>
</aside>


  {/* RIGHT: Services Grid */}
  <section className="lg:col-span-9">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredServices.map((service) => (
        <div
          key={service.id}
          className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500"></div>

          <div className="p-6">
            <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {service.category}
            </span>

            <h3 className="mt-4 text-xl font-bold text-black dark:text-white">
              {service.title}
            </h3>

            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              by <span className="font-medium">SELLER</span>
            </p>

            <p className="mt-3 text-zinc-700 dark:text-zinc-300">
              {service.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {service.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-black dark:text-white">
                  ${Number(service.price).toFixed(2)}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">/service</span>
              </div>
              <span className="text-zinc-600 dark:text-zinc-400">New</span>
            </div>

            <button className="mt-6 w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
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