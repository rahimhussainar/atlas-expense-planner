
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CTASection: React.FC = () => {
  return (
    <div className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 bg-atlas-blue/10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Ready to simplify your group travel?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join Trip Atlas today and experience stress-free travel expense management.
          </p>
          
          <div className="max-w-md mx-auto">
            <form className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="border-gray-200"
              />
              <Button className="bg-atlas-blue-dark hover:bg-atlas-blue text-white">
                Get Started - Free
              </Button>
            </form>
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
