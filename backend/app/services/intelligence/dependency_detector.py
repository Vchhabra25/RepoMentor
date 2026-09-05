import json
import re
from dataclasses import dataclass, field
from typing import List

from app.models import DependencyEdge, DependencyGraph, DependencyNode
from app.services.intelligence.repository_scanner import ScanResult

# package-manager signal -> (manifest/lockfile name, package manager label)
PACKAGE_MANAGER_FILES = {
    "pnpm-lock.yaml": "pnpm",
    "yarn.lock": "yarn",
    "package-lock.json": "npm",
    "poetry.lock": "poetry",
    "requirements.txt": "pip",
    "pom.xml": "maven",
    "build.gradle": "gradle",
    "build.gradle.kts": "gradle",
    "Cargo.toml": "cargo",
}

DATABASE_SIGNATURES = {
    "mongoose": "MongoDB",
    "mongodb": "MongoDB",
    "pymongo": "MongoDB",
    "pg": "PostgreSQL",
    "psycopg2": "PostgreSQL",
    "psycopg2-binary": "PostgreSQL",
    "asyncpg": "PostgreSQL",
    "mysql": "MySQL",
    "mysql2": "MySQL",
    "pymysql": "MySQL",
    "mysqlclient": "MySQL",
    "redis": "Redis",
    "ioredis": "Redis",
    "supabase": "Supabase",
    "@supabase/supabase-js": "Supabase",
    "firebase-admin": "Firebase",
    "firebase": "Firebase",
}

AUTH_SIGNATURES = {
    "jsonwebtoken": "JWT",
    "pyjwt": "JWT",
    "passport": "Passport",
    "passport-jwt": "Passport",
    "next-auth": "NextAuth",
    "@clerk/nextjs": "Clerk",
    "clerk": "Clerk",
    "@supabase/auth-helpers-nextjs": "Supabase Auth",
    "authlib": "OAuth",
    "oauthlib": "OAuth",
    "django-allauth": "OAuth",
    "firebase-admin": "Firebase Auth",
}

CLOUD_CONFIG_SIGNATURES = {
    "Dockerfile": "Docker",
    "docker-compose.yml": "Docker",
    "docker-compose.yaml": "Docker",
    "vercel.json": "Vercel",
    "netlify.toml": "Netlify",
    "firebase.json": "Firebase",
    "azure-pipelines.yml": "Azure",
    "app.yaml": "GCP",
    "serverless.yml": "AWS",
}


@dataclass
class DependencyDetectionResult:
    graph: DependencyGraph = field(default_factory=DependencyGraph)
    package_managers: List[str] = field(default_factory=list)
    databases: List[str] = field(default_factory=list)
    auth_methods: List[str] = field(default_factory=list)
    cloud_targets: List[str] = field(default_factory=list)


