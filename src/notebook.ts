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
  location: 'San Francisco, CA (or Remote)',
  email: 'isabelkeyan@gmail.com',
  summary:
    'Results-driven systems thinker and AI-native engineer focused on building highly reliable platform tools, resilient backend architectures, and clean, high-conviction full-stack products with strict validation frameworks.',
  experience: [
    {
      company: 'Cognitive Platform Guild',
      role: 'Lead Platform Engineer',
      period: '2024 - Present',
      bullets: [
        'Architected an automated multi-model orchestration gateway handling 2.5M request executions daily.',
        'Engineered strict type systems and verification pipelines on AWS Bedrock and OpenAI pipelines, reducing API cost anomalies by 94%.',
        'Developed custom internal visual analytics boards and CSS design sandboxes using React, TypeScript, and modern Tailwinds.',
        'Collaborated with security teams to enforce automated scanning, validation guardrails, and secure API routing.',
      ],
      tags: ['React', 'TypeScript', 'AWS', 'Pydantic', 'Docker', 'Node.js'],
    },
    {
      company: 'Core Infrastructure Tech',
      role: 'Senior Backend Specialist',
      period: '2021 - 2024',
      bullets: [
        'Created custom client-side storage connectors and real-time state synchronization modules supporting high-throughput dashboards.',
        'Built responsive interfaces with robust visual tracking tools, improving user session durations by 35%.',
        'Restructured low-performing relational queries, optimizing database read capacities and reducing N+1 indexing blocks.',
      ],
      tags: ['Go', 'PostgreSQL', 'React', 'GraphQL', 'Redis', 'Vite'],
    },
    {
      company: 'BetaLab Automation',
      role: 'Software Developer',
      period: '2019 - 2021',
      bullets: [
        'Supported standard client applications built on SPA architectures (React/Redux).',
        'Implemented secure login flows, user authorization parameters, and automated unit test integrations.',
      ],
      tags: ['JavaScript', 'HTML/CSS', 'Jest', 'Git', 'Webpack'],
    },
  ],
  skills: {
    languages: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL (PostgreSQL)', 'HTML/CSS'],
    frameworks: ['React', 'Node.js (Express)', 'Tailwind CSS', 'Vite', 'Pydantic', 'Next.js'],
    tools: ['AWS (Bedrock, S3, IAM)', 'Docker', 'Git', 'Redis', 'Postgres', 'Vercel', 'Firebase'],
  },
  certifications: [
    'AWS Certified Solutions Architect – Professional (2025)',
    'Terraform Associate Certification (2024)',
    'DeepLearning.AI: AI-Native Systems Design (2025)',
  ],
};
