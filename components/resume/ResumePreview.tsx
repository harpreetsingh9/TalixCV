'use client';
import { Resume } from '@/types/resume';
interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  if (!resume) {
    return <div className="p-8 text-gray-600">No resume data</div>;
  }

  const {
    personal,
    summary,
    skillGroups,
    experience,
    projects,
    education,
    achievements,
  } = resume;

  return (
    <div className="bg-white p-12 min-h-screen max-w-4xl mx-auto font-serif text-sm text-black">
      {/* Header */}
      <div className="text-center border-b border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {personal.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-4 text-xs mt-2 flex-wrap">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
        {(personal.linkedIn || personal.portfolio) && (
          <div className="flex justify-center gap-4 text-xs mt-1 flex-wrap">
            {personal.linkedIn && <span>{personal.linkedIn}</span>}
            {personal.portfolio && <span>{personal.portfolio}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black mb-2 pb-1">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {skillGroups.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black mb-2 pb-1">
            Skills
          </h2>
          <div className="space-y-2">
            {skillGroups.map((group) => (
              <div key={group.id} className="text-xs">
                <span className="font-semibold">{group.category}:</span>{' '}
                <span>{group.skills.map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black mb-2 pb-1">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold">{exp.role}</span>
                  <span className="text-gray-700">
                    {exp.startDate && `${exp.startDate}`}
                    {exp.startDate && exp.endDate && ' – '}
                    {exp.endDate && exp.endDate}
                    {!exp.endDate && exp.currentlyWorking && 'Present'}
                  </span>
                </div>
                <div className="text-gray-700 mb-1">{exp.company}</div>
                {exp.bullets.length > 0 && (
                  <ul className="ml-4 space-y-0.5 list-disc text-gray-800">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet.id} className="text-xs">
                        {bullet.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black mb-2 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="text-xs">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold">{project.title}</span>
                  {project.link && (
                    <span className="text-gray-700">{project.link}</span>
                  )}
                </div>
                <p className="text-gray-800 mb-1">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Tech:</span>{' '}
                    {project.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black mb-2 pb-1">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{edu.degree}</span>
                  {edu.graduationYear && (
                    <span className="text-gray-700">{edu.graduationYear}</span>
                  )}
                </div>
                <div className="text-gray-700">
                  {edu.school}
                  {edu.field && ` – ${edu.field}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black mb-2 pb-1">
            Awards & Achievements
          </h2>
          <ul className="space-y-1 list-disc ml-4 text-xs">
            {achievements.map((achievement, index) => (
              <li key={index} className="text-gray-800">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
