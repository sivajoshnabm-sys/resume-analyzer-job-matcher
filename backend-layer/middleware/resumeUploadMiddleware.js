const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
  __dirname,
  "..",
  "data",
  "resumeUploads"
);

// Create upload folder if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true
  });
}


// Where and how uploaded files are stored
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const filename =
      `${Date.now()}-${Math.round(Math.random() * 1000000000)}${extension}`;

    cb(null, filename);
  }
});


// Allow only PDF and DOCX
const fileFilter = function (req, file, cb) {

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    extension === ".pdf" ||
    extension === ".docx"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF and DOCX files are supported."
      )
    );
  }
};


// Multer configuration
const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024
  }

});


module.exports = upload;