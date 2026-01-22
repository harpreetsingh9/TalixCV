'use client';

import { Input } from '@/components/ui/input';
import type { Resume } from '@/types/resume';

interface PersonalInfoSectionProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function PersonalInfoSection({
  resume,
  setResume,
}: PersonalInfoSectionProps) {
  if (!resume) return null;

  const personal = resume.personal;

  const updatePersonal = (updatedFields: Partial<Resume['personal']>) => {
    setResume({
      ...resume,
      personal: {
        ...personal,
        ...updatedFields,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <Input
            value={personal.fullName}
            onChange={(e) =>
              setResume({
                ...resume,
                personal: { ...personal, fullName: e.target.value },
              })
            }
            placeholder="John Doe"
            className="border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            value={personal.email}
            onChange={(e) =>
              setResume({
                ...resume,
                personal: { ...personal, email: e.target.value },
              })
            }
            placeholder="john@example.com"
            className="border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <Input
            value={personal.phone}
            onChange={(e) =>
              setResume({
                ...resume,
                personal: { ...personal, phone: e.target.value },
              })
            }
            placeholder="+1 (555) 123-4567"
            className="border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <Input
            value={personal.location}
            onChange={(e) =>
              setResume({
                ...resume,
                personal: { ...personal, location: e.target.value },
              })
            }
            placeholder="San Francisco, CA"
            className="border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            LinkedIn (optional)
          </label>
          <Input
            value={personal.linkedIn || ''}
            onChange={(e) =>
              setResume({
                ...resume,
                personal: { ...personal, linkedIn: e.target.value },
              })
            }
            placeholder="linkedin.com/in/johndoe"
            className="border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Portfolio (optional)
          </label>
          <Input
            value={personal.portfolio || ''}
            onChange={(e) =>
              setResume({
                ...resume,
                personal: { ...personal, portfolio: e.target.value },
              })
            }
            placeholder="johndoe.com"
            className="border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
