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

    if (!resources.resources?.length) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <h2>No Resources Found</h2>
                    <p>
                        AI couldn't find learning resources for the selected skills.
                    </p>
                </div>
            </>
        );
    }

    // Actual page -> Main UI
    return (
        <>
            <Navbar />

            <div className="container animate-fade-in">
                <h1>Learning Resources</h1>

                {resources.resources?.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: "40px",
                            padding: "20px",
                            border: "1px solid #333",
                            borderRadius: "10px",
                        }}
                    >
                        <h2>{item.skill}</h2>

                        {/* YouTube */}
                        <h3>YouTube Videos</h3>

                        <ul>
                            {item.youtube?.map((video, i) => (
                                <li key={i}>
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {video.title}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Articles */}
                        <h3>Articles</h3>

                        <ul>
                            {item.articles?.map((article, i) => (
                                <li key={i}>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {article.title}
                                    </a>
                                </li>
                            ))}
                        </ul>

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