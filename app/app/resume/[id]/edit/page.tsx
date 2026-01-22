'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { resumeService } from '@/lib/services/resume-service';
import { authUtils } from '@/lib/auth';
import { useMediaQuery } from '@/hooks/use-mobile';
import type { Resume } from '@/types/resume';
import Header from '@/components/dashboard/Header';
import MobileLayout from '@/components/resume/MobileLayout';
import DesktopLayout from '@/components/resume/DesktopLayout';

export default function ResumePage() {
  const params = useParams();
  const id = params?.id as string;
  const [resume, setResume] = useState<Resume | null>(null);
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const user = authUtils.getCurrentUser();
  const currentResume = resume; // Declare currentResume variable
  const saveResume = () => {
    // Placeholder for saveResume function
    console.log('Save resume logic here');
  };

  useEffect(() => {
    setMounted(true);
    if (id) {
      loadResume(id);
    }
  }, [id]);

  const loadResume = async (resumeId: string) => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const dbResume = await resumeService.getResume(resumeId);
        if (dbResume) {
          setResume({
            id: dbResume.id || resumeId,
            createdAt: dbResume.created_at
              ? new Date(dbResume.created_at).getTime()
              : Date.now(),
            updatedAt: dbResume.updated_at
              ? new Date(dbResume.updated_at).getTime()
              : Date.now(),
            personal: {
              fullName: dbResume.full_name || '',
              email: dbResume.email || '',
              phone: dbResume.phone || '',
              location: dbResume.location || '',
              linkedIn: dbResume.linkedin || '',
              portfolio: dbResume.portfolio || '',
            },
            summary: dbResume.summary || '',
            skillGroups: dbResume.skills || [],
            experience: dbResume.experience || [],
            projects: dbResume.projects || [],
            education: dbResume.education || [],
            achievements: dbResume.achievements || [],
          });
        } else {
          // Create empty resume if not found
          const emptyResume: Resume = {
            id: resumeId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            personal: { fullName: '', email: '', phone: '', location: '' },
            summary: '',
            skillGroups: [],
            experience: [],
            projects: [],
            education: [],
            achievements: [],
          };
          setResume(emptyResume);
        }
      } catch (err) {
        console.error('Failed to load resume:', err);
        const emptyResume: Resume = {
          id: resumeId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          personal: { fullName: '', email: '', phone: '', location: '' },
          summary: '',
          skillGroups: [],
          experience: [],
          projects: [],
          education: [],
          achievements: [],
        };
        setResume(emptyResume);
      }
    } else {
      // No Supabase, use empty resume
      const emptyResume: Resume = {
        id: resumeId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        personal: { fullName: '', email: '', phone: '', location: '' },
        summary: '',
        skillGroups: [],
        experience: [],
        projects: [],
        education: [],
        achievements: [],
      };
      setResume(emptyResume);
    }
  };

  // Auto-save every 5 seconds when data changes
  useEffect(() => {
    const interval = setInterval(async () => {
      if (resume && user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        try {
          const resumeData = {
            id: resume.id,
            title: resume.personal.fullName || 'Untitled Resume',
            full_name: resume.personal.fullName,
            email: resume.personal.email,
            phone: resume.personal.phone,
            location: resume.personal.location,
            summary: resume.summary,
            skills: resume.skillGroups,
            experience: resume.experience,
            projects: resume.projects,
            education: resume.education,
            achievements: resume.achievements,
          };

          const existingResume = await resumeService.getResume(resume.id);
          if (existingResume) {
            await resumeService.updateResume(resume.id, resumeData);
          } else {
            await resumeService.createResume(user.userId, resumeData);
          }
        } catch (err) {
          console.error('Failed to sync resume to database:', err);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [resume, user]);

  if (!mounted || !resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white text-black min-h-screen">
      <Header />

      {isMobile ? (
        <MobileLayout resume={resume} setResume={setResume} />
      ) : (
        <DesktopLayout resume={resume} setResume={setResume} />
      )}
    </div>
  );
}
