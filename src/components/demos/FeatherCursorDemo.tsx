import { FeatherCursor } from "@/components/repo/feather-cursor";

const FeatherCursorDemo = () => {
  return (
    <div className="w-full h-screen">
      <FeatherCursor>
        <div className="relative z-10 h-full flex items-center justify-center text-white text-lg tracking-[0.5em] uppercase mix-blend-difference select-none pointer-events-none">
          Move your cursor
        </div>
      </FeatherCursor>
    </div>
  );
};

export default FeatherCursorDemo;
