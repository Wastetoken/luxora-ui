import { useState } from "react";

export default function App() {
  const [knob1Angle, setKnob1Angle] = useState(0);
  const [knob2Angle, setKnob2Angle] = useState(0);
  const [knob3Angle, setKnob3Angle] = useState(0);
  const [power, setPower] = useState(false);
  const [arm, setArm] = useState(false);
  const [lock, setLock] = useState(false);
  const [sys, setSys] = useState(false);

  const altitude = Math.floor(12500 + knob1Angle * 10);
  const velocity = Math.floor(450 + knob2Angle * 2);

  return (
    <div 
      className="w-screen h-screen flex items-center justify-center p-4 md:p-8"
      style={{
        background: "radial-gradient(ellipse at center, #1a1a1a 0%, #000000 100%)",
      }}
    >
      <div
        className="w-full h-full max-w-7xl relative"
        style={{
          background: `
            linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.3) 100%),
            repeating-linear-gradient(0deg, #2a2a2a 0px, #2a2a2a 1px, #282828 1px, #282828 2px),
            repeating-linear-gradient(90deg, #2a2a2a 0px, #2a2a2a 1px, #282828 1px, #282828 2px),
            linear-gradient(180deg, #2d2d2d 0%, #242424 50%, #1a1a1a 100%)
          `,
          borderRadius: "12px",
          boxShadow: `
            inset 0 0 0 1px rgba(60,60,60,0.5),
            inset 0 2px 4px rgba(255,255,255,0.05),
            inset 0 -2px 4px rgba(0,0,0,0.5),
            0 20px 60px rgba(0,0,0,0.9),
            0 5px 15px rgba(0,0,0,0.8)
          `,
          border: "3px solid #1a1a1a",
        }}
      >
        {/* Top Control Bar */}
        <div
          className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 h-20 md:h-24"
          style={{
            background: `
              repeating-linear-gradient(0deg, #2a2a2a 0px, #2a2a2a 1px, #272727 1px, #272727 2px),
              linear-gradient(180deg, #323232 0%, #2a2a2a 10%, #1f1f1f 90%, #1a1a1a 100%)
            `,
            borderRadius: "6px",
            border: "2px solid #0d0d0d",
            boxShadow: `
              inset 0 3px 6px rgba(0,0,0,0.8),
              inset 0 -1px 3px rgba(255,255,255,0.05),
              0 8px 16px rgba(0,0,0,0.7)
            `,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8">
            <div className="flex gap-2 md:gap-4">
              {[
                { label: "PWR", state: power, set: setPower, color: "#00ff00" },
                { label: "ARM", state: arm, set: setArm, color: "#ff0000" },
                { label: "LCK", state: lock, set: setLock, color: "#ffaa00" },
                { label: "SYS", state: sys, set: setSys, color: "#00aaff" },
              ].map((btn, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "7px",
                      color: "#666",
                      letterSpacing: "0.5px",
                      marginBottom: "2px",
                    }}
                  >
                    {btn.label}
                  </div>
                  <button
                    onClick={() => btn.set(!btn.state)}
                    className="relative w-12 h-12 md:w-14 md:h-14 rounded transition-all duration-200"
                    style={{
                      background: `
                        repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px),
                        linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%)
                      `,
                      border: "3px solid #0d0d0d",
                      boxShadow: btn.state
                        ? `
                          inset 0 4px 8px rgba(0,0,0,0.9),
                          inset 0 0 20px ${btn.color}66,
                          0 0 30px ${btn.color}aa,
                          0 0 50px ${btn.color}66
                        `
                        : `
                          inset 0 -4px 8px rgba(255,255,255,0.08),
                          inset 0 4px 8px rgba(0,0,0,0.6),
                          0 6px 12px rgba(0,0,0,0.8)
                        `,
                    }}
                  >
                    <div
                      className="absolute inset-2 rounded flex items-center justify-center"
                      style={{
                        background: btn.state
                          ? `radial-gradient(circle at 35% 35%, ${btn.color}ff, ${btn.color}cc, ${btn.color}88)`
                          : "linear-gradient(135deg, #2a2a2a, #1a1a1a)",
                        boxShadow: btn.state
                          ? `inset 0 -2px 4px rgba(255,255,255,0.3), inset 0 2px 6px rgba(0,0,0,0.4)`
                          : "inset 0 2px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      <span
                        style={{
                          color: btn.state ? "#ffffff" : "#4a4a4a",
                          fontFamily: "monospace",
                          fontSize: "9px",
                          fontWeight: "bold",
                          textShadow: btn.state ? `0 0 8px ${btn.color}` : "none",
                        }}
                      >
                        {btn.label}
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 md:gap-4 items-center">
              <div
                className="px-2 py-0.5"
                style={{
                  background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
                  border: "1px solid #0d0d0d",
                  borderRadius: "2px",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
                  fontFamily: "monospace",
                  fontSize: "8px",
                  color: "#666",
                  letterSpacing: "1px",
                }}
              >
                STATUS
              </div>
              {[
                { active: power, label: "P" },
                { active: arm, label: "A" },
                { active: lock, label: "L" },
                { active: sys, label: "S" },
              ].map((indicator, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="relative w-6 h-6 md:w-7 md:h-7 rounded-full"
                    style={{
                      background: "radial-gradient(circle at 30% 30%, #3a3a3a, #1a1a1a)",
                      border: "2px solid #0d0d0d",
                      boxShadow: `
                        inset 0 3px 6px rgba(0,0,0,0.9),
                        inset 0 -1px 2px rgba(255,255,255,0.05),
                        0 3px 6px rgba(0,0,0,0.6)
                      `,
                    }}
                  >
                    <div
                      className="absolute inset-1 rounded-full"
                      style={{
                        background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.95)",
                      }}
                    >
                      <div
                        className="absolute inset-0.5 rounded-full transition-all duration-300"
                        style={{
                          background: indicator.active
                            ? "radial-gradient(circle at 35% 35%, #00ff00, #00cc00, #009900)"
                            : "radial-gradient(circle at 35% 35%, #1a2a1a, #0d1a0d, #050a05)",
                          boxShadow: indicator.active
                            ? `
                              0 0 16px #00ff00,
                              0 0 24px #00ff0066,
                              inset 0 -1px 3px rgba(255,255,255,0.4),
                              inset 0 2px 4px rgba(0,0,0,0.3)
                            `
                            : "inset 0 2px 4px rgba(0,0,0,0.95)",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "6px",
                      color: "#555",
                    }}
                  >
                    {indicator.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Display Screens */}
        <div className="absolute top-28 md:top-36 left-4 md:left-6 right-4 md:right-6 bottom-32 md:bottom-40 flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Radar Display */}
          <div className="flex-1 relative">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: `
                  repeating-linear-gradient(0deg, #2a2a2a 0px, #2a2a2a 1px, #272727 1px, #272727 2px),
                  linear-gradient(145deg, #3d3d3d 0%, #2a2a2a 30%, #1a1a1a 70%, #0d0d0d 100%)
                `,
                border: "4px solid #0d0d0d",
                boxShadow: `
                  inset 0 8px 16px rgba(0,0,0,0.95),
                  inset 0 -4px 8px rgba(255,255,255,0.03),
                  0 12px 24px rgba(0,0,0,0.9)
                `,
              }}
            >
              <div
                className="absolute top-3 left-3 px-2 py-1"
                style={{
                  background: "linear-gradient(180deg, #3a3a3a, #2a2a2a)",
                  borderRadius: "2px",
                  border: "1px solid #1a1a1a",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.4)",
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: "#999",
                  letterSpacing: "0.5px",
                }}
              >
                RADAR SCOPE
              </div>

              <div
                className="absolute inset-4 md:inset-6 rounded"
                style={{
                  background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
                  border: "3px solid #0d0d0d",
                  boxShadow: `
                    inset 0 6px 12px rgba(0,0,0,0.98),
                    inset 0 -2px 4px rgba(255,255,255,0.02),
                    0 4px 8px rgba(0,0,0,0.7)
                  `,
                }}
              >
                <div
                  className="absolute inset-2 rounded overflow-hidden"
                  style={{
                    background: "#000a00",
                    border: "1px solid #0d2a0d",
                    boxShadow: "inset 0 0 60px rgba(0,255,0,0.12)",
                  }}
                >
                  <div
                    className="absolute top-3 left-3 text-green-500 z-10"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      textShadow: "0 0 8px #00ff00",
                      letterSpacing: "1px",
                    }}
                  >
                    RADAR
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-40 h-40 md:w-72 md:h-72">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          border: "2px solid #0d4a0d",
                          boxShadow: "0 0 8px rgba(0,255,0,0.3)",
                        }}
                      />
                      <div
                        className="absolute inset-4 md:inset-8 rounded-full"
                        style={{
                          border: "1px solid #0d3a0d",
                          boxShadow: "0 0 4px rgba(0,255,0,0.2)",
                        }}
                      />
                      <div
                        className="absolute inset-8 md:inset-16 rounded-full"
                        style={{
                          border: "1px solid #0d3a0d",
                          boxShadow: "0 0 4px rgba(0,255,0,0.2)",
                        }}
                      />

                      <div
                        className="absolute top-1/2 left-0 right-0"
                        style={{
                          height: "1px",
                          background: "#0d3a0d",
                          boxShadow: "0 0 4px rgba(0,255,0,0.2)",
                        }}
                      />
                      <div
                        className="absolute top-0 bottom-0 left-1/2"
                        style={{
                          width: "1px",
                          background: "#0d3a0d",
                          boxShadow: "0 0 4px rgba(0,255,0,0.2)",
                        }}
                      />

                      {[45, 120, 200, 280].map((angle, i) => (
                        <div
                          key={i}
                          className="absolute w-2.5 h-2.5 rounded-full"
                          style={{
                            top: `${50 + 30 * Math.sin((angle * Math.PI) / 180)}%`,
                            left: `${50 + 30 * Math.cos((angle * Math.PI) / 180)}%`,
                            background: "radial-gradient(circle, #00ff00, #00aa00)",
                            boxShadow: "0 0 12px #00ff00, 0 0 20px #00ff0066",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Altitude Display */}
          <div className="flex-1 relative">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: `
                  repeating-linear-gradient(0deg, #2a2a2a 0px, #2a2a2a 1px, #272727 1px, #272727 2px),
                  linear-gradient(145deg, #3d3d3d 0%, #2a2a2a 30%, #1a1a1a 70%, #0d0d0d 100%)
                `,
                border: "4px solid #0d0d0d",
                boxShadow: `
                  inset 0 8px 16px rgba(0,0,0,0.95),
                  inset 0 -4px 8px rgba(255,255,255,0.03),
                  0 12px 24px rgba(0,0,0,0.9)
                `,
              }}
            >
              <div
                className="absolute top-3 left-3 px-2 py-1"
                style={{
                  background: "linear-gradient(180deg, #3a3a3a, #2a2a2a)",
                  borderRadius: "2px",
                  border: "1px solid #1a1a1a",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.4)",
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: "#999",
                  letterSpacing: "0.5px",
                }}
              >
                ALT INDICATOR
              </div>

              <div
                className="absolute inset-4 md:inset-6 rounded"
                style={{
                  background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
                  border: "3px solid #0d0d0d",
                  boxShadow: `
                    inset 0 6px 12px rgba(0,0,0,0.98),
                    inset 0 -2px 4px rgba(255,255,255,0.02),
                    0 4px 8px rgba(0,0,0,0.7)
                  `,
                }}
              >
                <div
                  className="absolute inset-2 rounded flex flex-col items-center justify-center"
                  style={{
                    background: "#00000a",
                    border: "1px solid #0d0d2a",
                    boxShadow: "inset 0 0 60px rgba(0,150,255,0.12)",
                  }}
                >
                  <div
                    className="text-cyan-400 mb-4 md:mb-8"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "12px",
                      letterSpacing: "2px",
                      textShadow: "0 0 12px #00aaff",
                    }}
                  >
                    ALTITUDE
                  </div>
                  <div
                    className="text-cyan-300 mb-2 md:mb-4"
                    style={{
                      fontSize: "42px",
                      fontFamily: "monospace",
                      textShadow: "0 0 24px #00aaff, 0 0 36px #00aaff66",
                      letterSpacing: "4px",
                    }}
                  >
                    {altitude}
                  </div>
                  <div
                    className="text-cyan-700 mb-6"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      letterSpacing: "1px",
                    }}
                  >
                    FEET MSL
                  </div>

                  <div className="flex gap-1 md:gap-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 md:w-2 h-10 md:h-14 rounded-sm"
                        style={{
                          background:
                            i < knob1Angle / 36
                              ? "linear-gradient(180deg, #00eeff, #00aacc, #007799)"
                              : "#001a22",
                          border: "1px solid #003344",
                          boxShadow:
                            i < knob1Angle / 36
                              ? "0 0 10px #00aaff, inset 0 -2px 4px rgba(0,0,0,0.4)"
                              : "inset 0 2px 4px rgba(0,0,0,0.9)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Velocity Display */}
          <div className="flex-1 relative">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: `
                  repeating-linear-gradient(0deg, #2a2a2a 0px, #2a2a2a 1px, #272727 1px, #272727 2px),
                  linear-gradient(145deg, #3d3d3d 0%, #2a2a2a 30%, #1a1a1a 70%, #0d0d0d 100%)
                `,
                border: "4px solid #0d0d0d",
                boxShadow: `
                  inset 0 8px 16px rgba(0,0,0,0.95),
                  inset 0 -4px 8px rgba(255,255,255,0.03),
                  0 12px 24px rgba(0,0,0,0.9)
                `,
              }}
            >
              <div
                className="absolute top-3 left-3 px-2 py-1"
                style={{
                  background: "linear-gradient(180deg, #3a3a3a, #2a2a2a)",
                  borderRadius: "2px",
                  border: "1px solid #1a1a1a",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.4)",
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: "#999",
                  letterSpacing: "0.5px",
                }}
              >
                VEL READOUT
              </div>

              <div
                className="absolute inset-4 md:inset-6 rounded"
                style={{
                  background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
                  border: "3px solid #0d0d0d",
                  boxShadow: `
                    inset 0 6px 12px rgba(0,0,0,0.98),
                    inset 0 -2px 4px rgba(255,255,255,0.02),
                    0 4px 8px rgba(0,0,0,0.7)
                  `,
                }}
              >
                <div
                  className="absolute inset-2 rounded flex flex-col items-center justify-center"
                  style={{
                    background: "#0a0000",
                    border: "1px solid #2a0d0d",
                    boxShadow: "inset 0 0 60px rgba(255,100,0,0.12)",
                  }}
                >
                  <div
                    className="text-orange-400 mb-4 md:mb-8"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "12px",
                      letterSpacing: "2px",
                      textShadow: "0 0 12px #ff6600",
                    }}
                  >
                    VELOCITY
                  </div>
                  <div
                    className="text-orange-300 mb-2 md:mb-4"
                    style={{
                      fontSize: "42px",
                      fontFamily: "monospace",
                      textShadow: "0 0 24px #ff6600, 0 0 36px #ff660066",
                      letterSpacing: "4px",
                    }}
                  >
                    {velocity}
                  </div>
                  <div
                    className="text-orange-800 mb-6"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      letterSpacing: "1px",
                    }}
                  >
                    KNOTS
                  </div>

                  <div
                    className="w-48 md:w-64 h-4 md:h-5 rounded overflow-hidden"
                    style={{
                      background: "#1a0500",
                      border: "2px solid #2a0d0d",
                      boxShadow: "inset 0 3px 6px rgba(0,0,0,0.95)",
                    }}
                  >
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(knob2Angle / 360) * 100}%`,
                        background: "linear-gradient(90deg, #ff3300, #ff6600, #ff9933)",
                        boxShadow: "0 0 12px #ff6600, inset 0 -2px 4px rgba(0,0,0,0.4)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Control Panel */}
        <div
          className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 h-24 md:h-28"
          style={{
            background: `
              repeating-linear-gradient(0deg, #2a2a2a 0px, #2a2a2a 1px, #272727 1px, #272727 2px),
              linear-gradient(180deg, #323232 0%, #2a2a2a 10%, #1f1f1f 90%, #1a1a1a 100%)
            `,
            borderRadius: "6px",
            border: "2px solid #0d0d0d",
            boxShadow: `
              inset 0 3px 6px rgba(0,0,0,0.8),
              inset 0 -1px 3px rgba(255,255,255,0.05),
              0 8px 16px rgba(0,0,0,0.7)
            `,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-around px-8 md:px-20">
            {[
              { label: "GAIN", angle: knob1Angle, set: setKnob1Angle },
              { label: "FREQ", angle: knob2Angle, set: setKnob2Angle },
              { label: "TUNE", angle: knob3Angle, set: setKnob3Angle },
            ].map((knob, i) => (
              <div key={i} className="flex flex-col items-center gap-2 md:gap-3">
                <div
                  className="px-2 py-0.5"
                  style={{
                    background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
                    border: "1px solid #0d0d0d",
                    borderRadius: "2px",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
                    fontFamily: "monospace",
                    fontSize: "8px",
                    color: "#666",
                    letterSpacing: "1px",
                  }}
                >
                  {knob.label}
                </div>

                <div
                  className="relative"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle at 30% 30%, #3a3a3a, #1a1a1a)",
                      border: "3px solid #0d0d0d",
                      boxShadow: `
                        inset 0 6px 12px rgba(0,0,0,0.95),
                        inset 0 -3px 6px rgba(255,255,255,0.05),
                        0 8px 16px rgba(0,0,0,0.8)
                      `,
                    }}
                  />

                  <button
                    onClick={() => knob.set((knob.angle + 30) % 360)}
                    className="absolute inset-2 rounded-full transition-transform duration-200 ease-out"
                    style={{
                      background: `
                        repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px),
                        radial-gradient(circle at 35% 35%, #4a4a4a, #3a3a3a, #2a2a2a, #1a1a1a)
                      `,
                      border: "2px solid #0d0d0d",
                      boxShadow: `
                        inset 0 -8px 16px rgba(255,255,255,0.1),
                        inset 0 8px 16px rgba(0,0,0,0.6),
                        0 10px 20px rgba(0,0,0,0.9)
                      `,
                      transform: `rotate(${knob.angle}deg)`,
                    }}
                  >
                    <div
                      className="absolute top-2 left-1/2 w-1.5 h-6 rounded-full -ml-0.75"
                      style={{
                        background: "linear-gradient(180deg, #ff3300, #cc2200)",
                        boxShadow: "0 0 12px #ff3300, inset 0 1px 2px rgba(255,255,255,0.3)",
                      }}
                    />

                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "repeating-conic-gradient(from 0deg, transparent 0deg 8deg, rgba(0,0,0,0.3) 8deg 10deg)",
                      }}
                    />

                    <div
                      className="absolute top-1/2 left-1/2 w-6 h-6 -ml-3 -mt-3 rounded-full"
                      style={{
                        background: "radial-gradient(circle at 40% 40%, #3a3a3a, #2a2a2a, #1a1a1a)",
                        border: "1px solid #0d0d0d",
                        boxShadow: "inset 0 -2px 4px rgba(255,255,255,0.1), inset 0 2px 4px rgba(0,0,0,0.8)",
                      }}
                    />
                  </button>
                </div>

                <div
                  className="px-3 py-1 rounded"
                  style={{
                    background: "#0d0d0d",
                    border: "1px solid #1a1a1a",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.9)",
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "#00ff00",
                    textShadow: "0 0 8px #00ff00",
                  }}
                >
                  {Math.floor(knob.angle)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
