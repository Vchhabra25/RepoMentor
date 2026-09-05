
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      toast({
        title: "Login Successful!",
        description: "Welcome back to Gestiva",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gestiva-light/30 to-gestiva-medium/40 flex items-center justify-center p-6">
      {/* Background Logo */}
      <div 
        className="fixed inset-0 opacity-10 bg-contain bg-center bg-no-repeat z-0"
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
            <h1 className="text-3xl font-bold text-gestiva-darkest">Welcome Back</h1>
            <p className="text-gestiva-dark mt-2">Sign in to your Gestiva account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-gestiva-darkest">Username or Email</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Enter your username or email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gestiva-darkest">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gestiva-medium hover:bg-gestiva-dark text-white py-3"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gestiva-dark">
              Don't have an account?{" "}
              <Link to="/register" className="text-gestiva-medium hover:text-gestiva-dark font-semibold">
                Sign up here
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

export default Login;
