import { TextRoll } from "@/components/repo/text-roll-navigation";

const navItems = ["Home", "Components", "Pricing", "How to use", "Account", "Login"];

const TextRollDemo = () => {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-3 bg-neutral-950 rounded-lg p-8">
      {navItems.map((item) => (
        <div key={item} className="cursor-pointer">
          <TextRoll
            center
            className="text-4xl font-extrabold uppercase leading-[0.8] tracking-[-0.03em] text-white lg:text-5xl"
          >
            {item}
          </TextRoll>
        </div>
      ))}
    </div>
  );
};

export default TextRollDemo;
