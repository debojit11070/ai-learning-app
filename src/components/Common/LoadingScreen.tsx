import React from 'react';
import { Brain, Loader } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
            <Brain className="w-12 h-12 text-white animate-pulse" />
          </div>
          <div className="absolute inset-0 w-24 h-24 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
        
        <h2 className="text-3xl font-bold font-poppins text-white mb-4">
          AI Learning Coach
        </h2>
        
        <div className="flex items-center justify-center space-x-2 text-white/80">
          <Loader className="w-5 h-5 animate-spin" />
          <span className="text-lg">Preparing your learning experience...</span>
        </div>
        
        <div className="mt-8 w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse" style={{
            animation: 'loading 2s ease-in-out infinite'
          }}></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}