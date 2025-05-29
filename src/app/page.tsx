"use client";
import React, { useEffect } from "react";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  useEffect(() => {
    const setHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-headlines">
          <h1 className="headline line1">SMART QUERIES</h1>
          <h1 className="headline line2">FAST SOLUTIONS</h1>
          <h1 className="headline line3">PRECISE ANSWERS,</h1>
          <h1 className="headline line4">RIGHT AWAY</h1>
        </div>
      </div>
      <div className="animated-blobs-wrapper">
        <div className="animated-blob blob1" />
        <div className="animated-blob blob2" />
        <div className="animated-blob blob3" />
      </div>

      <hr className="divider" />

      <footer className="landing-footer">
        <p className="desc-main">For Students and Government Departments</p>
        <p className="desc-sub">From queries to solutions</p>
      </footer>
    </div>
  );
};

export default LandingPage;
