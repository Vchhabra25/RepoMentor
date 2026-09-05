import React from 'react';
import { Brain, MessageCircle, Sparkles, Activity, CheckSquare, Users, Calendar, Heart } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'mental-health',
      title: 'Mental Health Check',
      description: 'Take our comprehensive assessment to understand your mental wellbeing',
      icon: Brain,
      color: 'from-slate-400 to-slate-500',
      bgColor: 'bg-slate-50 hover:bg-slate-100'
    },
    {
      id: 'ai-assistant',
      title: 'AI Mental Health Assistant',
      description: 'Get personalized support and guidance from our AI companion',
      icon: Sparkles,
      color: 'from-indigo-400 to-indigo-500',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100'
    },
    {
      id: 'exercises',
      title: 'Mindfulness Exercises',
      description: 'Practice breathing and grounding techniques for inner peace',
      icon: Activity,
      color: 'from-emerald-400 to-emerald-500',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100'
    },
    {
      id: 'challenges',
      title: 'Daily Challenges',
      description: 'Complete daily tasks designed to boost your mental wellness',
      icon: CheckSquare,
      color: 'from-amber-400 to-amber-500',
      bgColor: 'bg-amber-50 hover:bg-amber-100'
    },
    {
      id: 'psychologist',
      title: 'Consult Psychologist',
      description: 'Connect with professional mental health experts',
      icon: Users,
      color: 'from-teal-400 to-teal-500',
      bgColor: 'bg-teal-50 hover:bg-teal-100'
    },
    {
      id: 'todo',
      title: 'Mindful To-Do List',
      description: 'Organize your tasks mindfully to reduce stress and anxiety',
      icon: Calendar,
      color: 'from-violet-400 to-violet-500',
      bgColor: 'bg-violet-50 hover:bg-violet-100'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-0.5 bg-gradient-to-r from-slate-400 to-indigo-500 rounded-xl">
                <img
  src="two heads.jpg"
  alt="Soulnote Logo"
  className="w-8 h-8 object-contain rounded"
/>

              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-indigo-600 bg-clip-text text-transparent">
                Soulnote
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <button 
                onClick={() => onNavigate('about')}
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Contact
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <img 
              src="intro.png" 
              alt="Mental wellness meditation" 
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
            />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Your Journey to
            <span className="block bg-gradient-to-r from-slate-600 to-indigo-600 bg-clip-text text-transparent">
              Mental Wellness
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Take control of your mental health with our comprehensive suite of tools designed to support, 
            guide, and empower you on your wellness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('mental-health')}
              className="px-8 py-4 bg-gradient-to-r from-slate-500 to-indigo-600 text-white rounded-full font-semibold hover:from-slate-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Assessment
            </button>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transform hover:scale-105 transition-all duration-300"
            >
              AI Chatbot
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <img 
              src="/story.jpg" 
              alt="Mental health tools" 
              className="w-24 h-24 rounded-full mx-auto mb-6 object-cover shadow-md"
            />
            <h3 className="text-4xl font-bold text-slate-800 mb-4">Comprehensive Mental Health Tools</h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to monitor, improve, and maintain your mental wellbeing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.id}
                  onClick={() => onNavigate(feature.id)}
                  className={`${feature.bgColor} rounded-2xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-100`}
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section 
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-4xl font-bold text-indigo-600 mb-2">10,000+</div>
              <div className="text-slate-600">Users Helped</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-emerald-600 mb-2">95%</div>
              <div className="text-slate-600">Satisfaction Rate</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-violet-600 mb-2">24/7</div>
              <div className="text-slate-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>*/}

      {/* Daily Inspiration Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-100 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <img 
            src="/daily inspo.png" 
            alt="Daily inspiration" 
            className="w-20 h-20 rounded-full mx-auto mb-6 object-cover shadow-md"
          />
          <h3 className="text-3xl font-bold text-slate-800 mb-6">Daily Inspiration</h3>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <blockquote className="text-xl text-slate-700 italic mb-4">
              “You cannot always control what goes on outside. But you can always control what goes on inside.”
            </blockquote>
            <cite className="text-slate-500">— Sri Swami Sivananda</cite>
          </div>
          <p className="text-slate-600 mt-6">
            Get daily motivational quotes and inspiration to support your mental wellness journey.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-0.5 bg-gradient-to-r from-slate-400 to-indigo-500 rounded-xl">
              <img
  src="two heads.jpg"
  alt="Soulnote Logo"
  className="w-8 h-8 object-contain rounded"
/>

            </div>
            <h4 className="text-xl font-bold">Soulnote</h4>
          </div>
          <p className="text-slate-400 mb-4">
            Taking care of your mental health, one step at a time.
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <button 
              onClick={() => onNavigate('about')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Contact
            </button>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 Soulnote. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;