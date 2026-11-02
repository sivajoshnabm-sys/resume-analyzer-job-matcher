from typing import Optional

from pydantic import BaseModel, Field, ConfigDict, field_validator


# ============================================================
# EDUCATION
# ============================================================

class Education(BaseModel):
    degree: str
    institution: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


# ============================================================
# CERTIFICATION
# ============================================================

class Certification(BaseModel):
    name: str
    issuer: Optional[str] = None
    date: Optional[str] = None


# ============================================================
# PROJECT
# ============================================================

class Project(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: list[str] = Field(default_factory=list)


# ============================================================
# SKILL
# ============================================================

class Skill(BaseModel):
    name: str
    category: Optional[str] = None


# ============================================================
# WORK EXPERIENCE
# ============================================================

class WorkExperience(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None


# ============================================================
# RESUME PROFILE
# ============================================================

class ResumeProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None

    # Retained for compatibility with existing resume extraction.
    # This field stores resume evidence, not a RAG index.
    evidence_sentences: list[str] = Field(default_factory=list)

    skills: list[Skill] = Field(default_factory=list)
    roles: list[str] = Field(default_factory=list)
    experience: list[WorkExperience] = Field(default_factory=list)
    education: list[Education] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)


# ============================================================
# RESUME EXTRACTION REQUEST
# ============================================================

class ResumeExtractionRequest(BaseModel):
    resume_text: str = Field(
        min_length=1,
        description="Extracted text from the candidate's resume."
    )

    @field_validator("resume_text")
    @classmethod
    def validate_resume_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Resume text cannot be empty.")

        return value


# ============================================================
# JOB DESCRIPTION REQUEST
# ============================================================

class JobDescriptionRequest(BaseModel):
    job_description: str = Field(
        min_length=1,
        description="Job description to analyze."
    )

    @field_validator("job_description")
    @classmethod
    def validate_job_description(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Job description cannot be empty.")

        return value


# ============================================================
# JOB RUBRIC ITEM
# ============================================================

class RubricItem(BaseModel):
    name: str = Field(min_length=1)
    description: Optional[str] = None
    weight: float = Field(gt=0, le=100)
    required: bool = False

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Requirement name cannot be empty.")

        return value


# ============================================================
# JOB RUBRIC
# ============================================================

class JobRubric(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    items: list[RubricItem] = Field(default_factory=list)


# ============================================================
# EVIDENCE
# ============================================================

class Evidence(BaseModel):
    requirement: Optional[str] = None
    sentence: Optional[str] = None
    source: Optional[str] = None
    relevance: Optional[float] = Field(default=None, ge=-1, le=1)


# ============================================================
# GAP
# ============================================================

class Gap(BaseModel):
    requirement: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None


# ============================================================
# MATCH ITEM
# ============================================================

class MatchItem(BaseModel):
    requirement: str
    matched: bool = False
    score: float = Field(default=0.0, ge=0, le=100)
    evidence: Optional[str] = None
    gap: Optional[str] = None


# ============================================================
# MATCH RESULT
# ============================================================

class MatchResult(BaseModel):
    total_score: float = Field(default=0.0, ge=0, le=100)

    matched_items: list[MatchItem] = Field(
        default_factory=list
    )

    evidence: list[Evidence] = Field(
        default_factory=list
    )

    gaps: list[Gap] = Field(
        default_factory=list
    )

    suggestions: list[str] = Field(
        default_factory=list
    )


# ============================================================
# SCORE REQUEST
# ============================================================

class ScoreRequest(BaseModel):
    profile: ResumeProfile
    rubric: JobRubric


# ============================================================
# HEALTH RESPONSE
# ============================================================

class HealthResponse(BaseModel):
    status: str
    service: str
    claude_model: str
    embedding_model: str
    port: int
