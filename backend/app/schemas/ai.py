from pydantic import BaseModel, Field


class FolderExplanationRequest(BaseModel):
    folder_path: str = Field(..., description="Repository-relative folder path, e.g. 'src/components'")


class FileExplanationRequest(BaseModel):
    file_path: str = Field(..., description="Repository-relative file path, e.g. 'src/App.tsx'")
