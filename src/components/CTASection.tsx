
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <div className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 bg-atlas-blue/10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Start planning your next adventure together
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of travelers who manage expenses effortlessly and focus on making memories.
          </p>
          
          <div className="max-w-md mx-auto">
            <Button size="lg" className="bg-atlas-rust hover:bg-atlas-rust/90 text-white font-medium px-8 py-6 h-auto text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Explore Trip Atlas
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
