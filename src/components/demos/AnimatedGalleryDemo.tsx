import { ContainerScroll, GalleryContainer, GalleryCol } from "@/components/repo/animated-gallery";

const AnimatedGalleryDemo = () => {
  return (
    <div className="bg-neutral-950 w-full h-full rounded-lg overflow-hidden">
      <div className="relative h-full overflow-auto">
        <ContainerScroll className="min-h-[800px] py-20">
          <div className="flex flex-col items-center justify-center mb-10 text-center z-10 relative">
            <h2 className="text-4xl font-bold text-white mb-4">3D Scroll Gallery</h2>
            <p className="text-neutral-400">Scroll down to see the transformation</p>
          </div>
          <GalleryContainer className="h-[500px]">
            <GalleryCol yRange={["0%", "-20%"]}>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 w-full rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center">
                  <span className="text-4xl font-bold text-neutral-600">{i}</span>
                </div>
              ))}
            </GalleryCol>
            <GalleryCol yRange={["-20%", "0%"]} style={{ marginTop: '-50px' }}>
              {[4, 5, 6].map(i => (
                <div key={i} className="h-64 w-full rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center">
                  <span className="text-4xl font-bold text-neutral-600">{i}</span>
                </div>
              ))}
            </GalleryCol>
            <GalleryCol yRange={["0%", "-20%"]}>
              {[7, 8, 9].map(i => (
                <div key={i} className="h-64 w-full rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center">
                  <span className="text-4xl font-bold text-neutral-600">{i}</span>
                </div>
              ))}
            </GalleryCol>
          </GalleryContainer>
        </ContainerScroll>
      </div>
    </div>
  );
};

export default AnimatedGalleryDemo;
