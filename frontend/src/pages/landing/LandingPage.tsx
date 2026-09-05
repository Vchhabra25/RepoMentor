import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UploadCloud,
  Github,
  Network,
  FolderTree,
  Mic,
  LineChart,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useMousePosition } from "@/hooks/useMousePosition";

const features = [
  {
    icon: Network,
    title: "Architecture Blueprint",
    description: "See how modules, services, and data flow connect before you write a line of code.",
  },
  {
    icon: FolderTree,
    title: "Guided Explorer",
    description: "Click any file to open a plain-language explanation panel alongside the source.",
  },
  {
    icon: Mic,
    title: "Interview Mode",
    description: "Turn any repository into a set of realistic technical interview questions.",
  },
  {
    icon: LineChart,
    title: "Repository Insights",
    description: "Track project health, structure, and complexity in one dashboard.",
  },
];

const steps = [
  {
    title: "Bring your codebase",
    description: "Upload a .zip file or paste a public GitHub repository URL.",
  },
  {
    title: "We map the structure",
    description: "RepoMentor indexes your folders, files, and dependencies into a workspace.",
  },
  {
    title: "Explore with context",
    description: "Move through the blueprint, explorer, and API map at your own pace.",
  },
];

const benefits = [
  "Onboard onto unfamiliar codebases in a fraction of the time",
  "Prep for technical interviews using real project structure",
  "Give new teammates a self-serve map of your architecture",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { x, y } = useMousePosition();

  return (
    <div className="min-h-screen bg-base grid-bg overflow-x-hidden">
      <Navbar />

      {/* Ambient mouse glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(124,108,240,0.10), transparent 70%)`,
        }}
      />

      {/* Hero */}
      <section className="relative z-10 pt-40 pb-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-ink-muted mb-8"
          >
            <Sparkles size={13} className="text-accent-amber" />
            AI analysis modules launching soon
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-semibold tracking-tight text-ink leading-[1.05]"
          >
            Understand Any
            <br />
            <span className="text-gradient">Codebase in Minutes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg text-ink-muted max-w-2xl mx-auto"
          >
            RepoMentor AI turns an unfamiliar repository into a guided workspace — architecture,
            file explanations, API surface, and interview prep, all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" icon={<UploadCloud size={18} />} onClick={() => navigate("/upload")}>
              Upload ZIP
            </Button>
            <Button
              size="lg"
              variant="secondary"
              icon={<Github size={18} />}
              onClick={() => navigate("/upload")}
            >
              Analyze GitHub Repository
            </Button>
          </motion.div>
        </div>

        {/* Floating glass preview cards */}
        <div className="relative z-10 max-w-5xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Files indexed", value: "1,204" },
            { label: "Primary language", value: "TypeScript" },
            { label: "Architecture style", value: "Modular Monolith" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              <Card padding="md" className="text-left">
                <p className="text-xs font-mono text-ink-faint uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="text-lg font-display font-medium text-ink mt-1">{item.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-accent-cyan mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-ink max-w-lg mb-14">
            Everything you need to read a codebase like its author.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature) => (
              <Card key={feature.title} padding="lg" hoverable>
                <div className="w-11 h-11 rounded-xl bg-signal-gradient-soft border border-accent-indigo/20 flex items-center justify-center mb-5">
                  <feature.icon size={20} className="text-accent-cyan" />
                </div>
                <h3 className="text-lg font-medium text-ink mb-2">{feature.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-accent-cyan mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-ink max-w-lg mb-14">
            Three steps between "unfamiliar" and "understood."
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="relative">
                <span className="text-4xl font-display font-semibold text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-medium text-ink mt-4 mb-2">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="relative z-10 py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-accent-cyan mb-3">
            Benefits
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-ink mb-12">
            Built for the moment you open a repo for the first time.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            {benefits.map((benefit) => (
              <Card key={benefit} padding="md">
                <p className="text-sm text-ink leading-relaxed">{benefit}</p>
              </Card>
            ))}
          </div>

          <div className="mt-16">
            <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right" onClick={() => navigate("/upload")}>
              Start understanding your first repo
            </Button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-faint">
          <span>© {new Date().getFullYear()} RepoMentor AI. All rights reserved.</span>
          <span className="font-mono">Understand Any Codebase in Minutes.</span>
        </div>
      </footer>
    </div>
  );
}
