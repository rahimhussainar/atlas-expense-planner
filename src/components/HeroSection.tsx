import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-16">
      {/* Professional animated background with green accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          <div className="absolute top-0 -left-[10%] w-[500px] h-[500px] bg-[#4a6c6f]/5 dark:bg-[#4a6c6f]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -top-[20%] right-0 w-[600px] h-[600px] bg-[#4a6c6f]/3 dark:bg-[#4a6c6f]/5 rounded-full blur-[120px] animate-pulse delay-700" />
          <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#4a6c6f]/5 dark:bg-[#4a6c6f]/10 rounded-full blur-[120px] animate-pulse delay-1500" />
        </div>
      </div>

      <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-10">
          {/* Refined badge with subtle green accent */}
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-white/5 backdrop-blur-sm rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#4a6c6f] dark:text-white/80" />
            <span className="text-sm font-medium text-gray-700 dark:text-white/80">Welcome to Trip Atlas</span>
          </div>
          
          {/* Main heading */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="text-gray-900 dark:text-white">Plan Group Trips.</span>
              <br />
              <span className="bg-gradient-to-r from-[#4a6c6f] to-[#6a9c7f] dark:from-[#6a9c7f] dark:to-white bg-clip-text text-transparent animate-gradient bg-300% bg-gradient-x">
                Split Expenses Effortlessly.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              The intelligent way to organize trips with friends and family. 
              Track expenses, vote on activities, and settle up—all in one place.
            </p>
          </div>

          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="min-w-[220px] h-14 bg-[#4a6c6f] hover:bg-[#3a5c5f] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group text-base font-semibold"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="min-w-[220px] h-14 text-gray-700 dark:text-white border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 text-base font-medium"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </div>

          {/* Enhanced trust indicator */}
          <div className="pt-16">
            <p className="text-sm text-gray-600 dark:text-gray-500 mb-4">
              Trusted by over <span className="text-[#4a6c6f] dark:text-white font-semibold">1,000+ travelers</span> worldwide
            </p>
            {/* Social proof dots */}
            <div className="flex justify-center items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 h-2 rounded-full bg-[#4a6c6f]/20 dark:bg-white/20" 
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-50 dark:from-[#1a1b1f] via-gray-50/50 dark:via-[#1a1b1f]/50 to-transparent" />
    </section>
  );
};

export default HeroSection;
