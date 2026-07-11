// import React, { useEffect } from "react";
import React, { useEffect, useState } from "react";
// import axios from "axios";
import api from "../api/axios";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMessage } from "../utils/apiErrorHandler";
import Navbar from "../components/Navbar";
import useAnalysisStore from "../store/analysisStore";
import Loading from "../components/LoadingPage";

const TechnicalQuestions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    result,
    technicalQuestions,
    setTechnicalQuestions
  } = useAnalysisStore();

  const fetchQuestions = async () => {
    if (loading) return;
    if (!result?._id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.post(
        "/technicalQues",
        {
          analysisId: result._id
        }
      );

      setTechnicalQuestions(res.data);
    }
    catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // No automatic fetching in useEffect anymore.
  }, [result, technicalQuestions]);

  // no result
  if (!result) {
    return (
      <>
        <Navbar />
        <div className="empty-state">
          <h2>No Resume Analysis Found</h2>
          <p>Please analyze your resume first.</p>
        </div>
      </>
    );
  }

  // error
  if (error) {
    return (
      <>
        <Navbar />
        <ErrorMessage
          title="Failed to Load Technical Questions"
          message={error}
          onRetry={fetchQuestions}
        />
      </>
    );
  }

  // Loading page
  if (loading) {
    return (
      <>
        <Navbar />
        <Loading
          title="💻 Generating Technical Questions"
          message="AI is creating interview questions based on your skill gaps."
        />
      </>
    );
  }

  // Not generated yet
  if (!technicalQuestions) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ display: "flex", justifyContent: "center", padding: "4rem 2rem" }}>
          <div className="glass-card" style={{ padding: "3rem 2rem", maxWidth: "600px", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem" }}>Technical Questions</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
              Technical interview questions for your profile have not been generated yet. Click below to generate 10 tailored easy, medium, and hard interview questions focusing on your skill gaps.
            </p>
            <button onClick={fetchQuestions} className="btn-primary">
              Generate Technical Questions
            </button>
          </div>
        </div>
      </>
    );
  }

  // empty technical Ques
  if (!technicalQuestions.questions?.length) {
    return (
      <>
        <Navbar />
        <div className="container">
          <h2>No Questions Found</h2>
          <p>AI couldn't generate technical interview questions.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">

        <h1>Technical Interview Questions</h1>

        {technicalQuestions.questions?.map((q, index) => (

          <div
            key={index}
            className="glass-card"
            style={{
              padding: "20px",
              marginBottom: "20px"
            }}
          >

            <h3>
              {index + 1}. {q.question}
            </h3>

            <p>
              <strong>Topic:</strong> {q.topic}
            </p>

            <p>
              <strong>Difficulty:</strong> {q.difficulty}
            </p>

            <p>
              <strong>Answer:</strong>
            </p>

            <p>
              {q.answer}
            </p>

          </div>

        ))}

      </div>
    </>
  );
};

export default TechnicalQuestions;