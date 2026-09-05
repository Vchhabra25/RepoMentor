import React, { useState } from 'react';
import { ArrowLeft, Activity, Wind, Anchor, Play, Pause, RotateCcw } from 'lucide-react';

interface ExercisesProps {
  onNavigateHome: () => void;
}

const Exercises: React.FC<ExercisesProps> = ({ onNavigateHome }) => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && activeExercise === 'breathing') {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          
          // 4-7-8 breathing pattern
          if (newSeconds <= 4) {
            setBreathingPhase('inhale');
          } else if (newSeconds <= 11) {
            setBreathingPhase('hold');
          } else if (newSeconds <= 19) {
            setBreathingPhase('exhale');
          } else {
            setBreathingPhase('pause');
            if (newSeconds >= 21) {
              return 0; // Reset cycle
            }
          }
          
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, activeExercise]);

  const exercises = [
    {
      id: 'breathing',
      title: '4-7-8 Breathing',
      description: 'A powerful breathing technique to reduce anxiety and promote relaxation',
      icon: Wind,
      color: 'from-slate-400 to-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      description: 'Ground yourself in the present moment using your five senses',
      icon: Anchor,
      color: 'from-emerald-400 to-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'progressive',
      title: 'Progressive Muscle Relaxation',
      description: 'Systematically tense and relax different muscle groups',
      icon: Activity,
      color: 'from-violet-400 to-violet-500',
      bgColor: 'bg-violet-50'
    }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSeconds(0);
    setBreathingPhase('inhale');
  };

  const renderBreathingExercise = () => (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">4-7-8 Breathing Exercise</h3>
      <p className="text-slate-600 mb-6">
        Inhale for 4 counts, hold for 7 counts, exhale for 8 counts. This technique helps activate your body's relaxation response.
      </p>
      
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className={`w-32 h-32 rounded-full transition-all duration-1000 ${
            breathingPhase === 'inhale' ? 'bg-indigo-400 scale-125' :
            breathingPhase === 'hold' ? 'bg-indigo-500 scale-125' :
            breathingPhase === 'exhale' ? 'bg-indigo-300 scale-75' :
            'bg-indigo-200 scale-100'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg capitalize">{breathingPhase}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-800 mb-2">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-lg text-slate-600 capitalize">
            {breathingPhase === 'inhale' && 'Breathe in slowly...'}
            {breathingPhase === 'hold' && 'Hold your breath...'}
            {breathingPhase === 'exhale' && 'Breathe out slowly...'}
            {breathingPhase === 'pause' && 'Pause and rest...'}
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handlePlayPause}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isPlaying ? 'Pause' : 'Start'}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderGroundingExercise = () => (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">5-4-3-2-1 Grounding Technique</h3>
      <p className="text-slate-600 mb-6">
        Use your five senses to ground yourself in the present moment. This technique helps reduce anxiety and panic.
      </p>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500">
          <h4 className="font-semibold text-slate-800 mb-2">5 Things You Can See</h4>
          <p className="text-slate-600">Look around and identify 5 things you can see. Notice their colors, shapes, and details.</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
          <h4 className="font-semibold text-slate-800 mb-2">4 Things You Can Touch</h4>
          <p className="text-slate-600">Find 4 things you can touch. Notice their texture, temperature, and weight.</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border-l-4 border-violet-500">
          <h4 className="font-semibold text-slate-800 mb-2">3 Things You Can Hear</h4>
          <p className="text-slate-600">Listen for 3 different sounds around you. They might be near or far.</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border-l-4 border-amber-500">
          <h4 className="font-semibold text-slate-800 mb-2">2 Things You Can Smell</h4>
          <p className="text-slate-600">Notice 2 scents in your environment. Take a deep breath and identify them.</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
          <h4 className="font-semibold text-slate-800 mb-2">1 Thing You Can Taste</h4>
          <p className="text-slate-600">Focus on 1 taste in your mouth, or take a sip of water and notice the taste.</p>
        </div>
      </div>
    </div>
  );

  const renderProgressiveExercise = () => (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">Progressive Muscle Relaxation</h3>
      <p className="text-slate-600 mb-6">
        Systematically tense and relax different muscle groups to release physical tension and promote relaxation.
      </p>
      
      <div className="space-y-4">
        {[
          'Feet and calves',
          'Thighs and glutes',
          'Abdomen and chest',
          'Hands and arms',
          'Shoulders and neck',
          'Face and scalp'
        ].map((muscle, index) => (
          <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-800">{muscle}</h4>
              <p className="text-sm text-slate-600">Tense for 5 seconds, then relax for 10 seconds</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
              <span className="text-violet-600 font-semibold text-sm">{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-violet-100 rounded-lg">
        <p className="text-violet-800 text-sm">
          <strong>Instructions:</strong> Start with your feet and work your way up. Tense each muscle group for 5 seconds, 
          then relax for 10 seconds. Notice the difference between tension and relaxation.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-emerald-600" />
              <h1 className="text-3xl font-bold text-slate-800">Mindfulness Exercises</h1>
            </div>
          </div>

          {!activeExercise ? (
            <div>
              <div className="text-center mb-12">
                <img 
                  src="/breathing.png" 
                  alt="Mindfulness exercises" 
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover shadow-md"
                />
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Choose Your Exercise</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Select from our collection of proven mindfulness and relaxation techniques to help you find calm and reduce stress.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {exercises.map((exercise) => {
                  const IconComponent = exercise.icon;
                  return (
                    <div
                      key={exercise.id}
                      onClick={() => setActiveExercise(exercise.id)}
                      className={`${exercise.bgColor} rounded-2xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${exercise.color} mb-6`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-3">{exercise.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{exercise.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setActiveExercise(null)}
                  className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Exercises</span>
                </button>
              </div>

              {activeExercise === 'breathing' && renderBreathingExercise()}
              {activeExercise === 'grounding' && renderGroundingExercise()}
              {activeExercise === 'progressive' && renderProgressiveExercise()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exercises;