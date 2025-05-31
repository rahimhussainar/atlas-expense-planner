import React from 'react';
import { Users, Calculator, Zap, Shield, TrendingUp, Globe } from 'lucide-react';

const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Group Management',
      description: 'Easily invite friends, family, or colleagues. Track participants and their expense contributions.'
    },
    {
      icon: Calculator,
      title: 'Smart Expense Splitting',
      description: 'Support for equal splits, custom amounts, and flexible calculations.'
    },
    {
      icon: TrendingUp,
      title: 'Democratic Planning',
      description: 'Vote on destinations, keep group decisions transparent and fair.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. Control access with custom privacy settings.'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Stay synchronized with real-time updates. See expenses and activities instantly.'
    },
    {
      icon: Globe,
      title: 'Works Anywhere',
      description: 'Access your trips from any device, online or offline support for global travel.'
    }
  ];

  return (
    <section className="relative py-32 px-4 md:px-6 lg:px-8" id="features">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Everything you need for <br />
            <span className="text-[#4a6c6f] dark:text-white">seamless group travel</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Powerful features designed to take the stress out of group trip planning and 
            expense management.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-[#4a6c6f]/20 dark:hover:border-white/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon with enhanced styling */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/5 p-3 flex items-center justify-center group-hover:bg-[#4a6c6f]/10 dark:group-hover:bg-white/10 transition-all duration-300">
                  <feature.icon className="w-full h-full text-[#4a6c6f] dark:text-white/80 group-hover:text-[#4a6c6f] dark:group-hover:text-white transition-colors duration-300" />
                </div>
                {/* Subtle glow effect on hover */}
                <div className="absolute -inset-2 bg-[#4a6c6f]/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#4a6c6f] dark:group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Subtle border gradient on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#4a6c6f]/10 via-transparent to-[#4a6c6f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid; 