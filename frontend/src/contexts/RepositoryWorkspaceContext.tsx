import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { api, ApiError } from "@/services/api";
import type { Repository, RepositoryAnalysis } from "@/types";

interface RepositoryWorkspaceValue {
  repository: Repository | null;
  analysis: RepositoryAnalysis | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  runIntelligenceAnalysis: () => Promise<void>;
  isAnalyzing: boolean;
  analyzeError: string | null;
}

export const RepositoryWorkspaceContext = createContext<RepositoryWorkspaceValue | undefined>(undefined);

export function RepositoryWorkspaceProvider({
  repositoryId,
  children,
}: {
  repositoryId: string;
  children: ReactNode;
}) {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { repository } = await api.getRepository(repositoryId);
      setRepository(repository);
      try {
        const { analysis } = await api.getRepositoryAnalysis(repositoryId);
        setAnalysis(analysis);
      } catch {
        setAnalysis(null);
      }
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 404
          ? "This repository doesn't exist or hasn't been ingested."
          : "Couldn't load this repository right now."
      );
    } finally {
      setIsLoading(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    load();
  }, [load]);

  async function runIntelligenceAnalysis() {
    setIsAnalyzing(true);
    setAnalyzeError(null);
    try {
      const { analysis } = await api.analyzeRepository(repositoryId);
      setAnalysis(analysis);
    } catch (err) {
      setAnalyzeError(err instanceof ApiError ? err.message : "Couldn't analyze this repository right now.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  const value: RepositoryWorkspaceValue = {
    repository,
    analysis,
    isLoading,
    error,
    reload: load,
    runIntelligenceAnalysis,
    isAnalyzing,
    analyzeError,
  };

  return <RepositoryWorkspaceContext.Provider value={value}>{children}</RepositoryWorkspaceContext.Provider>;
}
