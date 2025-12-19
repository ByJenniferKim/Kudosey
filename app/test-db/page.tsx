'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDBPage() {
  const [status, setStatus] = useState('Testing connection...');
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Check connection
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .limit(5);
        
        if (error) {
          setStatus(`❌ Error: ${error.message}`);
          return;
        }
        
        setStatus(`✅ Connected to Supabase! Found ${data?.length || 0} services`);
        setServices(data || []);
        
        // Test 2: Try to insert a test service
        const testService = {
          title: 'Test Photography Service',
          description: 'This is a test service for database connection',
          price: 25.00,
          category: 'photography',
          tags: ['NSFW', 'FBT'],
          delivery_time: '1-3'
        };
        
        const { error: insertError } = await supabase
          .from('services')
          .insert(testService);
          
        if (!insertError) {
          setStatus(prev => prev + ' | ✅ Can insert data!');
        }
        
      } catch (err: any) {
        setStatus(`❌ Failed: ${err.message}`);
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
        
        <div className={`mb-6 p-4 rounded-lg ${
          status.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-semibold">{status}</p>
        </div>
        
        {services.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Current Services in Database:</h2>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="border border-zinc-200 rounded p-4">
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-sm text-zinc-600">{service.description}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      ${service.price}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {service.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Next Steps:</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Create the services table in Supabase (SQL Editor)</li>
            <li>Update .env.local with your Supabase credentials</li>
            <li>Visit this page to test connection</li>
            <li>Update the Create Service form to save to database</li>
            <li>Update Browse page to read from database</li>
          </ol>
        </div>
      </div>
    </div>
  );
}