'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Resume } from '@/types/resume';

interface SummarySectionProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
  optimizedSummary?: string;
  originalSummary?: string;
}

export function SummarySection({
  resume,
  setResume,
  optimizedSummary,
}: SummarySectionProps) {
  const [showComparison, setShowComparison] = useState(true);
  const hasOptimization =
    !!optimizedSummary && optimizedSummary !== resume.summary;

  const applyOptimized = () => {
    setResume({ ...resume, summary: optimizedSummary || '' });
    setShowComparison(false);
  };

  const keepOriginal = () => {
    setResume({ ...resume, summary: resume.summary || '' });
    setShowComparison(false);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="summary">Professional Summary</Label>

      {hasOptimization && showComparison && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800 mb-4">
              ✨ <strong>AI Optimization Available!</strong> Review the
              comparison below and choose which version to use.
            </p>

            <div className="flex flex-col gap-4">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Original Summary:
                </p>
                <div className="bg-red-50 border border-red-200 p-4 rounded min-h-[100px]">
                  <p className="text-sm">{resume.summary || 'No summary'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Optimized Summary:
                </p>
                <div className="bg-green-50 border border-green-200 p-4 rounded min-h-[100px]">
                  <p className="text-sm">{optimizedSummary}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={applyOptimized}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Apply Optimized
              </Button>
              <Button onClick={keepOriginal} size="sm" variant="outline">
                <XCircle className="w-4 h-4 mr-1" />
                Keep Original
              </Button>
            </div>
          </div>
        </div>
      )}
      <Textarea
        id="summary"
        value={resume.summary}
        onChange={(e) => setResume({ ...resume, summary: e.target.value })}
        placeholder="Write a brief professional summary highlighting your key strengths and experience..."
        className="min-h-[120px]"
      />

      {hasOptimization && !showComparison && (
        <Button
          onClick={() => setShowComparison(true)}
          size="sm"
          variant="outline"
          className="border-purple-300 text-purple-700"
        >
          View AI Optimization
        </Button>
      )}

      <p className="text-xs text-gray-500">
        Tip: A strong summary is 2-3 sentences highlighting your experience,
        skills, and career goals.
      </p>
      <Button className="bg-black text-white hover:bg-gray-900" disabled>
        ✨ Enhance with AI
      </Button>
    </div>
  );
}

// Mock data for development / stories / tests
export const mockResume: Resume = {
  id: 'mock-1',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  personal: {
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '555-555-5555',
    location: 'San Francisco, CA',
    linkedIn: 'https://www.linkedin.com/in/janedoe',
    portfolio: 'https://janedoe.dev',
  },
  summary:
    'Product-focused engineering leader with 6+ years building consumer and B2B web products. Skilled at turning ambiguous problems into clear product roadmaps, partnering with design and engineering to deliver measurable outcomes.',
  skillGroups: [
    {
      id: 'sg-1',
      category: 'Technical Skills',
      skills: [
        { id: 's-1', name: 'React' },
        { id: 's-2', name: 'TypeScript' },
        { id: 's-3', name: 'Node.js' },
      ],
    },
    {
      id: 'sg-2',
      category: 'Product & Design',
      skills: [
        { id: 's-4', name: 'Figma' },
        { id: 's-5', name: 'A/B Testing' },
      ],
    },
  ],
  experience: [
    {
      id: 'e-1',
      company: 'Acme Corp',
      role: 'Senior Product Manager',
      startDate: '2019-06',
      endDate: '2024-01',
      currentlyWorking: false,
      bullets: [
        {
          id: 'b-1',
          text: 'Led cross-functional team to launch feature X, increasing retention by 18%.',
        },
        {
          id: 'b-2',
          text: 'Defined roadmap and prioritized initiatives that drove a 35% increase in activation.',
        },
      ],
    },
  ],
  projects: [
    {
      id: 'p-1',
      title: 'Resume Builder',
      description:
        'A modern resume builder with AI-powered suggestions and PDF export.',
      link: 'https://example.com',
      technologies: ['React', 'Next.js', 'Supabase'],
    },
  ],
  education: [
    {
      id: 'ed-1',
      school: 'State University',
      degree: 'B.S.',
      field: 'Computer Science',
      graduationYear: '2018',
    },
  ],
  achievements: [
    'Improved onboarding conversion by 35% through product experiments',
    'Guest speaker at ProductConf 2022',
  ],
};

export const mockOriginalSummary = mockResume.summary;
