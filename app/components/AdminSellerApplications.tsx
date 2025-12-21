// Create /app/components/AdminSellerApplications.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSellerApplications() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('seller_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching count:', error);
        return;
      }

      setCount(count || 0);
      setLoading(false);
    };

    fetchCount();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Seller Applications Overview
      </h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {loading ? '...' : count}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Pending Applications
          </div>
        </div>
        
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            View All
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            <a 
              href="/admin/seller-applications" 
              className="text-purple-600 hover:underline dark:text-purple-400"
            >
              Go to full page →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}