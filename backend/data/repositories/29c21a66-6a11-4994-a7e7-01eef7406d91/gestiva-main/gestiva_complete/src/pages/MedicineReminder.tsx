
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pill, Clock, Plus, Bell, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MedicineReminder = () => {
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    time: "",
    frequency: "daily"
  });
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Prenatal Vitamins",
      dosage: "1 tablet",
      times: ["09:00", "21:00"],
      frequency: "Daily",
      taken: [true, false]
    },
    {
      id: 2,
      name: "Iron Supplement",
      dosage: "1 capsule",
      times: ["14:00"],
      frequency: "Daily",
      taken: [false]
    },
    {
      id: 3,
      name: "Calcium",
      dosage: "2 tablets",
      times: ["10:00", "18:00"],
      frequency: "Daily",
      taken: [true, true]
    }
  ]);
  const { toast } = useToast();

  const addMedicine = () => {
    if (newMedicine.name && newMedicine.dosage && newMedicine.time) {
      const medicine = {
        id: medicines.length + 1,
        name: newMedicine.name,
        dosage: newMedicine.dosage,
        times: [newMedicine.time],
        frequency: newMedicine.frequency,
        taken: [false]
      };
      setMedicines([...medicines, medicine]);
      setNewMedicine({ name: "", dosage: "", time: "", frequency: "daily" });
      toast({
        title: "Medicine Added",
        description: `${newMedicine.name} reminder has been set`,
      });
    }
  };

  const markAsTaken = (medicineId: number, timeIndex: number) => {
    setMedicines(prev => prev.map(med => {
      if (med.id === medicineId) {
        const newTaken = [...med.taken];
        newTaken[timeIndex] = !newTaken[timeIndex];
        return { ...med, taken: newTaken };
      }
      return med;
    }));
    toast({
      title: "Medicine Tracked",
      description: "Medicine intake has been recorded",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gestiva-light/20 to-gestiva-medium/30 p-6">
      <div 
        className="fixed inset-0 opacity-5 bg-contain bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png')`,
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/dashboard">
            <Button variant="outline" className="mr-4 border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gestiva-darkest">Medicine Reminder</h1>
        </div>

        {/* Add New Medicine */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg mb-6 animate-fade-in">
          <CardHeader className="bg-gestiva-light/20">
            <CardTitle className="text-gestiva-darkest flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add New Medicine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medicineName" className="text-gestiva-darkest">Medicine Name</Label>
                <Input
                  id="medicineName"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                  placeholder="e.g., Prenatal Vitamins"
                />
              </div>
              <div>
                <Label htmlFor="dosage" className="text-gestiva-darkest">Dosage</Label>
                <Input
                  id="dosage"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                  className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                  placeholder="e.g., 1 tablet"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-gestiva-darkest">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newMedicine.time}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, time: e.target.value }))}
                  className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addMedicine} className="bg-gestiva-medium hover:bg-gestiva-dark text-white w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medicine
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Medicines */}
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-gestiva-darkest">Today's Schedule</h2>
          
          {medicines.map((medicine, index) => (
            <Card key={medicine.id} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gestiva-light/20 rounded-full flex items-center justify-center">
                      <Pill className="w-6 h-6 text-gestiva-medium" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gestiva-darkest">{medicine.name}</h3>
                      <p className="text-gestiva-dark">{medicine.dosage} • {medicine.frequency}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        {medicine.times.map((time, timeIndex) => (
                          <div key={timeIndex} className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gestiva-medium" />
                            <span className="text-gestiva-dark">{time}</span>
                            <Button
                              variant={medicine.taken[timeIndex] ? "default" : "outline"}
                              size="sm"
                              onClick={() => markAsTaken(medicine.id, timeIndex)}
                              className={medicine.taken[timeIndex] 
                                ? "bg-green-500 text-white" 
                                : "border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white"
                              }
                            >
                              {medicine.taken[timeIndex] ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                "Mark as Taken"
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Bell className="w-6 h-6 text-gestiva-medium mb-2" />
                    <p className="text-sm text-gestiva-dark">Reminder Set</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Medicine Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-green-500 mb-2">85%</div>
            <div className="text-gestiva-dark">Adherence Rate</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-gestiva-medium mb-2">3</div>
            <div className="text-gestiva-dark">Active Medicines</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-500 mb-2">5</div>
            <div className="text-gestiva-dark">Daily Doses</div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gestiva-light/20 rounded-2xl p-6 animate-fade-in">
          <h3 className="text-lg font-bold text-gestiva-darkest mb-3">Medicine Safety Tips</h3>
          <ul className="text-gestiva-dark space-y-2">
            <li>• Take prenatal vitamins with food to reduce nausea</li>
            <li>• Iron supplements are best absorbed on an empty stomach</li>
            <li>• Keep medicines in a cool, dry place</li>
            <li>• Never skip doses without consulting your doctor</li>
            <li>• Set phone alarms as backup reminders</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MedicineReminder;
