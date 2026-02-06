import { useEffect, useState } from "react";

const MilHardware = () => {
  const [scanAngle, setScanAngle] = useState(0);
  const [blinkOn, setBlinkOn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanAngle((a) => (a + 2) % 360);
    }, 30);
    const blink = setInterval(() => setBlinkOn((b) => !b), 800);
    return () => {
      clearInterval(interval);
      clearInterval(blink);
    };
  }, []);

  const data = [
    { label: "LAT", value: "34.0522° N" },
    { label: "LNG", value: "118.2437° W" },
    { label: "ALT", value: "2,847 FT" },
    { label: "HDG", value: `${(scanAngle * 0.5).toFixed(0)}°` },
    { label: "SPD", value: "0 KTS" },
    { label: "STATUS", value: blinkOn ? "ACTIVE" : "" },
  ];

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center p-8" style={{ background: "hsl(120, 20%, 5%)" }}>
      <div className="w-full max-w-2xl">
        {/* Radar */}
        <div className="flex gap-8 items-start">
          <div className="relative" style={{ width: 200, height: 200 }}>
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {[30, 60, 90].map((r) => (
                <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="hsla(120, 80%, 40%, 0.2)" strokeWidth="1" />
              ))}
              <line x1="100" y1="10" x2="100" y2="190" stroke="hsla(120, 80%, 40%, 0.15)" strokeWidth="1" />
              <line x1="10" y1="100" x2="190" y2="100" stroke="hsla(120, 80%, 40%, 0.15)" strokeWidth="1" />
              <line
                x1="100"
                y1="100"
                x2={100 + 88 * Math.cos((scanAngle * Math.PI) / 180)}
                y2={100 + 88 * Math.sin((scanAngle * Math.PI) / 180)}
                stroke="hsla(120, 90%, 50%, 0.8)"
                strokeWidth="2"
              />
              {/* Blips */}
              <circle cx="130" cy="70" r="3" fill="hsla(120, 90%, 50%, 0.8)" />
              <circle cx="75" cy="120" r="2" fill="hsla(120, 90%, 50%, 0.6)" />
              <circle cx="140" cy="130" r="2.5" fill="hsla(120, 90%, 50%, 0.7)" />
            </svg>
          </div>

          {/* Data readout */}
          <div className="flex-1 font-mono text-xs space-y-2" style={{ color: "hsl(120, 80%, 50%)" }}>
            <div className="border-b pb-1 mb-2 text-sm font-bold tracking-widest" style={{ borderColor: "hsla(120, 80%, 40%, 0.3)" }}>
              SYS // MIL-HW v3.2
            </div>
            {data.map((d) => (
              <div key={d.label} className="flex justify-between">
                <span style={{ color: "hsla(120, 60%, 40%, 0.8)" }}>{d.label}</span>
                <span>{d.value}</span>
              </div>
            ))}
            <div className="mt-4 pt-2" style={{ borderTop: "1px solid hsla(120, 80%, 40%, 0.2)" }}>
              <div className="flex gap-2 flex-wrap">
                {["COMMS", "NAV", "TGTG", "FLIR"].map((sys) => (
                  <span
                    key={sys}
                    className="px-2 py-0.5 rounded text-[10px] tracking-wider"
                    style={{
                      border: "1px solid hsla(120, 80%, 40%, 0.4)",
                      background: "hsla(120, 80%, 40%, 0.1)",
                    }}
                  >
                    {sys}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilHardware;
