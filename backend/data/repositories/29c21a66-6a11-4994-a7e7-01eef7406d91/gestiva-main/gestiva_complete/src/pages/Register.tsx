
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.password && formData.phoneNumber && formData.location) {
      toast({
        title: "Registration Successful!",
        description: "Please complete your medical history",
      });
      navigate("/medical-history");
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gestiva-light/30 to-gestiva-medium/40 flex items-center justify-center p-6">
      {/* Background Logo */}
      <div 
        className="fixed inset-0 opacity-5 bg-contain bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png')`,
        }}
      />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gestiva-medium flex items-center justify-center mx-auto mb-4">
              <img 
                src="/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png" 
                alt="Gestiva Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gestiva-darkest">Join Gestiva</h1>
            <p className="text-gestiva-dark mt-2">Create your pregnancy care account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-gestiva-darkest">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gestiva-darkest">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gestiva-darkest">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-gestiva-darkest">Phone Number *</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-gestiva-darkest">Location *</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Enter your city/location"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                }
              />
              <Label htmlFor="rememberMe" className="text-gestiva-darkest text-sm">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gestiva-medium hover:bg-gestiva-dark text-white py-3"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gestiva-dark">
              Already have an account?{" "}
              <Link to="/login" className="text-gestiva-medium hover:text-gestiva-dark font-semibold">
                Sign in here
              </Link>
            </p>
            <Link to="/" className="text-gestiva-dark hover:text-gestiva-medium text-sm mt-2 block">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
