// lib/services/ai-service.server.ts

type AIProvider = 'openai' | 'gemini' | 'openrouter';

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

class AIService {
  private config: AIConfig;

  constructor() {
    const provider = (process.env.AI_PROVIDER || 'gemini') as AIProvider;
    const apiKey = this.getApiKey(provider);

    this.config = {
      provider,
      apiKey,
      model: this.getDefaultModel(provider),
    };
  }

  private getApiKey(provider: AIProvider): string {
    switch (provider) {
      case 'openai':
        return process.env.OPENAI_API_KEY || '';
      case 'gemini':
        return process.env.GOOGLE_API_KEY || '';
      case 'openrouter':
        return process.env.OPENROUTER_API_KEY || '';
      default:
        return '';
    }
  }

  private getDefaultModel(provider: AIProvider): string {
    switch (provider) {
      case 'openai':
        return process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
      case 'gemini':
        return process.env.GEMINI_MODEL || 'gemini-pro';
      case 'openrouter':
        return process.env.OPENROUTER_MODEL || 'google/gemini-flash-1.5-8b';
      default:
        return '';
    }
  }

  private async callOpenAI(messages: any[]): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async callGemini(prompt: string): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gemini API request failed');
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || '';
  }

  private async callOpenRouter(messages: any[]): Promise<string> {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'TalixCV Resume Builder',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenRouter API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async generateText(
    userPrompt: string,
    systemPrompt?: string
  ): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error(`${this.config.provider} API key not configured`);
    }

    try {
      switch (this.config.provider) {
        case 'openai':
        case 'openrouter': {
          const messages = [];
          if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
          }
          messages.push({ role: 'user', content: userPrompt });

          return this.config.provider === 'openai'
            ? await this.callOpenAI(messages)
            : await this.callOpenRouter(messages);
        }

        case 'gemini': {
          const fullPrompt = systemPrompt
            ? `${systemPrompt}\n\n${userPrompt}`
            : userPrompt;
          return await this.callGemini(fullPrompt);
        }

        default:
          throw new Error(`Unsupported AI provider: ${this.config.provider}`);
      }
    } catch (error: any) {
      console.error('AI Service Error:', error);
      throw new Error(error.message || 'Failed to generate AI response');
    }
  }

  async analyzeJobDescription(jobDescription: string): Promise<{
    keywords: string[];
    requiredSkills: string[];
    summary: string;
  }> {
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer. Extract key information from job descriptions.`;

    const userPrompt = `Analyze this job description and extract:
1. Top 10 important keywords
2. Required skills and qualifications
3. A brief summary of the role

Job Description:
${jobDescription}

Respond in this exact JSON format:
{
  "keywords": ["keyword1", "keyword2", ...],
  "requiredSkills": ["skill1", "skill2", ...],
  "summary": "brief summary here"
}`;

    const response = await this.generateText(userPrompt, systemPrompt);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Failed to parse job description analysis');
    }
  }

  async optimizeBulletPoint(
    bulletPoint: string,
    jobDescription: string,
    role: string
  ): Promise<string> {
    const systemPrompt = `You are an expert resume writer specializing in ATS optimization. Your task is to rewrite experience bullet points to be more impactful and keyword-optimized for the target job.`;

    const userPrompt = `Optimize this resume bullet point for the following job:

Role: ${role}
Job Description: ${jobDescription}

Current Bullet Point: ${bulletPoint}

Requirements:
- Make it ATS-friendly with relevant keywords from the job description
- Use strong action verbs
- Include metrics and quantifiable results where possible
- Keep it concise (1-2 lines)
- Maintain accuracy and don't fabricate information
- Return ONLY the optimized bullet point text, no explanations

Optimized Bullet Point:`;

    return await this.generateText(userPrompt, systemPrompt);
  }

  async optimizeMultipleBullets(
    bullets: string[],
    jobDescription: string,
    role: string
  ): Promise<string[]> {
    const systemPrompt = `You are an expert resume writer specializing in ATS optimization.`;

    const bulletsText = bullets.map((b, i) => `${i + 1}. ${b}`).join('\n');

    const userPrompt = `Optimize these resume bullet points for this job:

Role: ${role}
Job Description: ${jobDescription}

Current Bullet Points:
${bulletsText}

Requirements:
- Make each ATS-friendly with relevant keywords
- Use strong action verbs
- Include metrics where possible
- Keep each concise (1-2 lines)
- Maintain accuracy
- Return ONLY the optimized bullets in numbered format, no other text

Optimized Bullet Points:`;

    const response = await this.generateText(userPrompt, systemPrompt);

    const lines = response.split('\n').filter((line) => line.trim());
    const optimizedBullets = lines
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((line) => line.length > 0);

    return optimizedBullets.slice(0, bullets.length);
  }

  async generateSummary(
    experience: any[],
    skills: any[],
    targetRole: string
  ): Promise<string> {
    const systemPrompt = `You are an expert resume writer creating compelling professional summaries.`;

    const userPrompt = `Create a professional summary for a resume targeting this role: ${targetRole}

Experience:
${experience.map((exp) => `- ${exp.role} at ${exp.company}`).join('\n')}

Skills:
${skills.flatMap((group) => group.skills.map((s: any) => s.name)).join(', ')}

Requirements:
- Write a compelling 2-3 sentence professional summary
- Highlight key strengths relevant to the target role
- Include years of experience if clear from the data
- Make it ATS-friendly
- Keep it concise and impactful
- Return ONLY the summary text, no labels or formatting

Professional Summary:`;

    return await this.generateText(userPrompt, systemPrompt);
  }

  async suggestSkills(
    currentSkills: string[],
    jobDescription: string
  ): Promise<string[]> {
    const systemPrompt = `You are an expert at identifying missing skills for resumes based on job requirements.`;

    const userPrompt = `Given this job description and current skills, suggest 5-10 additional relevant skills that are missing:

Job Description:
${jobDescription}

Current Skills:
${currentSkills.join(', ')}

Requirements:
- Suggest only skills mentioned or implied in the job description
- Don't repeat skills already listed
- Focus on technical skills and tools
- Return ONLY a comma-separated list of skills, nothing else

Suggested Skills:`;

    const response = await this.generateText(userPrompt, systemPrompt);

    return response
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  }

  async improveProjectDescription(
    projectTitle: string,
    currentDescription: string,
    technologies: string[]
  ): Promise<string> {
    const systemPrompt = `You are an expert at writing compelling project descriptions for resumes.`;

    const userPrompt = `Improve this project description:

Project: ${projectTitle}
Technologies: ${technologies.join(', ')}
Current Description: ${currentDescription}

Requirements:
- Make it more impactful and results-oriented
- Highlight technical complexity and achievements
- Keep it concise (2-3 sentences max)
- Use action verbs
- Return ONLY the improved description, no labels

Improved Description:`;

    return await this.generateText(userPrompt, systemPrompt);
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  getProviderInfo(): {
    provider: AIProvider;
    model: string;
    configured: boolean;
  } {
    return {
      provider: this.config.provider,
      model: this.config.model || '',
      configured: this.isConfigured(),
    };
  }
}

export const aiService = new AIService();
