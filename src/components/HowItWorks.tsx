import React from 'react';
import { UserPlus, FileText, DollarSign, CheckCircle } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: UserPlus,
      step: '01',
      title: 'Create Your Trip',
      description: 'Set up your trip details and invite friends with a simple link.',
    },
    {
      icon: FileText,
      step: '02',
      title: 'Plan Together',
      description: 'Add activities, accommodations, and let everyone vote on options.',
    },
    {
      icon: DollarSign,
      step: '03',
      title: 'Track Expenses',
      description: 'Log costs as you go. We\'ll calculate who owes what automatically.',
    },
    {
      icon: CheckCircle,
      step: '04',
      title: 'Settle Up',
      description: 'See a clear breakdown and settle debts with integrated payments.',
    },
  ];

  return (
    <section className="relative py-24 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-[#1a1b1f]/50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4a6c6f]/[0.02] dark:via-[#4a6c6f]/[0.05] to-transparent" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            How it works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get started in minutes. No complex setup required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line with gradient (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-[2px]">
                  <div className="h-full bg-gradient-to-r from-gray-300 dark:from-white/10 via-gray-200 dark:via-white/5 to-transparent" />
                </div>
              )}
              
              <div className="text-center lg:text-left space-y-4">
                <div className="relative inline-block">
                  <div className="w-24 h-24 mx-auto lg:mx-0 rounded-2xl bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-[#4a6c6f]/5 dark:hover:bg-[#4a6c6f]/10">
                    <step.icon className="w-10 h-10 text-[#4a6c6f] dark:text-white/80" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-5xl font-bold text-[#4a6c6f]/20 dark:text-white/10">
                    {step.step}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-[250px] mx-auto lg:mx-0">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => window.location.href = '/auth'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4a6c6f] hover:bg-[#3a5c5f] text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Planning Your Trip
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 