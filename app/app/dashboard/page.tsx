'use client';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { authUtils } from '@/lib/auth';
// import { resumeService } from '@/lib/services/resume-service';

import Header from '@/components/dashboard/Header';
import Main from '@/components/dashboard/Main';
// import { createResume, useResumeStore, loadResume, deleteResume } from '@/lib/resume-store';

export default function DashboardPage() {
  // const router = useRouter();
  const [user, setUser] = useState(authUtils.getCurrentUser());

  useEffect(() => {
    // setMounted(true);
    const currentUser = authUtils.getCurrentUser();
    setUser(currentUser);
  }, []);

  // if (!user) {
  //   return null;
  // }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <Main />
    </div>
  );
}
