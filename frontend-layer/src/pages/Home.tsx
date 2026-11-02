interface HomeProps {
  setPage: (page: "home" | "analyzer" | "results") => void;
}

function Home({ setPage }: HomeProps) {
  return (
    <main className="home-page">
      <section className="hero">
        <h1>AI Resume Matcher</h1>

        <p>
          Analyze your resume against a job description
          and understand your match score, skill gaps,
          and supporting evidence.
        </p>

        <button onClick={() => setPage("analyzer")}>
          Analyze My Resume
        </button>
      </section>
    </main>
  );
}

export default Home;