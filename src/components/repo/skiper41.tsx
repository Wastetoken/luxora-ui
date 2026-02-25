import React from "react";

type ProgressiveBlurProps = {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
};

const ProgressiveBlur = ({
  className = "",
  backgroundColor = "#f5f4f3",
  position = "top",
  height = "150px",
  blurAmount = "4px",
}: ProgressiveBlurProps) => {
  const isTop = position === "top";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-20 select-none ${className}`}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height,
        background: isTop
          ? `linear-gradient(to bottom, ${backgroundColor}, transparent)`
          : `linear-gradient(to top, ${backgroundColor}, transparent)`,
        maskImage: isTop
          ? "linear-gradient(to bottom, black, transparent)"
          : "linear-gradient(to top, black, transparent)",
        WebkitMaskImage: isTop
          ? "linear-gradient(to bottom, black, transparent)"
          : "linear-gradient(to top, black, transparent)",
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    />
  );
};

const Skiper41 = () => {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#f5f4f3] text-black/40">
      <div className="relative h-full w-full overflow-y-auto">
        <div className="mt-20 grid content-start justify-items-center gap-6 px-5 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
            Scroll down to see the effect
          </span>
        </div>

        <div className="mx-auto mt-24 w-full max-w-lg space-y-20 px-5 pb-36 text-justify text-neutral-600">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Obcaecati, reiciendis eum vitae nostrum, temporibus repudiandae
              voluptatibus, natus iure ipsa velit odit quibusdam illum. Quaerat
              cumque laudantium libero reprehenderit perferendis quo nulla
              voluptate? Repellat tenetur labore exercitationem dicta libero
              voluptate suscipit, iusto ea assumenda. Ipsa enim, quidem atque
              modi error eaque, debitis perferendis, hic iste libero dignissimos
              ea! Quod inventore beatae aspernatur nulla rem perferendis aperiam
              at debitis delectus odit quia animi ex mollitia vero molestias
              itaque deleniti, quos exercitationem consequatur assumenda dolor?
              Quod reiciendis in similique reprehenderit commodi quo blanditiis
              nobis hic ea optio illum placeat officia alias quasi autem earum
              quos obcaecati, voluptatum corporis quisquam. Quisquam iste, quas
              explicabo omnis harum aut quam adipisci, voluptatem saepe
              accusantium doloribus repellendus amet culpa magnam ex et dolores
              accusamus commodi facere aliquam voluptatum alias? Officia
              expedita ut vel? Beatae deserunt sequi id eos libero suscipit
              totam cum, sed architecto atque quisquam et incidunt quod fuga
              ullam repellat assumenda quos ab, voluptatum sint nesciunt? Ad
              sapiente est laborum quam sint eius sequi. Eum, veniam
              dignissimos.
            </div>
          ))}
        </div>
      </div>

      <ProgressiveBlur
        position="bottom"
        backgroundColor="#f5f4f3"
        height="180px"
        blurAmount="8px"
      />
    </div>
  );
};

export { ProgressiveBlur, Skiper41 };