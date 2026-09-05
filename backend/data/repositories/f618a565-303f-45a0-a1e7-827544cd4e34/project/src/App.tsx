import React, { useState } from 'react';
import { Brain, MessageCircle, Sparkles, Activity, CheckSquare, Users, Calendar, Home, ArrowLeft } from 'lucide-react';
import HomePage from './pages/HomePage';
import MentalHealthChecker from './pages/MentalHealthChecker';
import AIAssistant from './pages/AIAssistant';
import Exercises from './pages/Exercises';
import DailyChallenges from './pages/DailyChallenges';
import PsychologistConsultation from './pages/PsychologistConsultation';
import TodoList from './pages/TodoList';
import About from './pages/About';
import Contact from './pages/Contact';
import DailyQuotes from './components/DailyQuotes';
import BackgroundMusic from "./components/BackgroundMusic";

type Page = 'home' | 'mental-health' | 'ai-assistant' | 'exercises' | 'challenges' | 'psychologist' | 'todo' | 'about' | 'contact';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
  };

  const navigateHome = () => {
    setCurrentPage('home');
  };
  <BackgroundMusic />

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateToPage} />;
      case 'mental-health':
        return <MentalHealthChecker onNavigateHome={navigateHome} />;
      case 'ai-assistant':
        return <AIAssistant onNavigateHome={navigateHome} />;
      case 'exercises':
        return <Exercises onNavigateHome={navigateHome} />;
      case 'challenges':
        return <DailyChallenges onNavigateHome={navigateHome} />;
      case 'psychologist':
        return <PsychologistConsultation onNavigateHome={navigateHome} />;
      case 'todo':
        return <TodoList onNavigateHome={navigateHome} />;
      case 'about':
        return <About onNavigateHome={navigateHome} />;
      case 'contact':
        return <Contact onNavigateHome={navigateHome} />;
      default:
        return <HomePage onNavigate={navigateToPage} />;
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

    <BackgroundMusic />

    {renderPage()}

    <DailyQuotes />
  </div>
);
}

export default App;