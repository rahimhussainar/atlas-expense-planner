import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesGrid from '@/components/FeaturesGrid';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-gray-100/30 dark:from-gray-900/50 dark:via-transparent dark:to-gray-800/30" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#4a6c6f]/5 dark:bg-[#4a6c6f]/3 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gray-300/20 dark:bg-gray-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#4a6c6f]/5 dark:bg-[#4a6c6f]/3 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <FeaturesGrid />
          <HowItWorks />
          <Testimonials />
          <Pricing />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
