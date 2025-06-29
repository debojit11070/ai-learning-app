import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, BookOpen, Play, FileText, Dumbbell, CheckCircle, Loader, Eye, Bookmark, Share2, Download, RefreshCw, Brain } from 'lucide-react';
import { Task } from '../../types';
import { AIService } from '../../services/aiService';
import { marked } from 'marked';

interface ContentViewerProps {
  task: Task;
  onComplete: () => void;
  onBack: () => void;
}

export function ContentViewer({ task, onComplete, onBack }: ContentViewerProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [task]);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Generating AI content for:', task.title);
      const generatedContent = await AIService.generateLearningContent(
        task.title,
        task.type,
        task.skill,
        'Intermediate' // You can get this from user context
      );
      setContent(generatedContent);
      
      // Calculate estimated reading time (average 200 words per minute)
      const wordCount = generatedContent.split(' ').length;
      setReadingTime(Math.ceil(wordCount / 200));
    } catch (error) {
      console.error('Error loading content:', error);
      setError('Failed to generate content. Please try again.');
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadContent();
  };

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: task.title,
          text: `Check out this learning content: ${task.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${task.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getTaskIcon = () => {
    switch (task.type) {
      case 'Video': return <Play className="w-6 h-6" />;
      case 'Article': return <FileText className="w-6 h-6" />;
      case 'Exercise': return <Dumbbell className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const getTaskColor = () => {
    switch (task.type) {
      case 'Video': return 'from-red-500 to-pink-500';
      case 'Article': return 'from-blue-500 to-cyan-500';
      case 'Exercise': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getTaskBgColor = () => {
    switch (task.type) {
      case 'Video': return 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20';
      case 'Article': return 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20';
      case 'Exercise': return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
      default: return 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20';
    }
  };

  // Simulate reading progress
  useEffect(() => {
    if (!loading && !completed && content) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 0.5; // Slower, more realistic progress
        });
      }, (task.duration * 1000) / 200); // More granular progress updates

      return () => clearInterval(interval);
    }
  }, [loading, completed, task.duration, content]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <div className={`p-4 bg-gradient-to-r ${getTaskColor()} rounded-full`}>
                {getTaskIcon()}
              </div>
            </div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🤖 AI Generating Content...
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Creating personalized learning content using Groq AI for
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h3>
            <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${getTaskColor()} text-white text-xs`}>
                {task.type}
              </span>
              <span>{task.skill}</span>
            </div>
          </div>
          
          <div className="mt-6 w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${getTaskColor()} rounded-full animate-pulse`}></div>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Powered by Groq AI • Generating unique content just for you
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-red-500 text-4xl">⚠️</div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Content Generation Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            
            <button
              onClick={onBack}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
        <div className="text-center animate-bounce-in max-w-lg mx-auto p-8">
          <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Excellent Work! 🎉
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            You've successfully completed the AI-generated content for
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {task.title}
            </h3>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${getTaskColor()} text-white`}>
                {task.type}
              </span>
              <span>{task.duration} minutes</span>
              <span>{task.skill}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4 shadow-lg">
            <div className="text-3xl font-bold mb-1">+{task.points}</div>
            <div className="text-sm opacity-90">Points Earned!</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Bolt.new Badge - Top Left */}
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-110"
              >
                <img
                  src="/assets/white_circle_360x360.png"
                  alt="Made with Bolt.new"
                  className="w-8 h-8 rounded-full shadow-lg dark:block hidden"
                />
                <img
                  src="/assets/black_circle_360x360.png"
                  alt="Made with Bolt.new"
                  className="w-8 h-8 rounded-full shadow-lg dark:hidden block"
                />
              </a>

              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{task.duration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium">AI Generated</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked 
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                +{task.points} pts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-6">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${getTaskColor()} shadow-lg`}>
              <div className="text-white">
                {getTaskIcon()}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {task.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getTaskColor()} text-white`}>
                  {task.type}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {task.skill}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  🤖 AI Generated
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${getTaskColor()} h-3 rounded-full transition-all duration-500 shadow-sm`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-0">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`bg-gradient-to-br ${getTaskBgColor()} rounded-2xl shadow-xl overflow-hidden`}>
          <div className="bg-white dark:bg-gray-800 m-1 rounded-xl">
            <div className="p-8 lg:p-12">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 dark:prose-blockquote:bg-primary-900/20"
                dangerouslySetInnerHTML={{ __html: marked(content) }}
              />
            </div>
            
            <div className="px-8 lg:px-12 pb-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pt-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getTaskColor()}`}></div>
                    <span>Progress: {Math.round(progress)}% complete</span>
                  </div>
                  {progress >= 100 && (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Ready to complete!</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleComplete}
                  disabled={progress < 100}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    progress >= 100
                      ? `bg-gradient-to-r ${getTaskColor()} text-white shadow-lg hover:scale-105 hover:shadow-xl`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {progress < 100 ? 'Keep Reading...' : 'Complete Learning'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}