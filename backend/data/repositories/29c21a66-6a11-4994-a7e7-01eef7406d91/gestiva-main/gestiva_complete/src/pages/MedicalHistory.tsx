
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MedicalHistory = () => {
  const [formData, setFormData] = useState({
    previousPregnancies: "",
    fertilityIssues: "",
    currentMedications: "",
    chronicDiseases: "",
    recentInfections: "",
    smokingAlcoholDrugs: "",
    radiationExposure: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allFieldsFilled = Object.values(formData).every(value => value.trim() !== "");
    
    if (allFieldsFilled) {
      toast({
        title: "Medical History Saved!",
        description: "Welcome to your Gestiva dashboard",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "All medical history fields are required",
        variant: "destructive",
      });
    }
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
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gestiva-darkest">Lifestyle & Medical History</h1>
            <p className="text-gestiva-dark mt-2">Help us provide the best care by sharing your medical background</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="previousPregnancies" className="text-gestiva-darkest">
                Previous pregnancies or miscarriages *
              </Label>
              <Textarea
                id="previousPregnancies"
                name="previousPregnancies"
                value={formData.previousPregnancies}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Please describe any previous pregnancies, miscarriages, or complications"
                required
              />
            </div>

            <div>
              <Label htmlFor="fertilityIssues" className="text-gestiva-darkest">
                Known fertility issues *
              </Label>
              <Textarea
                id="fertilityIssues"
                name="fertilityIssues"
                value={formData.fertilityIssues}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Describe any known fertility issues or treatments"
                required
              />
            </div>

            <div>
              <Label htmlFor="currentMedications" className="text-gestiva-darkest">
                Current medications *
              </Label>
              <Textarea
                id="currentMedications"
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="List all current medications, supplements, and vitamins"
                required
              />
            </div>

            <div>
              <Label htmlFor="chronicDiseases" className="text-gestiva-darkest">
                Chronic diseases (diabetes, thyroid, hypertension, etc.) *
              </Label>
              <Textarea
                id="chronicDiseases"
                name="chronicDiseases"
                value={formData.chronicDiseases}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="List any chronic conditions or ongoing health issues"
                required
              />
            </div>

            <div>
              <Label htmlFor="recentInfections" className="text-gestiva-darkest">
                Recent infections or fever *
              </Label>
              <Textarea
                id="recentInfections"
                name="recentInfections"
                value={formData.recentInfections}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Describe any recent infections, illnesses, or fever episodes"
                required
              />
            </div>

            <div>
              <Label htmlFor="smokingAlcoholDrugs" className="text-gestiva-darkest">
                Smoking, alcohol, or drug use *
              </Label>
              <Textarea
                id="smokingAlcoholDrugs"
                name="smokingAlcoholDrugs"
                value={formData.smokingAlcoholDrugs}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Please be honest about any substance use - this helps us provide better care"
                required
              />
            </div>

            <div>
              <Label htmlFor="radiationExposure" className="text-gestiva-darkest">
                Exposure to radiation or toxic chemicals *
              </Label>
              <Textarea
                id="radiationExposure"
                name="radiationExposure"
                value={formData.radiationExposure}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Describe any exposure to radiation, chemicals, or toxic substances"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gestiva-medium hover:bg-gestiva-dark text-white py-3"
            >
              Complete Setup & Access Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
