'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { resumeService } from '@/lib/services/resume-service';
import { authUtils, type AuthUser } from '@/lib/auth';
import { useMediaQuery } from '@/hooks/use-mobile';
import type { Resume } from '@/types/resume';
import Header from '@/components/dashboard/Header';
import MobileLayout from '@/components/resume/MobileLayout';
import DesktopLayout from '@/components/resume/DesktopLayout';
import { ResumePDF } from '@/components/resume/ResumePDF';
import { pdf } from '@react-pdf/renderer';

export default function ResumePage() {
  const params = useParams();
  const id = params?.id as string;
  const [resume, setResume] = useState<Resume | null>(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const handleSave = async () => {
    if (!resume || !user) return;

    try {
      const payload = {
        title: resume.personal.fullName || 'Untitled Resume',
        full_name: resume.personal.fullName,
        email: resume.personal.email,
        phone: resume.personal.phone,
        location: resume.personal.location,
        linkedin: resume.personal.linkedIn,
        portfolio: resume.personal.portfolio,
        summary: resume.summary,
        skills: resume.skillGroups,
        experience: resume.experience,
        projects: resume.projects,
        education: resume.education,
        achievements: resume.achievements,
      };

      await resumeService.updateResume(resume.id, payload);

      // Create blob and trigger download
      const blob = await pdf(ResumePDF({ resume })).toBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.personal.fullName?.replace(/\s+/g, '_') || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to save resume');
    }
  };

  useEffect(() => {
    setMounted(true);

    const loadData = async () => {
      const currentUser = await authUtils.getCurrentUser();
      setUser(currentUser);

      if (id) {
        await loadResume(id);
      }
    };

    loadData();
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

  if (!mounted || !resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white text-black min-h-screen">
      <Header handleSave={handleSave} isEditor={true} />

      {isMobile ? (
        <MobileLayout resume={resume} setResume={setResume} />
      ) : (
        <DesktopLayout resume={resume} setResume={setResume} />
      )}
    </div>
  );
}
