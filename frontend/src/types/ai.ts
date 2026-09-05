// Mirrors backend/app/ai/models/responses.py — every field name matches exactly.

export interface ProjectOverviewResponse {
  purpose: string;
  tech_stack_summary: string;
  high_level_workflow: string;
  important_technologies: string[];
}

export interface ArchitectureResponse {
  overall_architecture: string;
  frontend_backend_interaction: string;
  data_flow: string;
  authentication_flow: string;
  database_flow: string;
  mermaid_diagram: string;
}

export interface FolderExplanationResponse {
  folder_path: string;
  purpose: string;
  responsibilities: string[];
  important_files: string[];
  connections: string;
}

export interface FileExplanationResponse {
  file_path: string;
  purpose: string;
  classes: string[];
  functions: string[];
  dependencies: string[];
  imports: string[];
  possible_improvements: string[];
}

export interface ApiEndpointDoc {
  method: string;
  endpoint: string;
  purpose: string;
  request: string;
  response: string;
  errors: string[];
  authentication: string;
}

export interface ApiDocumentationResponse {
  endpoints: ApiEndpointDoc[];
}

export interface InterviewQuestion {
  question: string;
  ideal_answer: string;
  common_mistakes: string[];
  follow_up_questions: string[];
}

export interface InterviewQuestionsResponse {
  hr_questions: InterviewQuestion[];
  technical_questions: InterviewQuestion[];
  system_design_questions: InterviewQuestion[];
}

export interface ImprovementSuggestion {
  category: string;
  suggestion: string;
  rationale: string;
  priority: string;
}

export interface ImprovementSuggestionsResponse {
  suggestions: ImprovementSuggestion[];
}

export interface ReadmeResponse {
  markdown: string;
  sections: string[];
}

export type AgentResponseData =
  | ProjectOverviewResponse
  | ArchitectureResponse
  | FolderExplanationResponse
  | FileExplanationResponse
  | ApiDocumentationResponse
  | InterviewQuestionsResponse
  | ImprovementSuggestionsResponse
  | ReadmeResponse;

/** Mirrors the SSE event contract yielded by AIOrchestrator._stream (see app/api/ai.py). */
export type AgentStreamEvent<T = AgentResponseData> =
  | { type: "chunk"; text: string }
  | { type: "cached"; data: T }
  | { type: "done"; data: T; from_cache: boolean }
  | { type: "error"; message: string };

export const EXPLAIN_MODES = [
  "Explain Like I'm New",
  "Explain Like an Intern",
  "Explain Like an Interviewer",
  "Explain Like a Senior Engineer",
  "30 Second Summary",
] as const;

export type ExplainMode = (typeof EXPLAIN_MODES)[number];
