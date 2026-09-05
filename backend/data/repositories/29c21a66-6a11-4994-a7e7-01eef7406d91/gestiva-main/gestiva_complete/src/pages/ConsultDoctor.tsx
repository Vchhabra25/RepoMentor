
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ConsultDoctor = () => {
  const [location, setLocation] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { toast } = useToast();

  const doctors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialization: "Obstetrics & Gynecology",
      experience: "15 years",
      rating: 4.8,
      hospital: "Apollo Hospital, Mumbai",
      consultationHours: "9:00 AM - 6:00 PM",
      fee: "₹800",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
    },
    {
      id: 2,
      name: "Dr. Kavita Patel",
      specialization: "High-Risk Pregnancy Specialist",
      experience: "12 years",
      rating: 4.9,
      hospital: "Fortis Hospital, Delhi",
      consultationHours: "10:00 AM - 8:00 PM",
      fee: "₹1000",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150"
    },
    {
      id: 3,
      name: "Dr. Anita Gupta",
      specialization: "Maternal Fetal Medicine",
      experience: "18 years",
      rating: 4.7,
      hospital: "Max Hospital, Bangalore",
      consultationHours: "8:00 AM - 5:00 PM",
      fee: "₹900",
      image: "https://images.unsplash.com/photo-1594824404893-4bf7d8bd6ce1?w=150"
    }
  ];

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    toast({
      title: "Appointment Booking",
      description: `Booking appointment with ${doctor.name}`,
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
          <h1 className="text-3xl font-bold text-gestiva-darkest">Consult a Doctor</h1>
        </div>

        {/* Location Search */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="location" className="text-gestiva-darkest font-semibold">
                Search by Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Enter your city or area..."
              />
            </div>
            <Button className="bg-gestiva-medium hover:bg-gestiva-dark text-white mt-7">
              <MapPin className="w-4 h-4 mr-2" />
              Find Doctors
            </Button>
          </div>
        </div>

        {/* Available Doctors */}
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gestiva-darkest">Available Doctors</h2>
          
          {doctors.map((doctor, index) => (
            <Card key={doctor.id} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gestiva-darkest">{doctor.name}</h3>
                        <p className="text-gestiva-medium font-semibold">{doctor.specialization}</p>
                        <p className="text-gestiva-dark">{doctor.experience} experience</p>
                        <p className="text-gestiva-dark">{doctor.hospital}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-semibold">{doctor.rating}</span>
                        </div>
                        <p className="text-gestiva-medium font-bold text-lg">{doctor.fee}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gestiva-dark">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {doctor.consultationHours}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-4">
                      <Button 
                        onClick={() => handleBookAppointment(doctor)}
                        className="bg-gestiva-medium hover:bg-gestiva-dark text-white"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                      <Button variant="outline" className="border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white">
                        Join Online Queue
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map View */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-fade-in">
          <h3 className="text-xl font-bold text-gestiva-darkest mb-4">Nearby Facilities</h3>
          <div className="bg-gestiva-light/20 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gestiva-medium mx-auto mb-2" />
              <p className="text-gestiva-dark">Interactive map showing nearby hospitals and clinics</p>
              <p className="text-gestiva-dark text-sm mt-1">(Map integration will be implemented)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultDoctor;
