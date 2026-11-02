const express = require("express");

const {
  analyzeResume
} = require("../controllers/matchController");

const router = express.Router();


// POST /analyze
router.post(
  "/",
  analyzeResume
);


module.exports = router;