'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { aiService } from '@/lib/services/ai-service.client';
import { Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Resume } from '@/types/resume';

interface OptimizationResults {
  analysis: {
    keywords: string[];
    requiredSkills: string[];
    summary: string;
  };
  optimizedExperience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    bullets: any[];
    optimizedBullets: Array<{
      id: string;
      original: string;
      optimized: string;
    }>;
  }>;
  optimizedSummary: string;
  originalSummary: string;
  suggestedSkills: string[];
}

interface JobDescriptionSectionProps {
  resume: Resume;
  onOptimizationComplete?: (results: OptimizationResults) => void;
}

export function JobDescriptionSection({
  resume,
  onOptimizationComplete,
}: JobDescriptionSectionProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [optimizationResults, setOptimizationResults] =
    useState<OptimizationResults | null>(null);
  const [error, setError] = useState('');
  // const [providerInfo, setProviderInfo] = useState<{
  //   provider: string;
  //   model: string;
  //   configured: boolean;
  // } | null>(null);

  // useEffect(() => {
  //   const checkStatus = async () => {
  //     try {
  //       const status = await aiService.checkStatus();
  //       setProviderInfo(status);
  //     } catch (err) {
  //       console.error('Failed to check AI status:', err);
  //     }
  //   };
  //   checkStatus();
  // }, []);

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    // if (!providerInfo?.configured) {
    //   setError('AI provider not configured. Please check your environment variables.');
    //   return;
    // }

    setAnalyzing(true);
    setError('');

    try {
      const results = await aiService.optimizeResume(jobDescription, resume);
      setOptimizationResults(results);
      onOptimizationComplete?.(results);
    } catch (err: any) {
      console.error('Optimization error:', err);
      setError(err.message || 'Failed to optimize resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setJobDescription('');
    setOptimizationResults(null);
    setError('');
    onOptimizationComplete?.(null as any);
  };

  return (
    <div className="space-y-4 p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">AI Resume Optimizer</h3>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Paste a job description to get AI-optimized bullet points, summary, and
        skill suggestions - all at once!
      </p>

      <Textarea
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="min-h-[150px] border-gray-300"
        disabled={analyzing}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleOptimize}
          disabled={analyzing}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Optimizing Resume...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Optimize Resume
            </>
          )}
        </Button>

        {jobDescription && (
          <Button onClick={handleClear} variant="outline">
            Clear
          </Button>
        )}
      </div>

      {optimizationResults && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold">Optimization Complete!</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-sm mb-2 text-purple-700">
                📝 Summary
              </h4>
              <p className="text-xs text-gray-600">Optimized in Summary tab</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-sm mb-2 text-purple-700">
                💼 Experience
              </h4>
              <p className="text-xs text-gray-600">
                {optimizationResults.optimizedExperience.reduce(
                  (sum, exp) => sum + exp.optimizedBullets.length,
                  0
                )}{' '}
                bullet points optimized
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-sm mb-2 text-purple-700">
                🎯 Skills
              </h4>
              <p className="text-xs text-gray-600">
                {optimizationResults.suggestedSkills.length} skills suggested
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Job Summary</h4>
            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
              {optimizationResults.analysis.summary}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Key Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {optimizationResults.analysis.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {optimizationResults.analysis.requiredSkills.map(
                (skill, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800">
                    {skill}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              💡 <strong>Next steps:</strong> Go to Summary, Experience, and
              Skills tabs to review and apply the optimized content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
