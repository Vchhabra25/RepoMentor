import { AlertTriangle, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ title = "Something went wrong", message, onRetry }: ErrorCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card padding="lg" className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-state-danger/10 border border-state-danger/20 flex items-center justify-center">
          <AlertTriangle size={20} className="text-state-danger" />
        </div>
        <p className="text-ink font-medium mb-1">{title}</p>
        <p className="text-sm text-ink-muted max-w-sm mx-auto mb-6">{message}</p>
        {onRetry && (
          <Button variant="secondary" size="sm" icon={<RefreshCcw size={14} />} onClick={onRetry}>
            Try again
          </Button>
        )}
      </Card>
    </motion.div>
  );
}
