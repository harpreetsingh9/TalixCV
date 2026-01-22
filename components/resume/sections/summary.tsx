'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Resume } from '@/types/resume';

interface SummarySectionProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function SummarySection({ resume, setResume }: SummarySectionProps) {
  if (!resume) return null;

  const currentResume = resume;
  const updateSummary = (summary: string) => {
    setResume({ ...resume, summary });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Professional Summary</h3>
      </div>

      <div className="space-y-4">
        <Textarea
          value={resume.summary}
          onChange={(e) =>
            setResume({
              ...resume,
              summary: e.target.value,
            })
          }
          placeholder="Write a compelling summary about your professional background, skills, and career goals..."
          className="min-h-32 border-gray-300"
        />

        <Button className="bg-black text-white hover:bg-gray-900" disabled>
          ✨ Enhance with AI
        </Button>
      </div>
    </div>
  );
}
