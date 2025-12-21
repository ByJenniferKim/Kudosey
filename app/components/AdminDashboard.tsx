'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminUsers from './AdminUsers';
import SiteStats from './SiteStats';
import AdminSellerApplications from './AdminSellerApplications';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'applications' | 'users' | 'stats'>('applications');
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        window.location.href = '/';
        return;
      }

      setUserIsAdmin(true);
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Checking permissions...</div>
      </div>
    );
  }

  if (!userIsAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Manage your VRChat Creator Hub
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                ← Back to site
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'applications'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300'
              }`}
            >
              Seller Applications
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'stats'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300'
              }`}
            >
              Site Statistics
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === 'applications' && <AdminSellerApplications />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'stats' && <SiteStats />}
      </div>
    </div>
  );
}