'use client';

import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import type { Resume } from '@/types/resume';

interface ProjectsSectionProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function ProjectsSection({ resume, setResume }: ProjectsSectionProps) {
  if (!resume) return null;

  const addProject = () => {
    const newProject = {
      id: uuidv4(),
      title: '',
      description: '',
      link: '',
      technologies: [],
    };
    setResume({
      ...resume,
      projects: [...resume.projects, newProject],
    });
  };

  const updateProject = (
    projectId: string,
    updatedFields: Partial<{
      title: string;
      description: string;
      link: string;
      technologies: string[];
    }>
  ) => {
    setResume({
      ...resume,
      projects: resume.projects.map((project) =>
        project.id === projectId ? { ...project, ...updatedFields } : project
      ),
    });
  };

  const deleteProject = (projectId: string) => {
    setResume({
      ...resume,
      projects: resume.projects.filter((project) => project.id !== projectId),
    });
  };

  const currentResume = resume;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button
          onClick={addProject}
          className="bg-black text-white hover:bg-gray-900 text-sm"
        >
          Add Project
        </Button>
      </div>

      {currentResume.projects.length === 0 ? (
        <p className="text-gray-600 text-sm">No projects yet.</p>
      ) : (
        <div className="space-y-6">
          {currentResume.projects.map((project) => (
            <Card key={project.id} className="p-4 border-gray-200">
              <div className="space-y-4">
                <div className="flex gap-2 items-start">
                  <Input
                    value={project.title}
                    onChange={(e) =>
                      updateProject(project.id, {
                        title: e.target.value,
                      })
                    }
                    placeholder="Project Title"
                    className="flex-1 border-gray-300"
                  />
                  <Button
                    onClick={() => deleteProject(project.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Textarea
                  value={project.description}
                  onChange={(e) =>
                    updateProject(project.id, {
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your project and its impact"
                  className="min-h-24 border-gray-300"
                />

                <Input
                  value={project.link || ''}
                  onChange={(e) =>
                    updateProject(project.id, { link: e.target.value })
                  }
                  placeholder="Project Link (optional)"
                  className="border-gray-300"
                />

                <Input
                  value={project.technologies.join(', ')}
                  onChange={(e) =>
                    updateProject(project.id, {
                      technologies: e.target.value
                        .split(',')
                        .map((t) => t.trim()),
                    })
                  }
                  placeholder="Technologies (comma-separated)"
                  className="border-gray-300"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
