import type { Evidence as EvidenceType } from "../types";

interface EvidenceProps {
  evidence: EvidenceType[];
}

function Evidence({ evidence }: EvidenceProps) {
  return (
    <div className="evidence">

      <h2>Match Evidence</h2>

      {evidence.length === 0 ? (
        <div className="no-evidence">
          <p>
            No supporting evidence was found.
          </p>
        </div>
      ) : (
        <div className="evidence-container">

          {evidence.map((item, index) => (
            <div
              className="evidence-item"
              key={`${item.requirement}-${index}`}
            >

              {item.requirement && (
                <h3>
                  {item.requirement}
                </h3>
              )}

              {item.sentence && (
                <p className="evidence-sentence">
                  "{item.sentence}"
                </p>
              )}

              <div className="evidence-meta">

                {item.source && (
                  <span>
                    Source: {item.source}
                  </span>
                )}

                {typeof item.relevance === "number" && (
                  <span>
                    Relevance:{" "}
                    {(item.relevance * 100).toFixed(1)}%
                  </span>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Evidence;