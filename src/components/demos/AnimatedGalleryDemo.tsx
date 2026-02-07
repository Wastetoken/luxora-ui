import { ContainerScroll, GalleryContainer, GalleryCol } from "@/components/repo/animated-gallery";

const AnimatedGalleryDemo = () => {
  return (
    <div className="bg-neutral-950 w-full min-h-screen">
      <ContainerScroll className="min-h-[200vh] py-20">
        <div className="flex flex-col items-center justify-center mb-10 text-center z-10 relative">
          <h2 className="text-4xl font-bold text-white mb-4">3D Scroll Gallery</h2>
          <p className="text-neutral-400">Scroll down to see the transformation</p>
        </div>
        <GalleryContainer className="h-[500px]">
          <GalleryCol yRange={["0%", "-20%"]}>
            {[
              "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/18-fractal-glass-hero-bg.jpg",
              "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/17-fractal-glass-texture-light-gradients.jpg",
              "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/13-green-fractal-light-background.jpg",
            ].map((src, i) => (
              <div key={i} className="h-64 w-full rounded-xl overflow-hidden">
                <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </GalleryCol>
          <GalleryCol yRange={["-20%", "0%"]} style={{ marginTop: '-50px' }}>
            {[
              "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png",
              "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png",
              "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/47-fractal-phantom-gradient-stripes.jpg",
            ].map((src, i) => (
              <div key={i} className="h-64 w-full rounded-xl overflow-hidden">
                <img src={src} alt={`Gallery ${i + 4}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </GalleryCol>
          <GalleryCol yRange={["0%", "-20%"]}>
            {[
              "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/48-cool-tone-spatial-gradient.jpg",
              "https://pub-391b349e64bf41c79cbb737e77691d35.r2.dev/Blue-Energy-Beam.jpg",
              "https://pub-391b349e64bf41c79cbb737e77691d35.r2.dev/Dusk-Amber-Gradient.png",
            ].map((src, i) => (
              <div key={i} className="h-64 w-full rounded-xl overflow-hidden">
                <img src={src} alt={`Gallery ${i + 7}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </GalleryCol>
        </GalleryContainer>
      </ContainerScroll>
    </div>
  );
};

export default AnimatedGalleryDemo;
