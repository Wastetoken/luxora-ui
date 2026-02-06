import { useState } from "react";

const cards = [
  { title: "Design System", sub: "Tokens & Variables", gradient: "linear-gradient(135deg, hsl(38, 92%, 50%), hsl(25, 95%, 55%))" },
  { title: "Components", sub: "Reusable UI Parts", gradient: "linear-gradient(135deg, hsl(260, 70%, 55%), hsl(280, 80%, 60%))" },
  { title: "Animations", sub: "Motion & Transitions", gradient: "linear-gradient(135deg, hsl(180, 70%, 45%), hsl(200, 80%, 50%))" },
  { title: "Layout", sub: "Grid & Flex Patterns", gradient: "linear-gradient(135deg, hsl(340, 80%, 50%), hsl(320, 70%, 55%))" },
];

const DisplayCards = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background p-8">
      <div className="relative" style={{ width: 350, height: 300 }}>
        {cards.map((card, i) => {
          const isHovered = hovered === i;
          const offset = isHovered ? -20 : 0;
          const rotation = (i - 1.5) * 8 + (isHovered ? 0 : 0);
          const scale = isHovered ? 1.05 : 1;
          const z = isHovered ? 50 : i * 2;

          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-end cursor-pointer transition-all duration-500 ease-out"
              style={{
                background: card.gradient,
                transform: `rotate(${rotation}deg) translateY(${offset}px) scale(${scale})`,
                zIndex: z,
                boxShadow: isHovered
                  ? "0 25px 60px -12px rgba(0,0,0,0.5)"
                  : "0 10px 30px -8px rgba(0,0,0,0.3)",
              }}
            >
              <h3 className="text-2xl font-bold" style={{ color: "white" }}>{card.title}</h3>
              <p className="text-sm opacity-80" style={{ color: "rgba(255,255,255,0.8)" }}>{card.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DisplayCards;
