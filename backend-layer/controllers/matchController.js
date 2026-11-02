const {
  createJobRubric,
  scoreResume,
  retrieveResumeEvidence
} = require("../services/aiResumeService");

const {
  getResumeStorage
} = require("./resumeController");


// POST /analyze
async function analyzeResume(req, res) {

  try {

    const {
      resume_id,
      job_description
    } = req.body;


    // -----------------------------------------
    // Validate resume ID
    // -----------------------------------------

    if (!resume_id) {
      return res.status(400).json({
        success: false,
        message: "resume_id is required."
      });
    }


    // -----------------------------------------
    // Validate job description
    // -----------------------------------------

    if (
      !job_description ||
      !job_description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Job description is required."
      });
    }


    // -----------------------------------------
    // Find stored resume
    // -----------------------------------------

    const resumes = getResumeStorage();

    const resume = resumes[resume_id];


    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found."
      });
    }


    // -----------------------------------------
    // Get extracted resume profile
    // -----------------------------------------

    const profile = resume.profile;


    // -----------------------------------------
    // Create JD rubric
    // -----------------------------------------

    console.log(
      "Creating job description rubric..."
    );

    const rubricResponse =
      await createJobRubric(
        job_description
      );

    const rubric =
      rubricResponse.rubric;


    // -----------------------------------------
    // Score resume
    // -----------------------------------------

    console.log(
      "Scoring resume against rubric..."
    );

    const scoreResponse =
      await scoreResume(
        profile,
        rubric
      );


    const result =
      scoreResponse.result;


    // -----------------------------------------
    // Return final result
    // -----------------------------------------

    return res.json({

      success: true,

      resume_id,

      filename: resume.filename,

      profile,

      result

    });


  } catch (error) {

    console.error(
      "Resume analysis error:",
      error.response?.data ||
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        error.response?.data?.detail ||
        error.message ||
        "Resume analysis failed."

    });

  }

}


module.exports = {
  analyzeResume
};