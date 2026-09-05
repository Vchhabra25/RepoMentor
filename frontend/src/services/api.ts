import type { AnalysisResponse, Repository, RepositoryListResponse, RepositoryResponse } from "@/types";
import type {
  AgentStreamEvent,
  ApiDocumentationResponse,
  ArchitectureResponse,
  FileExplanationResponse,
  FolderExplanationResponse,
  ImprovementSuggestionsResponse,
  InterviewQuestionsResponse,
  ProjectOverviewResponse,
  ReadmeResponse,
} from "@/types/ai";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

interface PlaceholderResponse {
  status: string;
  [key: string]: unknown;
}

/** Thrown for any non-2xx response; carries the backend's `detail` message when present. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body?.detail === "string") return body.detail;
  } catch {
    // response wasn't JSON — fall through to the generic message
  }
  return fallback;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      `Request to ${path} failed with status ${response.status}`
    );
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

/**
 * Uploads a file via XMLHttpRequest (rather than fetch) so real byte-level
 * upload progress is available through `onProgress`. Resolves with the
 * parsed JSON response, or throws ApiError with the backend's `detail`
 * message on failure.
 */
function uploadWithProgress<T>(
  path: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}${path}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let body: unknown = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON response — handled below via status check
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body as T);
      } else {
        const detail =
          body && typeof body === "object" && "detail" in body
            ? String((body as { detail: unknown }).detail)
            : `Upload failed with status ${xhr.status}`;
        reject(new ApiError(detail, xhr.status));
      }
    };

    xhr.onerror = () => reject(new ApiError("Network error during upload.", 0));

    xhr.send(formData);
  });
}

/**
 * API surface for RepoMentor AI. Ingestion endpoints (upload, github,
 * repository, repositories) call the real backend. `analyzeProject` still
 * maps to a placeholder route — no AI analysis is implemented yet.
 */
export const api = {
  health: () => request<PlaceholderResponse>("/api/health"),

  /** Uploads a .zip for ingestion, reporting real upload progress. */
  uploadRepository: (file: File, onProgress?: (percent: number) => void) =>
    uploadWithProgress<RepositoryResponse>("/api/upload", file, onProgress),

  /** Ingests a public GitHub repository by URL. */
  ingestGithubRepository: (repoUrl: string) =>
    request<RepositoryResponse>("/api/github", {
      method: "POST",
      body: JSON.stringify({ repo_url: repoUrl }),
    }),

  /** Fetches a single ingested repository by id. */
  getRepository: (id: string) => request<RepositoryResponse>(`/api/repository/${id}`),

  /** Lists every ingested repository, most recent first. */
  listRepositories: () => request<RepositoryListResponse>("/api/repositories"),

  /**
   * Runs the deterministic Repository Intelligence Engine (languages,
   * frameworks, dependencies, entry points, config, project health).
   * No AI involved — this is the structured, rule-based analysis layer.
   */
  analyzeRepository: (id: string) =>
    request<AnalysisResponse>(`/api/repository/${id}/analyze`, { method: "POST" }),

  /** Fetches a previously generated Repository Intelligence analysis. */
  getRepositoryAnalysis: (id: string) => request<AnalysisResponse>(`/api/repository/${id}/analysis`),

  analyzeProject: (projectId: string) =>
    request<PlaceholderResponse>("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    }),
};

/**
 * Reads a Server-Sent Events stream from a POST endpoint (fetch's
 * ReadableStream, not EventSource — EventSource can't send a POST body).
 * Yields one parsed AgentStreamEvent per `data: {...}\n\n` frame, exactly
 * matching AIOrchestrator._stream's contract on the backend.
 */
async function* streamAgent<T>(path: string, body: unknown, signal?: AbortSignal): AsyncGenerator<AgentStreamEvent<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok || !response.body) {
    const message = await parseErrorMessage(response, `AI request to ${path} failed with status ${response.status}`);
    throw new ApiError(message, response.status);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const line = frame.trim();
      if (!line.startsWith("data:")) continue;
      const jsonText = line.slice(5).trim();
      if (!jsonText) continue;
      yield JSON.parse(jsonText) as AgentStreamEvent<T>;
    }
  }
}

/**
 * One function per AI Orchestrator agent, each returning an async
 * generator of AgentStreamEvent. Endpoints, request shapes, and the event
 * contract all come from the (frozen) backend AI layer — this is purely a
 * typed client for it.
 */
export const aiApi = {
  overview: (repositoryId: string, signal?: AbortSignal) =>
    streamAgent<ProjectOverviewResponse>(`/api/repository/${repositoryId}/ai/overview`, undefined, signal),

  architecture: (repositoryId: string, signal?: AbortSignal) =>
    streamAgent<ArchitectureResponse>(`/api/repository/${repositoryId}/ai/architecture`, undefined, signal),

  folderExplanation: (repositoryId: string, folderPath: string, signal?: AbortSignal) =>
    streamAgent<FolderExplanationResponse>(
      `/api/repository/${repositoryId}/ai/folder-explanation`,
      { folder_path: folderPath },
      signal
    ),

  fileExplanation: (repositoryId: string, filePath: string, signal?: AbortSignal) =>
    streamAgent<FileExplanationResponse>(
      `/api/repository/${repositoryId}/ai/file-explanation`,
      { file_path: filePath },
      signal
    ),

  apiDocumentation: (repositoryId: string, signal?: AbortSignal) =>
    streamAgent<ApiDocumentationResponse>(`/api/repository/${repositoryId}/ai/api-documentation`, undefined, signal),

  interviewQuestions: (repositoryId: string, signal?: AbortSignal) =>
    streamAgent<InterviewQuestionsResponse>(`/api/repository/${repositoryId}/ai/interview-questions`, undefined, signal),

  improvementSuggestions: (repositoryId: string, signal?: AbortSignal) =>
    streamAgent<ImprovementSuggestionsResponse>(
      `/api/repository/${repositoryId}/ai/improvement-suggestions`,
      undefined,
      signal
    ),

  readme: (repositoryId: string, signal?: AbortSignal) =>
    streamAgent<ReadmeResponse>(`/api/repository/${repositoryId}/ai/readme`, undefined, signal),
};

export type { Repository };
