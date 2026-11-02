import type { ResumeData } from "../types";

interface ResumeSummaryProps {
  resumeSummary: ResumeData;
}

function ResumeSummary({
  resumeSummary,
}: ResumeSummaryProps) {
  return (
    <div className="resume-summary">

      <h2>Resume Summary</h2>

      {/* Personal Information */}
      <div className="summary-personal">

        {resumeSummary.name && (
          <div className="summary-item">
            <strong>Name</strong>
            <span>{resumeSummary.name}</span>
          </div>
        )}

        {resumeSummary.email && (
          <div className="summary-item">
            <strong>Email</strong>
            <span>{resumeSummary.email}</span>
          </div>
        )}

        {resumeSummary.phone && (
          <div className="summary-item">
            <strong>Phone</strong>
            <span>{resumeSummary.phone}</span>
          </div>
        )}

      </div>

      {/* Professional Summary */}
      {resumeSummary.summary && (
        <div className="summary-section">

          <h3>Professional Summary</h3>

          <p>
            {resumeSummary.summary}
          </p>

        </div>
      )}

      {/* Skills */}
      {resumeSummary.skills.length > 0 && (
        <div className="summary-section">

          <h3>Skills</h3>

          <div className="tag-container">

            {resumeSummary.skills.map(
              (skill, index) => (
                <span
                  className="skill-tag"
                  key={`${skill.name}-${index}`}
                >
                  {skill.name}
                </span>
              )
            )}

          </div>

        </div>
      )}

      {/* Roles */}
      {resumeSummary.roles.length > 0 && (
        <div className="summary-section">

          <h3>Roles</h3>

          <ul>
            {resumeSummary.roles.map(
              (role, index) => (
                <li key={`${role}-${index}`}>
                  {role}
                </li>
              )
            )}
          </ul>

        </div>
      )}

      {/* Experience */}
      {resumeSummary.experience.length > 0 && (
        <div className="summary-section">

          <h3>Experience</h3>

          {resumeSummary.experience.map(
            (experience, index) => (
              <div
                className="experience-item"
                key={index}
              >

                {experience.role && (
                  <h4>
                    {experience.role}
                  </h4>
                )}

                {experience.company && (
                  <p>
                    <strong>
                      {experience.company}
                    </strong>
                  </p>
                )}

                {(experience.start_date ||
                  experience.end_date) && (
                  <p>
                    {experience.start_date ?? ""}
                    {" - "}
                    {experience.end_date ?? "Present"}
                  </p>
                )}

                {experience.description && (
                  <p>
                    {experience.description}
                  </p>
                )}

              </div>
            )
          )}

        </div>
      )}

      {/* Education */}
      {resumeSummary.education.length > 0 && (
        <div className="summary-section">

          <h3>Education</h3>

          {resumeSummary.education.map(
            (education, index) => (
              <div
                className="education-item"
                key={index}
              >

                <h4>
                  {education.degree}
                </h4>

                {education.institution && (
                  <p>
                    {education.institution}
                  </p>
                )}

                {(education.start_date ||
                  education.end_date) && (
                  <p>
                    {education.start_date ?? ""}
                    {" - "}
                    {education.end_date ?? ""}
                  </p>
                )}

              </div>
            )
          )}

        </div>
      )}

      {/* Certifications */}
      {resumeSummary.certifications.length > 0 && (
        <div className="summary-section">

          <h3>Certifications</h3>

          <ul>
            {resumeSummary.certifications.map(
              (certification, index) => (
                <li
                  key={`${certification.name}-${index}`}
                >
                  <strong>
                    {certification.name}
                  </strong>

                  {certification.issuer && (
                    <>
                      {" - "}
                      {certification.issuer}
                    </>
                  )}

                  {certification.date && (
                    <>
                      {" ("}
                      {certification.date}
                      {")"}
                    </>
                  )}
                </li>
              )
            )}
          </ul>

        </div>
      )}

      {/* Projects */}
      {resumeSummary.projects.length > 0 && (
        <div className="summary-section">

          <h3>Projects</h3>

          {resumeSummary.projects.map(
            (project, index) => (
              <div
                className="project-item"
                key={`${project.name}-${index}`}
              >

                <h4>
                  {project.name}
                </h4>

                {project.description && (
                  <p>
                    {project.description}
                  </p>
                )}

                {project.technologies.length > 0 && (
                  <div className="tag-container">

                    {project.technologies.map(
                      (technology, techIndex) => (
                        <span
                          className="skill-tag"
                          key={`${technology}-${techIndex}`}
                        >
                          {technology}
                        </span>
                      )
                    )}

                  </div>
                )}

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default ResumeSummary;