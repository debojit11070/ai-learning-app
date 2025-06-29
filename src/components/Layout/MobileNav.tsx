import React from 'react';
import { Home, BarChart3, Award, Settings } from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'badges', icon: Award, label: 'Badges' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentPage === id
                ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}