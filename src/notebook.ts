export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  tags: string[];
  problem: string;
  originalDesign: string;
  gaps: string;
  improvements: string;
  lessons: string;
  decision?: string;
  alternativeConsidered?: string;
  whyRejected?: string;
  evidenceLink?: string;
  interactiveComponentId?: string;
  systemDiagramSpec?: string;
  body?: string;
  bodyHtml?: string;
  date?: string;
}

export interface Note {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  summary: string;
  content: string;
  contentHtml?: string;
  tags: string[];
}

export interface ReadingNote {
  id: string;
  title: string;
  author: string;
  source: string;
  sourceType: 'Book' | 'Podcast' | 'Paper' | 'Blog';
  date: string;
  keyInsights: string[];
  evidence: string;
  reflection: string;
  actionableTakeaways: string[];
  notes?: string;
  notesHtml?: string;
}

export const RESUME_DATA = {
  name: 'Isabel Ke',
  title: 'Engineer & Systems Thinker',
  location: 'Calgary, Canada',
  email: 'isabelkeyan@gmail.com',
  summary:
    'I write about how building with AI changes engineering work in practice. This notebook follows real projects, verification work, reliability lessons, and the engineering judgment behind what I build.',
};
