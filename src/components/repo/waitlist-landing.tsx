import { useEffect, useMemo, useState } from "react";

export interface WaitlistLandingProps {
  /** Path to the raw HTML template copied from user uploads. */
  templatePath?: string;
  /** Optional className for wrapper sizing/positioning. */
  className?: string;
}

const preserveLength = (from: string, to: string) => {
  if (from.length !== to.length) return from;
  return to;
};

const replaceEvery = (text: string, find: string, replacement: string) => {
  return text.split(find).join(replacement);
};

const copyReplacements: Array<[string, string]> = [
  ["WEBFLOW BUILDS", preserveLength("WEBFLOW BUILDS", "STARSHIP BUILDS")],
  ["WITH NO WEBFLOW", preserveLength("WITH NO WEBFLOW", "WITH NO BORDERS")],
  ["LIMITS", preserveLength("LIMITS", "FRONTS")],
  ["JAVASCRIPT COURSE FOR", preserveLength("JAVASCRIPT COURSE FOR", "ASTRONAUTIC COURSE F")],
  ["WEBFLOW DEVELOPERS", preserveLength("WEBFLOW DEVELOPERS", "STARPORT ENGINEERS")],
  ["COURSE CONTENT", preserveLength("COURSE CONTENT", "MISSION CONTENT")],
  ["API AND DATA", preserveLength("API AND DATA", "MAPS AND DATA")],
  ["DOM", preserveLength("DOM", "EVA")],
  ["MANIPULATIONS", preserveLength("MANIPULATIONS", "PROPULSIONS  ")],
  ["SMOOTH SCROLL", preserveLength("SMOOTH SCROLL", "ORBIT SCROLL ")],
  ["PAGE TRANSITIONS", preserveLength("PAGE TRANSITIONS", "PHASE TRANSITS ")],
  ["ADVANCED JS", preserveLength("ADVANCED JS", "ADVANCED AI")],
  ["LIBRARIES", preserveLength("LIBRARIES", "HABITATS ")],
  ["DEV SETUP", preserveLength("DEV SETUP", "OPS SETUP")],
  ["COMPILERS", preserveLength("COMPILERS", "THRUSTERS")],
  ["WORKFLOWS", preserveLength("WORKFLOWS", "TELEMETRY")],
  ["BACKEND", preserveLength("BACKEND", "DOCKING")],
  ["WEBFLOW API", preserveLength("WEBFLOW API", "STATION API")],
  ["VIBE CODING", preserveLength("VIBE CODING", "DEEP CODING")],
  ["PERFORMANCE", preserveLength("PERFORMANCE", "ENDURANCE  ")],
];

export const WaitlistLanding = ({
  templatePath = "/templates/codeflow.html",
  className,
}: WaitlistLandingProps) => {
  const [srcDoc, setSrcDoc] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    fetch(templatePath)
      .then((res) => res.text())
      .then((html) => {
        if (!isMounted) return;

        let patched = html;
        copyReplacements.forEach(([from, to]) => {
          patched = replaceEvery(patched, from, to);
        });

        patched = replaceEvery(patched, "Join Waitlist — thecodeflow.co", "Join Crewlist — thecodeflow.co");
        patched = replaceEvery(
          patched,
          "Level up your Webflow game by learning Javascript.",
          "Level up your starflight game by learning mission code."
        );

        setSrcDoc(patched);
      })
      .catch(() => {
        if (!isMounted) return;
        setSrcDoc("<html><body style='font-family:sans-serif;padding:20px'>Failed to load template.</body></html>");
      });

    return () => {
      isMounted = false;
    };
  }, [templatePath]);

  const wrapperClassName = useMemo(
    () => `relative h-screen w-full overflow-hidden bg-background ${className ?? ""}`,
    [className]
  );

  return (
    <div className={wrapperClassName}>
      <iframe
        title="Waitlist Landing"
        className="h-full w-full border-0"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default WaitlistLanding;
