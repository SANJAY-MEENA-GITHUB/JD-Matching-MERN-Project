import { useRef, useState } from "react";
import axios from "axios";
import useAnalysisStore from "../store/analysisStore";
import { useNavigate } from "react-router";

const UploadForm = () => {
  const resumeRef = useRef(null);
  const jdRef = useRef(null);
  const navigate = useNavigate();

  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const {setResult} = useAnalysisStore();
  
//   const handleSubmit = async (e)=>{
//     e.preventDefault();
//     console.log("Hello")
//     alert("Hello")
//   }

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    const resumeFile = resumeRef.current.files[0];
    const jdFile = jdRef.current.files[0];

    // Validation
    if (!resumeFile) {
      alert("Resume is required");
      return;
    }

    if (!jdFile && jdText.trim() === "") {
      alert("Please upload Job Description PDF or paste text");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    // IMPORTANT: send only one JD
    if (jdFile) {
      formData.append("jdPdf", jdFile);
    } else {
      formData.append("jdText", jdText.trim());
    }

    try {
      setLoading(true);
        const response = await axios.post("http://localhost:5000/analyze",formData);
    //   const response = await fetch("http://localhost:5000/analyze", {
    //     method: "POST",
    //     body: formData,
    //   });
    console.log("Hello");
      console.log(response)
      setResult(response.data.data);
      navigate("/analysis-result")

    //   const result = await response.json();
    //   console.log(result);

    alert(`Analysis Completed! Match Percentage:${response.data.data.matchPercentage}`);

    } catch (error) {
      console.log("Upload error:", error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        {/* <button onClick={()=>console.log("object")}>
            Click Me
        </button> */}
    <form id="uploadForm" encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="grid-container">

        <div className="column">
          <div className="card-title">Your Resume</div>
          <div className="upload-area">
            <input
              type="file"
              ref={resumeRef}
              accept=".pdf,.doc,.docx"
            //   required
            />
            <p className="upload-text-main">
              Upload Resume{" "}
              <span style={{ fontWeight: 400, color: "var(--text-grey)", fontSize: "0.9rem" }}>
                (PDF/DOCX)
              </span>
            </p>
          </div>
        </div>

        <div className="column">
          <div className="card-title">Target Job Description</div>

          <div className="upload-area" style={{ padding: "2.2rem 1rem" }}>
            <input
              type="file"
              ref={jdRef}
              accept=".pdf,.doc,.docx"
            />
            <p className="upload-text-main">
              Upload JD File{" "}
              <span style={{ fontWeight: 400, color: "var(--text-grey)", fontSize: "0.9rem" }}>
                (PDF/DOCX)
              </span>
            </p>
          </div>

          <div className="divider">OR PASTE TEXT</div>

          <div className="text-input-wrapper">
            <textarea
              className="text-input-area"
              placeholder="Paste the full job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>
        </div>

      </div>

      <div className="action-area">
        <button type="submit" className="btn-analyze" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze & Match"}
        </button>

        <div className="security-note">
          Your data is private and processed securely.
        </div>
      </div>
    </form>
    </div>
  );
};

export default UploadForm;
