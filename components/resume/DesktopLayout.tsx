import { ResumeEditor } from './ResumeEditor';
import { ResumePreview } from './ResumePreview';
import type { Resume } from '@/types/resume';

interface DesktopLayoutProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export default function DesktopLayout({
  resume,
  setResume,
}: DesktopLayoutProps) {
  return (
    <div className="flex flex-1">
      <div className="w-1/2 border-r border-gray-200 overflow-auto">
        <ResumeEditor resume={resume} setResume={setResume} />
      </div>
      <div className="w-1/2 overflow-auto bg-gray-50">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
