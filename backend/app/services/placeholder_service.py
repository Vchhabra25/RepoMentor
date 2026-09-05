from app.schemas import PlaceholderResponse


class PlaceholderService:
    """
    Stand-in for the future ingestion/analysis services (repo parsing, AST
    walking, embeddings, etc.). Routers call into this layer instead of
    building responses inline, so swapping in real logic later only means
    editing these methods — not the API layer or the frontend contract.
    """

    @staticmethod
    def handle_upload(filename: str) -> PlaceholderResponse:
        return PlaceholderResponse(
            status="Not implemented yet",
            detail="Repository upload received. Parsing and indexing are not yet implemented.",
            data={"filename": filename},
        )

    @staticmethod
    def handle_github(repo_url: str) -> PlaceholderResponse:
        return PlaceholderResponse(
            status="Not implemented yet",
            detail="GitHub repository ingestion is not yet implemented.",
            data={"repo_url": repo_url},
        )

    @staticmethod
    def handle_analyze(project_id: str) -> PlaceholderResponse:
        return PlaceholderResponse(
            status="Not implemented yet",
            detail="Repository analysis is not yet implemented.",
            data={"project_id": project_id},
        )


placeholder_service = PlaceholderService()
