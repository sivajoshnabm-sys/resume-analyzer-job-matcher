import os

import numpy as np
from sentence_transformers import SentenceTransformer


class SkillEmbedder:
    """
    Generates text embeddings and compares resume skills
    with job requirements.

    This component works independently of RAG.
    """

    def __init__(self):
        model_name = os.getenv(
            "EMBEDDING_MODEL",
            "all-MiniLM-L6-v2"
        )

        self.model = SentenceTransformer(model_name)

    # ========================================================
    # GENERATE EMBEDDINGS
    # ========================================================

    def encode(self, texts: list[str]) -> np.ndarray:
        """
        Convert a list of strings into normalized embeddings.
        """

        if isinstance(texts, str):
            texts = [texts]

        if not texts:
            return np.empty((0, 0), dtype=np.float32)

        if not all(
            isinstance(text, str) and text.strip()
            for text in texts
        ):
            raise ValueError(
                "All input texts must be non-empty strings."
            )

        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True,
            convert_to_numpy=True
        )

        return np.asarray(
            embeddings,
            dtype=np.float32
        )

    # ========================================================
    # COMPARE TWO TEXTS
    # ========================================================

    def similarity(
        self,
        text1: str,
        text2: str
    ) -> float:
        """
        Calculate cosine similarity between two texts.

        Because the embeddings are normalized, their dot
        product is equivalent to cosine similarity.
        """

        if not isinstance(text1, str) or not text1.strip():
            raise ValueError("text1 must be a non-empty string.")

        if not isinstance(text2, str) or not text2.strip():
            raise ValueError("text2 must be a non-empty string.")

        embeddings = self.encode([text1, text2])

        score = np.dot(
            embeddings[0],
            embeddings[1]
        )

        return float(
            np.clip(score, -1.0, 1.0)
        )

    # ========================================================
    # FIND THE BEST MATCH
    # ========================================================

    def best_match(
        self,
        requirement: str,
        candidates: list[str]
    ) -> tuple[str | None, float]:
        """
        Find the candidate most semantically similar
        to a job requirement.

        Returns:
            (best_candidate, similarity_score)

        If candidates is empty, returns (None, 0.0).
        """

        if not isinstance(requirement, str) or not requirement.strip():
            raise ValueError(
                "requirement must be a non-empty string."
            )

        if not candidates:
            return None, 0.0

        if not all(
            isinstance(candidate, str) and candidate.strip()
            for candidate in candidates
        ):
            raise ValueError(
                "All candidates must be non-empty strings."
            )

        requirement_embedding = self.encode(
            [requirement]
        )[0]

        candidate_embeddings = self.encode(
            candidates
        )

        scores = np.dot(
            candidate_embeddings,
            requirement_embedding
        )

        best_index = int(np.argmax(scores))

        best_score = float(
            np.clip(scores[best_index], -1.0, 1.0)
        )

        return candidates[best_index], best_score
