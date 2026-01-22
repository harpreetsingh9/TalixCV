'use client';

import React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      authUtils.authenticate(name);
      router.push('/app/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => router.push('/')}
            className="text-lg font-serif font-bold tracking-tight hover:opacity-70 transition-opacity"
          >
            Resume Builder
          </button>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-serif font-bold">Welcome</h2>
            <p className="text-gray-600">Enter your name to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="border-gray-300 text-black placeholder:text-gray-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-900 py-2 font-medium"
            >
              {loading ? 'Getting Started...' : 'Continue'}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            <p>
              New here?{' '}
              <button
                onClick={() => router.push('/signup')}
                className="font-medium text-black hover:opacity-70 transition-opacity"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
