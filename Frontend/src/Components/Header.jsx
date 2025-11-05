import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Header.css";

function Header() {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const text = "Turning Code into Confidence";

  const { user, logout, isAuthenticated } = useAuth0();

  useEffect(() => {
    let timer;
    if (!isErasing && index < text.length) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 150);
    } else if (isErasing && index > 0) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        setIndex((prev) => prev - 1);
      }, 100);
    } else if (index === text.length && !isErasing) {
      timer = setTimeout(() => {
        setIsErasing(true);
      }, 1000);
    } else if (index === 0 && isErasing) {
      setIsErasing(false);
    }

    return () => clearTimeout(timer);
  }, [index, isErasing, text]);

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">CodeSavant-AI</h1>
        <span className="developer">{displayText}</span>
      </div>

      {isAuthenticated && (
        <div className="header-right">
          <img src={user.picture} alt="profile" className="user-pic" />
          <span className="user-info">
            {user.name} ({user.email})
          </span>
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
