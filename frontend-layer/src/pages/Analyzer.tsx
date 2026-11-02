import { useState } from "react";

import ResumeUpload from "../components/ResumeUpload";
import JobDescription from "../components/JobDescription";
import Loading from "../components/Loading";

import { analyzeResume } from "../services/api";

import type { MatchResult } from "../types";

interface AnalyzerProps {
  onAnalysisComplete: (
    result: MatchResult
  ) => void;
}

function Analyzer({
  onAnalysisComplete,
}: AnalyzerProps) {
  const [resume, setResume] =
    useState<File | null>(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleAnalyze = async () => {
    // Check resume
    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    // Check job description
    if (!jobDescription.trim()) {
      setError(
        "Please enter the job description."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await analyzeResume(
        resume,
        jobDescription
      );

      // Check API success
      if (!response.success) {
        setError(
          response.message ??
            "Resume analysis failed."
        );
        return;
      }

      // Check whether result exists
      if (!response.result) {
        setError(
          "No analysis result was returned."
        );
        return;
      }

      // Send result to Results page
      onAnalysisComplete(
        response.result
      );

    } catch (error) {
      console.error(
        "Analysis error:",
        error
      );

      setError(
        "Unable to connect to the backend."
      );

    } finally {
      setLoading(false);
    }
  };

  // Show loading screen
  if (loading) {
    return <Loading />;
  }

  return (
    <main className="analyzer-page">

      <div className="analyzer-container">

        <h1>
          Resume Analyzer
        </h1>

        <p className="page-description">
          Upload your resume and paste the
          job description to analyze your
          compatibility.
        </p>

        {/* Resume Upload */}

        <ResumeUpload
          resume={resume}
          setResume={setResume}
        />

        {/* Job Description */}

        <JobDescription
          jobDescription={jobDescription}
          setJobDescription={
            setJobDescription
          }
        />

        {/* Error */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Analyze Button */}

        <button
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          Analyze Resume
        </button>

      </div>

    </main>
  );
}

export default Analyzer;