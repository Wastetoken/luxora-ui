import { useMotionValue } from "framer-motion";
import { WavyBlock, WavyBlockItem } from "@/components/repo/wavy-text-block";

const WavyTextDemo = () => {
  const progress = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - rect.top) / rect.height;
    progress.set(y);
  };

  const handleMouseLeave = () => {
    progress.set(0);
  };

  const words = ["Creative", "Wavy", "Text", "Animation", "Effect"];
  
  return (
    <div
      className="w-full h-full bg-neutral-950 flex items-center justify-center cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <WavyBlock progress={progress}>
        {words.map((word, i) => (
          <WavyBlockItem key={i} index={i}>
            <span className="text-5xl font-bold text-white">{word}</span>
          </WavyBlockItem>
        ))}
      </WavyBlock>
    </div>
  );
};

export default WavyTextDemo;
