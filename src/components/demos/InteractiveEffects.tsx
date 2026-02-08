import { useState } from "react";

// Hero Section (StackPilot style)
export const HeroSection = () => {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative overflow-hidden">
      <style>{`
        @keyframes hero-float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-15px) rotate(2deg); } }
        @keyframes hero-bg-move { 0% { transform: translate(0, 0); } 100% { transform: translate(-50%, -50%); } }
      `}</style>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 50%, hsla(260, 70%, 20%, 0.5), transparent 70%), radial-gradient(ellipse at 70% 50%, hsla(38, 80%, 20%, 0.3), transparent 70%)",
      }} />
      <div className="relative z-10 text-center px-8 max-w-2xl">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-medium mb-6" style={{
          border: "1px solid hsla(38, 92%, 50%, 0.3)",
          color: "hsl(38, 92%, 50%)",
          background: "hsla(38, 92%, 50%, 0.1)",
        }}>
          NEW RELEASE
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-4 leading-tight" style={{ animation: "hero-float 6s ease-in-out infinite" }}>
          Build Faster.<br />Ship Smarter.
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          A component library for developers who care about craft.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium" style={{
            background: "hsl(38, 92%, 50%)",
            color: "hsl(225, 14%, 7%)",
          }}>
            Get Started
          </button>
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium border" style={{
            borderColor: "hsl(225, 12%, 20%)",
            color: "hsl(220, 14%, 80%)",
          }}>
            View Docs
          </button>
        </div>
      </div>
    </div>
  );
};

// Menu Animations
export const MenuAnimations = () => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const menuItems = [
    { label: "Products", items: ["Analytics", "Reports", "Dashboards"] },
    { label: "Solutions", items: ["Enterprise", "Startup", "Agency"] },
    { label: "Resources", items: ["Documentation", "API Reference", "Tutorials"] },
    { label: "Company", items: ["About", "Careers", "Contact"] },
  ];

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center pt-16 bg-background">
      <nav className="flex gap-1 relative">
        {menuItems.map((menu, i) => (
          <div key={i} className="relative">
            <button
              onPointerEnter={() => setActiveMenu(i)}
              onPointerLeave={() => setActiveMenu(null)}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors"
              style={{
                color: activeMenu === i ? "hsl(38, 92%, 50%)" : "hsl(220, 14%, 70%)",
                background: activeMenu === i ? "hsla(38, 92%, 50%, 0.1)" : "transparent",
              }}
            >
              {menu.label}
            </button>
            {activeMenu === i && (
              <div
                className="absolute top-full mt-2 left-0 rounded-lg p-2 min-w-[180px] border"
                style={{
                  background: "hsl(225, 14%, 11%)",
                  borderColor: "hsl(225, 12%, 16%)",
                  animation: "fadeSlideIn 0.2s ease-out",
                }}
                onPointerEnter={() => setActiveMenu(i)}
                onPointerLeave={() => setActiveMenu(null)}
              >
                <style>{`
                  @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
                `}</style>
                {menu.items.map((item, j) => (
                  <div
                    key={j}
                    className="px-3 py-2 text-sm rounded-md cursor-pointer transition-colors"
                    style={{ color: "hsl(220, 14%, 70%)" }}
                    onPointerEnter={(e) => {
                      (e.target as HTMLElement).style.background = "hsla(38, 92%, 50%, 0.1)";
                      (e.target as HTMLElement).style.color = "hsl(38, 92%, 50%)";
                    }}
                    onPointerLeave={(e) => {
                      (e.target as HTMLElement).style.background = "transparent";
                      (e.target as HTMLElement).style.color = "hsl(220, 14%, 70%)";
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};
