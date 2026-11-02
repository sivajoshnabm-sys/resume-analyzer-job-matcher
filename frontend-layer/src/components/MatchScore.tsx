interface MatchScoreProps {
  score: number;
}

function MatchScore({ score }: MatchScoreProps) {
  const roundedScore = Math.round(score);

  return (
    <div className="match-score">

      <h2>Resume Match Score</h2>

      <div className="score-circle">
        <span>{roundedScore}%</span>
      </div>

      <div className="score-details">

        <h3>
          {roundedScore >= 80
            ? "Strong Match"
            : roundedScore >= 60
            ? "Good Match"
            : roundedScore >= 40
            ? "Partial Match"
            : "Low Match"}
        </h3>

        <p>
          Your resume matches approximately{" "}
          <strong>{roundedScore}%</strong>{" "}
          of the job requirements.
        </p>

      </div>

    </div>
  );
}

export default MatchScore;