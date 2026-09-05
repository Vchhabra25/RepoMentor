import React, { useState, useEffect } from 'react';
import { Quote, X, RefreshCw } from 'lucide-react';

const quotes = [
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thích Nhất Hạnh"
  },
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer"
  },
  {
    text: "You are not your thoughts. You are the observer of your thoughts.",
    author: "Eckhart Tolle"
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha"
  },
  {
    text: "The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.",
    author: "William James"
  },
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Anonymous"
  },
  {
    text: "It's okay to not be okay. It's okay to ask for help.",
    author: "Anonymous"
  },
  {
    text: "Healing isn't about forgetting or moving on. It's about learning to carry the weight of the world without breaking.",
    author: "Anonymous"
  }
];

const DailyQuotes: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 30000); // Change quote every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 p-6 z-50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Quote className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-medium text-slate-700">Daily Inspiration</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mb-4">
        <p className="text-slate-800 text-sm leading-relaxed italic">
          "{quotes[currentQuote].text}"
        </p>
        <p className="text-slate-600 text-xs mt-2 text-right">
          — {quotes[currentQuote].author}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {quotes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentQuote ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextQuote}
          className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-xs">Next</span>
        </button>
      </div>
    </div>
  );
};

export default DailyQuotes;