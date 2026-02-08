import { LiquidGLCursor } from "@/components/repo/liquid-gl-cursor";

const LiquidGLCursorDemo = () => {
  return (
    <div className="w-full h-full min-h-[500px]">
      <LiquidGLCursor>
        <div className="relative z-10 h-full flex flex-col items-start justify-center max-w-3xl mx-auto px-12 text-white pointer-events-none select-none">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Stand on the shoulders of giants.
          </h1>
          <p className="text-lg leading-relaxed text-neutral-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid suscipit eius
            reiciendis provident. Harum nisi atque consectetur dolorum eos itaque at quo beatae!
          </p>
        </div>
      </LiquidGLCursor>
    </div>
  );
};

export default LiquidGLCursorDemo;
