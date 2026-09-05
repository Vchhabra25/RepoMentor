import React, { useState } from 'react';
import { ArrowLeft, CheckSquare, Target, Clock, Award, Star } from 'lucide-react';

interface DailyChallengesProps {
  onNavigateHome: () => void;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: 'mindfulness' | 'physical' | 'social' | 'creative';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({ onNavigateHome }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: 'Morning Gratitude',
      description: 'Write down three things you\'re grateful for today',
      category: 'mindfulness',
      difficulty: 'easy',
      points: 10,
      completed: false
    },
    {
      id: 2,
      title: '5-Minute Walk',
      description: 'Take a peaceful 5-minute walk outdoors',
      category: 'physical',
      difficulty: 'easy',
      points: 15,
      completed: false
    },
    {
      id: 3,
      title: 'Connect with a Friend',
      description: 'Reach out to someone you haven\'t talked to in a while',
      category: 'social',
      difficulty: 'medium',
      points: 20,
      completed: false
    },
    {
      id: 4,
      title: 'Deep Breathing Session',
      description: 'Practice 10 minutes of deep breathing exercises',
      category: 'mindfulness',
      difficulty: 'medium',
      points: 25,
      completed: false
    },
    {
      id: 5,
      title: 'Creative Expression',
      description: 'Spend 15 minutes drawing, writing, or creating something',
      category: 'creative',
      difficulty: 'medium',
      points: 30,
      completed: false
    },
    {
      id: 6,
      title: 'Tech-Free Hour',
      description: 'Spend one hour without any electronic devices',
      category: 'mindfulness',
      difficulty: 'hard',
      points: 40,
      completed: false
    }
  ]);

  const toggleChallenge = (id: number) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, completed: !challenge.completed }
          : challenge
      )
    );
  };

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;
  const completionPercentage = Math.round((completedChallenges / totalChallenges) * 100);
  const totalPoints = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.points, 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mindfulness': return 'bg-indigo-100 text-indigo-800';
      case 'physical': return 'bg-emerald-100 text-emerald-800';
      case 'social': return 'bg-violet-100 text-violet-800';
      case 'creative': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-600';
      case 'medium': return 'text-amber-600';
      case 'hard': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 text-slate-600 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-amber-600" />
              <h1 className="text-3xl font-bold text-slate-800">Daily Challenges</h1>
            </div>
          </div>

          <div className="text-center mb-8">
            <img 
              src="/challenge.png" 
              alt="Daily challenges" 
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-md"
            />
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Completed</p>
                  <p className="text-2xl font-bold">{completedChallenges}/{totalChallenges}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-indigo-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Progress</p>
                  <p className="text-2xl font-bold">{completionPercentage}%</p>
                </div>
                <Target className="w-8 h-8 text-emerald-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-violet-400 to-violet-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-sm">Points Earned</p>
                  <p className="text-2xl font-bold">{totalPoints}</p>
                </div>
                <Award className="w-8 h-8 text-violet-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Streak</p>
                  <p className="text-2xl font-bold">7 days</p>
                </div>
                <Star className="w-8 h-8 text-amber-200" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-slate-800">Today's Progress</h3>
              <span className="text-sm text-slate-600">{completionPercentage}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Challenges List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Today's Challenges</h3>
            
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  challenge.completed 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className={`text-lg font-semibold ${
                        challenge.completed ? 'text-emerald-800 line-through' : 'text-slate-800'
                      }`}>
                        {challenge.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(challenge.category)}`}>
                        {challenge.category}
                      </span>
                      <span className={`text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className={`text-slate-600 mb-3 ${challenge.completed ? 'line-through' : ''}`}>
                      {challenge.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          {challenge.difficulty === 'easy' ? '5-10 min' : 
                           challenge.difficulty === 'medium' ? '10-20 min' : '20-30 min'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-slate-500">{challenge.points} points</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleChallenge(challenge.id)}
                    className={`ml-4 p-3 rounded-full transition-all duration-300 ${
                      challenge.completed
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-slate-200 text-slate-600 hover:bg-amber-500 hover:text-white'
                    }`}
                  >
                    <CheckSquare className={`w-6 h-6 ${challenge.completed ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Motivational Message */}
          <div className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
            <h4 className="text-lg font-semibold text-slate-800 mb-2">
              {completionPercentage === 100 
                ? '🎉 Amazing! You\'ve completed all challenges today!' 
                : completionPercentage >= 50 
                  ? '🌟 Great progress! You\'re doing awesome!' 
                  : '💪 You can do this! Start with small steps.'}
            </h4>
            <p className="text-slate-600">
              {completionPercentage === 100 
                ? 'You\'ve earned all the points for today. Keep up the great work!'
                : 'Each challenge you complete brings you closer to better mental health. Take your time and be kind to yourself.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenges;