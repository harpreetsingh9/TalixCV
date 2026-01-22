'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function NewResumePage() {
  const router = useRouter();

  useEffect(() => {
    const newResumeId = uuidv4();
    router.push(`/app/resume/${newResumeId}/edit`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Creating new resume...</p>
    </div>
  );
}
