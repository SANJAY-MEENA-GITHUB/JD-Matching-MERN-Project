import React from "react";
import useAnalysisStore from "../store/analysisStore";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "./AnalyzeResult.css";

const AnalyzeResult = () => {
  const { result } = useAnalysisStore();
  const navigate = useNavigate();

  if (!result) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="empty-state glass-card animate-fade-in">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2>No Results Found</h2>
            <p>You haven't run any analysis yet. Please upload your resume and job description to get started.</p>
            <button onClick={() => navigate("/")} className="btn-primary" style={{ marginTop: "1.5rem" }}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  // Circular gauge settings
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const score = result.matchPercentage || 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine feedback text & color class based on score
  let scoreClass = "low";
  let feedbackText = "Poor Fit";
  if (score >= 80) {
    scoreClass = "high";
    feedbackText = "Strong Fit";
  } else if (score >= 50) {
    scoreClass = "medium";
    feedbackText = "Moderate Fit";
  }

  return (
    <>
      <Navbar />

      <div className="container animate-fade-in">

        {/* Results Overview Grid */}
        <div className="results-overview glass-card">
          <div className="gauge-section">
            <div className={`gauge-container ${scoreClass}`}>
              <svg width="160" height="160" className="gauge-svg">
                <circle cx="80" cy="80" r={radius} className="gauge-bg" strokeWidth="10" />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="gauge-progress"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="gauge-value">
                <span className="percentage">{score}%</span>
                <span className="status-label">{feedbackText}</span>
              </div>
            </div>
          </div>

          <div className="overview-details">
            <h1 className="overview-title">Analysis Completed</h1>
            <p className="overview-desc">
              Here is how well your resume matches the job description. Review the identified skills gaps and implement the recommended improvements to increase your chances of landing an interview.
            </p>
            <button onClick={() => navigate("/")} className="btn-primary btn-back-dashboard">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Run Another Match
            </button>
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="skills-grid">

          {/* Matching Skills */}
          <div className="skills-card glass-card">
            <div className="card-header">
              <div className="card-badge bg-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3>Matching Skills</h3>
                <p>Keywords that match the requirements</p>
              </div>
            </div>

            <div className="skills-list">
              {result.matchingSkills && result.matchingSkills.length > 0 ? (
                result.matchingSkills.map((skill, index) => (
                  <span key={index} className="skill-tag matched">
                    <span className="dot"></span>
                    {skill}
                  </span>
                ))
              ) : (
                <div className="no-skills-msg">No matching skills found.</div>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="skills-card glass-card">
            <div className="card-header">
              <div className="card-badge bg-red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div>
                <h3>Missing Skills</h3>
                <p>Target keywords lacking in your resume</p>
              </div>
            </div>

            <div className="skills-list">
              {result.missingSkills && result.missingSkills.length > 0 ? (
                result.missingSkills.map((skill, index) => (
                  <span key={index} className="skill-tag missing">
                    <span className="dot"></span>
                    {skill}
                  </span>
                ))
              ) : (
                <div className="no-skills-msg success">Perfect! No missing skills.</div>
              )}
            </div>
          </div>

        </div>

        {/* Actionable Recommendations */}
        <div className="recommendations-section glass-card">
          <div className="section-header-row">
            <div className="rec-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 3.536 0V21h2v-2.7a5 5 0 0 1 3.536 0z" />
              </svg>
            </div>
            <div>
              <h2>Actionable Recommendations</h2>
              <p>Tailored AI-driven suggestions to optimize your resume content</p>
            </div>
          </div>

          <div className="improvements-timeline">
            {result.improvements && result.improvements.length > 0 ? (
              result.improvements.map((imp, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-number">{index + 1}</div>
                  <div className="timeline-content">
                    <p>{imp}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-improvements-msg">Your resume is fully optimized! No suggestions needed.</div>
            )}
          </div>
        </div>

        <div className="next-actions glass-card">

          <div className="section-header-row">
            <div>
              <h2>Career Accelerator</h2>
              <p>
                Generate personalized interview preparation content
              </p>
            </div>
          </div>

          <div className="action-grid">

            <button
              className="action-card"
              onClick={() => navigate("/resources")}
            >
              <h3>📚 Resources</h3>
              <p>
                Learning resources for missing skills
              </p>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/technicalQues")}
            >
              <h3>💻 Technical Questions</h3>
              <p>
                Practice role-specific technical interviews
              </p>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/behavioralQues")}
            >
              <h3>🤝 Behavioral Questions</h3>
              <p>
                Prepare STAR-format interview answers
              </p>
            </button>

            <button
              className="action-card"
              disabled={!result?.missingSkills?.length}
              onClick={() => navigate("/plan")}
            >
              <h3>📅 Preparation Plan</h3>
              <p>
                Personalized roadmap to close skill gaps
              </p>
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default AnalyzeResult;
