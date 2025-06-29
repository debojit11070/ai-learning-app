export interface User {
  id: string;
  email: string;
  name: string;
  skills: string[];
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  dailyTime: number;
  progress: number;
  streak: number;
  badges: string[];
  theme: 'Zen' | 'Cyberpunk' | 'Classic';
  totalPoints: number;
  completedTasks: number;
}

export interface Task {
  id: string;
  userId: string;
  date: string;
  title: string;
  type: 'Video' | 'Article' | 'Exercise' | 'Quiz';
  url?: string;
  duration: number;
  completed: boolean;
  points: number;
  skill: string;
  score?: number;
  completedAt?: string;
}

export interface Quiz {
  id: string;
  userId: string;
  taskId: string;
  questions: Question[];
  score?: number;
  completed: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  earned: boolean;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface LearningStats {
  totalTimeSpent: number;
  averageScore: number;
  completionRate: number;
  streakDays: number;
  skillProgress: Record<string, number>;
}