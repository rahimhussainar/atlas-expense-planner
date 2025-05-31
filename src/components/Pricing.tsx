import React from 'react';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      icon: Sparkles,
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for casual trips with friends',
      features: [
        'Up to 3 trips',
        'Up to 5 participants per trip',
        'Basic expense splitting',
        'Activity voting',
        'Mobile app access'
      ],
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '$9',
      period: '/month',
      description: 'For frequent travelers and larger groups',
      features: [
        'Unlimited trips',
        'Up to 20 participants per trip',
        'Advanced expense categories',
        'Receipt scanning',
        'Real-time collaboration',
        'Export to spreadsheet',
        'Priority support'
      ],
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      name: 'Team',
      icon: Crown,
      price: '$29',
      period: '/month',
      description: 'For travel agencies and organizations',
      features: [
        'Everything in Pro',
        'Unlimited participants',
        'Custom branding',
        'API access',
        'Advanced analytics',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee'
      ],
      buttonVariant: 'outline' as const,
      popular: false
    }
  ];

  return (
    <section className="relative py-32 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-[#1a1b1f]/50" id="pricing">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your travel needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl ${
                plan.popular
                  ? 'border-2 border-[#4a6c6f] dark:border-white/20 shadow-2xl scale-105 bg-white dark:bg-white/[0.05]'
                  : 'border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]'
              } p-8 transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'transform hover:scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="bg-[#4a6c6f] dark:bg-white text-white dark:text-[#1a1b1f] text-sm font-semibold px-6 py-2 rounded-full shadow-lg">
                    ⚡ Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center space-y-6 mb-8">
                <div className={`w-16 h-16 mx-auto rounded-xl ${
                  plan.popular 
                    ? 'bg-[#4a6c6f] dark:bg-white' 
                    : 'bg-gray-100 dark:bg-white/5'
                } p-3 flex items-center justify-center`}>
                  <plan.icon className={`w-full h-full ${
                    plan.popular 
                      ? 'text-white dark:text-[#1a1b1f]' 
                      : 'text-[#4a6c6f] dark:text-white/80'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="space-y-2">
                  <p className="text-5xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                    {plan.period && <span className="text-xl font-normal text-gray-500 dark:text-gray-400">{plan.period}</span>}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                </div>
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4a6c6f] dark:text-white/60 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Button
                onClick={() => navigate('/auth')}
                variant={plan.buttonVariant}
                className={`w-full h-12 text-base font-semibold ${
                  plan.popular
                    ? 'bg-[#4a6c6f] hover:bg-[#3a5c5f] text-white border-0 shadow-lg hover:shadow-xl'
                    : 'border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
                size="lg"
              >
                {plan.popular ? 'Start Free Trial' : 'Get Started'}
              </Button>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-20 text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            All plans include automatic updates and access to our mobile apps
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Questions? <a href="#" className="text-[#4a6c6f] dark:text-white hover:underline font-medium">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 