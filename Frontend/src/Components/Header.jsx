import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";   
import "./Header.css";

export default function Header() {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  const text = "Turning Code into Confidence";
  const { logout, isAuthenticated } = useAuth0();

  
  useEffect(() => {
    const typingSpeed = isErasing ? 60 : 90;
    const pauseBeforeErase = 1000;

    const handleTyping = () => {
      if (!isErasing && index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        setIndex((i) => i + 1);
      } else if (isErasing && index > 0) {
        setDisplayText(text.slice(0, index - 1));
        setIndex((i) => i - 1);
      } else if (index === text.length && !isErasing) {
        setTimeout(() => setIsErasing(true), pauseBeforeErase);
        return;
      } else if (index === 0 && isErasing) {
        setIsErasing(false);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [index, isErasing, text]);

  return (
    <header className="app-header no-jitter">
      <div className="app-header-inner">
        <div className="header-left">
          <div className="logo-mark">CS</div>

          <div className="title-group">
            <h1 className="header-title">CodeSavant-AI</h1>

            <span className="developer">
              <span className="developer-text">{displayText}</span>
              <span className="cursor" />
            </span>
          </div>
        </div>

        <div className="header-right">
          <nav className="header-nav">
            <Link to="/" className="nav-pill">Playground</Link>
            <Link to="/docs" className="nav-pill nav-pill-soft">Docs</Link>
            <Link to="/changelog" className="nav-pill nav-pill-soft">Changelog</Link>
          </nav>

          {isAuthenticated && (
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="logout-btn"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
