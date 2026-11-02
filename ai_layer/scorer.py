import os

from .schemas import (
    ResumeProfile,
    JobRubric,
    MatchResult,
    MatchItem,
    Evidence,
    Gap,
)


class DeterministicScorer:
    """
    Scores a resume against a job-description rubric without RAG.

    Uses:
    - SkillEmbedder for semantic similarity.
    - Rubric weights for deterministic scoring.
    - Resume content for evidence and gap analysis.
    """

    def __init__(self, embedder):
        self.embedder = embedder

        self.threshold = float(
            os.getenv("SIMILARITY_THRESHOLD", "0.55")
        )

        if not 0.0 <= self.threshold <= 1.0:
            raise ValueError(
                "SIMILARITY_THRESHOLD must be between 0 and 1."
            )

    # ========================================================
    # EXTRACT RESUME EVIDENCE
    # ========================================================

    @staticmethod
    def extract_evidence(resume: ResumeProfile) -> list[str]:
        """
        Collect relevant text from the structured resume.

        Handles optional fields without assuming every field
        is populated.
        """

        sentences = []

        # Skills
        for skill in resume.skills or []:
            if isinstance(skill, str):
                sentences.append(skill)

            else:
                name = getattr(skill, "name", None)
                category = getattr(skill, "category", None)

                if name:
                    if category:
                        sentences.append(
                            f"Skill: {name}. Category: {category}."
                        )
                    else:
                        sentences.append(
                            f"Skill: {name}."
                        )

        # Professional experience
        for experience in resume.experience or []:
            role = getattr(experience, "role", None)
            company = getattr(experience, "company", None)
            description = getattr(
                experience, "description", None
            )

            parts = []

            if role:
                parts.append(f"Role: {role}")

            if company:
                parts.append(f"Company: {company}")

            if description:
                parts.append(
                    f"Responsibilities: {description}"
                )

            if parts:
                sentences.append(". ".join(parts) + ".")

        # Projects
        for project in resume.projects or []:
            name = getattr(project, "name", None)
            description = getattr(
                project, "description", None
            )
            technologies = getattr(
                project, "technologies", None
            )

            parts = []

            if name:
                parts.append(f"Project: {name}")

            if description:
                parts.append(
                    f"Description: {description}"
                )

            if technologies:
                if isinstance(technologies, list):
                    technology_text = ", ".join(
                        str(technology)
                        for technology in technologies
                    )
                else:
                    technology_text = str(technologies)

                parts.append(
                    f"Technologies: {technology_text}"
                )

            if parts:
                sentences.append(". ".join(parts) + ".")

        # Education
        for education in resume.education or []:
            degree = getattr(education, "degree", None)
            institution = getattr(
                education, "institution", None
            )

            parts = []

            if degree:
                parts.append(f"Degree: {degree}")

            if institution:
                parts.append(
                    f"Institution: {institution}"
                )

            if parts:
                sentences.append(". ".join(parts) + ".")

        # Certifications
        for certification in resume.certifications or []:
            name = getattr(certification, "name", None)
            issuer = getattr(certification, "issuer", None)

            parts = []

            if name:
                parts.append(
                    f"Certification: {name}"
                )

            if issuer:
                parts.append(
                    f"Issuer: {issuer}"
                )

            if parts:
                sentences.append(". ".join(parts) + ".")

        # Existing evidence sentences, if defined in the schema
        existing_evidence = getattr(
            resume,
            "evidence_sentences",
            None
        )

        if existing_evidence:
            sentences.extend(
                sentence
                for sentence in existing_evidence
                if isinstance(sentence, str)
                and sentence.strip()
            )

        # Remove empty strings and duplicates while preserving order
        unique_sentences = []
        seen = set()

        for sentence in sentences:
            sentence = sentence.strip()

            if sentence and sentence not in seen:
                unique_sentences.append(sentence)
                seen.add(sentence)

        return unique_sentences

    # ========================================================
    # SCORE RESUME
    # ========================================================

    def score(
        self,
        resume: ResumeProfile,
        rubric: JobRubric
    ) -> MatchResult:

        if not rubric.items:
            raise ValueError(
                "Cannot score a resume against an empty rubric."
            )

        resume_evidence = self.extract_evidence(resume)

        total_score = 0.0
        total_weight = sum(
            float(item.weight)
            for item in rubric.items
        )

        matched_items = []
        evidence_results = []
        gaps = []
        suggestions = []

        if total_weight <= 0:
            raise ValueError(
                "The total rubric weight must be greater than zero."
            )

        # ----------------------------------------------------
        # EVALUATE EACH JOB REQUIREMENT
        # ----------------------------------------------------

        for item in rubric.items:

            requirement = item.name
            requirement_description = (
                getattr(item, "description", None)
                or requirement
            )

            best_evidence = None
            similarity = 0.0

            # Find the best matching resume evidence.
            if resume_evidence:

                best_evidence, similarity = (
                    self.embedder.best_match(
                        requirement_description,
                        resume_evidence
                    )
                )

            matched = similarity >= self.threshold

            # ------------------------------------------------
            # MATCHED REQUIREMENT
            # ------------------------------------------------

            if matched:

                points = float(item.weight)
                total_score += points

                matched_items.append(
                    MatchItem(
                        requirement=requirement,
                        matched=True,
                        score=round(points, 2),
                        evidence=best_evidence
                    )
                )

                evidence_results.append(
                    Evidence(
                        requirement=requirement,
                        sentence=best_evidence,
                        source="resume",
                        relevance=round(similarity, 3)
                    )
                )

            # ------------------------------------------------
            # REQUIREMENT NOT DEMONSTRATED
            # ------------------------------------------------

            else:

                matched_items.append(
                    MatchItem(
                        requirement=requirement,
                        matched=False,
                        score=0.0,
                        gap=(
                            "The resume does not provide "
                            "sufficiently similar evidence "
                            "for this requirement."
                        )
                    )
                )

                gaps.append(
                    Gap(
                        requirement=requirement,
                        description=(
                            f"The resume does not clearly "
                            f"demonstrate {requirement}. "
                            "If you have this experience, "
                            "add a relevant example. Otherwise, "
                            "consider developing this skill."
                        ),
                        severity=(
                            "high"
                            if item.required
                            else "medium"
                        )
                    )
                )

                # User-friendly, actionable recommendation
                if item.required:
                    priority = "high"
                else:
                    priority = "medium"

                suggestions.append(
                    f"{priority.title()} priority — "
                    f"{requirement}: Review the job requirement "
                    f"and add truthful evidence of relevant "
                    f"skills, projects, or experience if available. "
                    f"If you do not yet have this skill, consider "
                    f"practising it through a relevant project."
                )

                evidence_results.append(
                    Evidence(
                        requirement=requirement,
                        sentence=None,
                        source="resume",
                        relevance=round(similarity, 3)
                    )
                )

        # ----------------------------------------------------
        # CALCULATE MATCH PERCENTAGE
        # ----------------------------------------------------

        percentage = (
            (total_score / total_weight) * 100
        )

        percentage = max(
            0.0,
            min(100.0, percentage)
        )

        # ----------------------------------------------------
        # BUILD FINAL RESULT
        # ----------------------------------------------------

        return MatchResult(
            total_score=round(percentage, 2),
            matched_items=matched_items,
            evidence=evidence_results,
            gaps=gaps,
            suggestions=suggestions
        )