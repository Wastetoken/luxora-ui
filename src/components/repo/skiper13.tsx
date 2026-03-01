"use client";

import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

const Skiper13 = () => {
  return (
    <section className="relative h-full bg-black">
      <Navbar_001 />
      <Main />
    </section>
  );
};

export { Navbar_001, Skiper13 };

const list = [
  {
    name: "Sydney",
    value: 21.1,
    date: "2025-01-01",
  },
  {
    name: "Melbourne",
    value: 15.2,
    date: "2025-01-02",
  },
  {
    name: "Brisbane",
    value: 10.3,
    date: "2025-01-03",
  },
  {
    name: "Mumbai",
    value: 8.4,
    date: "2025-01-04",
  },
  {
    name: "Los Angeles",
    value: 6.5,
    date: "2025-01-05",
  },
  {
    name: "Mexico City",
    value: 4.6,
    date: "2025-01-06",
  },
  {
    name: "London",
    value: 2.7,
    date: "2025-01-07",
  },
];

const Navbar_001 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef as React.RefObject<HTMLElement>, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  return (
    <motion.div
      initial={{ height: "79px" }}
      animate={{ height: isOpen ? "100vh" : "79px" }}
      transition={{ duration: 0.3 }}
      className="z-90 md:w-110 absolute left-1/2 flex w-full -translate-x-1/2 justify-center overflow-hidden"
    >
      <motion.div
        ref={menuRef}
        animate={{ gap: isOpen ? "8px" : "1px" }}
        className="md:w-110 absolute flex h-screen w-screen flex-col p-4"
      >
        <nav className="flex w-full items-center justify-between rounded-2xl bg-[#121212]/80 px-7 py-5 text-white backdrop-blur-sm">
          <NikeLogo />

          <button onClick={() => setIsOpen(!isOpen)} className="text-sm font-bold uppercase text-white">
            {isOpen ? "Close" : "Menu"}
          </button>
        </nav>

        {/* menu items */}
        <ul className="flex w-full flex-1 flex-col items-center justify-center gap-1 rounded-2xl bg-[#121212]/80 px-7 py-5 text-red-500 backdrop-blur-sm">
          {list.map((item, index) => (
            <li className="relative flex cursor-pointer flex-col items-center overflow-hidden" key={index}>
              <div className="flex items-start gap-2">
                <span className="text-4xl font-extrabold uppercase leading-[0.8] tracking-[-0.03em]">{item.name}</span>
                <span className="text-sm font-bold leading-[0.9] tracking-tighter">{item.value}k</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex w-full items-center justify-between rounded-2xl bg-[#121212]/80 p-4 text-sm tracking-tight text-white/60 backdrop-blur-sm">
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
        </div>
        <div className="flex w-full items-center justify-between rounded-2xl bg-[#121212]/80 px-7 py-4 font-medium tracking-tight text-white/60 backdrop-blur-sm">
          <button className="text-red-500">PB</button>
          <button>EN</button>
          <button>ES</button>
          <button>FR</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Main = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-black pt-52 font-sans text-[#F11313]">
      <div className="relative z-50 flex flex-col items-center justify-center text-4xl font-black uppercase leading-[0.8] tracking-tighter md:text-7xl lg:text-9xl">
        <div className="flex items-center gap-2">
          <NikeLogo className="lg:size-30 size-12 h-8 lg:h-24" />
          after dark tour
        </div>
        <div className="flex items-start">
          seoul <span className="mt-2 text-lg tracking-normal">10k</span> <br />
        </div>
        10 may 2025
        <br />
        6:00pm (kst)
      </div>

      <div className="relative mt-10 flex h-full flex-col items-center justify-center">
        <div className="absolute top-0 -translate-y-[90%]">
          <img src="/skiperv1/skiper7/bg.png" alt="" className="size-full object-cover" />
        </div>
        <div className="relative z-50 h-full w-screen p-4">
          <img
            src="https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/Ring/rings.mp4"
            alt=""
            className="rounded-4xl size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

const NikeLogo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="42" height="22" viewBox="0 0 42 22" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.9389 3.68059C13.6545 4.46711 12.9677 5.06994 11.9965 5.06994L12.9918 2.45373C13.9389 2.45373 14.2016 2.98593 13.9389 3.68059ZM16.879 3.65705C17.708 1.52828 16.5223 0 14.0112 0H10.9772L6.75989 10.9287H9.79391L11.4302 6.66887L12.0857 10.9287H15.0282L14.2257 6.391C15.2667 5.99773 16.4042 4.81561 16.879 3.65705ZM23.6556 7.33999L26.4993 0H23.4652L20.6938 7.1775C20.4094 7.91927 20.0528 8.28898 19.4841 8.28898C18.7731 8.28898 18.9635 7.6414 19.1515 7.1775L21.9277 0H18.8936L16.2861 6.69241C15.0764 9.79607 16.3343 11.1383 18.537 11.1383C21.1203 11.1383 22.6603 9.90911 23.6556 7.33999ZM31.3287 10.0928L35.2446 0H32.4492L30.1983 5.83526V0H27.3548L23.1374 10.9311H25.9571L28.1379 5.21123V10.9193L11.623 15.1745C9.08782 15.8362 7.03461 15.742 5.87546 14.9154C2.87998 12.7678 5.17417 8.49621 5.97185 7.1987C4.5211 8.77879 3.04867 10.3377 1.91362 12.059C0.151994 14.7271 -0.621577 17.6753 0.585773 19.5639C2.75949 22.9619 7.95036 21.3818 11.2591 20.0113L42.002 7.33999L31.3287 10.0928Z"
        fill="currentColor"
      />
    </svg>
  );
};

/**
 * Skiper 13 Navbar_001 — React + Framer Motion
 * Inspired by and adapted from https://afterdarktour.nike.com/en/home
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * Illustrations by https://afterdarktour.nike.com/en/home
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 * - Cannot use original Nike illustrations or videos for commercial purposes.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */
