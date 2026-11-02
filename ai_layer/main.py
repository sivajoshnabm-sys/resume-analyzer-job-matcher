import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Import components from the AI layer
from .claude_client import ClaudeClient
from .embedder import SkillEmbedder
from .scorer import DeterministicScorer
from .schemas import ResumeProfile, JobRubric
from .prompts import (
    RESUME_EXTRACTION_PROMPT,
    JD_RUBRIC_PROMPT,
)

# ---------------------------------------------------------
# Load environment variables
# ---------------------------------------------------------

load_dotenv()

AI_LAYER_PORT = int(
    os.getenv("AI_LAYER_PORT", "3000")
)

# ---------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------

app = FastAPI(
    title="Resume Analyzer - AI Layer",
    description=(
        "AI-powered resume extraction, "
        "semantic matching, and deterministic scoring service"
    ),
    version="1.0.0",
)

# ---------------------------------------------------------
# Initialize AI Components
# ---------------------------------------------------------

claude_client = ClaudeClient()

embedder = SkillEmbedder()

# RAG removed.
# The scorer now receives the embedding component directly.
scorer = DeterministicScorer(embedder)


# ---------------------------------------------------------
# Request Models
# ---------------------------------------------------------

class ResumeExtractionRequest(BaseModel):
    resume_text: str


class JDRequest(BaseModel):
    job_description: str


class ScoreRequest(BaseModel):
    profile: dict
    rubric: dict


# ---------------------------------------------------------
# Root Endpoint
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "service": "AI Layer",
        "status": "running",
        "port": AI_LAYER_PORT,
        "model": claude_client.model,
        "rag_enabled": False,
    }


# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "ai-layer",
        "claude_model": claude_client.model,
        "embedding_model": os.getenv(
            "EMBEDDING_MODEL",
            "all-MiniLM-L6-v2",
        ),
        "port": AI_LAYER_PORT,
        "rag_enabled": False,
    }


# ---------------------------------------------------------
# Resume Extraction
# ---------------------------------------------------------

@app.post("/ai/extract-resume")
def extract_resume(
    request: ResumeExtractionRequest,
):
    try:
        if not request.resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Resume text cannot be empty.",
            )

        profile = claude_client.extract_resume(
            request.resume_text,
            RESUME_EXTRACTION_PROMPT,
        )

        # Validate the returned profile.
        profile = ResumeProfile.model_validate(
            profile.model_dump()
            if hasattr(profile, "model_dump")
            else profile
        )

        return {
            "success": True,
            "profile": profile.model_dump(),
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume extraction failed: {str(e)}",
        ) from e


# ---------------------------------------------------------
# Job Description -> Weighted Rubric
# ---------------------------------------------------------

@app.post("/ai/create-rubric")
def create_rubric(
    request: JDRequest,
):
    try:
        if not request.job_description.strip():
            raise HTTPException(
                status_code=400,
                detail="Job description cannot be empty.",
            )

        rubric = claude_client.create_rubric(
            request.job_description,
            JD_RUBRIC_PROMPT,
        )

        # Validate the returned rubric.
        rubric = JobRubric.model_validate(
            rubric.model_dump()
            if hasattr(rubric, "model_dump")
            else rubric
        )

        return {
            "success": True,
            "rubric": rubric.model_dump(),
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Rubric generation failed: {str(e)}",
        ) from e


# ---------------------------------------------------------
# Deterministic Resume Scoring
# ---------------------------------------------------------

@app.post("/ai/score")
def score_resume(
    request: ScoreRequest,
):
    try:
        # Validate the resume profile.
        profile = ResumeProfile.model_validate(
            request.profile
        )

        # Validate the job rubric.
        rubric = JobRubric.model_validate(
            request.rubric
        )

        # Calculate the score using the scoring engine.
        result = scorer.score(
            profile,
            rubric,
        )

        return {
            "success": True,
            "result": result.model_dump()
            if hasattr(result, "model_dump")
            else result,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume scoring failed: {str(e)}",
        ) from e


# ---------------------------------------------------------
# Run AI Layer Directly
# ---------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "ai_layer.main:app",
        host="0.0.0.0",
        port=AI_LAYER_PORT,
        reload=True,
    )