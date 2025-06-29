import { Task, Badge, Question, User } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Alex Johnson',
  skills: ['Python', 'Data Analysis', 'Leadership'],
  experienceLevel: 'Intermediate',
  dailyTime: 30,
  progress: 68,
  streak: 7,
  badges: ['First Steps', 'Python Basics', 'Consistent Learner'],
  theme: 'Zen',
  totalPoints: 1450,
  completedTasks: 24,
};

export const availableSkills = [
  'Python', 'JavaScript', 'Data Analysis', 'Machine Learning',
  'Leadership', 'Project Management', 'Digital Marketing', 'UX Design',
  'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes',
  'Public Speaking', 'Communication', 'Strategy', 'Finance',
  'Product Management', 'DevOps', 'Cybersecurity', 'Blockchain'
];

export const mockTasks: Task[] = [
  {
    id: '1',
    userId: '1',
    date: new Date().toISOString().split('T')[0],
    title: 'Python List Comprehensions Deep Dive',
    type: 'Video',
    duration: 15,
    completed: false,
    points: 50,
    skill: 'Python',
  },
  {
    id: '2',
    userId: '1',
    date: new Date().toISOString().split('T')[0],
    title: 'Data Visualization Best Practices',
    type: 'Article',
    duration: 10,
    completed: false,
    points: 30,
    skill: 'Data Analysis',
  },
  {
    id: '3',
    userId: '1',
    date: new Date().toISOString().split('T')[0],
    title: 'Leadership Communication Quiz',
    type: 'Quiz',
    duration: 5,
    completed: false,
    points: 40,
    skill: 'Leadership',
  },
];

export const availableBadges: Badge[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Completed your first learning task',
    icon: '🎯',
    requirement: '1 task completed',
    earned: false,
  },
  {
    id: '2',
    name: 'Python Basics',
    description: 'Completed 5 Python fundamentals tasks',
    icon: '🐍',
    requirement: '5 Python tasks',
    earned: false,
  },
  {
    id: '3',
    name: 'Data Explorer',
    description: 'Mastered data analysis concepts',
    icon: '📊',
    requirement: '10 Data Analysis tasks',
    earned: false,
  },
  {
    id: '4',
    name: 'Consistent Learner',
    description: 'Maintained a 7-day learning streak',
    icon: '🔥',
    requirement: '7-day streak',
    earned: false,
  },
  {
    id: '5',
    name: 'Speed Demon',
    description: 'Completed 20 tasks in one week',
    icon: '⚡',
    requirement: '20 tasks/week',
    earned: false,
  },
  {
    id: '6',
    name: 'Quiz Master',
    description: 'Scored 90%+ on 5 quizzes',
    icon: '🎯',
    requirement: '5 high-scoring quizzes',
    earned: false,
  },
  {
    id: '7',
    name: 'Knowledge Seeker',
    description: 'Completed 50 learning tasks',
    icon: '📚',
    requirement: '50 tasks completed',
    earned: false,
  },
  {
    id: '8',
    name: 'Dedication',
    description: 'Maintained a 30-day learning streak',
    icon: '💎',
    requirement: '30-day streak',
    earned: false,
  },
  {
    id: '9',
    name: 'Perfectionist',
    description: 'Achieved perfect scores on 3 quizzes',
    icon: '⭐',
    requirement: '3 perfect quiz scores',
    earned: false,
  },
  {
    id: '10',
    name: 'Well Rounded',
    description: 'Completed tasks in all your selected skills',
    icon: '🌟',
    requirement: 'Tasks in all skills',
    earned: false,
  },
];

export const sampleQuizQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the main advantage of using list comprehensions in Python?',
    options: [
      'They are always faster than loops',
      'They are more readable and concise',
      'They use less memory',
      'They can only work with numbers'
    ],
    correct: 1,
    explanation: 'List comprehensions provide a more readable and concise way to create lists compared to traditional for loops.'
  },
  {
    id: '2',
    question: 'Which of the following is a valid Python list comprehension?',
    options: [
      '[x for x in range(10)]',
      '[x * 2 for x in range(5)]',
      '[x for x in range(10) if x % 2 == 0]',
      'All of the above'
    ],
    correct: 3,
    explanation: 'All the given options are valid Python list comprehensions with different filtering and transformation patterns.'
  },
];

export const motivationalQuotes = [
  "The expert in anything was once a beginner.",
  "Learning never exhausts the mind. - Leonardo da Vinci",
  "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
  "Every master was once a disaster.",
  "Progress, not perfection.",
  "The beautiful thing about learning is that nobody can take it away from you. - B.B. King",
  "Knowledge is power. Information is liberating. - Kofi Annan",
  "Live as if you were to die tomorrow. Learn as if you were to live forever. - Mahatma Gandhi",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss",
  "Learning is a treasure that will follow its owner everywhere. - Chinese Proverb"
];