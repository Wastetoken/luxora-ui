import { WavyBlock, WavyBlockItem } from "@/components/repo/wavy-text-block";

const WavyTextDemo = () => {
  const words = ["Creative", "Wavy", "Text", "Animation", "Effect"];
  return (
    <div className="w-full h-full bg-neutral-950 flex items-center justify-center overflow-auto">
      <WavyBlock>
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
