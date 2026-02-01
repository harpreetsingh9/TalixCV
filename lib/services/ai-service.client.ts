class AIClientService {
  private async fetchAPI(endpoint: string, data: any) {
    const response = await fetch(`/api/ai/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'AI request failed');
    }

    return response.json();
  }

  // Main batch optimization - analyzes everything at once
  async optimizeResume(
    jobDescription: string,
    resume: any
  ): Promise<{
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
  }> {
    const result = await this.fetchAPI('optimize-resume', {
      jobDescription,
      resume,
    });
    return result;
  }

  async checkStatus(): Promise<{
    provider: string;
    model: string;
    configured: boolean;
  }> {
    const response = await fetch('/api/ai/check-status');
    if (!response.ok) {
      throw new Error('Failed to check AI status');
    }
    return response.json();
  }

  async isConfigured(): Promise<boolean> {
    try {
      const status = await this.checkStatus();
      return status.configured;
    } catch {
      return false;
    }
  }
}

export const aiService = new AIClientService();
