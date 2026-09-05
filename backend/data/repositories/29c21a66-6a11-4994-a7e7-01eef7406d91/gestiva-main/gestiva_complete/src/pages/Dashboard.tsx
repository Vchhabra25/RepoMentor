
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Stethoscope, 
  AlertTriangle, 
  Apple, 
  Baby, 
  FileText, 
  Pill,
  Users,
  Calendar,
  Settings,
  Brain
} from "lucide-react";

const Dashboard = () => {
  const features = [
    {
      title: "AI Risk Prediction",
      description: "ML-powered maternal risk assessment with 22 clinical features",
      icon: Brain,
      path: "/risk-prediction",
      color: "bg-gestiva-darker"
    },
    {
      title: "Daily Symptom Tracker",
      description: "Track and monitor your daily symptoms",
      icon: Heart,
      path: "/symptom-tracker",
      color: "bg-gestiva-light"
    },
    {
      title: "Consult a Doctor",
      description: "Book appointments with specialists",
      icon: Stethoscope,
      path: "/consult-doctor",
      color: "bg-gestiva-medium"
    },
    {
      title: "Emergency Alert",
      description: "Immediate emergency assistance",
      icon: AlertTriangle,
      path: "/emergency",
      color: "bg-red-500"
    },
    {
      title: "Personalized Diet Plan",
      description: "Custom nutrition plans for you",
      icon: Apple,
      path: "/diet-plan",
      color: "bg-gestiva-dark"
    },
    {
      title: "Ultrasound Tracker",
      description: "Monitor your baby's development",
      icon: Baby,
      path: "/ultrasound-tracker",
      color: "bg-gestiva-darker"
    },
    {
      title: "Medical Records",
      description: "Access your health documents",
      icon: FileText,
      path: "/medical-records",
      color: "bg-gestiva-light"
    },
    {
      title: "Medicine Reminder",
      description: "Never miss your medications",
      icon: Pill,
      path: "/medicine-reminder",
      color: "bg-gestiva-medium"
    },
    {
      title: "Family Alerts",
      description: "Keep your family informed",
      icon: Users,
      path: "/family-alerts",
      color: "bg-gestiva-dark"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gestiva-light/20 to-gestiva-medium/30">
      {/* Background Logo */}
      <div 
        className="fixed inset-0 opacity-5 bg-contain bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png')`,
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gestiva-medium flex items-center justify-center">
                <img 
                  src="/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png" 
                  alt="Gestiva Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gestiva-darkest">Gestiva Dashboard</h1>
                <p className="text-gestiva-dark text-sm">Your pregnancy care center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
  <Link to="/weekly-schedule">
    <Button
      variant="outline"
      className="border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white"
    >
      <Calendar className="w-4 h-4 mr-2" />
      Weekly Schedule
    </Button>
  </Link>

  <Link to="/settings">
    <Button
      variant="outline"
      className="border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white"
    >
      <Settings className="w-4 h-4 mr-2" />
      Settings
    </Button>
  </Link>
</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gestiva-darkest mb-2">Welcome Back!</h2>
          <p className="text-gestiva-dark text-lg">How are you feeling today? Choose from the options below to track your pregnancy journey.</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Link key={feature.title} to={feature.path}>
                <div 
                  className={`${feature.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer animate-scale-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-white/90 text-sm">{feature.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-gestiva-darkest mb-2">Current Week</h3>
            <p className="text-3xl font-bold text-gestiva-medium">24</p>
            <p className="text-gestiva-dark text-sm">weeks pregnant</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-gestiva-darkest mb-2">Next Appointment</h3>
            <p className="text-lg font-semibold text-gestiva-medium">Dec 25, 2024</p>
            <p className="text-gestiva-dark text-sm">Dr. Priya Sharma</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-gestiva-darkest mb-2">Baby's Size</h3>
            <p className="text-lg font-semibold text-gestiva-medium">Corn on the cob</p>
            <p className="text-gestiva-dark text-sm">About 30 cm long</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
