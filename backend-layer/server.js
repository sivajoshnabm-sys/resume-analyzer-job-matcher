const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

dotenv.config();

const resumeRoutes = require("./routes/resumeRoutes");
const matchRoutes = require("./routes/matchRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

const AI_LAYER_URL =
  process.env.AI_LAYER_URL || "http://127.0.0.1:3000";


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);


// ============================================================
// RESUME UPLOAD DIRECTORY
// ============================================================

const uploadDirectory = path.join(
  __dirname,
  "data",
  "resumeUploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true
  });
}


// ============================================================
// ROOT ENDPOINT
// ============================================================

app.get("/", (req, res) => {

  res.json({

    service: "Resume Analyzer Backend",

    status: "running",

    port: PORT,

    ai_layer: AI_LAYER_URL

  });

});


// ============================================================
// HEALTH ENDPOINT
// ============================================================

app.get("/health", async (req, res) => {

  try {

    const response = await axios.get(
      `${AI_LAYER_URL}/health`,
      {
        timeout: 5000
      }
    );

    res.json({

      backend: "healthy",

      ai_layer: response.data

    });

  } catch (error) {

    res.status(503).json({

      backend: "healthy",

      ai_layer: {

        status: "unavailable",

        error: error.message

      }

    });

  }

});


// ============================================================
// RESUME ROUTES
// ============================================================

// POST /resumes
// Upload and process resume

app.use(
  "/resumes",
  resumeRoutes
);


// ============================================================
// ANALYSIS ROUTES
// ============================================================

// POST /analyze
// Analyze resume against job description

app.use(
  "/analyze",
  matchRoutes
);


// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message: "Route not found."

  });

});


// ============================================================
// ERROR HANDLER
// ============================================================

app.use(
  (err, req, res, next) => {

    console.error(
      "Backend error:",
      err
    );

    res.status(
      err.status || 500
    ).json({

      success: false,

      message:
        err.message ||
        "Internal server error."

    });

  }
);


// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  () => {

    console.log(
      "--------------------------------------"
    );

    console.log(
      "Resume Analyzer Backend"
    );

    console.log(
      "--------------------------------------"
    );

    console.log(
      `Backend: http://127.0.0.1:${PORT}`
    );

    console.log(
      `AI Layer: ${AI_LAYER_URL}`
    );

    console.log(
      "--------------------------------------"
    );

  }
);