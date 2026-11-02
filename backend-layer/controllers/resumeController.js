const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const {
  extractResumeText,
  redactPII,
  createEvidenceSentences
} = require("../services/resumeParserService");

const {
  extractResume
} = require("../services/aiResumeService");

// Temporary in-memory storage
const resumes = {};

// POST /resumes
async function uploadResume(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Resume file is required."
    });
  }

  const resumeId = randomUUID();

  try {
    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    // Extract text from PDF/DOCX
    const rawText = await extractResumeText(
      req.file.path,
      extension
    );

    if (!rawText || !rawText.trim()) {
      throw new Error("No readable text found in resume.");
    }

    // Remove basic PII before sending text to AI
    const redactedText = redactPII(rawText);

    // Send resume text to Python AI Layer
    const aiResponse = await extractResume(redactedText);

    const profile = aiResponse.profile || {};

    // Store resume evidence sentences
    profile.evidence_sentences =
      createEvidenceSentences(redactedText);

    // Store processed resume
    resumes[resumeId] = {
      id: resumeId,
      filename: req.file.originalname,
      filePath: req.file.path,
      profile,
      status: "processed"
    };

    return res.status(201).json({
      success: true,
      resume_id: resumeId,
      filename: req.file.originalname,
      profile
    });

  } catch (error) {

    // Delete uploaded file if processing fails
    if (
      req.file &&
      req.file.path &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    console.error(
      "Resume processing error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.detail ||
        error.message ||
        "Resume processing failed."
    });
  }
}


// GET /resumes
function getResumes(req, res) {
  res.json({
    success: true,
    count: Object.keys(resumes).length,
    resumes: Object.values(resumes)
  });
}


// GET /resumes/:resumeId
function getResume(req, res) {
  const resume = resumes[req.params.resumeId];

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: "Resume not found."
    });
  }

  res.json({
    success: true,
    resume
  });
}


// PUT /resumes/:resumeId
function updateResume(req, res) {
  const resume = resumes[req.params.resumeId];

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: "Resume not found."
    });
  }

  resume.status = "updated";

  res.json({
    success: true,
    message: "Resume updated successfully.",
    resume_id: req.params.resumeId,
    status: resume.status
  });
}


// DELETE /resumes/:resumeId
function deleteResume(req, res) {
  const resumeId = req.params.resumeId;
  const resume = resumes[resumeId];

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: "Resume not found."
    });
  }

  // Delete physical file
  if (
    resume.filePath &&
    fs.existsSync(resume.filePath)
  ) {
    fs.unlinkSync(resume.filePath);
  }

  // Delete from memory
  delete resumes[resumeId];

  res.json({
    success: true,
    message: "Resume deleted successfully.",
    resume_id: resumeId
  });
}


// Used by match/chat controllers
function getResumeStorage() {
  return resumes;
}


module.exports = {
  uploadResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  getResumeStorage
};