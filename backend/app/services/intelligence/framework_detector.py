from dataclasses import dataclass, field
from typing import List, Optional, Set

from app.services.intelligence.repository_scanner import ScanResult

# dependency name (lowercase) -> framework label
FRAMEWORK_BY_DEPENDENCY = {
    "react": "React",
    "next": "Next.js",
    "@angular/core": "Angular",
    "vue": "Vue",
    "express": "Express",
    "@nestjs/core": "NestJS",
    "fastapi": "FastAPI",
    "flask": "Flask",
    "django": "Django",
    "laravel/framework": "Laravel",
}

# filename present anywhere in the repo -> framework label (used when a
# framework doesn't show up as a plain dependency, e.g. Spring Boot/ASP.NET)
FRAMEWORK_BY_CONFIG_FILE = {
    "angular.json": "Angular",
    "next.config.js": "Next.js",
    "next.config.mjs": "Next.js",
    "next.config.ts": "Next.js",
    "vue.config.js": "Vue",
    "manage.py": "Django",
    "artisan": "Laravel",
}

# substrings searched for inside pom.xml / build.gradle content
FRAMEWORK_BY_BUILD_FILE_CONTENT = {
    "spring-boot": "Spring Boot",
}

FRONTEND_FRAMEWORKS = {"React", "Next.js", "Angular", "Vue"}
# Preference order when multiple frontend frameworks are detected together
# (e.g. Next.js apps always also depend on "react" — the more specific
# framework should win as the summary's primary label).
FRONTEND_PRIORITY = ["Next.js", "Angular", "Vue", "React"]

BACKEND_FRAMEWORKS = {
    "Express",
    "NestJS",
    "FastAPI",
    "Flask",
    "Django",
    "Spring Boot",
    "Laravel",
    "ASP.NET",
    "Ruby on Rails",
}
BACKEND_PRIORITY = ["NestJS", "Django", "Spring Boot", "Laravel", "ASP.NET", "Ruby on Rails", "FastAPI", "Flask", "Express"]


@dataclass
class FrameworkDetectionResult:
    frameworks: List[str] = field(default_factory=list)
    frontend_framework: Optional[str] = None
    backend_framework: Optional[str] = None


class FrameworkDetector:
    """
    Detects web frameworks from parsed dependency names plus a handful of
    characteristic config files, then classifies the result into a primary
    frontend and/or backend framework for the repository summary.
    """

    @staticmethod
    def detect(scan: ScanResult, dependency_names: Set[str]) -> FrameworkDetectionResult:
        frameworks: List[str] = []

        for dependency_name, label in FRAMEWORK_BY_DEPENDENCY.items():
            if dependency_name in dependency_names and label not in frameworks:
                frameworks.append(label)

        names_present = {file.name for file in scan.files}
        for filename, label in FRAMEWORK_BY_CONFIG_FILE.items():
            if filename in names_present and label not in frameworks:
                frameworks.append(label)

        # ASP.NET: any .csproj referencing Microsoft.AspNetCore
        for file in scan.files:
            if file.extension == ".csproj" and "Microsoft.AspNetCore" in scan.read_text(file.relative_path):
                if "ASP.NET" not in frameworks:
                    frameworks.append("ASP.NET")

        # Ruby on Rails: config/routes.rb is a strong, unambiguous signal
        if any(f.relative_path.endswith("config/routes.rb") for f in scan.files):
            if "Ruby on Rails" not in frameworks:
                frameworks.append("Ruby on Rails")

        # Spring Boot: search build manifests for the tell-tale artifact name
        for filename in ("pom.xml", "build.gradle", "build.gradle.kts"):
            for file in scan.file_by_name(filename):
                content = scan.read_text(file.relative_path).lower()
                for needle, label in FRAMEWORK_BY_BUILD_FILE_CONTENT.items():
                    if needle in content and label not in frameworks:
                        frameworks.append(label)

        frontend = next((f for f in FRONTEND_PRIORITY if f in frameworks), None)
        backend = next((f for f in BACKEND_PRIORITY if f in frameworks), None)

        return FrameworkDetectionResult(frameworks=frameworks, frontend_framework=frontend, backend_framework=backend)


framework_detector = FrameworkDetector()
