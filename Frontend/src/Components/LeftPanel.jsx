import React, { useRef } from "react";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import { motion } from "framer-motion";

import "prismjs/themes/prism-tomorrow.css";
import "./LeftPanel.css";

import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";

function LeftPanel({
  language,
  code,
  setCode,
  isReviewing,
  reviewCode,
  handleLanguageChange,
}) {
  const editorRef = useRef(null);

  return (
    <section className="left-panel">
      <div className="panel-header">
        <div className="panel-title-block">
          <h2 className="panel-title">Your Code</h2>
          <p className="panel-subtitle">
            Paste or type your snippet. CodeSavant-AI will review it line by
            line.
          </p>
        </div>

        <div className="panel-controls">
          <div className="language-select-container">
            <label htmlFor="language-select">Language</label>
            <select
              id="language-select"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          {/* Animated Review Button */}
          <motion.button
            className={`review-button ${isReviewing ? "disabled" : ""}`}
            onClick={!isReviewing ? reviewCode : undefined}
            whileHover={!isReviewing ? { scale: 1.08 } : {}}
            whileTap={!isReviewing ? { scale: 0.92 } : {}}
            animate={
              isReviewing
                ? { opacity: 0.7, scale: 0.97 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {isReviewing ? "Reviewing..." : "Run Review"}
          </motion.button>
        </div>
      </div>

      <div className="editor-shell" ref={editorRef}>
        <Editor
          value={code}
          onValueChange={(newCode) => setCode(newCode)}
          highlight={(value) =>
            prism.highlight(
              value,
              prism.languages[language] || prism.languages.javascript,
              language
            )
          }
          padding={14}
          textareaClassName="code-editor-textarea"
          style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: 14,
            width: "100%",
            minHeight: "100%",
          }}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      <div className="panel-footer-hint">
        Tip: Paste production code and see detailed mistakes, suggestions and a
        fixed version on the right.
      </div>
    </section>
  );
}

export default LeftPanel;
