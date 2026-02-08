import { LightFeatherCursor } from "@/components/repo/light-feather-cursor";

const LightFeatherCursorDemo = () => {
  return (
    <div className="w-full h-screen">
      <LightFeatherCursor>
        <div className="relative z-10 h-full flex items-center justify-center text-white text-lg tracking-[0.5em] uppercase mix-blend-difference select-none pointer-events-none">
          Move your cursor
        </div>
      </LightFeatherCursor>
    </div>
  );
};

export default LightFeatherCursorDemo;
