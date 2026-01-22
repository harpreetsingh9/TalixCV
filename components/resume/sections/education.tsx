'use client';

import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import type { Resume } from '@/types/resume';

interface EducationSectionProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function EducationSection({ resume, setResume }: EducationSectionProps) {
  if (!resume) return null;

  const addEducation = () => {
    setResume({
      ...resume,
      education: [
        ...resume.education,
        { id: uuidv4(), school: '', degree: '', field: '', graduationYear: '' },
      ],
    });
  };

  const updateEducation = (
    id: string,
    updatedFields: Partial<Resume['education'][0]>
  ) => {
    setResume({
      ...resume,
      education: resume.education.map((edu) =>
        edu.id === id ? { ...edu, ...updatedFields } : edu
      ),
    });
  };

  const deleteEducation = (id: string) => {
    setResume({
      ...resume,
      education: resume.education.filter((edu) => edu.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button
          onClick={addEducation}
          className="bg-black text-white hover:bg-gray-900 text-sm"
        >
          Add Education
        </Button>
      </div>

      {resume.education.length === 0 ? (
        <p className="text-gray-600 text-sm">No education entries yet.</p>
      ) : (
        <div className="space-y-6">
          {resume.education.map((edu) => (
            <Card key={edu.id} className="p-4 border-gray-200">
              <div className="space-y-4">
                <div className="flex gap-2 items-start">
                  <div className="flex-1 space-y-3">
                    <Input
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(edu.id, {
                          school: e.target.value,
                        })
                      }
                      placeholder="School or University"
                      className="border-gray-300"
                    />
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, {
                          degree: e.target.value,
                        })
                      }
                      placeholder="Degree (e.g., Bachelor of Science)"
                      className="border-gray-300"
                    />
                  </div>
                  <Button
                    onClick={() => deleteEducation(edu.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(edu.id, {
                        field: e.target.value,
                      })
                    }
                    placeholder="Field of Study"
                    className="border-gray-300"
                  />
                  <Input
                    type="number"
                    value={edu.graduationYear}
                    onChange={(e) =>
                      updateEducation(edu.id, {
                        graduationYear: e.target.value,
                      })
                    }
                    placeholder="Graduation Year"
                    className="border-gray-300"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
