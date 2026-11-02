const axios = require("axios");

const AI_LAYER_URL =
  process.env.AI_LAYER_URL || "http://127.0.0.1:3000";


// Extract structured resume information
async function extractResume(resumeText) {
  const response = await axios.post(
    `${AI_LAYER_URL}/ai/extract-resume`,
    {
      resume_text: resumeText
    },
    {
      timeout: 120000
    }
  );

  return response.data;
}


// Create weighted rubric from Job Description
async function createJobRubric(jobDescription) {
  const response = await axios.post(
    `${AI_LAYER_URL}/ai/create-rubric`,
    {
      job_description: jobDescription
    },
    {
      timeout: 120000
    }
  );

  return response.data;
}


// Score resume against Job Description rubric
async function scoreResume(profile, rubric) {
  const response = await axios.post(
    `${AI_LAYER_URL}/ai/score`,
    {
      profile,
      rubric
    },
    {
      timeout: 120000
    }
  );

  return response.data;
}


// Retrieve relevant resume evidence using RAG
async function retrieveResumeEvidence(
  query,
  evidenceSentences,
  topK = 3
) {
  const response = await axios.post(
    `${AI_LAYER_URL}/ai/rag`,
    {
      query,
      evidence_sentences: evidenceSentences,
      top_k: topK
    },
    {
      timeout: 120000
    }
  );

  return response.data;
}


module.exports = {
  extractResume,
  createJobRubric,
  scoreResume,
  retrieveResumeEvidence
};