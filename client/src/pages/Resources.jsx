import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import useAnalysisStore from "../store/analysisStore";
import Loading from "../components/LoadingPage";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMessage } from "../utils/apiErrorHandler";

const Resources = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        result,
        resources,
        setResources,
    } = useAnalysisStore();


    const fetchResources = async () => {
        if (loading) return;
        if (!result?._id) return;

        setLoading(true);
        setError(null);

        try {
            const res = await api.post(
                "/resources",
                {
                    analysisId: result._id
                },
                {
                    withCredentials: true,
                    timeout: 60000
                }
            );

            setResources(res.data);
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
        // No automatic fetching here anymore.
    }, [result, resources]);

    // -------------------
    // No Result
    // -------------------
    if (!result) {
        return (
            <>
                <Navbar />
                <div className="empty-state">
                    <h2>No Resume Analysis Found</h2>
                    <p>
                        Please analyze a resume before viewing learning resources.
                    </p>
                </div>
            </>
        );
    }

    // if error occurred
    if (error) {
        return (
            <>
                <Navbar />
                <ErrorMessage
                    title="Failed to Load Resources"
                    message={error}
                    onRetry={fetchResources}
                />
            </>
        );
    }

    // -------------------
    // Loading
    // -------------------
    if (loading) {
        return (
            <>
                <Navbar />
                <Loading
                    title="📚 Finding Learning Resources"
                    message="AI is analyzing your missing skills and collecting the best resources."
                />
            </>
        );
    }

    // -------------------
    // Not Generated Yet / Empty Resources
    // -------------------
    if (!resources) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ display: "flex", justifyContent: "center", padding: "4rem 2rem" }}>
                    <div className="glass-card" style={{ padding: "3rem 2rem", maxWidth: "600px", textAlign: "center" }}>
                        <h2 style={{ marginBottom: "1rem" }}>Learning Resources</h2>
                        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
                            Learning resources for your missing skills have not been generated yet. Click below to find custom curated YouTube videos and articles/documentation.
                        </p>
                        <button onClick={fetchResources} className="btn-primary">
                            Generate Learning Resources
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (!resources?.resources?.length) {
        return (
            <>
                <Navbar />

                <div className="container">
                    <h2>No Resources Found</h2>
                    <p>
                        No curated learning resources were found for your missing skills.
                    </p>
                </div>
            </>
        );
    }

    // CourseCard component for displaying details of a curated course
    const CourseCard = ({ course }) => (
        <div className="course-card">
            <div className="course-card-top">
                <div className="course-platform-badge">{course.platform}</div>
                {course.duration && <div className="course-duration">⏱️ {course.duration}</div>}
            </div>
            <h4 className="course-title">{course.title}</h4>
            {course.description && <p className="course-desc">{course.description}</p>}
            <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary course-btn"
            >
                Go to Course
            </a>
        </div>
    );

    // Actual page -> Main UI
    return (
        <>
            <Navbar />

            <div className="container animate-fade-in">
                {/* Embed style overrides for hover states, shadows and colors */}
                <style>{`
                    .skill-section {
                        margin-bottom: 3rem;
                        padding: 2rem;
                        border-radius: var(--radius-lg);
                        background: var(--bg-card);
                        border: 1px solid var(--border-color);
                        box-shadow: var(--shadow-md);
                        transition: border-color var(--transition-normal);
                    }
                    .skill-section:hover {
                        border-color: var(--border-color-active);
                    }
                    .skill-name-heading {
                        font-size: 1.8rem;
                        font-weight: 800;
                        margin-bottom: 1.8rem;
                        background: linear-gradient(135deg, #ffffff 40%, var(--primary) 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        border-bottom: 1px solid var(--border-color);
                        padding-bottom: 0.8rem;
                    }
                    .levels-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 2rem;
                        align-items: start;
                    }
                    .level-column {
                        display: flex;
                        flex-direction: column;
                        gap: 1.2rem;
                    }
                    .level-heading {
                        font-size: 1.05rem;
                        font-weight: 700;
                        margin-bottom: 0.5rem;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .dot-indicator {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                    }
                    .course-card {
                        background: rgba(255, 255, 255, 0.02);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius-md);
                        padding: 1.2rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        min-height: 180px;
                        transition: transform var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
                    }
                    .course-card:hover {
                        transform: translateY(-2px);
                        background: rgba(255, 255, 255, 0.04);
                        border-color: var(--primary);
                        box-shadow: 0 4px 14px var(--primary-glow);
                    }
                    .course-card-top {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 0.8rem;
                    }
                    .course-platform-badge {
                        font-size: 0.75rem;
                        font-weight: 600;
                        color: var(--text-muted);
                        background: rgba(255, 255, 255, 0.05);
                        padding: 2px 8px;
                        border-radius: 4px;
                        border: 1px solid var(--border-color);
                    }
                    .course-duration {
                        font-size: 0.75rem;
                        color: var(--text-muted);
                    }
                    .course-title {
                        font-size: 1rem;
                        font-weight: 700;
                        color: var(--text-main);
                        margin-bottom: 0.5rem;
                        line-height: 1.4;
                    }
                    .course-desc {
                        font-size: 0.85rem;
                        color: var(--text-muted);
                        line-height: 1.5;
                        margin-bottom: 1.2rem;
                    }
                    .course-btn {
                        padding: 0.5rem 1rem;
                        font-size: 0.85rem;
                        border-radius: var(--radius-sm);
                        text-align: center;
                        text-decoration: none;
                        width: 100%;
                    }
                `}</style>

                <h1 style={{ marginBottom: "2rem" }}>Learning Resources</h1>

                {resources.resources?.map((item, index) => (
                    <div key={index} className="skill-section">
                        <h2 className="skill-name-heading">{item.skill}</h2>

                        <div className="levels-grid">
                            {/* Beginner level courses */}
                            {item.levels?.beginner?.length > 0 && (
                                <div className="level-column">
                                    <h3 className="level-heading" style={{ color: "var(--success)" }}>
                                        <span className="dot-indicator" style={{ backgroundColor: "var(--success)" }}></span>
                                        Beginner
                                    </h3>
                                    {item.levels.beginner.map((course, idx) => (
                                        <CourseCard key={idx} course={course} />
                                    ))}
                                </div>
                            )}

                            {/* Intermediate level courses */}
                            {item.levels?.intermediate?.length > 0 && (
                                <div className="level-column">
                                    <h3 className="level-heading" style={{ color: "var(--warning)" }}>
                                        <span className="dot-indicator" style={{ backgroundColor: "var(--warning)" }}></span>
                                        Intermediate
                                    </h3>
                                    {item.levels.intermediate.map((course, idx) => (
                                        <CourseCard key={idx} course={course} />
                                    ))}
                                </div>
                            )}

                            {/* Advanced level courses */}
                            {item.levels?.advanced?.length > 0 && (
                                <div className="level-column">
                                    <h3 className="level-heading" style={{ color: "var(--danger)" }}>
                                        <span className="dot-indicator" style={{ backgroundColor: "var(--danger)" }}></span>
                                        Advanced
                                    </h3>
                                    {item.levels.advanced.map((course, idx) => (
                                        <CourseCard key={idx} course={course} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Resources;




// import React, { useEffect } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import useAnalysisStore from "../store/analysisStore";


// const Resources = () => {
//     // console.log("Resources component rendered");

//     const {
//         result,
//         resources,
//         setResources
//     } = useAnalysisStore();

//     console.log("Result:", result);

//     useEffect(() => {

//         const fetchResources = async () => {
//             //debug
//             // if (!result) {
//             //     console.log("No analysis result found");
//             //     return;
//             // }

//             if (resources) return;

//             try {
//                 // console.log("Calling resources API...");
//                 const res = await axios.post(
//                     "http://localhost:5000/api/resources",
//                     {
//                         missingSkills:
//                             result.missingSkills
//                     }
//                 );

//                 setResources(res.data);

//             } catch (err) {
//                 console.log(err);
//             }
//         };

//         fetchResources();

//     }, []);

//     if (!resources)
//         return <h2>Loading...</h2>;

//     return (
//         <>
//             <Navbar />

//             <div className="container">

//                 <h1>Learning Resources</h1>

//                 {resources.resources?.map(
//                     (item, index) => (
//                         <div key={index}>

//                             <h2>{item.skill}</h2>

//                             <h3>YouTube</h3>

//                             <ul>
//                                 {item.youtube?.map(
//                                     (video, i) => (
//                                         <li key={i}>
//                                             <a
//                                                 href={video.url}
//                                                 target="_blank"
//                                                 rel="noreferrer"
//                                             >
//                                                 {video.title}
//                                             </a>
//                                         </li>
//                                     )
//                                 )}
//                             </ul>

//                             <h3>Articles</h3>

//                             <ul>
//                                 {item.articles?.map(
//                                     (article, i) => (
//                                         <li key={i}>
//                                             <a
//                                                 href={article.url}
//                                                 target="_blank"
//                                                 rel="noreferrer"
//                                             >
//                                                 {article.title}
//                                             </a>
//                                         </li>
//                                     )
//                                 )}
//                             </ul>

//                         </div>
//                     )
//                 )}

//             </div>
//         </>
//     );
// };

// export default Resources;