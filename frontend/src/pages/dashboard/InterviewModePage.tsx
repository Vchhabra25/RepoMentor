import { useState } from "react";
import { Mic, Users, Cpu, Network, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { CopyButton } from "@/components/ui/CopyButton";
import { RequiresIntelligenceAnalysis } from "@/components/ai/RequiresIntelligenceAnalysis";
import { AgentStreamPanel } from "@/components/ai/AgentStreamPanel";
import { useAgentStream } from "@/hooks/useAgentStream";
import { useRepositoryWorkspace } from "@/hooks/useRepositoryWorkspace";
import { aiApi } from "@/services/api";
import type { InterviewQuestion, InterviewQuestionsResponse } from "@/types/ai";
import { cn } from "@/utils/cn";

const LOADING_MESSAGES = ["🎯 Generating interview questions...", "🧠 Understanding architecture...", "⚡ Connecting components..."];

const TABS = [
  { key: "hr_questions", label: "HR", icon: Users },
  { key: "technical_questions", label: "Technical", icon: Cpu },
  { key: "system_design_questions", label: "System Design", icon: Network },
] as const;

function QuestionCard({ question }: { question: InterviewQuestion }) {
  const [isOpen, setIsOpen] = useState(false);
  const copyText = `Q: ${question.question}\n\nIdeal answer: ${question.ideal_answer}`;

  return (
    <Card padding="md">
      <button onClick={() => setIsOpen((v) => !v)} className="w-full flex items-start justify-between gap-3 text-left">
        <span className="text-sm text-ink font-medium">{question.question}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-0.5">
          <ChevronDown size={15} className="text-ink-muted" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-3 border-t border-border space-y-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-wide text-accent-cyan mb-1.5">Ideal answer</p>
                <p className="text-sm text-ink-muted leading-relaxed">{question.ideal_answer}</p>
              </div>
              {question.common_mistakes.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-wide text-state-danger mb-1.5">Common mistakes</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-ink-muted marker:text-state-danger">
                    {question.common_mistakes.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
              {question.follow_up_questions.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-wide text-ink-faint mb-1.5">Follow-up questions</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-ink-muted marker:text-accent-indigo">
                    {question.follow_up_questions.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="pt-1">
                <CopyButton text={copyText} label="Copy question + answer" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function InterviewContent() {
  const { repository } = useRepositoryWorkspace();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("hr_questions");

  const result = useAgentStream<InterviewQuestionsResponse>(
    (signal) => aiApi.interviewQuestions(repository!.id, signal),
    [repository?.id]
  );

  return (
    <AgentStreamPanel
      title="Interview questions"
      icon={Mic}
      loadingMessages={LOADING_MESSAGES}
      result={result}
      bodyActions={
        <div className="flex gap-1.5">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors",
                tab === key
                  ? "bg-signal-gradient-soft border-accent-indigo/30 text-ink"
                  : "border-border text-ink-muted hover:text-ink"
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      }
      renderData={(data) => {
        const questions = data[tab];
        return questions.length === 0 ? (
          <p className="text-sm text-ink-faint text-center py-8">No questions generated for this category.</p>
        ) : (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <QuestionCard key={`${tab}-${i}`} question={q} />
            ))}
          </div>
        );
      }}
    />
  );
}

export default function InterviewModePage() {
  return (
    <div>
      <SectionHeader
        eyebrow="AI-generated"
        title="Interview Mode"
        description="Practice discussing this exact project — HR, technical, and system design questions."
      />
      <RequiresIntelligenceAnalysis>
        <InterviewContent />
      </RequiresIntelligenceAnalysis>
    </div>
  );
}
