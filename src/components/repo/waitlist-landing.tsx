/**
 * Waitlist Landing Page Template
 *
 * A full-page waitlist / course landing page with:
 *   - Sticky nav with description + CTA
 *   - Big hero typography
 *   - Numbered content list with staggered layout
 *   - Two-column feature sections
 *   - Pricing / timeline table
 *   - Email signup form
 *   - Marquee footer
 *
 * Originally inspired by thecodeflow.co by @vallafederico
 * https://www.thecodeflow.co
 *
 * Re-themed and converted to a reusable React component by Luxora.
 */

import React, { useRef, useEffect, useState, FormEvent } from "react";

/* ── prop types ─────────────────────────────────────────────── */

export interface WaitlistLandingProps {
  /** Brand / site name shown in the footer marquee */
  brandName?: string;
  /** Accent color for buttons & dots (CSS value) */
  accentColor?: string;
  /** Called with the submitted email + name on form submit */
  onSubmit?: (data: { name: string; email: string }) => void;
}

/* ── component ──────────────────────────────────────────────── */

export const WaitlistLanding: React.FC<WaitlistLandingProps> = ({
  brandName = "STARLABS",
  accentColor = "#c4f74a",
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.({ name, email });
    setSubmitted(true);
  };

  /* ── marquee items ────────────────────────────────────────── */
  const marqueeItems = Array.from({ length: 6 }, (_, i) => (
    <span
      key={i}
      style={{
        display: "inline-block",
        padding: "0 2rem",
        fontSize: "clamp(3rem, 8vw, 8rem)",
        fontWeight: 900,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        color: "transparent",
        WebkitTextStroke: `1px rgba(255,255,255,0.15)`,
        whiteSpace: "nowrap",
      }}
    >
      {brandName}
    </span>
  ));

  /* ── numbered course items ───────────────────────────────── */
  const topics = [
    "STAR MAPPING",
    "EVA",
    "PROPULSIONS",
    "GSAP",
    "SIMULATIONS",
    "ORBIT DESIGN",
    "CREW ROTATIONS",
    "ADVANCED AI",
    "MARS &BEYOND",
    "HABITATION",
    "OPS SETUP",
    "THRUSTERS",
    "TELEMETRY",
    "THE FRAMEWORK™",
    "OPTIMISATION",
    "DOCKING",
    "STATION API",
    "CI/CD",
    "DEEP CODING",
    "ENDURANCE",
  ];

  return (
    <div
      style={{
        fontFamily:
          "'Arial Black', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        background: "#0a0a0a",
        color: "#e8e8e0",
        overscrollBehavior: "none",
        minHeight: "100vh",
      }}
    >
      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "1.5rem 2rem",
          backdropFilter: "blur(12px)",
          background: "rgba(10,10,10,0.75)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: "0.7rem",
            lineHeight: 1.7,
            maxWidth: "42ch",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          A practical <strong style={{ color: "#fff" }}>Astronautics</strong>{" "}
          course to <strong style={{ color: "#fff" }}>blast off</strong>{" "}
          space-tech developers<strong style={{ color: "#fff" }}>.</strong> From
          the basics to doing anything you can imagine, through{" "}
          <strong style={{ color: "#fff" }}>missions,</strong> custom rockets,
          flight systems, a proper setup and all that fun stuffs.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            (ver 0.2)
          </span>
          <a
            href="#signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1.2rem",
              background: accentColor,
              color: "#0a0a0a",
              fontWeight: 900,
              fontSize: "0.7rem",
              letterSpacing: "0.04em",
              textDecoration: "none",
              borderRadius: "2px",
            }}
          >
            JOIN WAITLIST
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 14 14"
              width="12"
              height="12"
              fill="none"
            >
              <path
                fill="currentColor"
                d="m13.03.6.337 8.832-1.752.072-.168-6.12-9.552 9.528-1.176-1.176 9.528-9.528-6.12-.192.072-1.752L13.03.6Z"
              />
            </svg>
          </a>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <header
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "5vw 6vw",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "2rem",
            }}
          >
            A 8+ HOURS VIDEO COURSE
          </div>
          <h1
            style={{
              fontSize: "clamp(3rem, 11vw, 13rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              fontWeight: 900,
              margin: 0,
              userSelect: "none",
            }}
          >
            STELLAR VOYAGE
            <br />
            INTO THE COSMOS
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 100, opacity: 0.6 }}>
              BEYOND
            </span>
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "3rem",
              gap: "1.2rem",
            }}
          >
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <div>ASTRONAUTICS COURSE FOR</div>
              <div style={{ fontWeight: 700, color: "#fff" }}>
                SPACE-TECH DEVELOPERS
              </div>
            </div>
            <a
              href="#signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 2rem",
                background: accentColor,
                color: "#0a0a0a",
                fontWeight: 900,
                fontSize: "0.8rem",
                letterSpacing: "0.04em",
                textDecoration: "none",
                borderRadius: "2px",
              }}
            >
              Reserve your Spot
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 14 14"
                width="14"
                height="14"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="m13.03.6.337 8.832-1.752.072-.168-6.12-9.552 9.528-1.176-1.176 9.528-9.528-6.12-.192.072-1.752L13.03.6Z"
                />
              </svg>
            </a>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "0.65rem",
                textAlign: "center",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              *LOCK PRICE AT <strong style={{ color: "#fff" }}>200$,</strong>
              <br />
              <strong style={{ color: "#fff" }}>GUARANTEES</strong> ENTRY
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENT LIST ────────────────────────────────────── */}
      <section style={{ padding: "4rem 6vw" }}>
        <h2
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: "0.75rem",
            textAlign: "center",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "3rem",
          }}
        >
          COURSE CONTENT
        </h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            counterReset: "itemcounter",
          }}
        >
          {topics.map((topic, i) => (
            <li
              key={i}
              style={{
                counterIncrement: "itemcounter",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                padding: "0.8rem 0",
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 4.5rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  margin: 0,
                  opacity: [2, 11, 19].includes(i) ? 0.3 : 1,
                }}
              >
                {topic}
              </h3>
            </li>
          ))}
        </ul>
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: "0.75rem",
            textAlign: "center",
            color: "rgba(255,255,255,0.4)",
            maxWidth: "50ch",
            margin: "3rem auto 0",
          }}
        >
          <strong style={{ color: "#fff" }}>8+ hours</strong> of in depth{" "}
          <strong style={{ color: "#fff" }}>video MATERIAL,</strong> beginners
          to advanced, and advanced to masters with{" "}
          <strong style={{ color: "#fff" }}>custom code in missions</strong>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section style={{ padding: "4rem 6vw" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
          }}
        >
          {/* Feature 1 */}
          <div>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              CONTENT
            </div>
            <h3
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                margin: "0.5rem 0 1rem",
              }}
            >
              10+ HOURS
              <br />
              OF VIDEO
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "40ch",
              }}
            >
              Split into{" "}
              <strong style={{ color: "#fff" }}>skill-based modules,</strong>{" "}
              you'll learn different{" "}
              <span style={{ textDecoration: "underline" }}>workflows</span>{" "}
              that are effective and applicable, even if you haven't completed
              the entire course.
            </p>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.4)",
                marginTop: "1.5rem",
                lineHeight: 2.2,
              }}
            >
              • 4 sections
              <br />
              • 2 FULL LIVE BUILDS
              <br />
              • COMMUNITY SUPPORT
              <br />
              • LEARN TOGETHER
              <br />• LIVE SESSION MONTHLY
            </div>
          </div>

          {/* Feature 2 */}
          <div>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              SKILLS
            </div>
            <h3
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                margin: "0.5rem 0 1rem",
              }}
            >
              BEGINNER TO
              <br />
              ADVANCED
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "40ch",
              }}
            >
              <strong style={{ color: "#fff" }}>
                And Advanced to master.
              </strong>{" "}
              Tailored to accommodate learners at any stage of their journey,
              ensuring{" "}
              <span style={{ textDecoration: "underline" }}>
                you can start from your current skill
              </span>{" "}
              level and gain practical, actionable knowledge at every step.
            </p>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.4)",
                marginTop: "1.5rem",
                lineHeight: 2.2,
              }}
            >
              &gt;JOIN AT ANY POINT
              <br />
              &lt;END AT ANY POINT
            </div>
          </div>
        </div>

        {/* Second feature row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
            marginTop: "5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              FEATURES (1/2)
            </div>
            <h3
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                margin: "0.5rem 0 1rem",
              }}
            >
              DISCORD
              <br />
              COMMUNITY
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "40ch",
              }}
            >
              <strong style={{ color: "#fff" }}>Learn with others</strong>{" "}
              following the same path, get help and share progress. Plus
              challenges, and{" "}
              <span style={{ textDecoration: "underline" }}>
                a network of other engineers
              </span>{" "}
              with the same skillset as you.
            </p>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              FEATURES (2/2)
            </div>
            <h3
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                margin: "0.5rem 0 1rem",
              }}
            >
              REAL LIFE
              <br />
              LIVE BUILDS
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "40ch",
              }}
            >
              <strong style={{ color: "#fff" }}>
                Featuring a full real-life mission build:
              </strong>{" "}
              dive into building and deconstructing fully functional flight
              systems with the newly acquired skills.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA + PRICING ───────────────────────────────────── */}
      <section style={{ padding: "6rem 6vw" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "1rem",
            }}
          >
            Solve Missions with code
          </div>
          <h2
            style={{
              fontSize: "clamp(3rem, 9vw, 10rem)",
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            FIND{" "}
            <span style={{ fontStyle: "italic", opacity: 0.3 }}>THE</span>
            <br />
            MISSING PIECE
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
            marginTop: "4rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              TIMELINE
            </div>
            <h3
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                margin: "0.5rem 0 1rem",
              }}
            >
              LIVE SEPT
              <br />
              2025
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "40ch",
              }}
            >
              <strong style={{ color: "#fff" }}>
                Recording is starting for the first module.
              </strong>{" "}
              The course goes live progressively, with additional sections after
              initial launch.
            </p>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.5rem",
              }}
            >
              PRICE
            </div>
            <h3
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                margin: "0.5rem 0 1rem",
              }}
            >
              LOCK PRICE
              <br />
              AT 200$*
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "40ch",
              }}
            >
              <strong style={{ color: "#fff" }}>
                By joining the waitlist now.
              </strong>{" "}
              You'll receive a discount before the course goes live, allowing
              you to signup early,{" "}
              <span style={{ textDecoration: "underline" }}>
                guaranteeing entry
              </span>{" "}
              to the first cohort, and at a special discount.
            </p>
          </div>
        </div>
      </section>

      {/* ── SIGNUP FORM ─────────────────────────────────────── */}
      <section
        id="signup"
        style={{ padding: "6rem 6vw", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
            alignItems: "start",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                margin: "0 0 1.5rem",
              }}
            >
              JOIN THE
              <br />
              WAITLIST
            </h2>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "40ch",
              }}
            >
              <strong style={{ color: "#fff" }}>
                Lock launch price at 200$ and guarantee entry to first cohort.
              </strong>{" "}
              I'll only send few updates on course completion, or probably just
              the launch one.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "1.5rem 0 0",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {[
                "Early access at 50% discount (then 250$+)",
                "Early access to Discord inner circle",
                "Guaranteed entry to 1st cohort",
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.6)",
                    paddingLeft: "1rem",
                    borderLeft: `2px solid ${accentColor}`,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  🚀
                </div>
                <h3 style={{ fontWeight: 900, fontSize: "1.2rem" }}>
                  You're on the list!
                </h3>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: "0.5rem",
                  }}
                >
                  We'll reach out before launch.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      fontFamily: "'Fira Code', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      marginBottom: "0.4rem",
                    }}
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.2)",
                      padding: "0.6rem 0",
                      color: "#fff",
                      fontSize: "0.9rem",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontFamily: "'Fira Code', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.2)",
                      padding: "0.6rem 0",
                      color: "#fff",
                      fontSize: "0.9rem",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.85rem 2rem",
                    background: accentColor,
                    color: "#0a0a0a",
                    fontWeight: 900,
                    fontSize: "0.8rem",
                    letterSpacing: "0.04em",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "2px",
                    fontFamily: "inherit",
                  }}
                >
                  JOIN WAITLIST
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 14 14"
                    width="14"
                    height="14"
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="m13.03.6.337 8.832-1.752.072-.168-6.12-9.552 9.528-1.176-1.176 9.528-9.528-6.12-.192.072-1.752L13.03.6Z"
                    />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER / MARQUEE ────────────────────────────────── */}
      <footer
        style={{
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "2rem 0",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "wl-marquee 30s linear infinite",
          }}
        >
          {marqueeItems}
          {marqueeItems}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontFamily: "'Fira Code', monospace",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </div>
        <style>{`
          @keyframes wl-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </footer>
    </div>
  );
};

export default WaitlistLanding;
