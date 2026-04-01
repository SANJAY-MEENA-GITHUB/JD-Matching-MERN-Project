import Navbar from "../components/Navbar";
import UploadForm from "../components/UploadForm";
import "./Home.css"

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="container">
        <header className="hero-banner">
          <h1>Match Your Skills to the Market</h1>
          <p>
            Upload your current resume and the target job description to see how
            well you fit and get AI-driven suggestions for improvement.
          </p>
        </header>

        <main>
          <div className="section-header">
            <h2>Start Analysis</h2>
          </div>

          <UploadForm />
        </main>
      </div>
    </>
  );
};

export default Home;