class DependencyDetector:
    """
    Parses every recognized manifest file (package.json, requirements.txt,
    pyproject.toml, pom.xml, build.gradle, Gemfile, composer.json,
    Cargo.toml, *.csproj) into a structured dependency graph, and derives
    package managers, databases, and auth providers from the dependency
    names it finds — plus cloud/deployment targets from known config files.
    """

    def detect(self, scan: ScanResult, repository_name: str) -> DependencyDetectionResult:
        nodes: List[DependencyNode] = []

        nodes += self._parse_package_json(scan)
        nodes += self._parse_requirements_txt(scan)
        nodes += self._parse_pyproject_toml(scan)
        nodes += self._parse_pom_xml(scan)
        nodes += self._parse_gradle(scan)
        nodes += self._parse_gemfile(scan)
        nodes += self._parse_composer_json(scan)
        nodes += self._parse_cargo_toml(scan)
        nodes += self._parse_csproj(scan)

        edges = [DependencyEdge(source=repository_name, target=node.name) for node in nodes]
        graph = DependencyGraph(nodes=nodes, edges=edges)

        dependency_names = {node.name.lower() for node in nodes}

        return DependencyDetectionResult(
            graph=graph,
            package_managers=self._detect_package_managers(scan),
            databases=self._match_signatures(dependency_names, DATABASE_SIGNATURES),
            auth_methods=self._match_signatures(dependency_names, AUTH_SIGNATURES),
            cloud_targets=self._detect_cloud_targets(scan),
        )

    # -- manifest parsers -----------------------------------------------------

    @staticmethod
    def _parse_package_json(scan: ScanResult) -> List[DependencyNode]:
        nodes: List[DependencyNode] = []
        for file in scan.file_by_name("package.json"):
            try:
                data = json.loads(scan.read_text(file.relative_path))
            except (json.JSONDecodeError, ValueError):
                continue
            for section in ("dependencies", "devDependencies"):
                for name, version in (data.get(section) or {}).items():
                    nodes.append(
                        DependencyNode(
                            name=name, version=str(version), ecosystem="npm", source_file=file.relative_path
                        )
                    )
        return nodes

    @staticmethod
    def _parse_requirements_txt(scan: ScanResult) -> List[DependencyNode]:
        nodes: List[DependencyNode] = []
        splitter = re.compile(r"[=<>~!\[;]")
        for file in scan.file_by_name("requirements.txt"):
            for line in scan.read_text(file.relative_path).splitlines():
                line = line.strip()
                if not line or line.startswith("#") or line.startswith("-"):
                    continue
                name = splitter.split(line, 1)[0].strip()
                if name:
                    nodes.append(DependencyNode(name=name, ecosystem="pip", source_file=file.relative_path))
        return nodes

    @staticmethod
    def _parse_pyproject_toml(scan: ScanResult) -> List[DependencyNode]:
        nodes: List[DependencyNode] = []
        for file in scan.file_by_name("pyproject.toml"):
            content = scan.read_text(file.relative_path)
            try:
                import tomllib

                data = tomllib.loads(content)
            except Exception:
                continue

            poetry_deps = (
                data.get("tool", {}).get("poetry", {}).get("dependencies", {})
                if isinstance(data.get("tool"), dict)
                else {}
            )
            for name, version in poetry_deps.items():
                if name.lower() == "python":
                    continue
                nodes.append(
                    DependencyNode(
                        name=name, version=str(version), ecosystem="pip", source_file=file.relative_path
                    )
                )

            pep621_deps = data.get("project", {}).get("dependencies", [])
            for entry in pep621_deps:
                name = re.split(r"[=<>~!\[; ]", entry, 1)[0].strip()
                if name:
                    nodes.append(DependencyNode(name=name, ecosystem="pip", source_file=file.relative_path))
        return nodes

    @staticmethod
    def _parse_pom_xml(scan: ScanResult) -> List[DependencyNode]:
        nodes: List[DependencyNode] = []
        for file in scan.file_by_name("pom.xml"):
            content = scan.read_text(file.relative_path)
            for match in re.finditer(
                r"<dependency>\s*<groupId>(.*?)</groupId>\s*<artifactId>(.*?)</artifactId>"
                r"(?:\s*<version>(.*?)</version>)?",
                content,
                re.DOTALL,
            ):
                group_id, artifact_id, version = match.groups()
                nodes.append(
                    DependencyNode(
                        name=f"{group_id.strip()}:{artifact_id.strip()}",
                        version=version.strip() if version else None,
                        ecosystem="maven",
                        source_file=file.relative_path,
                    )
                )
        return nodes

    @staticmethod
    def _parse_gradle(scan: ScanResult) -> List[DependencyNode]:
        nodes: List[DependencyNode] = []
        for filename in ("build.gradle", "build.gradle.kts"):
            for file in scan.file_by_name(filename):
                content = scan.read_text(file.relative_path)
                for match in re.finditer(r"""['"]([\w.\-]+):([\w.\-]+):([\w.\-]+)['"]""", content):
                    group_id, artifact_id, version = match.groups()
                    nodes.append(
                        DependencyNode(
                            name=f"{group_id}:{artifact_id}",
                            version=version,
                            ecosystem="gradle",
                            source_file=file.relative_path,
                        )
                    )
        return nodes

    @staticmethod
    def _parse_gemfile(scan: ScanResult) -> List[DependencyNode]:
        nodes: List[DependencyNode] = []
        for file in scan.file_by_name("Gemfile"):
            content = scan.read_text(file.relative_path)
            for match in re.finditer(r"""gem\s+['"]([\w\-]+)['"](?:\s*,\s*['"]([^'"]+)['"])?""", content):
                name, version = match.groups()
                nodes.append(
                    DependencyNode(name=name, version=version, ecosystem="gem", source_file=file.relative_path)
                )
        return nodes

    @staticmethod
    def _parse_composer_json(scan: ScanResult) -> List[DependencyNode]:
        nodes: List[DependencyNode] = []
        for file in scan.file_by_name("composer.json"):
            try:
                data = json.loads(scan.read_text(file.relative_path))
            except (json.JSONDecodeError, ValueError):
                continue
            for section in ("require", "require-dev"):
                for name, version in (data.get(section) or {}).items():
                    if name.lower() == "php":
                        continue
                    nodes.append(
                        DependencyNode(
                            name=name, version=str(version), ecosystem="composer", source_file=file.relative_path
                        )
                    )
        return nodes

    @staticmethod
    def _parse_cargo_toml(scan: ScanResult) -> List[DependencyNode]:
        nodes: List[DependencyNode] = []
        for file in scan.file_by_name("Cargo.toml"):
            content = scan.read_text(file.relative_path)
            try:
                import tomllib

                data = tomllib.loads(content)
            except Exception:
                continue
            for name, spec in (data.get("dependencies") or {}).items():
                version = spec if isinstance(spec, str) else (spec.get("version") if isinstance(spec, dict) else None)
                nodes.append(
                    DependencyNode(name=name, version=version, ecosystem="cargo", source_file=file.relative_path)
                )
        return nodes

    @staticmethod
    def _parse_csproj(scan: ScanResult) -> List[DependencyNode]:
        nodes: List[DependencyNode] = []
        for file in scan.files:
            if file.extension != ".csproj":
                continue
            content = scan.read_text(file.relative_path)
            for match in re.finditer(
                r'<PackageReference\s+Include="([\w.\-]+)"(?:\s+Version="([\w.\-]+)")?', content
            ):
                name, version = match.groups()
                nodes.append(
                    DependencyNode(name=name, version=version, ecosystem="nuget", source_file=file.relative_path)
                )
        return nodes

    # -- derived signals --------------------------------------------------------

    @staticmethod
    def _detect_package_managers(scan: ScanResult) -> List[str]:
        found: List[str] = []
        names_present = {file.name for file in scan.files}

        for filename, manager in PACKAGE_MANAGER_FILES.items():
            if filename in names_present and manager not in found:
                found.append(manager)

        # .csproj / .sln without an explicit lockfile still implies dotnet.
        if any(f.extension in (".csproj", ".sln") for f in scan.files) and "dotnet" not in found:
            found.append("dotnet")

        # A bare package.json (no lockfile detected above) still implies npm.
        if "package.json" in names_present and not any(m in found for m in ("npm", "yarn", "pnpm")):
            found.append("npm")

        return found

    @staticmethod
    def _match_signatures(dependency_names: set, signatures: dict) -> List[str]:
        matched: List[str] = []
        for dependency_name, label in signatures.items():
            if dependency_name.lower() in dependency_names and label not in matched:
                matched.append(label)
        return matched

    @staticmethod
    def _detect_cloud_targets(scan: ScanResult) -> List[str]:
        found: List[str] = []
        names_present = {file.name for file in scan.files}
        for filename, label in CLOUD_CONFIG_SIGNATURES.items():
            if filename in names_present and label not in found:
                found.append(label)
        return found


dependency_detector = DependencyDetector()
