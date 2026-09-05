import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/Loader";

/**
 * Guards dashboard routes. While Firebase is unconfigured (local/demo mode)
 * this simply passes children through so the UI stays explorable — swap the
 * `allowUnauthenticated` fallback for a hard redirect once auth is required.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, isConfigured } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <Loader />
      </div>
    );
  }

  const allowUnauthenticated = !isConfigured;

  if (!user && !allowUnauthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
