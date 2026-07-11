import React, { useEffect, useState } from "react";
// import axios from "axios";
import api from "../api/axios";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMessage } from "../utils/apiErrorHandler";
import Navbar from "../components/Navbar";
import useAnalysisStore from "../store/analysisStore";
import Loading from "../components/LoadingPage";

const BehavioralQuestions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    result,
    behavioralQuestions,
    setBehavioralQuestions
  } = useAnalysisStore();

  const fetchQuestions = async () => {
    if (loading) return;
    if (!result?._id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.post(
        "/behavioralQues",
        {
          analysisId: result._id
        }
      );

      setBehavioralQuestions(res.data);
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
    // No automatic fetching in useEffect.
  }, [result, behavioralQuestions]);

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
          title="Failed to Load Behavioral Questions"
          message={error}
          onRetry={fetchQuestions}
        />
      </>
    );
  }

  // Loading Page
  if (loading) {
    return (
      <>
        <Navbar />
        <Loading
          title="🎯 Generating Behavioral Questions"
          message="AI is preparing HR and behavioral interview questions."
        />
      </>
    );
  }

  // Not generated yet
  if (!behavioralQuestions) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ display: "flex", justifyContent: "center", padding: "4rem 2rem" }}>
          <div className="glass-card" style={{ padding: "3rem 2rem", maxWidth: "600px", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem" }}>Behavioral Questions</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
              Behavioral interview questions for your profile have not been generated yet. Click below to generate 10 custom HR and situational interview questions with STAR-format answers.
            </p>
            <button onClick={fetchQuestions} className="btn-primary">
              Generate Behavioral Questions
            </button>
          </div>
        </div>
      </>
    );
  }

  // Empty Questions
  if (!behavioralQuestions.questions?.length) {
    return (
      <>
        <Navbar />
        <div className="container">
          <h2>No Questions Found</h2>
          <p>AI couldn't generate behavioral interview questions.</p>
        </div>
      </>
    );
  }


  return (
    <>
      <Navbar />

      <div className="container">

        <h1>Behavioral Interview Questions</h1>

        {behavioralQuestions.questions?.map(
          (q, index) => (

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
                <strong>
                  What Interviewer Checks:
                </strong>
              </p>

              <p>
                {q.whatInterviewerChecks}
              </p>

              <p>
                <strong>
                  Sample Answer:
                </strong>
              </p>

              <p>
                {q.sampleAnswer}
              </p>

            </div>
          )
        )}

      </div>
    </>
  );
};

export default BehavioralQuestions;