const express = require("express");

const upload = require("../middleware/resumeUploadMiddleware");

const {
  uploadResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume
} = require("../controllers/resumeController");

const router = express.Router();


// POST /resumes
// Upload and process a resume
router.post(
  "/",
  upload.single("file"),
  uploadResume
);


// GET /resumes
// Get all uploaded resumes
router.get(
  "/",
  getResumes
);


// GET /resumes/:resumeId
// Get one resume
router.get(
  "/:resumeId",
  getResume
);


// PUT /resumes/:resumeId
// Update resume
router.put(
  "/:resumeId",
  updateResume
);


// DELETE /resumes/:resumeId
// Delete resume
router.delete(
  "/:resumeId",
  deleteResume
);


module.exports = router;