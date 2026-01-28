'use client';

import Header from '@/components/dashboard/Header';
import Main from '@/components/dashboard/Main';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <Main />
    </div>
  );
}
