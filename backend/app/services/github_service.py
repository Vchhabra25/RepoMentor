import asyncio
import shutil
from pathlib import Path

from app.services.validation_service import ValidationError

# `--depth 1` bounds history, not working-tree size — a repo with one huge
# commit (or a slow/hanging remote) can still tie up a worker indefinitely.
# This is a hard ceiling on how long a clone may run before it's killed.
CLONE_TIMEOUT_SECONDS = 60


class GitHubService:
    """
    Shallow-clones public GitHub repositories into a local working directory
    using an async subprocess, so cloning never blocks the event loop.
    """

    @staticmethod
    async def clone(repo_url: str, destination: Path) -> None:
        """Clones `repo_url` (depth 1) into `destination` and strips the .git directory."""
        destination.parent.mkdir(parents=True, exist_ok=True)

        process = await asyncio.create_subprocess_exec(
            "git",
            "clone",
            "--depth",
            "1",
            "--single-branch",
            repo_url,
            str(destination),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        try:
            _, stderr = await asyncio.wait_for(process.communicate(), timeout=CLONE_TIMEOUT_SECONDS)
        except asyncio.TimeoutError:
            process.kill()
            await process.wait()
            shutil.rmtree(destination, ignore_errors=True)
            raise ValidationError(
                f"Cloning timed out after {CLONE_TIMEOUT_SECONDS}s. The repository may be too large or unreachable."
            )

        if process.returncode != 0:
            shutil.rmtree(destination, ignore_errors=True)
            message = stderr.decode(errors="ignore").strip() or "unknown git error"
            raise ValidationError(f"Failed to clone repository: {message}")

        git_dir = destination / ".git"
        if git_dir.exists():
            shutil.rmtree(git_dir, ignore_errors=True)


github_service = GitHubService()
