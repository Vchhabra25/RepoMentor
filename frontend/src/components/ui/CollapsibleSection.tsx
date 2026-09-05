import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface CollapsibleSectionProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card padding="md" className="overflow-hidden">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 py-1"
      >
        <span className="flex items-center gap-2.5 text-sm font-medium text-ink">
          {Icon && <Icon size={16} className="text-ink-muted" />}
          {title}
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-ink-muted" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 text-sm text-ink-muted leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
