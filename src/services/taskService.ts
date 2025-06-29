import { User, Task } from '../types';

export class TaskService {
  static async generateDailyTasks(user: User): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    const taskTypes = ['Video', 'Article', 'Exercise', 'Quiz'] as const;
    
    const tasks: Task[] = [];
    
    // Generate 3-5 tasks based on user's daily time commitment
    const numTasks = Math.min(5, Math.max(3, Math.floor(user.dailyTime / 10)));
    
    for (let i = 0; i < numTasks; i++) {
      const skill = user.skills[i % user.skills.length];
      const type = taskTypes[i % taskTypes.length];
      
      const task: Task = {
        id: `task_${Date.now()}_${i}`,
        userId: user.id,
        date: today,
        title: this.generateTaskTitle(skill, type, user.experienceLevel),
        type,
        duration: this.calculateDuration(type, user.experienceLevel),
        completed: false,
        points: this.calculatePoints(type, user.experienceLevel),
        skill,
      };
      
      tasks.push(task);
    }
    
    return tasks;
  }
  
  private static generateTaskTitle(skill: string, type: string, level: string): string {
    const titleTemplates = {
      'Python': {
        'Video': [
          'Python List Comprehensions Deep Dive',
          'Object-Oriented Programming in Python',
          'Python Decorators Explained',
          'Async Programming with Python',
          'Python Data Structures Mastery'
        ],
        'Article': [
          'Python Best Practices Guide',
          'Memory Management in Python',
          'Python Performance Optimization',
          'Error Handling Strategies',
          'Python Testing Fundamentals'
        ],
        'Exercise': [
          'Build a Python Calculator',
          'Create a File Organizer Script',
          'Implement a Simple Web Scraper',
          'Design a Data Processing Pipeline',
          'Build a REST API with Flask'
        ],
        'Quiz': [
          'Python Syntax and Semantics Quiz',
          'Python Libraries Knowledge Test',
          'Object-Oriented Concepts Quiz',
          'Python Error Handling Quiz',
          'Advanced Python Features Test'
        ]
      },
      'JavaScript': {
        'Video': [
          'Modern JavaScript ES6+ Features',
          'Asynchronous JavaScript Mastery',
          'JavaScript Closures and Scope',
          'DOM Manipulation Techniques',
          'JavaScript Design Patterns'
        ],
        'Article': [
          'JavaScript Performance Best Practices',
          'Understanding the Event Loop',
          'JavaScript Security Fundamentals',
          'Modern JavaScript Frameworks Overview',
          'JavaScript Testing Strategies'
        ],
        'Exercise': [
          'Build a Todo App with Vanilla JS',
          'Create an Interactive Dashboard',
          'Implement a Simple Game',
          'Build a Weather App',
          'Create a Form Validation System'
        ],
        'Quiz': [
          'JavaScript Fundamentals Quiz',
          'Async JavaScript Knowledge Test',
          'DOM Manipulation Quiz',
          'JavaScript ES6+ Features Quiz',
          'JavaScript Debugging Quiz'
        ]
      },
      'Data Analysis': {
        'Video': [
          'Data Visualization Best Practices',
          'Statistical Analysis Fundamentals',
          'Data Cleaning Techniques',
          'Exploratory Data Analysis',
          'Advanced Analytics Methods'
        ],
        'Article': [
          'Choosing the Right Chart Type',
          'Data Quality Assessment',
          'Statistical Significance Explained',
          'Data Storytelling Techniques',
          'Analytics Tools Comparison'
        ],
        'Exercise': [
          'Analyze Sales Data Trends',
          'Create Interactive Dashboards',
          'Perform Customer Segmentation',
          'Build Predictive Models',
          'Design A/B Test Analysis'
        ],
        'Quiz': [
          'Statistics Fundamentals Quiz',
          'Data Visualization Quiz',
          'Analytics Tools Knowledge Test',
          'Data Interpretation Quiz',
          'Research Methods Quiz'
        ]
      },
      'Leadership': {
        'Video': [
          'Effective Communication Strategies',
          'Team Building and Motivation',
          'Conflict Resolution Techniques',
          'Strategic Decision Making',
          'Leading Through Change'
        ],
        'Article': [
          'Leadership Styles and When to Use Them',
          'Building High-Performance Teams',
          'Emotional Intelligence in Leadership',
          'Delegation and Empowerment',
          'Leadership in Remote Teams'
        ],
        'Exercise': [
          'Practice Active Listening',
          'Conduct a Team Meeting',
          'Resolve a Workplace Conflict',
          'Create a Team Development Plan',
          'Lead a Change Initiative'
        ],
        'Quiz': [
          'Leadership Principles Quiz',
          'Communication Skills Assessment',
          'Team Management Quiz',
          'Conflict Resolution Quiz',
          'Strategic Thinking Test'
        ]
      }
    };
    
    const skillTemplates = titleTemplates[skill as keyof typeof titleTemplates];
    if (!skillTemplates) {
      return `${skill} ${type} - ${level} Level`;
    }
    
    const typeTemplates = skillTemplates[type as keyof typeof skillTemplates];
    const randomIndex = Math.floor(Math.random() * typeTemplates.length);
    
    return typeTemplates[randomIndex];
  }
  
  private static calculateDuration(type: string, level: string): number {
    const baseDurations = {
      'Video': 15,
      'Article': 10,
      'Exercise': 25,
      'Quiz': 8
    };
    
    const levelMultipliers = {
      'Beginner': 0.8,
      'Intermediate': 1.0,
      'Advanced': 1.3
    };
    
    const baseDuration = baseDurations[type as keyof typeof baseDurations] || 15;
    const multiplier = levelMultipliers[level as keyof typeof levelMultipliers] || 1.0;
    
    return Math.round(baseDuration * multiplier);
  }
  
  private static calculatePoints(type: string, level: string): number {
    const basePoints = {
      'Video': 40,
      'Article': 30,
      'Exercise': 60,
      'Quiz': 50
    };
    
    const levelMultipliers = {
      'Beginner': 1.0,
      'Intermediate': 1.2,
      'Advanced': 1.5
    };
    
    const base = basePoints[type as keyof typeof basePoints] || 40;
    const multiplier = levelMultipliers[level as keyof typeof levelMultipliers] || 1.0;
    
    return Math.round(base * multiplier);
  }
}