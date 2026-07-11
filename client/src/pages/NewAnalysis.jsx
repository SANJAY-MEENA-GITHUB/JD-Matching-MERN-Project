import Navbar from "../components/Navbar";
import UploadForm from "../components/UploadForm";
import "./Home.css"; // Reuse existing Home styles for upload workspace

/**
 * NewAnalysis Component
 * Holds the central file-upload mapping workspace.
 */
const NewAnalysis = () => {
  return (
    <>
      <Navbar />

      <div className="container animate-fade-in">
        
        {/* Header Banner */}
        <header className="hero-banner">
          <h1>Match Your Skills to the Market</h1>
          <p>
            Upload your resume and targets to identify matching skills, fill crucial gaps, and instantly align your profile with industry expectations.
          </p>
        </header>

        {/* Stats/Metrics Grid */}
        <div className="dashboard-stats">
          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper p-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">AI Match Precision</span>
              <span className="stat-value">99.2%</span>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper p-violet">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Security Protocol</span>
              <span className="stat-value">Encrypted</span>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper p-emerald">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Analysis Speed</span>
              <span className="stat-value">&lt; 3s</span>
            </div>
          </div>
        </div>

        {/* Main Workspace Area */}
        <main className="dashboard-main glass-card">
          <div className="section-header">
            <h2>Start Profile Analysis</h2>
            <p>Provide your details below to initiate AI mapping</p>
          </div>

          <UploadForm />
        </main>
      </div>
    </>
  );
};

export default NewAnalysis;
