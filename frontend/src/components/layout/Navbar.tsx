import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled ? "glass-elevated" : "bg-transparent border-b border-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-signal-gradient flex items-center justify-center">
            <Compass size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-ink tracking-tight">RepoMentor AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-ink-muted">
          <a href="#features" className="hover:text-ink transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-ink transition-colors">
            How it works
          </a>
          <a href="#benefits" className="hover:text-ink transition-colors">
            Benefits
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Sign in
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/upload")}>
            Get started
          </Button>
        </div>
      </nav>
    </header>
  );
}
