import { useRef, useState } from "react";
import axios from "axios";
import useAnalysisStore from "../store/analysisStore";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/**
 * UploadForm Component
 * Renders the dashboard file-upload and textual inputs.
 * Users can upload a resume (PDF/DOCX) and drag-and-drop/upload a job description (JD) file
 * OR paste the JD text. Sends data to the backend `/analyze` endpoint with JWT authentication.
 */
const UploadForm = () => {
  // DOM References to hidden HTML file input elements
  const resumeRef = useRef(null);
  const jdRef = useRef(null);
  const navigate = useNavigate();

  // State definitions
  const [resumeFile, setResumeFile] = useState(null); // Selected resume File object
  const [jdFile, setJdFile] = useState(null);         // Selected JD File object
  const [resumeDragActive, setResumeDragActive] = useState(false); // Track drag-over state for resume uploader
  const [jdDragActive, setJdDragActive] = useState(false);         // Track drag-over state for JD uploader
  const [jdText, setJdText] = useState("");           // User-typed JD text input
  const [loading, setLoading] = useState(false);      // Loading indicator state during api requests

  // State hooks from global stores
  const { setResult } = useAnalysisStore(); // Save analysis results to Zustand store
  const user = useAuthStore((state) => state.user); // Fetch active logged-in user details

  /**
   * Handles form submit and sends files to backend API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔐 1. Enforce Authentication check
    if (!user) {
      alert("Please login to analyze");
      navigate("/login");
      return;
    }

    // 🔴 2. Validation constraints checks
    if (!resumeFile) {
      alert("Resume is required");
      return;
    }

    if (!jdFile && jdText.trim() === "") {
      alert("Please upload Job Description PDF or paste text");
      return;
    }

    // 3. Assemble Multipart FormData for file uploading
    const formData = new FormData();
    formData.append("resume", resumeFile);

    // If a JD file was uploaded, attach it; otherwise attach the pasted JD text
    if (jdFile) {
      formData.append("jdPdf", jdFile);
    } else {
      formData.append("jdText", jdText.trim());
    }

    try {
      setLoading(true);

      // 4. Dispatch POST request to analyze endpoint with JWT headers
      // const response = await axios.post(
      //   "http://localhost:5000/analyze",
      //   formData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${user.token}`, // Pass session token
      //     },
      //   }
      // );
      const response = await axios.post(
        "http://localhost:5000/analyze",
        formData,
        {
          withCredentials: true,
        }
      );


      //debug
      // console.log("Response:", response.data);
 
      // 5. Store result locally and redirect user to results visualizer page
      const result = response.data;
      // setResult(result);

      setResult(result);
      localStorage.setItem(
        "analysisResult",
        JSON.stringify(result)
      );
      navigate("/analysis-result");

    } catch (error) {
      console.error("❌ Upload error:", error);

      // Handle unauthenticated expired token responses
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else {
        alert("Upload failed. Make sure backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="uploadForm" onSubmit={handleSubmit} className="animate-fade-in">
      <div className="grid-container">

        {/* ================= RESUME COLUMN ================= */}
        <div className="column">
          <div className="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "20px", color: "var(--primary)" }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Your Resume
          </div>

          {/* Resume Upload Zone Drop Area */}
          <div
            className={`upload-zone glass-card ${resumeDragActive ? "drag-active" : ""} ${resumeFile ? "has-file" : ""}`}
            // Add Drag-Over/Drag-Leave handlers to trigger visual indicators
            onDragOver={(e) => { e.preventDefault(); setResumeDragActive(true); }}
            onDragLeave={() => setResumeDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setResumeDragActive(false);
              // Extract dropped files and save to state
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setResumeFile(e.dataTransfer.files[0]);
              }
            }}
            // Clicking the drop area forwards click to the hidden HTML input
            onClick={() => resumeRef.current.click()}
          >
            {/* Hidden Input field */}
            <input
              type="file"
              ref={resumeRef}
              style={{ display: "none" }}
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setResumeFile(e.target.files[0]);
                }
              }}
            />

            {!resumeFile ? (
              // State 1: No file selected - show upload prompt
              <div className="upload-zone-content">
                <div className="upload-icon-container">
                  <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <p className="upload-text-main">Upload Resume</p>
                <p className="upload-text-sub">Drag & drop your file or click to browse</p>
                <p className="upload-text-info">(PDF, DOCX up to 5MB)</p>
              </div>
            ) : (
              // State 2: File selected - show file details, sizes, and a clear option
              <div className="file-info-container" onClick={(e) => e.stopPropagation()}>
                <svg className="file-preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                <div className="file-metadata">
                  <span className="file-name" title={resumeFile.name}>{resumeFile.name}</span>
                  <span className="file-size">{(resumeFile.size / 1024).toFixed(1)} KB</span>
                </div>
                {/* Clear selected file handler */}
                <button
                  className="btn-clear-file"
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    if (resumeRef.current) resumeRef.current.value = "";
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= JOB DESCRIPTION COLUMN ================= */}
        <div className="column">
          <div className="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "20px", color: "var(--secondary)" }}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
            Target Job Description
          </div>

          {/* JD File Dropzone area */}
          <div
            className={`upload-zone glass-card ${jdDragActive ? "drag-active" : ""} ${jdFile ? "has-file" : ""}`}
            style={{ padding: jdFile ? "1.5rem" : "1.8rem 1rem", minHeight: "115px" }}
            onDragOver={(e) => { e.preventDefault(); setJdDragActive(true); }}
            onDragLeave={() => setJdDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setJdDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setJdFile(e.dataTransfer.files[0]);
                setJdText(""); // Clear typed text if file is uploaded
              }
            }}
            onClick={() => jdRef.current.click()}
          >
            {/* Hidden Input field */}
            <input
              type="file"
              ref={jdRef}
              style={{ display: "none" }}
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setJdFile(e.target.files[0]);
                  setJdText(""); // Clear typed text
                }
              }}
            />

            {!jdFile ? (
              // State 1: No JD file selected - show upload prompt
              <div className="upload-zone-content">
                <svg className="upload-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <p className="upload-text-main" style={{ fontSize: "0.95rem" }}>Upload JD File</p>
                <p className="upload-text-sub" style={{ fontSize: "0.8rem" }}>Drag & drop PDF/DOCX or click to browse</p>
              </div>
            ) : (
              // State 2: JD File selected - show file details, sizes, and a clear option
              <div className="file-info-container" onClick={(e) => e.stopPropagation()}>
                <svg className="file-preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                <div className="file-metadata">
                  <span className="file-name" title={jdFile.name}>{jdFile.name}</span>
                  <span className="file-size">{(jdFile.size / 1024).toFixed(1)} KB</span>
                </div>
                {/* Clear selected file handler */}
                <button
                  className="btn-clear-file"
                  type="button"
                  onClick={() => {
                    setJdFile(null);
                    if (jdRef.current) jdRef.current.value = "";
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Show the Text Area only when no JD file is uploaded */}
          {!jdFile && (
            <>
              <div className="divider">OR PASTE TEXT</div>

              <div className="text-input-wrapper">
                <textarea
                  className="text-input-area form-input"
                  placeholder="Paste the full job description text details here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

      </div>

      {/* ================= ACTION BUTTON ================= */}
      <div className="action-area">
        <button
          type="submit"
          className="btn-primary btn-analyze"
          disabled={loading}
        >
          {loading ? (
            // State A: loading matches - show spinning loader icon
            <>
              <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
              </svg>
              Analyzing Profile...
            </>
          ) : (
            // State B: not loading - show standard checkmark SVG button
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Analyze & Match
            </>
          )}
        </button>

        {/* Security / Privacy disclaimer footer */}
        <div className="security-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Your data is processed securely and kept private.
        </div>
      </div>
    </form>
  );
};

export default UploadForm;
