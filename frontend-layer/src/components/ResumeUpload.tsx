interface ResumeUploadProps {
  resume: File | null;
  setResume: (file: File | null) => void;
}

function ResumeUpload({
  resume,
  setResume,
}: ResumeUploadProps) {
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    setResume(file);
  };

  return (
    <div className="upload-box">
      <h2>Upload Resume</h2>

      <p>
        Upload your resume in PDF, DOC, or DOCX format.
      </p>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      {resume && (
        <div className="selected-file">
          <p>
            Selected file:
          </p>

          <strong>
            {resume.name}
          </strong>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;