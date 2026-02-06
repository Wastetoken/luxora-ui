import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Swiper CSS - required for Skiper carousel components
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-cards";
import "swiper/css/effect-creative";
import "swiper/css/navigation";
import "swiper/css/pagination";

createRoot(document.getElementById("root")!).render(<App />);
