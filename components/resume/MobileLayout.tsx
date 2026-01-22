import { useState } from 'react';
import { ResumeEditor } from './ResumeEditor';
import { ResumePreview } from './ResumePreview';
import type { Resume } from '@/types/resume';

interface MobileLayoutProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export default function MobileLayout({ resume, setResume }: MobileLayoutProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 flex">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'edit'
              ? 'border-black'
              : 'border-transparent text-gray-600'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'preview'
              ? 'border-black'
              : 'border-transparent text-gray-600'
          }`}
        >
          Preview
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {activeTab === 'edit' ? (
          <ResumeEditor resume={resume} setResume={setResume} />
        ) : (
          <ResumePreview resume={resume} />
        )}
      </div>
    </div>
  );
}
