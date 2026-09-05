from collections import Counter
from dataclasses import dataclass, field
from typing import Dict, List

from app.services.intelligence.repository_scanner import ScanResult
from app.utils.language_map import LANGUAGE_BY_EXTENSION


@dataclass
class LanguageDetectionResult:
    languages: List[str] = field(default_factory=list)  # sorted by prevalence, most common first
    distribution: Dict[str, float] = field(default_factory=dict)  # language -> percent of source files


class LanguageDetector:
    """Detects programming languages present in a repository by file extension."""

    @staticmethod
    def detect(scan: ScanResult) -> LanguageDetectionResult:
        counts: Counter = Counter()

        for file in scan.files:
            language = LANGUAGE_BY_EXTENSION.get(file.extension)
            if language:
                counts[language] += 1

        total = sum(counts.values())
        if total == 0:
            return LanguageDetectionResult()

        distribution = {
            language: round((count / total) * 100, 1) for language, count in counts.most_common()
        }
        languages = [language for language, _ in counts.most_common()]

        return LanguageDetectionResult(languages=languages, distribution=distribution)


language_detector = LanguageDetector()
