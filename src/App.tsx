import React, { useState, useEffect } from 'react';
import { OnboardingPage } from './components/Onboarding/OnboardingPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ContentViewer } from './components/Learning/ContentViewer';
import { QuizPage } from './components/Quiz/QuizPage';
import { ProgressPage } from './components/Progress/ProgressPage';
import { BadgesPage } from './components/Badges/BadgesPage';
import { SettingsPage } from './components/Settings/SettingsPage';
import { Header } from './components/Layout/Header';
import { MobileNav } from './components/Layout/MobileNav';
import { LoadingScreen } from './components/Common/LoadingScreen';
import { NotificationToast } from './components/Common/NotificationToast';
import { useNotifications } from './hooks/useNotifications';
import { useLocalStorage } from './hooks/useLocalStorage';
import { User, Task } from './types';
import { TaskService } from './services/taskService';
import { BadgeService } from './services/badgeService';

type AppState = 'onboarding' | 'dashboard' | 'content' | 'quiz' | 'progress' | 'badges' | 'settings';

function App() {
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      if (!user || user.skills.length === 0) {
        setAppState('onboarding');
      } else {
        setAppState('dashboard');
        await loadUserTasks();
      }
      setIsLoading(false);
    };

    initializeApp();
  }, [user]);

  const loadUserTasks = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      let userTasks = tasks.filter(task => task.date === today);
      
      // If no tasks for today, generate them
      if (userTasks.length === 0) {
        userTasks = await TaskService.generateDailyTasks(user);
        setTasks([...tasks, ...userTasks]);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Failed to load tasks. Please try again.',
      });
    }
  };

  const handleOnboardingComplete = async (userData: Partial<User>) => {
    setIsLoading(true);
    
    try {
      const newUser: User = {
        id: Date.now().toString(),
        email: 'user@example.com',
        name: userData.name || 'User',
        skills: userData.skills || [],
        experienceLevel: userData.experienceLevel || 'Beginner',
        dailyTime: userData.dailyTime || 30,
        progress: 0,
        streak: 0,
        badges: [],
        theme: userData.theme || 'Zen',
        totalPoints: 0,
        completedTasks: 0,
      };
      
      setUser(newUser);
      
      // Generate initial tasks
      const initialTasks = await TaskService.generateDailyTasks(newUser);
      setTasks(initialTasks);
      
      setAppState('dashboard');
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Profile Complete!',
        message: 'Your learning journey begins now. Check out your personalized tasks!',
      });
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Failed to complete onboarding. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTask = (task: Task) => {
    setCurrentTask(task);
    if (task.type === 'Quiz') {
      setAppState('quiz');
    } else {
      setAppState('content');
    }
  };

  const handleCompleteTask = async (taskId?: string) => {
    const targetTaskId = taskId || currentTask?.id;
    if (!targetTaskId || !user) return;

    const task = tasks.find(t => t.id === targetTaskId);
    if (!task) return;

    try {
      // Update task in local storage
      const updatedTasks = tasks.map(t => 
        t.id === targetTaskId 
          ? { ...t, completed: true, completedAt: new Date().toISOString() }
          : t
      );
      setTasks(updatedTasks);

      // Update user progress
      const points = task.points || 50;
      const updatedUser = {
        ...user,
        totalPoints: user.totalPoints + points,
        completedTasks: user.completedTasks + 1,
        progress: Math.min(100, user.progress + 2),
      };

      // Check for new badges
      const newBadges = await BadgeService.checkForNewBadges(updatedUser, updatedTasks);
      if (newBadges.length > 0) {
        updatedUser.badges = [...updatedUser.badges, ...newBadges.map(b => b.name)];
        
        newBadges.forEach(badge => {
          addNotification({
            id: Date.now().toString() + badge.id,
            type: 'success',
            title: 'Badge Earned! 🏆',
            message: `You've earned the "${badge.name}" badge!`,
          });
        });
      }

      setUser(updatedUser);

      // Return to dashboard
      setCurrentTask(null);
      setAppState('dashboard');

      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Task Completed!',
        message: `Great job! You earned ${points} points.`,
      });
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Failed to complete task. Please try again.',
      });
    }
  };

  const handleQuizComplete = async (score: number) => {
    if (!currentTask || !user) return;

    try {
      // Update task with score
      const updatedTasks = tasks.map(task => 
        task.id === currentTask.id 
          ? { ...task, completed: true, score, completedAt: new Date().toISOString() }
          : task
      );
      setTasks(updatedTasks);

      // Calculate bonus points based on score
      const basePoints = currentTask.points;
      const bonusPoints = score >= 90 ? 30 : score >= 80 ? 20 : score >= 70 ? 10 : 0;
      const totalPoints = basePoints + bonusPoints;

      const updatedUser = {
        ...user,
        totalPoints: user.totalPoints + totalPoints,
        completedTasks: user.completedTasks + 1,
        progress: Math.min(100, user.progress + 3),
      };

      // Check for new badges
      const newBadges = await BadgeService.checkForNewBadges(updatedUser, updatedTasks);
      if (newBadges.length > 0) {
        updatedUser.badges = [...updatedUser.badges, ...newBadges.map(b => b.name)];
      }

      setUser(updatedUser);
      setCurrentTask(null);
      setAppState('dashboard');

      const message = score >= 80 
        ? `Excellent! You scored ${score}% and earned ${totalPoints} points!`
        : `You scored ${score}%. Keep practicing to improve!`;

      addNotification({
        id: Date.now().toString(),
        type: score >= 80 ? 'success' : 'info',
        title: 'Quiz Complete!',
        message,
      });
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Failed to save quiz results. Please try again.',
      });
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setAppState(page as AppState);
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Settings Updated',
        message: 'Your preferences have been saved successfully.',
      });
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Failed to update settings. Please try again.',
      });
    }
  };

  const handleBackToDashboard = () => {
    setCurrentTask(null);
    setAppState('dashboard');
  };

  const handleReset = () => {
    setUser(null);
    setTasks([]);
    setCurrentTask(null);
    setCurrentPage('dashboard');
    setAppState('onboarding');
    
    addNotification({
      id: Date.now().toString(),
      type: 'info',
      title: 'Reset Complete',
      message: 'Your data has been reset. Start your learning journey again!',
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (appState === 'onboarding') {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  if (appState === 'content' && currentTask) {
    return (
      <ContentViewer
        task={currentTask}
        onComplete={() => handleCompleteTask()}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (appState === 'quiz' && currentTask) {
    return (
      <QuizPage
        task={currentTask}
        onComplete={handleQuizComplete}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (!user) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  const todaysTasks = tasks.filter(task => task.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <Header 
        user={user} 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleReset}
      />
      
      <main className="animate-fade-in">
        {appState === 'dashboard' && (
          <Dashboard
            user={user}
            tasks={todaysTasks}
            onStartTask={handleStartTask}
            onCompleteTask={handleCompleteTask}
          />
        )}
        
        {appState === 'progress' && (
          <ProgressPage user={user} tasks={tasks} />
        )}
        
        {appState === 'badges' && (
          <BadgesPage user={user} />
        )}
        
        {appState === 'settings' && (
          <SettingsPage
            user={user}
            onUpdateUser={handleUpdateUser}
            onLogout={handleReset}
          />
        )}
      </main>

      <MobileNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      {/* Bolt.new Badge */}
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 transition-all duration-300 hover:scale-110"
      >
        <img
          src="https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/assets/bolt-badge-white.png"
          alt="Made with Bolt.new"
          className="w-12 h-12 rounded-full shadow-lg dark:block hidden"
        />
        <img
          src="https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/assets/bolt-badge-black.png"
          alt="Made with Bolt.new"
          className="w-12 h-12 rounded-full shadow-lg dark:hidden block"
        />
      </a>
    </div>
  );
}

export default App;