from collections import defaultdict
from typing import Dict, Optional, Tuple

from app.models import ProjectHealth
from app.services.intelligence.language_detector import LanguageDetectionResult
from app.services.intelligence.repository_scanner import ScanResult
from app.utils.language_map import LANGUAGE_BY_EXTENSION

_LOC_MAX_FILE_BYTES = 2_000_000  # skip counting lines in unusually large source files


class ProjectHealthService:
    """
    Computes deterministic, quantitative repository health metrics: total
    size, average folder depth, the largest folder/file, total lines of
    code, and language distribution (reused from LanguageDetector).
    """

    @classmethod
    def compute(cls, scan: ScanResult, language_result: LanguageDetectionResult) -> ProjectHealth:
        repository_size_bytes = sum(f.size_bytes for f in scan.files)

        average_folder_depth = cls._average_folder_depth(scan)
        largest_folder, largest_folder_size = cls._largest_folder(scan)
        largest_file, largest_file_size = cls._largest_file(scan)
        lines_of_code = cls._count_lines_of_code(scan)

        return ProjectHealth(
            repository_size_bytes=repository_size_bytes,
            average_folder_depth=average_folder_depth,
            largest_folder=largest_folder,
            largest_folder_size_bytes=largest_folder_size,
            largest_file=largest_file,
            largest_file_size_bytes=largest_file_size,
            lines_of_code=lines_of_code,
            languages_distribution=language_result.distribution,
        )

    @staticmethod
    def _average_folder_depth(scan: ScanResult) -> float:
        if not scan.folders:
            return 0.0
        depths = [len(folder.split("/")) for folder in scan.folders]
        return round(sum(depths) / len(depths), 2)

    @staticmethod
    def _largest_folder(scan: ScanResult) -> Tuple[Optional[str], int]:
        if not scan.folders:
            return None, 0

        sizes: Dict[str, int] = defaultdict(int)
        for file in scan.files:
            for folder in scan.folders:
                if file.relative_path.startswith(folder + "/"):
                    sizes[folder] += file.size_bytes

        if not sizes:
            return None, 0

        largest = max(sizes.items(), key=lambda item: item[1])
        return largest

    @staticmethod
    def _largest_file(scan: ScanResult) -> Tuple[Optional[str], int]:
        if not scan.files:
            return None, 0
        largest = max(scan.files, key=lambda f: f.size_bytes)
        return largest.relative_path, largest.size_bytes

    @staticmethod
    def _count_lines_of_code(scan: ScanResult) -> int:
        total = 0
        for file in scan.files:
            if file.extension not in LANGUAGE_BY_EXTENSION:
                continue
            if file.size_bytes > _LOC_MAX_FILE_BYTES:
                continue
            content = scan.read_text(file.relative_path)
            if content:
                total += content.count("\n") + 1
        return total


project_health_service = ProjectHealthService()
