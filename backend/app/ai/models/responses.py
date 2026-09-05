from typing import List

from pydantic import BaseModel, Field


class ProjectOverviewResponse(BaseModel):
    purpose: str
    tech_stack_summary: str
    high_level_workflow: str
    important_technologies: List[str] = Field(default_factory=list)


class ArchitectureResponse(BaseModel):
    overall_architecture: str
    frontend_backend_interaction: str
    data_flow: str
    authentication_flow: str
    database_flow: str
    mermaid_diagram: str


class FolderExplanationResponse(BaseModel):
    folder_path: str
    purpose: str
    responsibilities: List[str] = Field(default_factory=list)
    important_files: List[str] = Field(default_factory=list)
    connections: str


class FileExplanationResponse(BaseModel):
    file_path: str
    purpose: str
    classes: List[str] = Field(default_factory=list)
    functions: List[str] = Field(default_factory=list)
    dependencies: List[str] = Field(default_factory=list)
    imports: List[str] = Field(default_factory=list)
    possible_improvements: List[str] = Field(default_factory=list)


class ApiEndpointDoc(BaseModel):
    method: str
    endpoint: str
    purpose: str
    request: str
    response: str
    errors: List[str] = Field(default_factory=list)
    authentication: str


class ApiDocumentationResponse(BaseModel):
    endpoints: List[ApiEndpointDoc] = Field(default_factory=list)


class InterviewQuestion(BaseModel):
    question: str
    ideal_answer: str
    common_mistakes: List[str] = Field(default_factory=list)
    follow_up_questions: List[str] = Field(default_factory=list)


class InterviewQuestionsResponse(BaseModel):
    hr_questions: List[InterviewQuestion] = Field(default_factory=list)
    technical_questions: List[InterviewQuestion] = Field(default_factory=list)
    system_design_questions: List[InterviewQuestion] = Field(default_factory=list)


class ImprovementSuggestion(BaseModel):
    category: str  # "Code organization" | "Performance" | "Security" | "Naming" | "Refactoring" | "Scalability"
    suggestion: str
    rationale: str
    priority: str = "Medium"  # "Low" | "Medium" | "High"


class ImprovementSuggestionsResponse(BaseModel):
    suggestions: List[ImprovementSuggestion] = Field(default_factory=list)


class ReadmeResponse(BaseModel):
    markdown: str
    sections: List[str] = Field(default_factory=list)


# Union alias used only for typing the orchestrator's generic cache/run plumbing.
AgentResponseModel = (
    ProjectOverviewResponse
    | ArchitectureResponse
    | FolderExplanationResponse
    | FileExplanationResponse
    | ApiDocumentationResponse
    | InterviewQuestionsResponse
    | ImprovementSuggestionsResponse
    | ReadmeResponse
)
