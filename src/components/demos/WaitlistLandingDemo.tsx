import { forwardRef } from "react";
import { WaitlistLanding } from "@/components/repo/waitlist-landing";

const WaitlistLandingDemo = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="h-full w-full">
      <WaitlistLanding />
    </div>
  );
});

WaitlistLandingDemo.displayName = "WaitlistLandingDemo";

export default WaitlistLandingDemo;
