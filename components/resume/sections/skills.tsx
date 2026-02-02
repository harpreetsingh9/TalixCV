'use client';

import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import type { Resume, Skill, SkillGroup } from '@/types/resume';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface SkillsSectionProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
  suggestedSkills?: string[];
}

export function SkillsSection({
  resume,
  setResume,
  suggestedSkills = [],
}: SkillsSectionProps) {
  if (!resume) return null;

  const [suggestions, setSuggestions] = useState<string[]>(suggestedSkills);

  const addSkillGroup = () => {
    const newGroup: SkillGroup = {
      id: uuidv4(),
      category: '',
      skills: [],
    };
    setResume({
      ...resume,
      skillGroups: [...resume.skillGroups, newGroup],
    });
  };

  const updateSkillGroup = (
    groupId: string,
    field: keyof SkillGroup,
    value: any
  ) => {
    setResume({
      ...resume,
      skillGroups: resume.skillGroups.map((group) =>
        group.id === groupId ? { ...group, [field]: value } : group
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
    const newSkill: Skill = { id: uuidv4(), name: '' };
    setResume({
      ...resume,
      skillGroups: resume.skillGroups.map((group) =>
        group.id === groupId
          ? { ...group, skills: [...group.skills, newSkill] }
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

  const addSuggestedSkill = (skillName: string, groupIndex: number = 0) => {
    if (resume.skillGroups.length === 0) {
      // Create a default group if none exists
      const newGroup: SkillGroup = {
        id: uuidv4(),
        category: 'Skills',
        skills: [{ id: uuidv4(), name: skillName }],
      };
      setResume({
        ...resume,
        skillGroups: [newGroup],
      });
    } else {
      // Add to the first group
      const targetGroup = resume.skillGroups[groupIndex];
      const newSkill: Skill = {
        id: uuidv4(),
        name: skillName,
      };
      updateSkillGroup(targetGroup.id, 'skills', [
        ...targetGroup.skills,
        newSkill,
      ]);
    }

    // Remove from suggestions
    setSuggestions(suggestions.filter((s) => s !== skillName));
  };

  return (
    <div className="space-y-6">
      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
          <p className="text-sm font-semibold text-purple-700">
            Suggested Skills (click to add):
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((skill, index) => (
              <Badge
                key={index}
                className="cursor-pointer bg-purple-100 text-purple-800 hover:bg-purple-200"
                onClick={() => addSuggestedSkill(skill)}
              >
                + {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button onClick={addSkillGroup} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Category
        </Button>
      </div>

      {resume.skillGroups.length === 0 ? (
        <p className="text-gray-600 text-sm">
          No skill categories added yet. Click "Add Category" to get started.
        </p>
      ) : (
        <div className="space-y-6">
          {resume.skillGroups.map((group) => (
            <div
              key={group.id}
              className="p-4 border border-gray-200 rounded-lg space-y-4 bg-white"
            >
              {' '}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex-1">
                      <Label htmlFor={`category-${group.id}`}>Category</Label>
                      <Input
                        id={`category-${group.id}`}
                        value={group.category}
                        onChange={(e) =>
                          updateSkillGroup(group.id, 'category', e.target.value)
                        }
                        placeholder="e.g., Programming Languages"
                        className="mt-1"
                      />
                    </div>
                  </div>
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
                  <div className="flex justify-between items-center">
                    <Label>Skills</Label>
                    <Button
                      onClick={() => addSkill(group.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Skill
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {group.skills.map((skill) => (
                      <div key={skill.id} className="flex gap-2">
                        <Input
                          value={skill.name}
                          onChange={(e) =>
                            updateSkill(group.id, skill.id, e.target.value)
                          }
                          placeholder="Skill name"
                        />
                        <Button
                          onClick={() => deleteSkill(group.id, skill.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {group.skills.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded">
                      No skills added. Click "Add Skill" to add skills.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
