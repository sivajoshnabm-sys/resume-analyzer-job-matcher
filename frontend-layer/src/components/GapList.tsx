import type { Gap } from "../types";

interface GapListProps {
  gaps: Gap[];
}

function GapList({ gaps }: GapListProps) {
  return (
    <div className="gap-list">

      <h2>Skill Gaps</h2>

      {gaps.length === 0 ? (
        <div className="no-gaps">
          <h3>No major gaps identified</h3>

          <p>
            Your resume contains relevant evidence
            for the analyzed requirements.
          </p>
        </div>
      ) : (
        <div className="gaps-container">

          {gaps.map((gap, index) => (
            <div
              className="gap-item"
              key={`${gap.requirement}-${index}`}
            >

              <div className="gap-header">

                <h3>
                  {gap.requirement ||
                    "Requirement"}
                </h3>

                {gap.severity && (
                  <span
                    className={`severity ${gap.severity.toLowerCase()}`}
                  >
                    {gap.severity}
                  </span>
                )}

              </div>

              {gap.description && (
                <p>
                  {gap.description}
                </p>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default GapList;