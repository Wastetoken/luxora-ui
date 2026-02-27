import { FluidInversionCursor } from "@/components/repo/fluid-inversion-cursor";

const FluidInversionCursorDemo = () => {
  return (
    <div className="w-full h-screen">
      <FluidInversionCursor>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "5vw 6vw",
            fontFamily: "'Arial Black', 'Helvetica Neue', Helvetica, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(4rem, 11vw, 13rem)",
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            color: "#0a0a0a",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          BUILDING<br />
          TOMORROW<br />
          FOR&nbsp;TODAY
        </div>
      </FluidInversionCursor>
    </div>
  );
};

export default FluidInversionCursorDemo;
