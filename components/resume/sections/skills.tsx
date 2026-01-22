'use client';

import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import type { Resume } from '@/types/resume';

interface SkillsSectionProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function SkillsSection({ resume, setResume }: SkillsSectionProps) {
  if (!resume) return null;

  const currentResume = resume;
  const addSkillGroup = () => {
    setResume({
      ...resume,
      skillGroups: [
        ...resume.skillGroups,
        { id: uuidv4(), category: '', skills: [] },
      ],
    });
  };

  const updateSkillGroup = (groupId: string, category: string) => {
    setResume({
      ...resume,
      skillGroups: resume.skillGroups.map((group) =>
        group.id === groupId ? { ...group, category } : group
      ),
    });
  };

  const deleteSkillGroup = (groupId: string) => {
    setResume({
      ...resume,
      skillGroups: resume.skillGroups.filter((group) => group.id !== groupId),
    });
  };

  const addSkill = (groupId: string) => {
    setResume({
      ...resume,
      skillGroups: resume.skillGroups.map((group) =>
        group.id === groupId
          ? { ...group, skills: [...group.skills, { id: uuidv4(), name: '' }] }
          : group
      ),
    });
  };

  const updateSkill = (groupId: string, skillId: string, name: string) => {
    setResume({
      ...resume,
      skillGroups: resume.skillGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              skills: group.skills.map((skill) =>
                skill.id === skillId ? { ...skill, name } : skill
              ),
            }
          : group
      ),
    });
  };

  const deleteSkill = (groupId: string, skillId: string) => {
    setResume({
      ...resume,
      skillGroups: resume.skillGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              skills: group.skills.filter((skill) => skill.id !== skillId),
            }
          : group
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button
          onClick={addSkillGroup}
          className="bg-black text-white hover:bg-gray-900 text-sm"
        >
          Add Category
        </Button>
      </div>

      {currentResume.skillGroups.length === 0 ? (
        <p className="text-gray-600 text-sm">
          No skill categories yet. Create one to get started.
        </p>
      ) : (
        <div className="space-y-6">
          {currentResume.skillGroups.map((group) => (
            <Card key={group.id} className="p-4 border-gray-200">
              <div className="space-y-4">
                <div className="flex gap-2 items-start">
                  <Input
                    value={group.category}
                    onChange={(e) => updateSkillGroup(group.id, e.target.value)}
                    placeholder="e.g., Languages, Frameworks"
                    className="border-gray-300"
                  />
                  <Button
                    onClick={() => deleteSkillGroup(group.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {group.skills.map((skill) => (
                    <div key={skill.id} className="flex gap-2">
                      <Input
                        value={skill.name}
                        onChange={(e) =>
                          updateSkill(group.id, skill.id, e.target.value)
                        }
                        placeholder="e.g., React, Python"
                        className="border-gray-300"
                      />
                      <Button
                        onClick={() => deleteSkill(group.id, skill.id)}
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
                  onClick={() => addSkill(group.id)}
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-300 hover:bg-gray-50"
                >
                  Add Skill
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
