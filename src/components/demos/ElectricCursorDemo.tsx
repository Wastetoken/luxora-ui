import { ElectricCursor } from "@/components/repo/electric-cursor";

const ElectricCursorDemo = () => {
  return (
    <div className="w-full h-screen">
      <ElectricCursor>
        <div className="relative z-10 h-full flex items-center justify-center text-white text-lg tracking-[0.5em] uppercase mix-blend-difference select-none pointer-events-none">
          Move your cursor
        </div>
      </ElectricCursor>
    </div>
  );
};

export default ElectricCursorDemo;
