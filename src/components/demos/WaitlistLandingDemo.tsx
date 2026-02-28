import { WaitlistLanding } from "@/components/repo/waitlist-landing";

const WaitlistLandingDemo = () => {
  return (
    <WaitlistLanding
      brandName="STARLABS"
      accentColor="#c4f74a"
      onSubmit={(data) => console.log("Waitlist signup:", data)}
    />
  );
};

export default WaitlistLandingDemo;
