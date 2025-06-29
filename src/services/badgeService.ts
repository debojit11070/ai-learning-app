import { User, Task, Badge } from '../types';
import { availableBadges } from '../data/mockData';

export class BadgeService {
  static async checkForNewBadges(user: User, tasks: Task[]): Promise<Badge[]> {
    const newBadges: Badge[] = [];
    const completedTasks = tasks.filter(task => task.completed);
    
    for (const badge of availableBadges) {
      // Skip if already earned
      if (user.badges.includes(badge.name)) continue;
      
      let earned = false;
      
      switch (badge.name) {
        case 'First Steps':
          earned = user.completedTasks >= 1;
          break;
          
        case 'Python Basics':
          earned = completedTasks.filter(task => task.skill === 'Python').length >= 5;
          break;
          
        case 'Data Explorer':
          earned = completedTasks.filter(task => task.skill === 'Data Analysis').length >= 10;
          break;
          
        case 'Consistent Learner':
          earned = user.streak >= 7;
          break;
          
        case 'Speed Demon':
          earned = this.checkWeeklyTaskCount(completedTasks) >= 20;
          break;
          
        case 'Quiz Master':
          earned = this.checkHighScoringQuizzes(completedTasks) >= 5;
          break;
          
        case 'Knowledge Seeker':
          earned = user.completedTasks >= 50;
          break;
          
        case 'Dedication':
          earned = user.streak >= 30;
          break;
          
        case 'Perfectionist':
          earned = this.checkPerfectScores(completedTasks) >= 3;
          break;
          
        case 'Well Rounded':
          earned = this.checkSkillDiversity(completedTasks, user.skills) >= user.skills.length;
          break;
      }
      
      if (earned) {
        newBadges.push({ ...badge, earned: true });
      }
    }
    
    return newBadges;
  }
  
  private static checkWeeklyTaskCount(tasks: Task[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return tasks.filter(task => 
      task.completedAt && new Date(task.completedAt) >= oneWeekAgo
    ).length;
  }
  
  private static checkHighScoringQuizzes(tasks: Task[]): number {
    return tasks.filter(task => 
      task.type === 'Quiz' && task.score && task.score >= 90
    ).length;
  }
  
  private static checkPerfectScores(tasks: Task[]): number {
    return tasks.filter(task => 
      task.type === 'Quiz' && task.score === 100
    ).length;
  }
  
  private static checkSkillDiversity(tasks: Task[], userSkills: string[]): number {
    const skillsWithCompletedTasks = new Set(
      tasks.map(task => task.skill)
    );
    
    return userSkills.filter(skill => 
      skillsWithCompletedTasks.has(skill)
    ).length;
  }
}