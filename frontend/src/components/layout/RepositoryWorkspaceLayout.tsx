import { Outlet, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { RepositoryWorkspaceProvider } from "@/contexts/RepositoryWorkspaceContext";
import { useRepositoryWorkspace } from "@/hooks/useRepositoryWorkspace";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageSkeleton } from "@/components/ui/Skeleton";

function WorkspaceGate() {
  const { repository, isLoading, error, reload } = useRepositoryWorkspace();
  const navigate = useNavigate();

  if (isLoading) return <PageSkeleton />;

  if (error || !repository) {
    return (
      <Card padding="lg" className="text-center py-16 max-w-lg mx-auto mt-12">
        <AlertCircle size={28} className="text-state-danger mx-auto mb-4" />
        <p className="text-ink mb-1">{error ?? "Repository not found."}</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate("/dashboard")}>
            Back to dashboard
          </Button>
          <Button onClick={reload}>Try again</Button>
        </div>
      </Card>
    );
  }

  return <Outlet />;
}

export function RepositoryWorkspaceLayout() {
  const { repositoryId } = useParams<{ repositoryId: string }>();
  if (!repositoryId) return null;

  return (
    <RepositoryWorkspaceProvider repositoryId={repositoryId}>
      <WorkspaceGate />
    </RepositoryWorkspaceProvider>
  );
}
