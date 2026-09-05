import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Thermometer, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SymptomTracker = () => {
  const [symptoms, setSymptoms] = useState({
    fever: "",
    severeCramps: false,
    heavyBleeding: false,
    weakness: false,
    tiredness: false,
    depression: false,
    moodSwings: false,
    sleepIssues: false,
    otherSymptoms: "",
    uploadedImage: null as File | null
  });
  const [prediction, setPrediction] = useState("");
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSymptoms(prev => ({ ...prev, [name]: checked }));
    } else {
      setSymptoms(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSymptoms(prev => ({ ...prev, uploadedImage: file }));
      toast({
        title: "Image Uploaded",
        description: "Your symptom image has been uploaded successfully",
      });
    }
  };

  const analyzeSymptoms = () => {
    let possibleConditions = [];
    
    if (symptoms.fever && parseFloat(symptoms.fever) > 100) {
      possibleConditions.push("Possible infection or fever-related condition");
    }
    if (symptoms.severeCramps && symptoms.heavyBleeding) {
      possibleConditions.push("Possible preeclampsia or pregnancy complications");
    }
    if (symptoms.depression || symptoms.moodSwings) {
      possibleConditions.push("Anxiety or depression symptoms");
    }
    if (symptoms.weakness && symptoms.tiredness) {
      possibleConditions.push("Possible anemia");
    }
    if (symptoms.otherSymptoms.toLowerCase().includes("burning") || symptoms.otherSymptoms.toLowerCase().includes("urination")) {
      possibleConditions.push("Possible urinary tract infection");
    }

    if (possibleConditions.length > 0) {
      setPrediction(`Based on your symptoms, you may have: ${possibleConditions.join(", ")}. Please consult with your doctor for proper diagnosis.`);
    } else {
      setPrediction("Your symptoms appear normal, but continue monitoring. Consult your doctor if symptoms worsen.");
    }

    toast({
      title: "Analysis Complete",
      description: "Your symptom analysis is ready",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gestiva-light/20 to-gestiva-medium/30 p-6">
      {/* Background Logo */}
      <div 
        className="fixed inset-0 opacity-5 bg-contain bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png')`,
        }}
      />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/dashboard">
            <Button variant="outline" className="mr-4 border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gestiva-darkest">Daily Symptom Tracker</h1>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <Thermometer className="w-16 h-16 text-gestiva-medium mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gestiva-darkest">How are you feeling today?</h2>
            <p className="text-gestiva-dark mt-2">Track your symptoms for better health monitoring</p>
          </div>

          <div className="space-y-6">
            {/* Fever */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <Label htmlFor="fever" className="text-gestiva-darkest font-semibold flex items-center">
                <Thermometer className="w-4 h-4 mr-2" />
                Fever (°F)
              </Label>
              <Input
                id="fever"
                name="fever"
                type="number"
                value={symptoms.fever}
                onChange={handleInputChange}
                className="mt-2 border-blue-200 focus:border-blue-400"
                placeholder="Enter your temperature (Normal: 98.6°F)"
              />
              <p className="text-sm text-blue-600 mt-1">Normal range: 98.6°F - 99.5°F</p>
            </div>

            {/* Symptoms Checkboxes */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'severeCramps', label: 'Severe Cramps' },
                { name: 'heavyBleeding', label: 'Heavy Bleeding' },
                { name: 'weakness', label: 'Weakness/Tiredness' },
                { name: 'depression', label: 'Depression/Mood Swings' },
                { name: 'sleepIssues', label: 'Sleep Issues' }
              ].map((symptom) => (
                <div key={symptom.name} className="bg-gestiva-light/20 p-3 rounded-lg">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name={symptom.name}
                      checked={symptoms[symptom.name as keyof typeof symptoms] as boolean}
                      onChange={handleInputChange}
                      className="rounded border-gestiva-medium text-gestiva-medium focus:ring-gestiva-medium"
                    />
                    <span className="text-gestiva-darkest font-medium">{symptom.label}</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Other Symptoms */}
            <div>
              <Label htmlFor="otherSymptoms" className="text-gestiva-darkest font-semibold">
                Other Symptoms (skin changes, burning during urination, etc.)
              </Label>
              <Textarea
                id="otherSymptoms"
                name="otherSymptoms"
                value={symptoms.otherSymptoms}
                onChange={handleInputChange}
                className="mt-2 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Describe any other symptoms you're experiencing..."
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="bg-gestiva-light/20 p-4 rounded-lg">
              <Label className="text-gestiva-darkest font-semibold flex items-center mb-2">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image (for queries)
              </Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border border-gestiva-light rounded-md focus:border-gestiva-medium"
              />
              {symptoms.uploadedImage && (
                <p className="text-gestiva-medium text-sm mt-2">
                  ✓ Image uploaded: {symptoms.uploadedImage.name}
                </p>
              )}
            </div>

            {/* Analysis Button */}
            <Button
              onClick={analyzeSymptoms}
              className="w-full bg-gestiva-medium hover:bg-gestiva-dark text-white py-3"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Analyze My Symptoms
            </Button>

            {/* Prediction Results */}
            {prediction && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg animate-fade-in">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">AI Risk Analysis</h3>
                    <p className="text-blue-700">{prediction}</p>
                    <p className="text-blue-600 text-sm mt-2">
                      ⚠️ This is an AI prediction for informational purposes only. Please consult your healthcare provider for proper medical advice.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomTracker;
