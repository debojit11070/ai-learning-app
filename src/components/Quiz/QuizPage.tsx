import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';
import { Task, Question } from '../../types';
import { AIService } from '../../services/aiService';

interface QuizPageProps {
  task: Task;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function QuizPage({ task, onComplete, onBack }: QuizPageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [task]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !loading && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !loading && questions.length > 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResult, loading, questions.length]);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Generating AI quiz questions for:', task.title);
      const generatedQuestions = await AIService.generateQuizQuestions(
        task.title,
        task.skill,
        'Intermediate' // You can get this from user context
      );
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to generate quiz questions. Please try again.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadQuestions();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setIsSubmitted(true);
        setTimeout(() => {
          handleSubmitQuiz(newAnswers);
        }, 500);
      }
    }
  };

  const handleSubmitQuiz = (finalAnswers = answers) => {
    const correctAnswers = finalAnswers.filter(
      (answer, index) => answer === questions[index]?.correct
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    setShowResult(true);
    
    setTimeout(() => {
      onComplete(score);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <div className="text-white text-2xl">🧠</div>
              </div>
            </div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🤖 AI Generating Quiz...
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Creating personalized quiz questions using Groq AI for
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h3>
            <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                Quiz
              </span>
              <span>{task.skill}</span>
            </div>
          </div>
          
          <div className="mt-6 w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Powered by Groq AI • Generating unique questions just for you
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
            Quiz Generation Failed
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

  if (showResult) {
    const correctAnswers = answers.filter(
      (answer, index) => answer === questions[index]?.correct
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full animate-fade-in">
          <div className="card p-8 text-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="mb-6">
              {score >= 80 ? (
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                </div>
              )}
              
              <h2 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white mb-2">
                AI Quiz Complete!
              </h2>
              
              <div className="text-6xl font-bold text-primary-500 mb-4">
                {score}%
              </div>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                You got {correctAnswers} out of {questions.length} AI-generated questions correct
              </p>

              {score >= 80 ? (
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Excellent work! You've mastered this AI-generated content! 🎉
                </p>
              ) : score >= 60 ? (
                <p className="text-orange-600 dark:text-orange-400 font-medium">
                  Good effort! Review the AI explanations and try again.
                </p>
              ) : (
                <p className="text-red-600 dark:text-red-400 font-medium">
                  Keep studying! Focus on the concepts you missed.
                </p>
              )}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      answers[index] === question.correct
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">
                        {question.question}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Your answer:</span> {question.options[answers[index]] || 'Not answered'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Correct answer:</span> {question.options[question.correct]}
                      </p>
                      {question.explanation && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                          💡 {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                🤖 This quiz was generated by AI using your learning topic and skill level
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
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
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className={timeLeft < 60 ? 'text-red-500 font-bold' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium">AI Generated</span>
            </div>
          </div>
        </div>

        <div className="card p-8 animate-fade-in bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
                {task.title}
              </h1>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  🤖 AI Quiz
                </span>
                <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  +{task.points} points
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {questions[currentQuestion] && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {questions[currentQuestion].question}
              </h2>

              <div className="space-y-3 mb-8">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null || isSubmitted}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitted ? 'Submitting...' : currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}