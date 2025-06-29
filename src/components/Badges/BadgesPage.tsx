import React from 'react';
import { Award, Lock, Star, Trophy } from 'lucide-react';
import { User } from '../../types';
import { availableBadges } from '../../data/mockData';

interface BadgesPageProps {
  user: User;
}

export function BadgesPage({ user }: BadgesPageProps) {
  const earnedBadges = availableBadges.filter(badge => user.badges.includes(badge.name));
  const unearned = availableBadges.filter(badge => !user.badges.includes(badge.name));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white mb-2">
          Your Badges
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Collect badges by completing learning milestones and achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {earnedBadges.length}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Badges Earned
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Great progress!
          </p>
        </div>

        <div className="card p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {unearned.length}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Keep learning to unlock
          </p>
        </div>

        <div className="card p-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round((earnedBadges.length / availableBadges.length) * 100)}%
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Completion
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Badge collection progress
          </p>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white mb-6">
            Earned Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.map((badge, index) => (
              <div
                key={badge.id}
                className="card p-6 animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
                  {badge.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm mb-3">
                  {badge.description}
                </p>
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    ✅ Earned
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      <div>
        <h2 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white mb-6">
          Available Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unearned.map((badge, index) => (
            <div
              key={badge.id}
              className="card p-6 opacity-75 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-gray-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
                {badge.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm mb-3">
                {badge.description}
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  🎯 {badge.requirement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Section */}
      <div className="mt-12 text-center">
        <div className="card p-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-200 dark:border-primary-800">
          <h3 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white mb-4">
            Keep Learning, Keep Earning! 🚀
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Each badge represents a milestone in your learning journey. Complete tasks, maintain streaks, 
            and master new skills to unlock them all!
          </p>
          <div className="flex justify-center">
            <div className="text-6xl">{earnedBadges.length > 0 ? '🎉' : '💪'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}