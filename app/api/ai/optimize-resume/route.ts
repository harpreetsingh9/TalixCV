// app/api/ai/optimize-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai-service.server';

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, resume } = await request.json();

    if (!jobDescription || !resume) {
      return NextResponse.json(
        { error: 'Job description and resume data are required' },
        { status: 400 }
      );
    }

    if (!aiService.isConfigured()) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    // Analyze job description first
    const analysis = await aiService.analyzeJobDescription(jobDescription);

    // Optimize all experience bullets at once
    const optimizedExperience = await Promise.all(
      resume.experience.map(async (exp: any) => {
        if (!exp.bullets || exp.bullets.length === 0) {
          return {
            ...exp,
            optimizedBullets: [],
          };
        }

        const bulletTexts = exp.bullets.map((b: any) => b.text);
        const optimizedBullets = await aiService.optimizeMultipleBullets(
          bulletTexts,
          jobDescription,
          exp.role
        );

        return {
          ...exp,
          optimizedBullets: exp.bullets.map((bullet: any, index: number) => ({
            id: bullet.id,
            original: bullet.text,
            optimized: optimizedBullets[index] || bullet.text,
          })),
        };
      })
    );

    // Generate optimized summary
    const optimizedSummary = resume.summary
      ? await aiService.generateSummary(
          resume.experience,
          resume.skillGroups || [],
          analysis.summary || 'Professional'
        )
      : '';

    // Suggest skills
    const currentSkills = resume.skillGroups
      ? resume.skillGroups.flatMap((group: any) =>
          group.skills.map((s: any) => s.name)
        )
      : [];

    const suggestedSkills = await aiService.suggestSkills(
      currentSkills,
      jobDescription
    );

    return NextResponse.json({
      analysis,
      optimizedExperience,
      optimizedSummary,
      originalSummary: resume.summary,
      suggestedSkills,
    });
  } catch (error: any) {
    console.error('Resume optimization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to optimize resume' },
      { status: 500 }
    );
  }
}
