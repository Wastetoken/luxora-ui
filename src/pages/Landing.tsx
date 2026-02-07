import ShaderBackground from '@/components/landing/ShaderBackground';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import CategoriesSection from '@/components/landing/CategoriesSection';
import Footer from '@/components/landing/Footer';

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ShaderBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <StatsSection />
        <CategoriesSection />
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
