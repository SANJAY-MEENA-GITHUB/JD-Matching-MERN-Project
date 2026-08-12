import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import useAnalysisStore from "../store/analysisStore";
import Loading from "../components/LoadingPage";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMessage } from "../utils/apiErrorHandler";
import "./Dashboard.css";

const Dashboard = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { setResult } = useAnalysisStore();
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/analysis");
      setAnalyses(res.data);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent navigating to analysis-result
    if (!window.confirm("Are you sure you want to delete this analysis?")) return;

    try {
      await api.delete(`/analysis/${id}`);
      setAnalyses((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete analysis: " + getErrorMessage(err));
    }
  };

  const handleCardClick = (analysis) => {
    // Save to global store (which will automatically populate sub-sections)
    setResult(analysis);
    navigate("/analysis-result");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading
          title="📂 Loading Dashboard"
          message="Retrieving your previous resume analyses..."
        />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <ErrorMessage
          title="Failed to Load Dashboard"
          message={error}
          onRetry={fetchHistory}
        />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container animate-fade-in">
        {/* Dashboard Header */}
        <header className="dashboard-header-section">
          <div>
            <h1>Your Career Dashboard</h1>
            <p className="subtitle">
              Manage your job applications, view past analyses, and access tailored interview preparations.
            </p>
          </div>
          <button
            onClick={() => navigate("/new-analysis")}
            className="btn-primary btn-new-match"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "18px", height: "18px" }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Analyze New Resume
          </button>
        </header>

        {analyses.length === 0 ? (
          /* Empty State */
          <div className="dashboard-empty-state glass-card">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
            <h2>No Analyses Yet</h2>
            <p>Upload your first resume and target job description to map your skills and start preparing.</p>
            <button
              onClick={() => navigate("/new-analysis")}
              className="btn-primary"
              style={{ marginTop: "1.5rem" }}
            >
              Analyze Resume Now
            </button>
          </div>
        ) : (
          /* History Cards List */
          <div className="history-grid">
            {analyses.map((analysis) => {
              const score = analysis.matchPercentage || 0;
              let scoreClass = "score-low";
              if (score >= 80) scoreClass = "score-high";
              else if (score >= 50) scoreClass = "score-medium";

              return (
                <div
                  key={analysis._id}
                  className="history-card glass-card"
                  onClick={() => handleCardClick(analysis)}
                >
                  {/* Card Main Info */}
                  <div className="history-card-header">
                    <div>
                      <h3 className="job-role">{analysis.jobRole || "Software Engineer"}</h3>
                      <p className="card-date">{formatDate(analysis.createdAt || analysis.updatedAt)}</p>
                    </div>
                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                      <div className={`score-badge ${scoreClass}`}>
                        {score}% Match
                      </div>
                      <button
                        className="btn-delete"
                        onClick={(e) => handleDelete(e, analysis._id)}
                        title="Delete Analysis"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="divider" style={{ margin: "1rem 0" }}></div>

                  {/* Status Checklist */}
                  <div className="status-checklist">
                    <h4 className="checklist-title">Generation Status</h4>
                    <div className="checklist-items">
                      {/* Analysis Status: always generated since it's the root card */}
                      <div className="checklist-item status-completed">
                        <span className="status-icon">✔</span>
                        <span className="status-label">Analysis Result</span>
                      </div>

                      {/* Preparation Plan */}
                      <div className={`checklist-item ${analysis.preparationPlan ? "status-completed" : "status-pending"}`}>
                        <span className="status-icon">{analysis.preparationPlan ? "✔" : "✖"}</span>
                        <span className="status-label">Preparation Plan</span>
                      </div>

                      {/* Learning Resources */}
                      <div className={`checklist-item ${analysis.resources ? "status-completed" : "status-pending"}`}>
                        <span className="status-icon">{analysis.resources ? "✔" : "✖"}</span>
                        <span className="status-label">Learning Resources</span>
                      </div>

                      {/* Technical Questions */}
                      <div className={`checklist-item ${analysis.technicalQuestions ? "status-completed" : "status-pending"}`}>
                        <span className="status-icon">{analysis.technicalQuestions ? "✔" : "✖"}</span>
                        <span className="status-label">Technical Questions</span>
                      </div>

                      {/* Behavioral Questions */}
                      <div className={`checklist-item ${analysis.behavioralQuestions ? "status-completed" : "status-pending"}`}>
                        <span className="status-icon">{analysis.behavioralQuestions ? "✔" : "✖"}</span>
                        <span className="status-label">Behavioral Questions</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <span>View Full Report</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="arrow-icon">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
