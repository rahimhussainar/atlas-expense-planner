
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for occasional travelers',
    features: [
      'Up to 3 trips',
      'Basic expense tracking',
      'Up to 5 participants per trip',
      '30-day history'
    ],
    buttonText: 'Get started',
    buttonVariant: 'outline' as const
  },
  {
    name: 'Pro',
    price: '$5',
    period: 'per month',
    description: 'For frequent travelers',
    popular: true,
    features: [
      'Unlimited trips',
      'Advanced expense categories',
      'Unlimited participants',
      'Currency conversion',
      'Trip templates',
      'Priority support'
    ],
    buttonText: 'Get Pro',
    buttonVariant: 'default' as const
  },
  {
    name: 'Team',
    price: '$12',
    period: 'per month',
    description: 'For travel companies & groups',
    features: [
      'Everything in Pro',
      'Team management',
      'Admin controls',
      'Advanced reporting',
      'API access',
      'Dedicated support'
    ],
    buttonText: 'Contact sales',
    buttonVariant: 'outline' as const
  }
];

const PricingSection: React.FC = () => {
  return (
    <div id="pricing" className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for your travel needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white p-8 rounded-xl border ${plan.popular ? 'border-atlas-blue shadow-lg' : 'border-gray-200 shadow-sm'} relative flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-atlas-blue-dark text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <div className="flex-1">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-atlas-green shrink-0 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                variant={plan.buttonVariant} 
                className={plan.popular ? 'bg-atlas-blue-dark hover:bg-atlas-blue text-white' : ''}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
