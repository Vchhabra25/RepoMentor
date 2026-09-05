from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class DependencyNode(BaseModel):
    """A single dependency discovered in a manifest file (package.json, requirements.txt, etc.)."""

    name: str
    version: Optional[str] = None
    ecosystem: str  # e.g. "npm", "pip", "maven", "gradle", "gem", "composer", "cargo", "nuget"
    source_file: str


class DependencyEdge(BaseModel):
    """A directed edge from the repository root to a dependency it declares."""

    source: str
    target: str


class DependencyGraph(BaseModel):
    """
    Deterministic, structured dependency graph — no visualization, just data
    future AI prompts (or a future graph UI) can consume directly.
    """

    nodes: List[DependencyNode] = Field(default_factory=list)
    edges: List[DependencyEdge] = Field(default_factory=list)


class ImportantFolder(BaseModel):
    category: str  # e.g. "frontend", "backend", "components", "hooks"...
    path: str


class ProjectHealth(BaseModel):
    """Quantitative health/shape metrics computed deterministically from the file tree."""

    repository_size_bytes: int
    average_folder_depth: float
    largest_folder: Optional[str] = None
    largest_folder_size_bytes: int = 0
    largest_file: Optional[str] = None
    largest_file_size_bytes: int = 0
    lines_of_code: int
    languages_distribution: Dict[str, float] = Field(default_factory=dict)


class RepositorySummary(BaseModel):
    """
    Matches the exact contract future AI prompts are expected to consume.
    Field names intentionally mirror the spec (camelCase) rather than the
    rest of this codebase's snake_case, since this object is the public
    "repository summary" API surface.
    """

    name: str
    framework: str = ""
    frontend: str = ""
    backend: str = ""
    database: str = ""
    authentication: str = ""
    deployment: str = ""
    languages: List[str] = Field(default_factory=list)
    packageManagers: List[str] = Field(default_factory=list)
    entryPoints: List[str] = Field(default_factory=list)
    configurationFiles: List[str] = Field(default_factory=list)
    importantFolders: List[str] = Field(default_factory=list)
    importantFiles: List[str] = Field(default_factory=list)
    estimatedArchitecture: str = ""
    analysisTimestamp: str = ""


class RepositoryAnalysis(BaseModel):
    """
    The full Repository Intelligence Engine output for one repository.
    `summary` is the compact object described in the spec; the rest is the
    richer structured data (multiple detected values, the dependency graph,
    health metrics) that dashboard cards and future AI prompts can draw on.
    """

    repository_id: str
    summary: RepositorySummary
    health: ProjectHealth
    dependency_graph: DependencyGraph
    detected_frameworks: List[str] = Field(default_factory=list)
    detected_databases: List[str] = Field(default_factory=list)
    detected_auth_methods: List[str] = Field(default_factory=list)
    detected_cloud_targets: List[str] = Field(default_factory=list)
    important_folders: List[ImportantFolder] = Field(default_factory=list)
    generated_at: datetime
