import React, { useState } from 'react';
import { ChevronRight, Plus, X, Brain } from 'lucide-react';
import { User } from '../../types';
import { availableSkills } from '../../data/mockData';

interface OnboardingPageProps {
  onComplete: (userData: Partial<User>) => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [dailyTime, setDailyTime] = useState(30);
  const [theme, setTheme] = useState<'Zen' | 'Cyberpunk' | 'Classic'>('Zen');
  const [name, setName] = useState('');

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleSubmit = () => {
    const userData: Partial<User> = {
      name,
      skills: selectedSkills,
      experienceLevel,
      dailyTime,
      theme,
      progress: 0,
      streak: 0,
      badges: [],
      totalPoints: 0,
      completedTasks: 0,
    };
    onComplete(userData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              {/* App Logo - Fixed */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl shadow-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white mb-2">
                Welcome to AI Learning Coach!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                What's your name?
              </p>
            </div>

            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="input-field text-center text-lg"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white mb-2">
                What would you like to learn?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select skills you want to develop (choose 2-5)
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedSkills.includes(skill)
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill"
                className="input-field flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
              />
              <button
                onClick={handleAddCustomSkill}
                className="btn-secondary"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  >
                    {skill}
                    <button
                      onClick={() => handleSkillToggle(skill)}
                      className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white mb-2">
                What's your experience level?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This helps us customize the difficulty
              </p>
            </div>

            <div className="space-y-3">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setExperienceLevel(level)}
                  className={`w-full p-4 text-left rounded-xl transition-all ${
                    experienceLevel === level
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-semibold">{level}</div>
                  <div className="text-sm opacity-80">
                    {level === 'Beginner' && 'Just starting out or refreshing basics'}
                    {level === 'Intermediate' && 'Have some experience, ready to go deeper'}
                    {level === 'Advanced' && 'Looking to master advanced concepts'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white mb-2">
                How much time daily?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We'll create a personalized plan for you
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-500 mb-2">
                  {dailyTime} minutes
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={dailyTime}
                  onChange={(e) => setDailyTime(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00A3FF 0%, #00A3FF ${((dailyTime - 5) / 115) * 100}%, #e5e7eb ${((dailyTime - 5) / 115) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="text-left">5 min</div>
                <div className="text-center">60 min</div>
                <div className="text-right">120 min</div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white mb-2">
                Choose your vibe
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select a theme that matches your style
              </p>
            </div>

            <div className="space-y-3">
              {(['Zen', 'Cyberpunk', 'Classic'] as const).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={`w-full p-4 text-left rounded-xl transition-all ${
                    theme === themeOption
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-semibold">{themeOption}</div>
                  <div className="text-sm opacity-80">
                    {themeOption === 'Zen' && 'Calm and minimalist design'}
                    {themeOption === 'Cyberpunk' && 'Futuristic and vibrant colors'}
                    {themeOption === 'Classic' && 'Clean and professional look'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return selectedSkills.length >= 2;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Step {step} of 5
              </span>
              <span className="text-sm font-medium text-primary-500">
                {Math.round((step / 5) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Back
              </button>
            )}
            
            <div className="ml-auto">
              {step < 5 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Start Learning</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}