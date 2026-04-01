import React from "react";
import useAnalysisStore from "../store/analysisStore";
import "./AnalyzeResult.css";

const AnalyzeResult = () => {
  const { result } = useAnalysisStore();

  if (!result) {
    return <div className="empty-state">No results to display.</div>;
  }

  return (
    <div className="analysis-container">

      {/* Score Card */}
      <div className="score-card">
        <h1>{result.matchPercentage}%</h1>
        <p>Overall Match Score</p>
      </div>

      {/* Skills Grid */}
      <div className="skills-grid">

        <div className="card">
          <h2>✅ Matching Skills</h2>
          <ul>
            {result.matchingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="card warning">
          <h2>❌ Missing Skills</h2>
          <ul>
            {result.missingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* Improvements */}
      <div className="card improvement-card">
        <h2>🚀 Recommended Improvements</h2>
        <ul>
          {result.improvements.map((imp, index) => (
            <li key={index}>{imp}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default AnalyzeResult;
