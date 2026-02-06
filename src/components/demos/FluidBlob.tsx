const FluidBlob = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background min-h-[400px]">
      <style>{`
        @keyframes blob-morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 50% 70% 60%; }
          75% { border-radius: 40% 60% 70% 30% / 60% 40% 30% 70%; }
        }
        @keyframes blob-rotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes blob-glow {
          0%, 100% { filter: blur(0px) brightness(1); }
          50% { filter: blur(2px) brightness(1.2); }
        }
        .fluid-blob-main {
          width: 280px;
          height: 280px;
          background: linear-gradient(135deg, hsl(38, 92%, 50%), hsl(340, 80%, 55%), hsl(260, 70%, 55%));
          animation: blob-morph 8s ease-in-out infinite, blob-rotate 12s linear infinite;
        }
        .fluid-blob-shadow {
          width: 260px;
          height: 260px;
          background: linear-gradient(135deg, hsl(260, 70%, 55%), hsl(38, 92%, 50%));
          animation: blob-morph 8s ease-in-out infinite reverse, blob-rotate 16s linear infinite reverse;
          opacity: 0.3;
          position: absolute;
          filter: blur(30px);
        }
      `}</style>
      <div className="relative flex items-center justify-center">
        <div className="fluid-blob-shadow" />
        <div className="fluid-blob-main" />
      </div>
    </div>
  );
};

export default FluidBlob;
