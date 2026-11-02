import MatchScore from "../components/MatchScore";
import GapList from "../components/GapList";
import Evidence from "../components/Evidence";
import type { MatchResult } from "../types";

interface ResultsProps {
  result: MatchResult | null;
  onBack: () => void;
}

function Results({
  result,
  onBack,
}: ResultsProps) {
  if (!result) {
    return (
      <main className="results-page">

        <div className="results-container">

          <h1>No Analysis Available</h1>

          <p>
            Please analyze a resume first to view
            the matching results.
          </p>

          <button onClick={onBack}>
            Go to Analyzer
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="results-page">

      <div className="results-container">

        <div className="results-header">

          <h1>Analysis Results</h1>

          <p>
            Here's a breakdown of how your resume
            matches the job requirements.
          </p>

        </div>

        {/* Match Score */}

        <section className="results-card score-card">

          <MatchScore
            score={result.total_score}
          />

        </section>

        {/* Matched Requirements */}

        <section className="results-card">

          <h2>Requirement Analysis</h2>

          {result.matched_items.length === 0 ? (
            <p>
              No requirements were analyzed.
            </p>
          ) : (
            <div className="match-items">

              {result.matched_items.map(
                (item, index) => (
                  <div
                    className={`match-item ${
                      item.matched
                        ? "matched"
                        : "not-matched"
                    }`}
                    key={`${item.requirement}-${index}`}
                  >

                    <div className="match-item-header">

                      <h3>
                        {item.requirement}
                      </h3>

                      <span>
                        {item.matched
                          ? "Matched"
                          : "Not Matched"}
                      </span>

                    </div>

                    <p>
                      Score:{" "}
                      {item.score.toFixed(2)}
                    </p>

                    {item.evidence && (
                      <p>
                        <strong>
                          Evidence:
                        </strong>{" "}
                        {item.evidence}
                      </p>
                    )}

                    {item.gap && (
                      <p>
                        <strong>
                          Gap:
                        </strong>{" "}
                        {item.gap}
                      </p>
                    )}

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* Evidence */}

        <section className="results-card">

          <Evidence
            evidence={result.evidence}
          />

        </section>

        {/* Gaps */}

        <section className="results-card">

          <GapList
            gaps={result.gaps}
          />

        </section>

        {/* Suggestions */}

        {result.suggestions.length > 0 && (
          <section className="results-card suggestions">

            <h2>Suggestions</h2>

            <ul>

              {result.suggestions.map(
                (suggestion, index) => (
                  <li key={`${suggestion}-${index}`}>
                    {suggestion}
                  </li>
                )
              )}

            </ul>

          </section>
        )}

        {/* Back Button */}

        <div className="results-actions">

          <button
            className="secondary-button"
            onClick={onBack}
          >
            Analyze Another Resume
          </button>

        </div>

      </div>

    </main>
  );
}

export default Results;