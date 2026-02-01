'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import type { Resume, Experience, Bullet } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

interface OptimizedBullet {
  id: string;
  original: string;
  optimized: string;
}

interface OptimizedExperience {
  id: string;
  optimizedBullets: OptimizedBullet[];
}

interface ExperienceSectionProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
  optimizedExperience?: OptimizedExperience[];
}

export function ExperienceSection({
  resume,
  setResume,
  optimizedExperience = [
    {
      id: 'e-1',
      optimizedBullets: [
        {
          id: 'b-1',
          original: 'this is origin 1 point',
          optimized: 'this is optimized point 1',
        },
        {
          id: 'b-2',
          original: 'this is second org point ',
          optimized: 'this is 2 optimized point',
        },
      ],
    },
  ],
}: ExperienceSectionProps) {
  const [localOptimizedExperience, setLocalOptimizedExperience] =
    useState<OptimizedExperience[]>(optimizedExperience);

  const getOptimizedBulletsForExp = (expId: string): OptimizedBullet[] => {
    const optimized = localOptimizedExperience.find((exp) => exp.id === expId);
    return optimized?.optimizedBullets || [];
  };

  const addExperience = () => {
    const newExp: Experience = {
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
      experience: [...resume.experience, newExp],
    });
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: any
  ) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const deleteExperience = (id: string) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((exp) => exp.id !== id),
    });
  };

  const addBullet = (expId: string) => {
    const newBullet: Bullet = {
      id: uuidv4(),
      text: '',
    };
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === expId
          ? { ...exp, bullets: [...exp.bullets, newBullet] }
          : exp
      ),
    });
  };

  const updateBullet = (expId: string, bulletId: string, text: string) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === expId
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

  const applyOptimizedBullet = (
    expId: string,
    bulletId: string,
    optimizedText: string
  ) => {
    updateBullet(expId, bulletId, optimizedText);

    // remove the applied optimization for this bullet so the comparison UI hides
    setLocalOptimizedExperience((prev) =>
      prev
        .map((exp) =>
          exp.id === expId
            ? {
                ...exp,
                optimizedBullets: exp.optimizedBullets.filter(
                  (ob) => ob.id !== bulletId
                ),
              }
            : exp
        )
        .filter((exp) => exp.optimizedBullets.length > 0)
    );
  };

  const applyOriginalBullet = (
    expId: string,
    bulletId: string,
    originalText: string
  ) => {
    updateBullet(expId, bulletId, originalText);

    // remove the optimization suggestion after keeping original
    setLocalOptimizedExperience((prev) =>
      prev
        .map((exp) =>
          exp.id === expId
            ? {
                ...exp,
                optimizedBullets: exp.optimizedBullets.filter(
                  (ob) => ob.id !== bulletId
                ),
              }
            : exp
        )
        .filter((exp) => exp.optimizedBullets.length > 0)
    );
  };

  const deleteBullet = (expId: string, bulletId: string) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === expId
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
        <Button onClick={addExperience} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Experience
        </Button>
      </div>

      {optimizedExperience.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-800">
            ✨ <strong>AI Optimizations Available!</strong> Review the
            before/after comparisons below and click "Apply" to use optimized
            versions.
          </p>
        </div>
      )}

      {resume.experience.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          No experience added yet. Click "Add Experience" to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {resume.experience.map((exp, index) => {
            const optimizedBullets = getOptimizedBulletsForExp(exp.id);
            const hasOptimizations = optimizedBullets.length > 0;

            return (
              <div
                key={exp.id}
                className={`p-4 border rounded-lg space-y-4 ${
                  hasOptimizations
                    ? 'border-purple-300 bg-purple-50/30'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      Experience {index + 1}
                    </span>
                    {hasOptimizations && (
                      <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
                        AI Optimized
                      </span>
                    )}
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`company-${exp.id}`}>Company</Label>
                    <Input
                      id={`company-${exp.id}`}
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, 'company', e.target.value)
                      }
                      placeholder="Company Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`role-${exp.id}`}>Role</Label>
                    <Input
                      id={`role-${exp.id}`}
                      value={exp.role}
                      onChange={(e) =>
                        updateExperience(exp.id, 'role', e.target.value)
                      }
                      placeholder="Job Title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${exp.id}`}
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, 'startDate', e.target.value)
                      }
                      placeholder="Jan 2020"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                    <Input
                      id={`endDate-${exp.id}`}
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(exp.id, 'endDate', e.target.value)
                      }
                      placeholder="Dec 2022"
                      disabled={exp.currentlyWorking}
                    />
                  </div>
                </div>

                <div className="flex items-center pb-6 space-x-2 border-b border-gray-200">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.currentlyWorking}
                    onCheckedChange={(checked) =>
                      updateExperience(exp.id, 'currentlyWorking', checked)
                    }
                  />
                  <label
                    htmlFor={`current-${exp.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I currently work here
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Responsibilities & Achievements</Label>
                    <Button
                      onClick={() => addBullet(exp.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Bullet
                    </Button>
                  </div>

                  {exp.bullets.map((bullet) => {
                    const optimized = optimizedBullets.find(
                      (ob) => ob.id === bullet.id
                    );

                    return (
                      <div key={bullet.id} className="space-y-2">
                        <div className="flex gap-2">
                          <Textarea
                            value={bullet.text}
                            onChange={(e) =>
                              updateBullet(exp.id, bullet.id, e.target.value)
                            }
                            placeholder="Describe your achievement or responsibility..."
                            className="flex-1 min-h-[60px]"
                          />
                          <Button
                            onClick={() => deleteBullet(exp.id, bullet.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* AI Optimization Comparison */}
                        {optimized && (
                          <div className="p-4 mt-2 mb-6 bg-white border border-purple-200 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
                              <Sparkles className="w-4 h-4" />
                              AI Optimization Available
                            </div>

                            <div className="flex flex-col gap-4">
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-1">
                                  Original:
                                </p>
                                <div className="bg-red-50 border border-red-200 p-3 rounded text-sm">
                                  {optimized.original}
                                </div>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-1">
                                  Optimized:
                                </p>
                                <div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
                                  {optimized.optimized}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  applyOptimizedBullet(
                                    exp.id,
                                    bullet.id,
                                    optimized.optimized
                                  )
                                }
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Apply Optimized
                              </Button>
                              <Button
                                onClick={() =>
                                  applyOriginalBullet(
                                    exp.id,
                                    bullet.id,
                                    optimized.original
                                  )
                                }
                                size="sm"
                                variant="outline"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Keep Original
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {exp.bullets.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded">
                      No bullet points added. Click "Add Bullet" to add
                      achievements.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
