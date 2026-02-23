"use client";

import React, { useState } from "react";

const styles = `
  .sinek-container {
    background: #111 url('https://pub-6738c828bef548d69b3f13bdd680b5b0.r2.dev/Untitled506_20260120181403.png') no-repeat center center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    font-family: sans-serif;
  }

  .sinek-panel {
    width: 90%;
    max-width: 360px;
    background: linear-gradient(13deg, #161c22, #3e4e55);
    padding: 25px;
    border-radius: 30px;
    box-shadow: 0 20px 50px #000, inset 1px 1px 0 #555;
    border: 1px solid #111;
  }

  .sinek-screen {
    background: linear-gradient(193deg, #0a220e, #87939d);
    padding: 15px;
    border-radius: 10px;
    border: 3px solid #316d35;
    box-shadow: inset 0 0 15px #0b711e;
    margin-bottom: 30px;
    min-height: 80px;
  }

  .sinek-dial {
    position: relative;
    width: 280px;
    height: 280px;
    margin: 0 auto;
  }

  .sinek-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    aspect-ratio: 1/1;
  }

  .sinek-ring:active { transform: translate(-50%, -50%) scale(0.95); }
  .sinek-ring:hover { filter: brightness(1.2); }

  .sinek-what {
    width: 100%;
    background: linear-gradient(145deg, #161c22, #39464f);
    box-shadow: 10px 10px 20px #111, -5px -5px 15px #3c484f;
  }

  .sinek-how {
    width: 70%;
    background: linear-gradient(145deg, #39464f, #1a1a1a);
    box-shadow: 5px 5px 10px #111, inset 2px 2px 5px rgba(255,255,255,0.1);
    z-index: 2;
  }

  .sinek-why {
    width: 35%;
    background: radial-gradient(circle at 30% 30%, #ffd700, #b8860b);
    box-shadow: 0 0 20px rgba(255,215,0,0.4), inset 2px 2px 5px #fff;
    z-index: 3;
  }

  .sinek-label {
    position: absolute;
    font-weight: bold;
    font-size: 0.65rem;
    letter-spacing: 1px;
  }

  .sinek-label-top {
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    color: #888;
  }

  .sinek-label-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #000;
  }
`;

export const SinekPanel = () => {
  const [title, setTitle] = useState("SYSTEM READY");
  const [text, setText] = useState("TAP A LAYER TO BEGIN. START WITH WHAT AND MOVE YOUR WAY IN.");

  const update = (newTitle: string, desc: string) => {
    setTitle(newTitle);
    setText(desc);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sinek-container">
        <div className="sinek-panel">
          <div className="sinek-screen">
            <h2 style={{ color: "#ffd700", fontSize: "1rem", margin: 0, textTransform: "uppercase" }}>{title}</h2>
            <p style={{ color: "#3f3", fontSize: "0.85rem", fontFamily: "monospace", margin: "5px 0 0" }}>{text}</p>
          </div>

          <div className="sinek-dial">
            <button
              className="sinek-ring sinek-what"
              onClick={() => update("WHAT", "Every organization on the planet knows WHAT they do. These are products or services you sell.")}
            >
              <span className="sinek-label sinek-label-top">WHAT</span>
            </button>
            <button
              className="sinek-ring sinek-how"
              onClick={() => update("HOW", "Some organizations know HOW they do it. This is how your company is special or stands out from competitors.")}
            >
              <span className="sinek-label sinek-label-top">HOW</span>
            </button>
            <button
              className="sinek-ring sinek-why"
              onClick={() => update("WHY", "Very few organizations know WHY they do what they do. WHY is a purpose, cause or belief. The very reason your organization exists.")}
            >
              <span className="sinek-label sinek-label-center">WHY</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
