
import React from 'react';
import { MapPin, Calendar, Users, CreditCard } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="w-full pt-8 md:pt-12 pb-12 md:py-16 px-4 md:px-6 lg:px-12 flex flex-col md:flex-row items-center">
      {/* Left side - Content */}
      <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 md:mb-6 text-gray-900">
          Effortlessly track group trips & expenses
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
          Plan trips, split costs evenly, and settle expenses with Trip Atlas. Perfect for traveling with friends, family, or colleagues.
        </p>
      </div>
      
      {/* Right side - Illustration */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-full max-w-md">
          <div className="absolute -top-4 md:-top-6 -left-4 md:-left-6 animate-float delay-100">
            <div className="bg-white p-3 md:p-4 rounded-lg shadow-lg flex items-center gap-2 md:gap-3">
              <MapPin className="text-atlas-rust h-4 w-4" />
              <span className="font-medium text-sm md:text-base">Trip to Barcelona</span>
            </div>
          </div>
          
          <div className="absolute top-16 md:top-20 -right-2 md:-right-4 animate-float delay-300">
            <div className="bg-white p-3 md:p-4 rounded-lg shadow-lg flex items-center gap-2 md:gap-3">
              <Calendar className="text-atlas-forest h-4 w-4" />
              <span className="font-medium text-sm md:text-base">June 10-16</span>
            </div>
          </div>
          
          <div className="absolute bottom-16 md:bottom-20 -left-6 md:-left-8 animate-float delay-500">
            <div className="bg-white p-3 md:p-4 rounded-lg shadow-lg flex items-center gap-2 md:gap-3">
              <Users className="text-atlas-gold h-4 w-4" />
              <span className="font-medium text-sm md:text-base">4 travelers</span>
            </div>
          </div>
          
          <div className="absolute -bottom-4 md:-bottom-6 -right-1 md:-right-2 animate-float delay-700">
            <div className="bg-white p-3 md:p-4 rounded-lg shadow-lg flex items-center gap-2 md:gap-3">
              <CreditCard className="text-atlas-slate h-4 w-4" />
              <span className="font-medium text-sm md:text-base">$240 per person</span>
            </div>
          </div>
          
          <div className="bg-atlas-rust/20 border-4 border-atlas-rust h-64 w-64 md:h-80 md:w-80 rounded-full flex items-center justify-center">
            <div className="bg-white h-3/5 w-3/5 rounded-full shadow-lg flex items-center justify-center">
              <div className="bg-atlas-gold/30 h-2/3 w-2/3 rounded-full flex items-center justify-center">
                <div className="bg-atlas-forest h-1/2 w-1/2 rounded-full flex items-center justify-center">
                  <div className="bg-atlas-slate h-2/3 w-2/3 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
