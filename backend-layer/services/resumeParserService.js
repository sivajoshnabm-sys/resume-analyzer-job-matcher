const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractPDFText(filePath) {
  const buffer = fs.readFileSync(filePath);

  const result = await pdfParse(buffer);

  return result.text;
}

async function extractDOCXText(filePath) {
  const result = await mammoth.extractRawText({
    path: filePath
  });

  return result.value;
}

async function extractResumeText(filePath, extension) {
  extension = extension.toLowerCase();

  if (extension === ".pdf") {
    return await extractPDFText(filePath);
  }

  if (extension === ".docx") {
    return await extractDOCXText(filePath);
  }

  throw new Error(
    "Only PDF and DOCX files are supported."
  );
}


// Remove basic PII before sending resume text to AI
function redactPII(text) {

  // Email
  text = text.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    "[EMAIL_REDACTED]"
  );

  // Indian phone numbers
  text = text.replace(
    /(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)/g,
    "[PHONE_REDACTED]"
  );

  return text;
}


// Convert resume text into individual evidence lines
function createEvidenceSentences(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
}


module.exports = {
  extractResumeText,
  redactPII,
  createEvidenceSentences
};