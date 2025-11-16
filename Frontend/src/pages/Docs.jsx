import React from "react";
import "./Docs.css";

export default function Docs() {
  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h1>📘 Documentation</h1>
        <p className="page-subtitle">
          Everything you need to understand how CodeSavant-AI works.
        </p>

        <section>
          <h2>What is CodeSavant-AI?</h2>
          <p>
            CodeSavant-AI reviews your code like a senior engineer, finds bugs,
            suggests improvements, and generates clean corrected versions.
          </p>
        </section>

        <section>
          <h2>Supported Languages</h2>
          <ul>
            <li>JavaScript</li>
            <li>C</li>
            <li>C++</li>
            <li>Java</li>
          </ul>
        </section>

        <section>
          <h2>How to Use</h2>
          <p>
            Paste your code → select language → click <strong>Run Review</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
