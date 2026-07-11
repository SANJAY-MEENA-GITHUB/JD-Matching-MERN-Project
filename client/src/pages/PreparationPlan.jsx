// import React, { useEffect } from "react";
import React, { useEffect, useState } from "react";
// import axios from "axios";
import api from "../api/axios";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMessage } from "../utils/apiErrorHandler";
import Navbar from "../components/Navbar";
import useAnalysisStore from "../store/analysisStore";
import Loading from "../components/LoadingPage";

const PreparationPlan = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {
        result,
        preparationPlan,
        setPreparationPlan,
    } = useAnalysisStore();

    const fetchPreparationPlan = async () => {
        if (loading) return;
        if (!result?._id) return;

        setLoading(true);
        setError(null);

        try {
            const res = await api.post(
                "/preparation-plan",
                {
                    analysisId: result._id
                }
            );

            setPreparationPlan(res.data);
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
        // No automatic fetching here anymore. Just let the user click the "Generate" button if it's null.
    }, [result, preparationPlan]);

    if (!result) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <h2>No analysis found.</h2>
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
                    title="Failed to Load Preparation Plan"
                    message={error}
                    onRetry={fetchPreparationPlan}
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
                    title="🚀 Building Preparation Plan"
                    message="AI is creating your personalized interview preparation roadmap."
                />
            </>
        );
    }

    // empty/not generated yet preparation plan
    if (!preparationPlan) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ display: "flex", justifyContent: "center", padding: "4rem 2rem" }}>
                    <div className="glass-card" style={{ padding: "3rem 2rem", maxWidth: "600px", textAlign: "center" }}>
                        <h2 style={{ marginBottom: "1rem" }}>Preparation Plan</h2>
                        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
                            Your personalized 7-day preparation plan has not been generated yet. Click below to use AI to analyze your skill gaps and create a daily study schedule.
                        </p>
                        <button onClick={fetchPreparationPlan} className="btn-primary">
                            Generate Preparation Plan
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // If it is generated but empty
    if (!preparationPlan.preparationPlan?.length) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <h2>No Preparation Plan Found</h2>
                    <p>AI couldn't generate a preparation plan.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container animate-fade-in">
                <h1>Preparation Plan</h1>

                <h2>Skill Gap Analysis</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {preparationPlan.skillGaps?.map((gap, index) => (
                        <div
                            key={index}
                            className="glass-card"
                            style={{
                                padding: "16px",
                                borderLeft: `4px solid ${gap.severity === "high" ? "var(--danger)" : gap.severity === "medium" ? "var(--warning)" : "var(--success)"}`
                            }}
                        >
                            <h3 style={{ textTransform: "capitalize" }}>{gap.skill}</h3>
                            <p style={{ margin: "8px 0" }}>
                                <strong>Severity:</strong> <span style={{ textTransform: "capitalize" }}>{gap.severity}</span>
                            </p>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{gap.reason}</p>
                        </div>
                    ))}
                </div>

                <h2>7-Day Roadmap</h2>
                {preparationPlan.preparationPlan?.map((day) => (
                    <div
                        key={day.day}
                        className="glass-card"
                        style={{
                            padding: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        <h3>Day {day.day}</h3>
                        <p style={{ margin: "8px 0 12px" }}>
                            <strong>Focus:</strong> {day.focus}
                        </p>
                        <ul style={{ paddingLeft: "20px" }}>
                            {day.tasks.map((task, i) => (
                                <li key={i} style={{ marginBottom: "6px" }}>{task}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PreparationPlan;