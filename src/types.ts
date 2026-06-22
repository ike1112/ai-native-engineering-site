/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RoadmapTopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface RoadmapItem {
  id: string;
  category: 'frontend' | 'backend' | 'systems' | 'advanced';
  title: string;
  description: string;
  status: 'pending' | 'learning' | 'completed';
  topics: RoadmapTopic[];
  icon: string;
}

export interface ProgressLog {
  id: string;
  week: number;
  title: string;
  date: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  content: string; // Markdown supported
  codeSnippet?: string;
  codeLanguage?: string;
  skillsLearned: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
