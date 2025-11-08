import React from 'react';
import { Moon, Sun, User, Settings, Trophy, LogOut, Brain } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function Header({ user, currentPage, onNavigate, onLogout }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-dark-card shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* App Logo and Title */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-3 hover:scale-105 transition-transform group"
            >
              {/* Simple Logo - Fixed */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold font-poppins bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Learning Coach
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Powered by AI
                </span>
              </div>
            </button>
          </div>

          <nav className="hidden md:flex space-x-2">
            {['dashboard', 'progress', 'badges'].map((page) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`nav-link ${
                  currentPage === page ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-sm bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {user.streak} day streak
              </span>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative group">
              <button
                className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <button
                    onClick={() => onNavigate('settings')}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <hr className="border-gray-200 dark:border-gray-600" />
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}