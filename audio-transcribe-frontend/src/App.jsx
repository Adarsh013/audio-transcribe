import { useState, useRef } from "react";
import { transcribeAudio, generateSummary } from "./services/api";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [stage, setStage] = useState("idle"); // idle | transcribing | summarizing | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const isLoading = stage === "transcribing" || stage === "summarizing";

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("Choose an audio file first.");
      return;
    }

    setErrorMsg("");
    setTranscript("");
    setSummary("");

    try {
      setStage("transcribing");

      // Step 1: Transcribe Audio
      const response = await transcribeAudio(file);
      const transcriptText = response.text;
      setTranscript(transcriptText);

      setStage("summarizing");

      // Step 2: Generate Summary
      const summaryResponse = await generateSummary(transcriptText);
      setSummary(summaryResponse.summary);

      setStage("done");
    } catch (error) {
      console.error(error);
      setErrorMsg("Processing failed. Check that the server is running and try again.");
      setStage("error");
    }
  };

  return (
    <div className="App">
      <div className="backdrop" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
      </div>

      <div className="shell">
        <header className="header">
          
          <h1 className="wordmark">VoiceBrief AI</h1>
        </header>

        <main className="stage">
          <section className="panel">
            <span className="panel-dot" aria-hidden="true" />

            <div className="panel-head">
              <div className="panel-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 18v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h2 className="panel-heading">Audio Transcriber &amp; Summarizer</h2>
                <p className="tool-kicker">Drop a recording in, get a transcript and a summary out.</p>
              </div>
            </div>

            <div
              className={`dropzone${isDragging ? " is-dragging" : ""}${file ? " has-file" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="waveform" aria-hidden="true">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span key={i} className="wave-bar" style={{ "--i": i }} />
                ))}
              </div>

              <p className="dropzone-text">
                {file ? file.name : "Drag an audio file here, or choose one"}
              </p>

              <div className="tool-row">
                <label className="file-btn">
                  Choose File
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>

                <button className="tool-submit" onClick={handleUpload} disabled={isLoading}>
                  {stage === "transcribing" && "Transcribing…"}
                  {stage === "summarizing" && "Summarizing…"}
                  {(stage === "idle" || stage === "done" || stage === "error") && "Upload & Transcribe"}
                </button>
              </div>

              {isLoading && (
                <div className="equalizer" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="eq-bar" style={{ "--i": i }} />
                  ))}
                </div>
              )}
            </div>

            {errorMsg && <p className="error-banner">{errorMsg}</p>}

            <div className="tool-section">
              <div className="tool-section-label">
                <span className="section-number">01</span>
                <h3>Transcript</h3>
              </div>
              <div className={`tool-output${transcript ? " has-content" : ""}`}>
                {transcript ? (
                  <pre className="output-text transcript-text">{transcript}</pre>
                ) : (
                  <p className="output-placeholder">
                    {stage === "transcribing" ? "Listening…" : "Your transcript will show up here."}
                  </p>
                )}
              </div>
            </div>

            <div className="tool-section">
              <div className="tool-section-label">
                <span className="section-number">02</span>
                <h3>Summary</h3>
              </div>
              <div className={`tool-output${summary ? " has-content" : ""}`}>
                {summary ? (
                  <p className="output-text summary-text">{summary}</p>
                ) : (
                  <p className="output-placeholder">
                    {stage === "summarizing" ? "Writing the summary…" : "Your summary will show up here."}
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;