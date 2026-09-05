import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RepositoryWorkspaceLayout } from "@/components/layout/RepositoryWorkspaceLayout";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { PageSkeleton } from "@/components/ui/Skeleton";

import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import UploadPage from "@/pages/upload/UploadPage";

const HomeDashboardPage = lazy(() => import("@/pages/dashboard/HomeDashboardPage"));
const RepositoryHomePage = lazy(() => import("@/pages/dashboard/RepositoryHomePage"));
const OverviewPage = lazy(() => import("@/pages/dashboard/OverviewPage"));
const ArchitecturePage = lazy(() => import("@/pages/dashboard/ArchitecturePage"));
const ExplorerPage = lazy(() => import("@/pages/dashboard/ExplorerPage"));
const ApiExplorerPage = lazy(() => import("@/pages/dashboard/ApiExplorerPage"));
const InterviewModePage = lazy(() => import("@/pages/dashboard/InterviewModePage"));
const ImprovementsPage = lazy(() => import("@/pages/dashboard/ImprovementsPage"));
const ReadmePage = lazy(() => import("@/pages/dashboard/ReadmePage"));
const SettingsPage = lazy(() => import("@/pages/dashboard/SettingsPage"));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/upload" element={<UploadPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LazyPage><HomeDashboardPage /></LazyPage>} />
        <Route path="settings" element={<LazyPage><SettingsPage /></LazyPage>} />

        <Route path=":repositoryId" element={<RepositoryWorkspaceLayout />}>
          <Route index element={<LazyPage><RepositoryHomePage /></LazyPage>} />
          <Route path="overview" element={<LazyPage><OverviewPage /></LazyPage>} />
          <Route path="architecture" element={<LazyPage><ArchitecturePage /></LazyPage>} />
          <Route path="explorer" element={<LazyPage><ExplorerPage /></LazyPage>} />
          <Route path="api-explorer" element={<LazyPage><ApiExplorerPage /></LazyPage>} />
          <Route path="interview" element={<LazyPage><InterviewModePage /></LazyPage>} />
          <Route path="improvements" element={<LazyPage><ImprovementsPage /></LazyPage>} />
          <Route path="readme" element={<LazyPage><ReadmePage /></LazyPage>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
