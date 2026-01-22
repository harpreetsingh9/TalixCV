'use client';

import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import type { Resume } from '@/types/resume';

interface ExperienceSectionProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function ExperienceSection({
  resume,
  setResume,
}: ExperienceSectionProps) {
  if (!resume) return null;

  const currentResume = resume;

  const addExperience = () => {
    const newExperience = {
      id: uuidv4(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      bullets: [],
    };
    setResume({
      ...resume,
      experience: [...resume.experience, newExperience],
    });
  };

  const updateExperience = (id: string, updatedFields: Partial<Experience>) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === id ? { ...exp, ...updatedFields } : exp
      ),
    });
  };

  const deleteExperience = (id: string) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((exp) => exp.id !== id),
    });
  };

  const addBullet = (experienceId: string) => {
    const newBullet = {
      id: uuidv4(),
      text: '',
    };
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === experienceId
          ? { ...exp, bullets: [...exp.bullets, newBullet] }
          : exp
      ),
    });
  };

  const updateBullet = (
    experienceId: string,
    bulletId: string,
    text: string
  ) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === experienceId
          ? {
              ...exp,
              bullets: exp.bullets.map((bullet) =>
                bullet.id === bulletId ? { ...bullet, text } : bullet
              ),
            }
          : exp
      ),
    });
  };

  const deleteBullet = (experienceId: string, bulletId: string) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === experienceId
          ? {
              ...exp,
              bullets: exp.bullets.filter((bullet) => bullet.id !== bulletId),
            }
          : exp
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button
          onClick={addExperience}
          className="bg-black text-white hover:bg-gray-900 text-sm"
        >
          Add Experience
        </Button>
      </div>

      {currentResume.experience.length === 0 ? (
        <p className="text-gray-600 text-sm">No experience entries yet.</p>
      ) : (
        <div className="space-y-6">
          {currentResume.experience.map((exp) => (
            <Card key={exp.id} className="p-4 border-gray-200">
              <div className="space-y-4">
                <div className="flex gap-2 items-start">
                  <div className="flex-1 space-y-3">
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, {
                          company: e.target.value,
                        })
                      }
                      placeholder="Company Name"
                      className="border-gray-300"
                    />
                    <Input
                      value={exp.role}
                      onChange={(e) =>
                        updateExperience(exp.id, { role: e.target.value })
                      }
                      placeholder="Job Title"
                      className="border-gray-300"
                    />
                  </div>
                  <Button
                    onClick={() => deleteExperience(exp.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(exp.id, {
                        startDate: e.target.value,
                      })
                    }
                    placeholder="Start Date"
                    className="border-gray-300"
                  />
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(exp.id, { endDate: e.target.value })
                    }
                    disabled={exp.currentlyWorking}
                    placeholder="End Date"
                    className="border-gray-300"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) =>
                      updateExperience(exp.id, {
                        currentlyWorking: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  Currently working here
                </label>

                <div className="space-y-2 pt-2 border-t border-gray-200">
                  {exp.bullets.map((bullet) => (
                    <div key={bullet.id} className="flex gap-2">
                      <Textarea
                        value={bullet.text}
                        onChange={(e) =>
                          updateBullet(exp.id, bullet.id, e.target.value)
                        }
                        placeholder="• Add an achievement or responsibility"
                        className="min-h-20 border-gray-300 resize-none"
                      />
                      <Button
                        onClick={() => deleteBullet(exp.id, bullet.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => addBullet(exp.id)}
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-300 hover:bg-gray-50"
                >
                  Add Bullet Point
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  bullets: { id: string; text: string }[];
}
