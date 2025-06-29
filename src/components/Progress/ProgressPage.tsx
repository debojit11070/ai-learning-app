import React from 'react';
import { TrendingUp, Calendar, Award, Target, Clock, BookOpen, BarChart3, Trophy } from 'lucide-react';
import { User, Task } from '../../types';
import { ProgressRing } from '../Common/ProgressRing';
import { availableBadges } from '../../data/mockData';

interface ProgressPageProps {
  user: User;
  tasks: Task[];
}

export function ProgressPage({ user, tasks }: ProgressPageProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const weeklyData = generateWeeklyData(completedTasks);
  const skillProgress = calculateSkillProgress(user.skills, completedTasks);
  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-poppins bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Your Progress
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 animate-scale-in bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <ProgressRing progress={user.progress} size={60} strokeWidth={6} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Progress
          </h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            {user.progress}% complete
          </p>
        </div>

        <div className="card p-6 animate-scale-in bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {user.completedTasks}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tasks Completed
          </h3>
          <p className="text-green-600 dark:text-green-400 font-medium">
            Across all skills
          </p>
        </div>

        <div className="card p-6 animate-scale-in bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {user.totalPoints.toLocaleString()}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Total Points
          </h3>
          <p className="text-purple-600 dark:text-purple-400 font-medium">
            Keep earning more!
          </p>
        </div>

        <div className="card p-6 animate-scale-in bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {user.badges.length}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Badges Earned
          </h3>
          <p className="text-orange-600 dark:text-orange-400 font-medium">
            {availableBadges.length - user.badges.length} more to go
          </p>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="card p-8 mb-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary-500 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
            Weekly Activity
          </h2>
        </div>
        <div className="space-y-6">
          {weeklyData.map((day, index) => (
            <div key={day.day} className="flex items-center space-x-6">
              <div className="w-16 text-sm font-semibold text-gray-600 dark:text-gray-400">
                {day.day}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-4 rounded-full transition-all duration-1000 shadow-sm"
                      style={{ 
                        width: `${(day.minutes / maxMinutes) * 100}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-6 text-sm min-w-0">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{day.minutes}m</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium">{day.tasks} tasks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Progress */}
      <div className="card p-8 mb-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-secondary-500 rounded-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
            Skills Progress
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.skills.map((skill, index) => {
            const progress = skillProgress[skill] || 0;
            return (
              <div
                key={skill}
                className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 animate-scale-in hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {skill}
                  </h3>
                  <ProgressRing 
                    progress={progress} 
                    size={60} 
                    strokeWidth={6} 
                  />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Level</span>
                    <span className="font-medium text-primary-600 dark:text-primary-400">
                      {user.experienceLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tasks completed</span>
                    <span className="font-medium">
                      {completedTasks.filter(task => task.skill === skill).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg. score</span>
                    <span className="font-medium">
                      {calculateAverageScore(completedTasks.filter(task => task.skill === skill))}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="card p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-yellow-500 rounded-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
            Recent Achievements
          </h2>
        </div>
        <div className="space-y-4">
          {generateRecentAchievements(user, completedTasks).map((achievement, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 animate-fade-in hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`p-3 rounded-xl shadow-sm ${getAchievementColor(achievement.type)}`}>
                {getAchievementIcon(achievement.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.date}
                </p>
              </div>
              <div className="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                +{achievement.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generateWeeklyData(completedTasks: Task[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  
  return days.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    
    const dayTasks = completedTasks.filter(task => {
      if (!task.completedAt) return false;
      const taskDate = new Date(task.completedAt);
      return taskDate.toDateString() === date.toDateString();
    });
    
    return {
      day,
      minutes: dayTasks.reduce((sum, task) => sum + task.duration, 0),
      tasks: dayTasks.length,
    };
  });
}

function calculateSkillProgress(skills: string[], completedTasks: Task[]) {
  const progress: Record<string, number> = {};
  
  skills.forEach(skill => {
    const skillTasks = completedTasks.filter(task => task.skill === skill);
    const baseProgress = Math.min(100, skillTasks.length * 10);
    const bonusProgress = skillTasks.reduce((sum, task) => {
      if (task.type === 'Quiz' && task.score) {
        return sum + (task.score / 100) * 5;
      }
      return sum + 5;
    }, 0);
    
    progress[skill] = Math.min(100, baseProgress + bonusProgress);
  });
  
  return progress;
}

function calculateAverageScore(tasks: Task[]): number {
  const quizTasks = tasks.filter(task => task.type === 'Quiz' && task.score);
  if (quizTasks.length === 0) return 0;
  
  const totalScore = quizTasks.reduce((sum, task) => sum + (task.score || 0), 0);
  return Math.round(totalScore / quizTasks.length);
}

function generateRecentAchievements(user: User, completedTasks: Task[]) {
  const achievements = [];
  
  // Recent task completions
  const recentTasks = completedTasks
    .filter(task => task.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 3);
  
  recentTasks.forEach(task => {
    achievements.push({
      date: formatRelativeDate(task.completedAt!),
      title: `Completed "${task.title}"`,
      points: task.points,
      type: 'task'
    });
  });
  
  // Recent badges
  if (user.badges.length > 0) {
    achievements.push({
      date: '2 days ago',
      title: `Earned "${user.badges[user.badges.length - 1]}" badge`,
      points: 100,
      type: 'badge'
    });
  }
  
  // Streak milestone
  if (user.streak >= 7) {
    achievements.push({
      date: `${user.streak} days ago`,
      title: `Started ${user.streak}-day learning streak`,
      points: user.streak * 10,
      type: 'streak'
    });
  }
  
  return achievements.slice(0, 5);
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
}

function getAchievementColor(type: string): string {
  switch (type) {
    case 'task':
      return 'bg-blue-500';
    case 'badge':
      return 'bg-purple-500';
    case 'streak':
      return 'bg-orange-500';
    case 'quiz':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

function getAchievementIcon(type: string): JSX.Element {
  switch (type) {
    case 'task':
      return <BookOpen className="w-5 h-5 text-white" />;
    case 'badge':
      return <Award className="w-5 h-5 text-white" />;
    case 'streak':
      return <TrendingUp className="w-5 h-5 text-white" />;
    case 'quiz':
      return <Target className="w-5 h-5 text-white" />;
    default:
      return <BookOpen className="w-5 h-5 text-white" />;
  }
}