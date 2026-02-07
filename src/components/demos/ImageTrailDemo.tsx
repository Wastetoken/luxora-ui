import TrailWrapper from "@/components/repo/image-trail-effect";

const ImageTrailDemo = () => {
  return (
    <div className="w-full h-full bg-neutral-950">
      <TrailWrapper
        images={[
          "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/18-fractal-glass-hero-bg.jpg",
          "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png",
          "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/48-cool-tone-spatial-gradient.jpg",
        ]}
        className="w-full h-full flex items-center justify-center"
      >
        <h1 className="text-6xl font-bold text-neutral-800 pointer-events-none select-none">MOVE MOUSE</h1>
      </TrailWrapper>
    </div>
  );
};

export default ImageTrailDemo;
