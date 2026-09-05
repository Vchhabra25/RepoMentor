
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Baby, Calendar, Camera, Ruler } from "lucide-react";

const UltrasoundTracker = () => {
  const ultrasoundHistory = [
    {
      date: "2024-12-15",
      week: "24 weeks",
      measurements: {
        length: "30 cm",
        weight: "600g",
        heartRate: "145 bpm"
      },
      notes: "Baby is developing well, all measurements normal",
      images: 1
    },
    {
      date: "2024-11-20",
      week: "20 weeks",
      measurements: {
        length: "25 cm",
        weight: "400g",
        heartRate: "150 bpm"
      },
      notes: "Anatomy scan completed, everything looks perfect",
      images: 2
    },
    {
      date: "2024-10-25",
      week: "16 weeks",
      measurements: {
        length: "18 cm",
        weight: "200g",
        heartRate: "155 bpm"
      },
      notes: "First detailed scan, baby is active and healthy",
      images: 1
    }
  ];

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
          <h1 className="text-3xl font-bold text-gestiva-darkest">Ultrasound Tracker</h1>
        </div>

        {/* Current Baby Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-6 text-center animate-fade-in">
          <Baby className="w-16 h-16 text-gestiva-medium mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gestiva-darkest mb-2">Your Baby at 24 Weeks</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gestiva-light/20 p-4 rounded-lg">
              <Ruler className="w-8 h-8 text-gestiva-medium mx-auto mb-2" />
              <div className="text-2xl font-bold text-gestiva-medium">30 cm</div>
              <div className="text-gestiva-dark">Length</div>
            </div>
            <div className="bg-gestiva-light/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gestiva-medium">600g</div>
              <div className="text-gestiva-dark">Weight</div>
            </div>
            <div className="bg-gestiva-light/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gestiva-medium">145</div>
              <div className="text-gestiva-dark">BPM</div>
            </div>
          </div>
          <p className="text-gestiva-dark mt-4">Your baby is now the size of a corn on the cob!</p>
        </div>

        {/* Add New Scan */}
        <div className="mb-6 animate-fade-in">
          <Button className="bg-gestiva-medium hover:bg-gestiva-dark text-white">
            <Camera className="w-4 h-4 mr-2" />
            Add New Ultrasound
          </Button>
        </div>

        {/* Ultrasound History */}
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gestiva-darkest">Ultrasound History</h2>
          
          {ultrasoundHistory.map((scan, index) => (
            <Card key={scan.date} className="bg-white/90 backdrop-blur-sm shadow-lg animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="bg-gestiva-light/20">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gestiva-medium" />
                    <span className="text-gestiva-darkest">{scan.date} - {scan.week}</span>
                  </div>
                  <div className="flex items-center text-gestiva-medium">
                    <Camera className="w-4 h-4 mr-1" />
                    {scan.images} image{scan.images > 1 ? 's' : ''}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gestiva-medium">{scan.measurements.length}</div>
                    <div className="text-gestiva-dark text-sm">Length</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gestiva-medium">{scan.measurements.weight}</div>
                    <div className="text-gestiva-dark text-sm">Weight</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gestiva-medium">{scan.measurements.heartRate}</div>
                    <div className="text-gestiva-dark text-sm">Heart Rate</div>
                  </div>
                </div>
                <div className="bg-gestiva-light/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-gestiva-darkest mb-2">Doctor's Notes:</h4>
                  <p className="text-gestiva-dark">{scan.notes}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Development Milestones */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-fade-in">
          <h3 className="text-xl font-bold text-gestiva-darkest mb-4">Development Milestones</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gestiva-medium mb-2">Week 24 Developments:</h4>
              <ul className="text-gestiva-dark space-y-1">
                <li>• Baby's hearing is developing</li>
                <li>• Lungs are producing surfactant</li>
                <li>• Taste buds are forming</li>
                <li>• Brain activity is increasing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gestiva-medium mb-2">Next Week (25):</h4>
              <ul className="text-gestiva-dark space-y-1">
                <li>• Hair and fingernails growing</li>
                <li>• Baby can respond to sounds</li>
                <li>• Rapid brain development</li>
                <li>• Fat deposits forming</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltrasoundTracker;
