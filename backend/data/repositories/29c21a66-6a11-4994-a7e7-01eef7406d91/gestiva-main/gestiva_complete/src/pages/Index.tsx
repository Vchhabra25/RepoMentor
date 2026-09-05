
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Shield, Users, Award } from "lucide-react";

const Index = () => {
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
      <header className="relative z-10 p-6">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gestiva-medium flex items-center justify-center">
              <img 
                src="/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png" 
                alt="Gestiva Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-gestiva-darkest">Gestiva</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gestiva-medium hover:bg-gestiva-dark text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gestiva-darkest mb-6">
            Your Pregnancy
            <span className="text-gestiva-medium"> Journey</span>
          </h1>
          <p className="text-xl text-gestiva-dark mb-8 max-w-2xl mx-auto">
            Comprehensive pregnancy care and monitoring at your fingertips. 
            Track symptoms, consult doctors, and ensure a healthy pregnancy journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gestiva-medium hover:bg-gestiva-dark text-white px-8 py-4 text-lg animate-scale-in">
                Access Dashboard
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white px-8 py-4 text-lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="mt-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gestiva-darkest mb-4">Why Choose Gestiva?</h2>
            <p className="text-gestiva-dark text-lg max-w-3xl mx-auto">
              Gestiva is at the forefront of providing the finest care for women and children. 
              Established with love, Gestiva operates comprehensive services across India.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
              <div className="w-16 h-16 bg-gestiva-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gestiva-darkest mb-2">Expertise in High-Risk Care</h3>
              <p className="text-gestiva-dark text-sm">Specialized care for complex pregnancies</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
              <div className="w-16 h-16 bg-gestiva-medium rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gestiva-darkest mb-2">Advanced Neonatal Care</h3>
              <p className="text-gestiva-dark text-sm">Round-the-clock care for newborns</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
              <div className="w-16 h-16 bg-gestiva-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gestiva-darkest mb-2">30+ Years Experience</h3>
              <p className="text-gestiva-dark text-sm">Decades of clinical excellence</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
              <div className="w-16 h-16 bg-gestiva-darker rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gestiva-darkest mb-2">Post Birth Medical Care</h3>
              <p className="text-gestiva-dark text-sm">Comprehensive postnatal support</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gestiva-darkest mb-4">Our Services and Facilities</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gestiva-light/90 rounded-xl p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Well Equipped Labour and Delivery Rooms</h3>
            </div>
            
            <div className="bg-gestiva-medium/90 rounded-xl p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Ultra-Modern Equipment</h3>
            </div>
            
            <div className="bg-gestiva-dark/90 rounded-xl p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Level III NICU</h3>
            </div>
            
            <div className="bg-gestiva-darker/90 rounded-xl p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Ventilator Enabled Ambulances</h3>
            </div>
            
            <div className="bg-gestiva-light/90 rounded-xl p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Well Trained Nurses & Medical Staff</h3>
            </div>
            
            <div className="bg-gestiva-medium/90 rounded-xl p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">24x7 Pharmacy</h3>
            </div>
            
            <div className="bg-gestiva-dark/90 rounded-xl p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Array of Maternity Packages</h3>
            </div>
            
            <div className="bg-gestiva-darker/90 rounded-xl p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Trusted experts with over 30+ years of clinical experience</h3>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 bg-gestiva-darkest text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; 2024 Gestiva. All rights reserved. Your trusted pregnancy care companion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
