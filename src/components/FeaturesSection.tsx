
import React from 'react';
import { Users, CreditCard, Calendar, MapPin } from 'lucide-react';

const features = [
  {
    icon: <MapPin className="h-10 w-10 text-atlas-rust" />,
    title: 'Trip Planning',
    description: 'Create detailed trip plans with destinations, dates, and invite friends to join your adventures.'
  },
  {
    icon: <CreditCard className="h-10 w-10 text-atlas-forest" />,
    title: 'Expense Tracking',
    description: 'Easily log expenses, categorize them, and see a clear breakdown of costs for everyone.'
  },
  {
    icon: <Users className="h-10 w-10 text-atlas-gold" />,
    title: 'Fair Splits',
    description: 'Split expenses evenly or customize how costs are shared among trip participants.'
  },
  {
    icon: <Calendar className="h-10 w-10 text-atlas-slate" />,
    title: 'Activity Management',
    description: 'Schedule activities, track who\'s participating, and convert plans into shared expenses.'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <div id="features" className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 bg-atlas-gray">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Everything you need for group travel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trip Atlas simplifies the logistics of traveling together so you can focus on creating memories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
