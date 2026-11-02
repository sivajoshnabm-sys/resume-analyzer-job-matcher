import axios from "axios";

import type {
  AnalysisResponse,
} from "../types";


// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL =
  "http://127.0.0.1:5000";


const api = axios.create({

  baseURL: API_BASE_URL,

  headers: {
    Accept: "application/json",
  },

  timeout: 180000,

});


// ============================================================
// UPLOAD RESUME
// ============================================================

const uploadResume = async (
  resume: File
) => {

  const formData = new FormData();

  formData.append(
    "file",
    resume
  );

  const response =
    await api.post(
      "/resumes",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

  return response.data;
};


// ============================================================
// ANALYZE RESUME
// ============================================================

export const analyzeResume = async (
  resume: File,
  jobDescription: string
): Promise<AnalysisResponse> => {

  try {

    console.log(
      "Uploading resume..."
    );

    // --------------------------------------------------------
    // STEP 1: Upload resume
    // --------------------------------------------------------

    const uploadResponse =
      await uploadResume(resume);

    console.log(
      "Upload response:",
      uploadResponse
    );


    if (
      !uploadResponse.success ||
      !uploadResponse.resume_id
    ) {

      throw new Error(
        uploadResponse.message ||
        "Resume upload failed."
      );

    }


    const resumeId =
      uploadResponse.resume_id;


    console.log(
      "Resume ID:",
      resumeId
    );


    // --------------------------------------------------------
    // STEP 2: Analyze
    // --------------------------------------------------------

    console.log(
      "Sending resume for analysis..."
    );


    const response =
      await api.post<AnalysisResponse>(
        "/analyze",
        {
          resume_id: resumeId,

          job_description:
            jobDescription,
        }
      );


    console.log(
      "Analysis response:",
      response.data
    );


    return response.data;

  } catch (error: any) {

    console.error(
      "API ERROR:",
      error
    );


    if (error.response) {

      console.error(
        "Backend status:",
        error.response.status
      );

      console.error(
        "Backend response:",
        error.response.data
      );

      throw new Error(
        error.response.data?.message ||
        `Backend error: ${error.response.status}`
      );

    }


    if (error.request) {

      throw new Error(
        "Cannot connect to backend at " +
        `${API_BASE_URL}. ` +
        "Make sure the Node backend is running."
      );

    }


    throw new Error(
      error.message ||
      "Unexpected API error."
    );

  }

};


// ============================================================
// EXPORT API INSTANCE
// ============================================================

export default api;