import io
import zipfile
from typing import Dict


def make_zip_bytes(files: Dict[str, str], compression: int = zipfile.ZIP_DEFLATED) -> bytes:
    """Builds an in-memory ZIP archive from {relative_path: content}."""
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", compression=compression) as archive:
        for path, content in files.items():
            archive.writestr(path, content)
    return buffer.getvalue()


SAMPLE_FULLSTACK_FILES = {
    "frontend/package.json": '{"name":"app","dependencies":{"react":"^18.3.1","next":"^14.2.0"}}',
    "frontend/next.config.js": "module.exports = {};",
    "frontend/src/App.tsx": "export default function App() { return null; }",
    "frontend/src/components/Button.tsx": "export function Button() { return null; }",
    "backend/requirements.txt": "fastapi==0.115.0\npsycopg2-binary==2.9.9\npyjwt==2.9.0\n",
    "backend/app/main.py": "print('entry')",
    "backend/app/routes/users.py": "def get_users(): pass",
    "Dockerfile": "FROM python:3.12",
    ".env.example": "DATABASE_URL=",
    "node_modules/some-pkg/index.js": "// should be ignored",
    ".git/HEAD": "ref: refs/heads/main",
    "logo.png": "not a real image but has an ignored extension",
}
