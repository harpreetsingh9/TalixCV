'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { authUtils, type AuthUser } from '@/lib/auth';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { resumeService } from '@/lib/services/resume-service';
import { Resume } from '@/types/resume';

export default function Main() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadData = async () => {
      const currentUser = await authUtils.getCurrentUser();
      setUser(currentUser);

      if (currentUser && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setLoading(true);
        try {
          const dbResumes = await resumeService.getResumes(currentUser.userId);
          if (dbResumes.length > 0) {
            setResumes(
              dbResumes.map((dbResume: any) => ({
                id: dbResume.id,
                createdAt: new Date(dbResume.created_at).getTime(),
                updatedAt: new Date(dbResume.updated_at).getTime(),
                personal: {
                  fullName: dbResume.full_name || '',
                  email: dbResume.email || '',
                  phone: dbResume.phone || '',
                  location: dbResume.location || '',
                },
                summary: dbResume.summary || '',
                skillGroups: dbResume.skills || [],
                experience: dbResume.experience || [],
                projects: dbResume.projects || [],
                education: dbResume.education || [],
                achievements: dbResume.achievements || [],
              }))
            );
          }
        } catch (err) {
          console.error('Failed to load resumes:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, []);

  if (!mounted || !user) {
    return null;
  }

  const handleCreateResume = async () => {
    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const created = await resumeService.createResume(user.userId, {
          title: 'Untitled Resume',
        });
        router.push(`/app/resume/${created?.id}/edit`);
      } catch (err) {
        console.error('Failed to create resume in database:', err);
      }
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
          await resumeService.deleteResume(id);
        }
        setResumes(resumes.filter((r) => r.id !== id));
      } catch (err) {
        console.error('Failed to delete resume:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">My Resumes</h2>
          <p className="text-gray-600">Create and manage your resumes</p>
        </div>
        <Button
          onClick={handleCreateResume}
          className="bg-black text-white hover:bg-gray-900 px-6 py-2 font-medium w-full md:w-auto"
        >
          Create New Resume
        </Button>
      </div>

      {/* Resumes Grid */}
      {resumes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">
            You haven't created any resumes yet.
          </p>
          <Button
            onClick={handleCreateResume}
            className="bg-black text-white hover:bg-gray-900 px-6 py-2 font-medium"
          >
            Create Your First Resume
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className="border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 mb-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {resume.personal.fullName || 'Untitled Resume'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created {format(new Date(resume.createdAt), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Updated {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => router.push(`/app/resume/${resume.id}/edit`)}
                    className="flex-1 bg-black text-white hover:bg-gray-900"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteResume(resume.id)}
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
