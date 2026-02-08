import { ReptileCursor } from "@/components/repo/reptile-cursor";

const ReptileCursorDemo = () => {
  return (
    <div className="w-full h-screen">
      <ReptileCursor>
        <div className="relative z-10 h-full flex items-center justify-center text-white text-lg tracking-[0.5em] uppercase mix-blend-difference select-none pointer-events-none">
          Move your cursor
        </div>
      </ReptileCursor>
    </div>
  );
};

export default ReptileCursorDemo;
