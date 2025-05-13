
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Calendar, Users, CreditCard } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 flex flex-col md:flex-row items-center">
      {/* Left side - Content */}
      <div className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900">
          Effortlessly track group trips & expenses
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Plan trips, split costs evenly, and settle expenses with Trip Atlas. Perfect for traveling with friends, family, or colleagues.
        </p>
        
        <div className="mb-8">
          <form className="flex flex-col sm:flex-row gap-3">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white border-gray-200"
            />
            <Button className="bg-atlas-forest hover:bg-atlas-forest/80 text-white">
              Get Started
            </Button>
          </form>
          <p className="text-sm text-gray-500 mt-3">
            Free to use. No credit card required.
          </p>
        </div>
      </div>
      
      {/* Right side - Illustration */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-full max-w-md">
          <div className="absolute -top-6 -left-6 animate-float delay-100">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <MapPin className="text-atlas-rust" />
              <span className="font-medium">Trip to Barcelona</span>
            </div>
          </div>
          
          <div className="absolute top-20 -right-4 animate-float delay-300">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <Calendar className="text-atlas-forest" />
              <span className="font-medium">June 10-16</span>
            </div>
          </div>
          
          <div className="absolute bottom-20 -left-8 animate-float delay-500">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <Users className="text-atlas-gold" />
              <span className="font-medium">4 travelers</span>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -right-2 animate-float delay-700">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <CreditCard className="text-atlas-slate" />
              <span className="font-medium">$240 per person</span>
            </div>
          </div>
          
          <div className="bg-atlas-rust/20 border-4 border-atlas-rust h-80 w-80 rounded-full flex items-center justify-center">
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
