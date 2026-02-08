import { LazerCursor } from "@/components/repo/lazer-cursor";

const LazerCursorDemo = () => {
  return (
    <div className="w-full h-full min-h-[500px]">
      <LazerCursor>
        <div className="relative z-10 h-full flex items-center justify-center text-white text-lg tracking-[0.5em] uppercase mix-blend-difference select-none pointer-events-none">
          Move your cursor
        </div>
      </LazerCursor>
    </div>
  );
};

export default LazerCursorDemo;
