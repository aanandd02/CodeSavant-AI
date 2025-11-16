import React from "react";
import "./Changelog.css";

export default function Changelog() {
  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h1>📝 Changelog</h1>
        <p className="page-subtitle">
          Track all new updates & improvements in CodeSavant-AI.
        </p>

        <section>
          <h2>v1.0.3 — UI Stability Upgrade</h2>
          <ul>
            <li>Fixed gradient jitter</li>
            <li>100% smooth scroll in editor</li>
            <li>Optimized background rendering</li>
          </ul>
        </section>

        <section>
          <h2>v1.0.2 — AI Review Enhancements</h2>
          <ul>
            <li>Better bug detection</li>
            <li>Improved suggestions</li>
            <li>More polished corrected code</li>
          </ul>
        </section>

        <section>
          <h2>v1.0.1 — Initial Release</h2>
          <ul>
            <li>JavaScript, C, C++, Java review support</li>
            <li>Auto-generated fixed code</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
