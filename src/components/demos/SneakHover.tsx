import { useState } from "react";

const items = [
  { text: "Design", color: "hsl(38, 92%, 50%)" },
  { text: "Develop", color: "hsl(260, 70%, 55%)" },
  { text: "Deploy", color: "hsl(340, 80%, 55%)" },
  { text: "Iterate", color: "hsl(180, 70%, 45%)" },
  { text: "Scale", color: "hsl(120, 60%, 45%)" },
];

const SneakHover = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-lg">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative overflow-hidden cursor-pointer border-b transition-all duration-500"
            style={{ borderColor: "hsl(225, 12%, 16%)" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out"
              style={{
                background: item.color,
                transform: hovered === i ? "translateX(0)" : "translateX(-100%)",
                opacity: 0.15,
              }}
            />
            <div className="relative flex items-center justify-between py-5 px-4">
              <span
                className="text-3xl font-bold tracking-tight transition-all duration-500"
                style={{
                  color: hovered === i ? item.color : "hsl(220, 14%, 70%)",
                  transform: hovered === i ? "translateX(12px)" : "translateX(0)",
                }}
              >
                {item.text}
              </span>
              <span
                className="text-sm font-mono transition-all duration-500"
                style={{
                  color: hovered === i ? item.color : "hsl(220, 10%, 35%)",
                  opacity: hovered === i ? 1 : 0.5,
                }}
              >
                0{i + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SneakHover;
