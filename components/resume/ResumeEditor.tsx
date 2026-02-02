'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoSection } from './sections/personal-info';
import { SummarySection } from './sections/summary';
import { SkillsSection } from './sections/skills';
import { ExperienceSection } from './sections/experience';
import { ProjectsSection } from './sections/projects';
import { EducationSection } from './sections/education';
import { AchievementsSection } from './sections/achievements';
import type { Resume } from '@/types/resume';
import { JobDescriptionSection } from './sections/JobDescriptionsSection';

export const mockOptimizedSummary =
  'Strategic product leader with 6+ years of experience delivering customer-focused web products. Proven track record increasing activation and retention through data-informed roadmaps and cross-functional execution.';

interface OptimizationResults {
  analysis: {
    keywords: string[];
    requiredSkills: string[];
    summary: string;
  };
  optimizedExperience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    bullets: any[];
    optimizedBullets: Array<{
      id: string;
      original: string;
      optimized: string;
    }>;
  }>;
  optimizedSummary: string;
  originalSummary: string;
  suggestedSkills: string[];
}

interface ResumeEditorProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function ResumeEditor({ resume, setResume }: ResumeEditorProps) {
  const [optimizationResults, setOptimizationResults] =
    useState<OptimizationResults | null>(null);

  if (!resume) {
    return <div className="p-6 text-gray-600">No resume loaded</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <JobDescriptionSection
        resume={resume}
        onOptimizationComplete={setOptimizationResults}
      />

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8">
          <TabsTrigger value="personal" className="text-xs lg:text-sm">
            Personal
          </TabsTrigger>
          <TabsTrigger value="summary" className="text-xs lg:text-sm">
            Summary
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-xs lg:text-sm">
            Skills
          </TabsTrigger>
          <TabsTrigger value="experience" className="text-xs lg:text-sm">
            Experience
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-xs lg:text-sm">
            Projects
          </TabsTrigger>
          <TabsTrigger value="education" className="text-xs lg:text-sm">
            Education
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs lg:text-sm">
            Awards
          </TabsTrigger>
        </TabsList>

        <div className="space-y-6">
          <TabsContent value="personal">
            <PersonalInfoSection resume={resume} setResume={setResume} />
          </TabsContent>

          <TabsContent value="summary">
            <SummarySection
              resume={resume}
              setResume={setResume}
              optimizedSummary={mockOptimizedSummary}
            />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsSection
              resume={resume}
              setResume={setResume}
              suggestedSkills={optimizationResults?.suggestedSkills}
            />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceSection
              resume={resume}
              setResume={setResume}
              optimizedExperience={optimizationResults?.optimizedExperience}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsSection resume={resume} setResume={setResume} />
          </TabsContent>

          <TabsContent value="education">
            <EducationSection resume={resume} setResume={setResume} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsSection resume={resume} setResume={setResume} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
