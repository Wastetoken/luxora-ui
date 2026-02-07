import { MenuAnimation } from "@/components/repo/menu-animations";

const animationIds = [
  { id: "dots-grid", title: "Dots Grid" },
  { id: "text-morph", title: "Text Morph" },
  { id: "plus-morph", title: "Plus Morph" },
  { id: "circle-pulse", title: "Circle Pulse" },
  { id: "cube-spin", title: "Cube Spin" },
  { id: "stacked-circles", title: "Stacked Circles" },
  { id: "rotating-circles", title: "Rotating Circles" },
  { id: "isometric-cube", title: "Isometric Cube" },
  { id: "expanding-circles", title: "Expanding Circles" },
] as const;

const MenuAnimationsDemo = () => {
  return (
    <div className="w-full h-full bg-neutral-950 flex flex-wrap items-center justify-center gap-6 p-8 overflow-auto">
      {animationIds.map(({ id, title }) => (
        <MenuAnimation key={id} title={title} animationId={id} />
      ))}
    </div>
  );
};

export default MenuAnimationsDemo;
