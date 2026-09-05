"""Extension → programming language, used by LanguageDetector and ProjectHealthService."""

LANGUAGE_BY_EXTENSION = {
    ".py": "Python",
    ".java": "Java",
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".mjs": "JavaScript",
    ".cjs": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".go": "Go",
    ".rs": "Rust",
    ".cs": "C#",
    ".cpp": "C++",
    ".cc": "C++",
    ".cxx": "C++",
    ".hpp": "C++",
    ".c": "C",
    ".h": "C",
    ".kt": "Kotlin",
    ".kts": "Kotlin",
    ".swift": "Swift",
    ".php": "PHP",
    ".rb": "Ruby",
    ".scala": "Scala",
    ".m": "Objective-C",
    ".dart": "Dart",
    ".sh": "Shell",
    ".sql": "SQL",
    ".html": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".vue": "Vue",
}

# Extensions counted as "source code" for lines-of-code purposes but not a
# standalone application language on their own.
MARKUP_EXTENSIONS = {".html", ".css", ".scss", ".vue"}
