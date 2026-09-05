import React, { useState } from 'react';
import { ArrowLeft, Brain, BarChart3, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MentalHealthCheckerProps {
  onNavigateHome: () => void;
}

interface Question {
  id: number;
  question: string;
  options: { text: string; value: number }[];
  category: 'anxiety' | 'stress' | 'depression' | 'wellbeing';
}

const questions: Question[] = [
  {
    id: 1,
    question: "How often do you feel overwhelmed by daily tasks?",
    options: [
      { text: "Never", value: 0 },
      { text: "Sometimes", value: 1 },
      { text: "Often", value: 2 },
      { text: "Always", value: 3 }
    ],
    category: 'stress'
  },
  {
    id: 2,
    question: "How well do you sleep at night?",
    options: [
      { text: "Very well", value: 0 },
      { text: "Well", value: 1 },
      { text: "Poorly", value: 2 },
      { text: "Very poorly", value: 3 }
    ],
    category: 'stress'
  },
  {
    id: 3,
    question: "How often do you worry about future events?",
    options: [
      { text: "Rarely", value: 0 },
      { text: "Sometimes", value: 1 },
      { text: "Often", value: 2 },
      { text: "Constantly", value: 3 }
    ],
    category: 'anxiety'
  },
  {
    id: 4,
    question: "How often do you feel restless or on edge?",
    options: [
      { text: "Never", value: 0 },
      { text: "Sometimes", value: 1 },
      { text: "Often", value: 2 },
      { text: "Always", value: 3 }
    ],
    category: 'anxiety'
  },
  {
    id: 5,
    question: "How often do you feel sad or down?",
    options: [
      { text: "Never", value: 0 },
      { text: "Sometimes", value: 1 },
      { text: "Often", value: 2 },
      { text: "Always", value: 3 }
    ],
    category: 'depression'
  },
  {
    id: 6,
    question: "How much do you enjoy activities you used to like?",
    options: [
      { text: "A lot", value: 0 },
      { text: "Some", value: 1 },
      { text: "A little", value: 2 },
      { text: "Not at all", value: 3 }
    ],
    category: 'depression'
  },
  {
    id: 7,
    question: "How confident do you feel about handling problems?",
    options: [
      { text: "Very confident", value: 0 },
      { text: "Somewhat confident", value: 1 },
      { text: "Not very confident", value: 2 },
      { text: "Not confident at all", value: 3 }
    ],
    category: 'wellbeing'
  },
  {
    id: 8,
    question: "How satisfied are you with your relationships?",
    options: [
      { text: "Very satisfied", value: 0 },
      { text: "Somewhat satisfied", value: 1 },
      { text: "Somewhat dissatisfied", value: 2 },
      { text: "Very dissatisfied", value: 3 }
    ],
    category: 'wellbeing'
  }
];

const MentalHealthChecker: React.FC<MentalHealthCheckerProps> = ({ onNavigateHome }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [musicGenre, setMusicGenre] = useState("Bollywood");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const categoryScores = {
      anxiety: 0,
      stress: 0,
      depression: 0,
      wellbeing: 0
    };

    const categoryCounts = {
      anxiety: 0,
      stress: 0,
      depression: 0,
      wellbeing: 0
    };

    questions.forEach((question, index) => {
      const score = answers[index] || 0;
      categoryScores[question.category] += score;
      categoryCounts[question.category]++;
    });

    const percentages = {
      anxiety: Math.round((categoryScores.anxiety / (categoryCounts.anxiety * 3)) * 100),
      stress: Math.round((categoryScores.stress / (categoryCounts.stress * 3)) * 100),
      depression: Math.round((categoryScores.depression / (categoryCounts.depression * 3)) * 100),
      wellbeing: Math.round(100 - (categoryScores.wellbeing / (categoryCounts.wellbeing * 3)) * 100)
    };

    return percentages;
  };

  const getColorForScore = (score: number) => {
    if (score <= 25) return 'text-emerald-600';
    if (score <= 50) return 'text-amber-600';
    if (score <= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBarColorForScore = (score: number) => {
    if (score <= 25) return 'bg-emerald-500';
    if (score <= 50) return 'bg-amber-500';
    if (score <= 75) return 'bg-orange-500';
    return 'bg-red-500';
  };
const analyzeAudio = async () => {
  let fileToSend: File;

  if (recordedBlob) {
    fileToSend = new File([recordedBlob], "recording.webm", {
      type: "audio/webm",
    });
  } else if (audioFile) {
    fileToSend = audioFile;
  } else {
    alert("Please record or upload audio");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("audio", fileToSend);

    const response = await fetch(
      "https://soulnote-fullstack.onrender.com/analyze",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    setAiResult(data);
  } catch (err) {
    console.error(err);
    alert("Analysis failed");
  } finally {
    setLoading(false);
  }
};
const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  const recorder = new MediaRecorder(stream);

  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, {
      type: "audio/webm",
    });

    setRecordedBlob(blob);

    stream.getTracks().forEach((track) => track.stop());
  };

  recorder.start();

  setMediaRecorder(recorder);
  setIsRecording(true);
};
const stopRecording = () => {
  if (!mediaRecorder) return;

  mediaRecorder.stop();
  setIsRecording(false);
};
const findMusic = () => {
  if (!aiResult) return;

  const emotion = aiResult.emotion.toLowerCase();

  let searchQuery = "";

  if (emotion === "sadness") {
    searchQuery = `uplifting ${musicGenre} songs for sadness`;
  } else if (emotion === "anger") {
    searchQuery = `calming ${musicGenre} music`;
  } else if (emotion === "fear") {
    searchQuery = `relaxing ${musicGenre} music`;
  } else if (emotion === "joy") {
    searchQuery = `happy ${musicGenre} songs`;
  } else {
    searchQuery = `mindfulness ${musicGenre} music`;
  }

  window.open(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
    "_blank"
  );
};
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const results = calculateResults();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={onNavigateHome}
                className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
              <h1 className="text-3xl font-bold text-slate-800">Your Mental Health Report</h1>
            </div>

            <div className="text-center mb-8">
              <img 
                src="assess.png" 
                alt="Mental health assessment results" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {Object.entries(results).map(([category, score]) => (
                <div key={category} className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-700 capitalize">{category}</h3>
                    <span className={`text-2xl font-bold ${getColorForScore(score)}`}>
                      {score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${getBarColorForScore(score)}`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    {score <= 25 && "Low level - You're doing great!"}
                    {score > 25 && score <= 50 && "Moderate level - Consider some self-care."}
                    {score > 50 && score <= 75 && "High level - You might benefit from support."}
                    {score > 75 && "Very high level - Please consider professional help."}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                Recommendations
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <p className="text-slate-700">Practice daily mindfulness exercises to reduce stress and anxiety</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <p className="text-slate-700">Complete daily challenges to build positive habits</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <p className="text-slate-700">Consider consulting with a mental health professional if needed</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Retake Assessment
              </button>
              <button
                onClick={onNavigateHome}
                className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Explore Tools
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              <span className="text-lg font-semibold text-slate-700">Mental Health Assessment</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <img 
              src="/test.png" 
              alt="Mental health assessment" 
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-md"
            />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-500">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-8">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 text-left bg-slate-50 hover:bg-indigo-50 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-indigo-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 transition-colors"></div>
                    <span className="text-slate-700 group-hover:text-indigo-700 font-medium">
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white border rounded-xl p-6 mb-6">
  <h3 className="text-xl font-bold mb-4">
    AI Voice Analysis
  </h3>

  <div className="flex flex-col gap-4 mt-4">

  {!isRecording ? (
    <button
      onClick={startRecording}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
      🎤 Start Recording
    </button>
  ) : (
    <button
      onClick={stopRecording}
      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
    >
      ⏹ Stop Recording
    </button>
  )}

  {recordedBlob && (
    <>
      <p className="text-green-600 font-medium">
        ✅ Recording Ready
      </p>

      <button
        onClick={analyzeAudio}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        {loading ? "Analyzing..." : "Analyze Voice"}
      </button>
    </>
  )}

</div>

  {aiResult && (
    <div className="mt-6 bg-slate-50 p-4 rounded-lg">
      <p>
        <strong>Transcript:</strong>
        {" "}
        {aiResult.transcript}
      </p>

      <p>
        <strong>Emotion:</strong>
        {" "}
        {aiResult.emotion}
      </p>

      <p>
        <strong>Confidence:</strong>
        {" "}
        {aiResult.confidence}%
      </p>

      <p>
        <strong>Recommendation:</strong>
        {" "}
        {aiResult.recommendation}
      </p>
      <hr className="my-4" />

<h4 className="font-bold text-lg mb-3">
  🎵 Music Therapy
</h4>

<div className="flex flex-col gap-3 mt-3">
  <select
    value={musicGenre}
    onChange={(e) =>
      setMusicGenre(e.target.value)
    }
    className="border rounded-lg p-2"
  >
    <option>Bollywood</option>
    <option>Hollywood</option>
    <option>Lo-fi</option>
    <option>Instrumental</option>
  </select>

  <button
    onClick={findMusic}
    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
  >
    🎵 Find Music
  </button>
</div>
    </div>
  )}
</div>
          <div className="bg-indigo-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-indigo-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Your responses are confidential and used only for assessment purposes.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthChecker;