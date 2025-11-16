// App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Header from "./Components/Header";
import LeftPanel from "./Components/LeftPanel";
import RightPanel from "./Components/RightPanel";

import { useAuth0 } from "@auth0/auth0-react";

import { Routes, Route } from "react-router-dom";
import Docs from "./pages/Docs";
import Changelog from "./pages/Changelog";

// -------------------------- Default Code For Languages --------------------------
const getDefaultCodeForLanguage = (lang) => {
  switch (lang) {
    case "javascript":
      return `function greetUser(userName) {\n  return "Welcome, " + userName + "!";\n}`;
    case "c":
      return `#include <stdio.h>\nint main() {\n    printf("Hello, world!\\n");\n    return 0;\n}`;
    case "cpp":
      return `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, world!";\n    return 0;\n}`;
    case "java":
      return `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}`;
    default:
      return "";
  }
};

// -------------------------- Check If It's Code --------------------------
function isLikelyCode(input) {
  const codeTokens = [
    "function",
    "{",
    "}",
    ";",
    "#include",
    "public class",
    "int main",
    "printf",
    "console.log",
    "=>",
  ];
  return codeTokens.some((token) => input.includes(token));
}

// -------------------------- Main App Component --------------------------
export default function App() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(getDefaultCodeForLanguage("javascript"));
  const [review, setReview] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  // Auto login
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect({ prompt: "select_account" });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  // Smart base URL
  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://codesavant-ai.onrender.com");

  // Run Review
  async function reviewCode() {
    if (!isLikelyCode(code)) {
      setReview("⚠️ Please provide valid code for analysis.");
      return;
    }

    setIsReviewing(true);
    setReview("");

    try {
      const response = await axios.post(`${BASE_URL}/ai/get-review`, {
        code,
        language,
      });

      setReview(response.data.review);
    } catch (error) {
      console.error("🔥 Frontend fetch error:", error);
      if (error.response) console.error("Backend said:", error.response.data);
      setReview("❌ Error fetching review. Try again.");
    } finally {
      setIsReviewing(false);
    }
  }

  // Change Language
  function handleLanguageChange(e) {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(getDefaultCodeForLanguage(selectedLang));
    setReview("");
  }

  // Apply Code
  function applyCorrectedCode(corrected) {
    setCode(corrected);
    setReview("");
  }

  // If still loading auth
  if (isLoading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (!isAuthenticated) return null;

  // ---------------------------------- UI -----------------------------------
  return (
    <div className="app-shell">
      <div className="app-bg" />
      <div className="app-overlay" />

      <Header />

      <Routes>
        {/* ------------------- MAIN PLAYGROUND PAGE ------------------- */}
        <Route
          path="/"
          element={
            <main>
              <LeftPanel
                language={language}
                code={code}
                setCode={setCode}
                isReviewing={isReviewing}
                reviewCode={reviewCode}
                handleLanguageChange={handleLanguageChange}
              />

              <RightPanel
                isReviewing={isReviewing}
                review={review}
                applyCorrectedCode={applyCorrectedCode}
              />
            </main>
          }
        />

        {/* ------------------- DOCS PAGE ------------------- */}
        <Route path="/docs" element={<Docs />} />

        {/* ------------------- CHANGELOG PAGE ------------------- */}
        <Route path="/changelog" element={<Changelog />} />
      </Routes>
    </div>
  );
}
