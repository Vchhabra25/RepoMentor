import { useContext } from "react";
import { RepositoryWorkspaceContext } from "@/contexts/RepositoryWorkspaceContext";

export function useRepositoryWorkspace() {
  const ctx = useContext(RepositoryWorkspaceContext);
  if (!ctx) {
    throw new Error("useRepositoryWorkspace must be used within a RepositoryWorkspaceProvider");
  }
  return ctx;
}
