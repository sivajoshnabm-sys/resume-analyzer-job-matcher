interface JobDescriptionProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
}

function JobDescription({
  jobDescription,
  setJobDescription,
}: JobDescriptionProps) {
  return (
    <div className="job-description">

      <h2>Job Description</h2>

      <p>
        Paste the job description for the role
        you want to analyze.
      </p>

      <textarea
        value={jobDescription}
        onChange={(event) =>
          setJobDescription(event.target.value)
        }
        placeholder="Paste the job description here..."
        rows={12}
      />

    </div>
  );
}

export default JobDescription;