export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export type ProjectStatus = "idle" | "uploading" | "processing" | "ready" | "error";

export interface ProjectSummary {
  id: string;
  name: string;
  primaryLanguage: string;
  techStack: string[];
  sizeLabel: string;
  fileCount: number;
  status: ProjectStatus;
  updatedAt: string;
}

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  extension?: string;
}

export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  route: string;
  description: string;
  tag: string;
}

export interface InterviewQuestion {
  id: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface RecentRepository {
  id: string;
  name: string;
  source: "github" | "zip";
  lastOpened: string;
}

/** Mirrors backend/app/models/repository.py::RepositoryStatus */
export type RepositoryStatus =
  | "Queued"
  | "Uploading"
  | "Extracting"
  | "Preparing"
  | "Ready"
  | "Failed";

/** Mirrors backend/app/models/repository.py::Repository */
export interface Repository {
  id: string;
  name: string;
  owner: string | null;
  source: "github" | "zip";
  upload_time: string;
  primary_language: string | null;
  file_count: number;
  folder_count: number;
  size_bytes: number;
  root_directory: string;
  status: RepositoryStatus;
  error_message: string | null;
}

export interface RepositoryResponse {
  status: string;
  repository: Repository;
}

export interface RepositoryListResponse {
  status: string;
  count: number;
  repositories: Repository[];
}

/** Mirrors backend/app/models/analysis.py::DependencyNode */
export interface DependencyNode {
  name: string;
  version: string | null;
  ecosystem: string;
  source_file: string;
}

/** Mirrors backend/app/models/analysis.py::DependencyEdge */
export interface DependencyEdge {
  source: string;
  target: string;
}

/** Mirrors backend/app/models/analysis.py::DependencyGraph */
export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

/** Mirrors backend/app/models/analysis.py::ProjectHealth */
export interface ProjectHealth {
  repository_size_bytes: number;
  average_folder_depth: number;
  largest_folder: string | null;
  largest_folder_size_bytes: number;
  largest_file: string | null;
  largest_file_size_bytes: number;
  lines_of_code: number;
  languages_distribution: Record<string, number>;
}

/** Mirrors backend/app/models/analysis.py::RepositorySummary */
export interface RepositorySummary {
  name: string;
  framework: string;
  frontend: string;
  backend: string;
  database: string;
  authentication: string;
  deployment: string;
  languages: string[];
  packageManagers: string[];
  entryPoints: string[];
  configurationFiles: string[];
  importantFolders: string[];
  importantFiles: string[];
  estimatedArchitecture: string;
  analysisTimestamp: string;
}

export interface ImportantFolder {
  category: string;
  path: string;
}

/** Mirrors backend/app/models/analysis.py::RepositoryAnalysis */
export interface RepositoryAnalysis {
  repository_id: string;
  summary: RepositorySummary;
  health: ProjectHealth;
  dependency_graph: DependencyGraph;
  detected_frameworks: string[];
  detected_databases: string[];
  detected_auth_methods: string[];
  detected_cloud_targets: string[];
  important_folders: ImportantFolder[];
  generated_at: string;
}

export interface AnalysisResponse {
  status: string;
  analysis: RepositoryAnalysis;
}

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}
