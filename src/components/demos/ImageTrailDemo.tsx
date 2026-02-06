import TrailWrapper from "@/components/repo/image-trail-effect";

const ImageTrailDemo = () => {
  return (
    <div className="w-full h-full bg-neutral-950">
      <TrailWrapper
        images={[
          "https://images.unsplash.com/photo-1721332163253-12d997232230?w=500&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1721332163634-b33379204051?w=500&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1721332164025-4724660d5716?w=500&auto=format&fit=crop&q=60",
        ]}
        className="w-full h-full flex items-center justify-center"
      >
        <h1 className="text-6xl font-bold text-neutral-800 pointer-events-none select-none">MOVE MOUSE</h1>
      </TrailWrapper>
    </div>
  );
};

export default ImageTrailDemo;
