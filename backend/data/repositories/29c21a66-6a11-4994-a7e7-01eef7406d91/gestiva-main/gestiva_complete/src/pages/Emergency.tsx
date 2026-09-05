
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, Ambulance, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Emergency = () => {
  const { toast } = useToast();

  const handleEmergencyCall = (service: string, number: string) => {
    toast({
      title: "Emergency Alert",
      description: `Calling ${service} at ${number}`,
    });
  };

  const emergencyContacts = [
    { name: "Emergency Ambulance", number: "108", icon: Ambulance },
    { name: "Police Emergency", number: "100", icon: AlertTriangle },
    { name: "Fire Emergency", number: "101", icon: AlertTriangle },
    { name: "Women Helpline", number: "1091", icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 p-6">
      <div 
        className="fixed inset-0 opacity-5 bg-contain bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png')`,
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/dashboard">
            <Button variant="outline" className="mr-4 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-red-700">Emergency SOS</h1>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-6 text-center animate-fade-in">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Emergency Services</h2>
          <p className="text-red-600 mb-4">In case of medical emergency, contact the services below immediately</p>
          
          <Button 
            onClick={() => handleEmergencyCall("Emergency Services", "108")}
            className="bg-red-500 hover:bg-red-600 text-white text-xl px-8 py-4"
            size="lg"
          >
            <Phone className="w-6 h-6 mr-2" />
            CALL 108 NOW
          </Button>
        </div>

        {/* Emergency Contacts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in">
          {emergencyContacts.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <Card key={contact.name} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <IconComponent className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gestiva-darkest mb-2">{contact.name}</h3>
                  <p className="text-3xl font-bold text-red-500 mb-4">{contact.number}</p>
                  <Button 
                    onClick={() => handleEmergencyCall(contact.name, contact.number)}
                    className="bg-red-500 hover:bg-red-600 text-white w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Emergency Map */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-fade-in">
          <h3 className="text-xl font-bold text-gestiva-darkest mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Nearest Emergency Facilities
          </h3>
          <div className="bg-red-50 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-red-700 mb-2">Emergency Map</h4>
              <p className="text-red-600">Showing nearest hospitals, ambulance services, and emergency facilities</p>
              <p className="text-red-500 text-sm mt-2">🚨 Real-time location tracking and emergency routing</p>
              
              {/* Mock Emergency Facilities */}
              <div className="mt-6 grid md:grid-cols-2 gap-4 text-left">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h5 className="font-semibold text-red-700">Apollo Emergency</h5>
                  <p className="text-sm text-red-600">2.3 km away • 5 min</p>
                  <p className="text-sm text-red-500">24/7 Emergency Services</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h5 className="font-semibold text-red-700">Fortis Emergency</h5>
                  <p className="text-sm text-red-600">3.1 km away • 7 min</p>
                  <p className="text-sm text-red-500">Maternity Emergency</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Instructions */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-6 animate-fade-in">
          <h3 className="text-lg font-bold text-orange-700 mb-3">Emergency Instructions</h3>
          <ul className="text-orange-600 space-y-2">
            <li>• Stay calm and call emergency services immediately</li>
            <li>• Provide your exact location and describe the emergency</li>
            <li>• Follow the operator's instructions carefully</li>
            <li>• Keep your phone charged and easily accessible</li>
            <li>• Have your medical information ready to share</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
