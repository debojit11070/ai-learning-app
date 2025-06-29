import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Target, Zap, Play, BookOpen, FileText, HelpCircle, RefreshCw } from 'lucide-react';
import { User, Task } from '../../types';
import { ProgressRing } from '../Common/ProgressRing';
import { ConfettiAnimation } from '../Common/ConfettiAnimation';
import { motivationalQuotes } from '../../data/mockData';
import { TaskService } from '../../services/taskService';

interface DashboardProps {
  user: User;
  tasks: Task[];
  onStartTask: (task: Task) => void;
  onCompleteTask: (taskId: string) => void;
}

export function Dashboard({ user, tasks, onStartTask, onCompleteTask }: DashboardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(task => task.date === today);
  const completedToday = todaysTasks.filter(task => task.completed).length;
  const totalTimeToday = todaysTasks.reduce((sum, task) => 
    task.completed ? sum + task.duration : sum, 0
  );

  const handleCompleteTask = (taskId: string) => {
    onCompleteTask(taskId);
    setShowConfetti(true);
  };

  const handleGenerateNewTasks = async () => {
    setIsGeneratingTasks(true);
    try {
      // This would typically update the tasks through the parent component
      // For now, we'll just show the loading state
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Play className="w-5 h-5" />;
      case 'Article': return <FileText className="w-5 h-5" />;
      case 'Exercise': return <BookOpen className="w-5 h-5" />;
      case 'Quiz': return <HelpCircle className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'Video': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'Article': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Exercise': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Quiz': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <ConfettiAnimation 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold font-poppins bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Ready to continue your learning journey?
        </p>
        <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
          <p className="text-primary-700 dark:text-primary-300 font-medium italic text-lg">
            "{currentQuote}"
          </p>
        </div>
      </div>

      {/* Stats Grid */}
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

        <div className="card p-6 animate-scale-in bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {user.streak}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Streak Days
          </h3>
          <p className="text-orange-600 dark:text-orange-400 font-medium">
            Keep it going! 🔥
          </p>
        </div>

        <div className="card p-6 animate-scale-in bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {completedToday}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tasks Today
          </h3>
          <p className="text-green-600 dark:text-green-400 font-medium">
            {todaysTasks.length - completedToday} remaining
          </p>
        </div>

        <div className="card p-6 animate-scale-in bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {totalTimeToday}m
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Time Today
          </h3>
          <p className="text-purple-600 dark:text-purple-400 font-medium">
            {Math.max(0, user.dailyTime - totalTimeToday)}m left
          </p>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white">
            Today's Learning Tasks
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {completedToday} of {todaysTasks.length} completed
            </div>
            {todaysTasks.length === 0 && (
              <button
                onClick={handleGenerateNewTasks}
                disabled={isGeneratingTasks}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isGeneratingTasks ? 'animate-spin' : ''}`} />
                <span>{isGeneratingTasks ? 'Generating...' : 'Generate Tasks'}</span>
              </button>
            )}
          </div>
        </div>

        {todaysTasks.length === 0 ? (
          <div className="card p-12 text-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="text-gray-400 dark:text-gray-500 mb-6">
              <BookOpen className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No tasks for today yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Your personalized learning tasks will be generated based on your skills and preferences. 
              Click the button above to create today's learning plan!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todaysTasks.map((task, index) => (
              <div
                key={task.id}
                className={`card p-6 animate-scale-in transition-all duration-300 ${
                  task.completed 
                    ? 'opacity-75 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10 border-green-200 dark:border-green-800' 
                    : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTaskTypeColor(task.type)}`}>
                      {getTaskIcon(task.type)}
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTaskTypeColor(task.type)}`}>
                        {task.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {task.duration}m
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {task.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium">
                    {task.skill}
                  </span>
                  <span className="font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-full">
                    +{task.points} pts
                  </span>
                </div>

                {task.completed ? (
                  <div className="flex items-center justify-center py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-medium">
                    ✅ Completed
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => onStartTask(task)}
                      className="w-full btn-primary"
                    >
                      {task.type === 'Quiz' ? 'Start Quiz' : 'Start Learning'}
                    </button>
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors py-2"
                    >
                      Mark as complete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Progress */}
      <div>
        <h2 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white mb-6">
          Skills Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.skills.map((skill, index) => (
            <div
              key={skill}
              className="card p-6 animate-scale-in bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {skill}
                </h3>
                <ProgressRing 
                  progress={Math.min(100, 20 + (index * 15) + (user.progress / 3))} 
                  size={50} 
                  strokeWidth={4} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Level</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {user.experienceLevel}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tasks completed</span>
                  <span className="font-medium">
                    {Math.floor(user.completedTasks / user.skills.length)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}