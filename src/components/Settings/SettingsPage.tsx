import React, { useState } from 'react';
import { Save, Download, Share2, Bell, Moon, Sun, User as UserIcon, Target, Clock, LogOut } from 'lucide-react';
import { User } from '../../types';
import { availableSkills } from '../../data/mockData';
import { useTheme } from '../../hooks/useTheme';

interface SettingsPageProps {
  user: User;
  onUpdateUser: (userData: Partial<User>) => void;
  onLogout: () => void;
}

export function SettingsPage({ user, onUpdateUser, onLogout }: SettingsPageProps) {
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: user.name,
    skills: user.skills,
    experienceLevel: user.experienceLevel,
    dailyTime: user.dailyTime,
    theme: user.theme,
  });
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyProgress: true,
    badgeEarned: true,
  });

  const handleSave = () => {
    onUpdateUser(formData);
  };

  const handleExportProgress = () => {
    const progressData = {
      user: user.name,
      totalPoints: user.totalPoints,
      completedTasks: user.completedTasks,
      badges: user.badges,
      streak: user.streak,
      skills: user.skills,
      progress: user.progress,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(progressData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ai-learning-progress-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleShare = () => {
    const shareText = `I've been learning with AI Micro-Learning Coach! 🚀\n\n📚 ${user.completedTasks} tasks completed\n🏆 ${user.badges.length} badges earned\n🔥 ${user.streak} day streak\n⭐ ${user.totalPoints} total points\n\nJoin me in personalized learning!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Learning Progress',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Progress copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-poppins bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Customize your learning experience and manage your account
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <div className="card p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Learning Skills
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSkills.map((skill) => (
                  <label key={skill} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            skills: [...formData.skills, skill]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            skills: formData.skills.filter(s => s !== skill)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    experienceLevel: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced'
                  })}
                  className="input-field"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Time Commitment
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={formData.dailyTime}
                    onChange={(e) => setFormData({ ...formData, dailyTime: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {formData.dailyTime} minutes per day
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="card p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Learning Preferences
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Zen', 'Cyberpunk', 'Classic'] as const).map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => setFormData({ ...formData, theme: themeOption })}
                    className={`p-3 text-sm font-medium rounded-lg transition-all ${
                      formData.theme === themeOption
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {themeOption}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dark Mode
                </span>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDark ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {key === 'dailyReminder' && 'Daily Learning Reminder'}
                    {key === 'weeklyProgress' && 'Weekly Progress Report'}
                    {key === 'badgeEarned' && 'Badge Earned Notifications'}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {key === 'dailyReminder' && 'Get reminded to complete your daily tasks'}
                    {key === 'weeklyProgress' && 'Receive weekly summaries of your progress'}
                    {key === 'badgeEarned' && 'Be notified when you earn new badges'}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !value })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data & Sharing */}
        <div className="card p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Data & Sharing
            </h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleExportProgress}
              className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export Progress Data</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Progress</span>
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            onClick={handleSave}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}