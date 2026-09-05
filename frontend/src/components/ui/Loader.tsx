import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

const DEFAULT_MESSAGES = [
  "🧠 Reading your repository...",
  "📂 Exploring folders...",
  "🔍 Finding dependencies...",
  "⚡ Understanding architecture...",
  "🎯 Preparing workspace...",
];

interface LoaderProps {
  messages?: string[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: 16, md: 24, lg: 32 };

export function Loader({ messages = DEFAULT_MESSAGES, size = "md", className }: LoaderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 text-center", className)}>
      <Loader2 size={sizeMap[size]} className="animate-spin text-accent-cyan" />
      <AnimatePresence mode="wait">
        <motion.p
          key={messages[index]}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-sm text-ink-muted font-mono"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
