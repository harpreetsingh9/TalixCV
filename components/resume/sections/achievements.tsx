'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import type { Resume } from '@/types/resume';

interface AchievementsSectionProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function AchievementsSection({
  resume,
  setResume,
}: AchievementsSectionProps) {
  if (!resume) return null;

  const currentResume = resume;
  const addAchievement = () => {
    setResume({
      ...resume,
      achievements: [...resume.achievements, ''],
    });
  };

  const updateAchievement = (index: number, value: string) => {
    setResume({
      ...resume,
      achievements: resume.achievements.map((achievement, i) =>
        i === index ? value : achievement
      ),
    });
  };

  const deleteAchievement = (index: number) => {
    setResume({
      ...resume,
      achievements: resume.achievements.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Awards & Achievements</h3>
        <Button
          onClick={addAchievement}
          className="bg-black text-white hover:bg-gray-900 text-sm"
        >
          Add Achievement
        </Button>
      </div>

      {currentResume.achievements.length === 0 ? (
        <p className="text-gray-600 text-sm">No achievements yet.</p>
      ) : (
        <div className="space-y-3">
          {currentResume.achievements.map((achievement, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={achievement}
                onChange={(e) => updateAchievement(index, e.target.value)}
                placeholder="Award or Achievement"
                className="border-gray-300"
              />
              <Button
                onClick={() => deleteAchievement(index)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
