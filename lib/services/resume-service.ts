export interface ResumeData {
  id?: string;
  title: string;
  // Personal Info
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  // Summary
  summary?: string;
  // Skills
  skills?: Array<{ 
    id: string;
    category: string;
    skills: Array<{ id: string; name: string; }> }>;
  experience?: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    bullets: Array<{ id: string; text: string }>;
  }>;
  projects?: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  education?: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    graduationYear: string;
  }>;
  achievements?: string[];
  created_at?: Date;
  updated_at?: Date;
}

const API_BASE = '/api/resumes';

export const resumeService = {
  // Get all resumes for a user
  async getResumes(userId: string): Promise<ResumeData[]> {
    try {
      const response = await fetch(`${API_BASE}?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch resumes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching resumes:', error);
      return [];
    }
  },

  // Get a single resume
  async getResume(id: string): Promise<ResumeData | null> {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch resume');
      return await response.json();
    } catch (error) {
      console.error('Error fetching resume:', error);
      return null;
    }
  },

  // Create a new resume
  async createResume(
    userId: string,
    resume: ResumeData
  ): Promise<ResumeData | null> {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...resume,
        }),
      });
      if (!response.ok) throw new Error('Failed to create resume');
      return await response.json();
    } catch (error) {
      console.error('Error creating resume:', error);
      return null;
    }
  },

  // Update a resume
  async updateResume(
    id: string,
    updates: Partial<ResumeData>
  ): Promise<ResumeData | null> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update resume');
      return await response.json();
    } catch (error) {
      console.error('Error updating resume:', error);
      return null;
    }
  },

  // Delete a resume
  async deleteResume(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete resume');
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      return false;
    }
  },
};
