import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import Results from "./pages/Results";

import type { MatchResult } from "./types";

type Page =
  | "home"
  | "analyzer"
  | "results";

function App() {
  const [page, setPage] =
    useState<Page>("home");

  const [result, setResult] =
    useState<MatchResult | null>(null);

  const handleAnalysisComplete = (
    analysisResult: MatchResult
  ) => {
    setResult(analysisResult);
    setPage("results");
  };

  const handleBackToAnalyzer = () => {
    setPage("analyzer");
  };

  return (
    <div className="app">

      <Navbar
        setPage={setPage}
      />

      {page === "home" && (
        <Home
          setPage={setPage}
        />
      )}

      {page === "analyzer" && (
        <Analyzer
          onAnalysisComplete={
            handleAnalysisComplete
          }
        />
      )}

      {page === "results" && (
        <Results
          result={result}
          onBack={
            handleBackToAnalyzer
          }
        />
      )}

    </div>
  );
}

export default App;