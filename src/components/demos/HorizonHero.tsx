const HorizonHero = () => {
  return (
    <div className="w-full h-full min-h-[400px] relative overflow-hidden flex items-center justify-center">
      <style>{`
        @keyframes horizon-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes horizon-line {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(0); opacity: 0; }
        }
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px hsla(38, 92%, 50%, 0.3); }
          50% { text-shadow: 0 0 40px hsla(38, 92%, 50%, 0.6), 0 0 80px hsla(38, 92%, 50%, 0.2); }
        }
        .horizon-bg {
          background: linear-gradient(180deg,
            hsl(225, 30%, 8%) 0%,
            hsl(260, 30%, 15%) 35%,
            hsl(340, 60%, 30%) 50%,
            hsl(30, 80%, 40%) 55%,
            hsl(38, 92%, 50%) 57%,
            hsl(30, 80%, 40%) 59%,
            hsl(225, 20%, 10%) 70%,
            hsl(225, 30%, 5%) 100%
          );
          background-size: 200% 200%;
          animation: horizon-shift 10s ease-in-out infinite;
        }
        .horizon-line-el {
          animation: horizon-line 4s ease-in-out infinite;
        }
      `}</style>
      <div className="horizon-bg absolute inset-0" />
      <div className="absolute left-0 right-0 top-1/2 h-[2px] flex justify-center">
        <div className="horizon-line-el w-3/4 h-full" style={{ background: "linear-gradient(90deg, transparent, hsl(38, 92%, 50%), transparent)" }} />
      </div>
      <div className="relative z-10 text-center px-8">
        <h1
          className="text-6xl font-bold tracking-tight mb-4"
          style={{ color: "white", animation: "text-glow 3s ease-in-out infinite" }}
        >
          HORIZON
        </h1>
        <p className="text-lg max-w-md mx-auto" style={{ color: "hsla(30, 40%, 80%, 0.7)" }}>
          Where the sky meets the infinite
        </p>
      </div>
    </div>
  );
};

export default HorizonHero;
