'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { CircleUser, LogOut } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(authUtils.getCurrentUser());

  useEffect(() => {
    // setMounted(true);
    const currentUser = authUtils.getCurrentUser();
    setUser(currentUser);
  }, []);
  
  const handleLogout = () => {
    authUtils.logout();
    router.push('/');
  };
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">
            Resume Builder
          </h1>
        </div>
        <span className="text-sm text-gray-500">
              {'Untitled Resume'}
            </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 flex items-center">
            <CircleUser className="mr-1" />
            {user?.userName}
          </span>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-black hover:bg-gray-100"
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </header>
  );
}
