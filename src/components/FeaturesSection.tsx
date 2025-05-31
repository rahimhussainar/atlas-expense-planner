import React from 'react';
import { Users, CreditCard, Calendar, MapPin, Sparkles, Shield, Globe, PieChart } from 'lucide-react';

const features = [
  {
    icon: <MapPin className="h-10 w-10" />,
    title: 'Smart Trip Planning',
    description: 'Create detailed trip plans with destinations, dates, and invite friends to join your adventures.',
    color: 'text-atlas-rust',
    bgColor: 'bg-atlas-rust/10',
    borderColor: 'border-atlas-rust/20'
  },
  {
    icon: <CreditCard className="h-10 w-10" />,
    title: 'Expense Tracking',
    description: 'Easily log expenses, categorize them, and see a clear breakdown of costs for everyone.',
    color: 'text-atlas-forest',
    bgColor: 'bg-atlas-forest/10',
    borderColor: 'border-atlas-forest/20'
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: 'Fair Splits',
    description: 'Split expenses evenly or customize how costs are shared among trip participants.',
    color: 'text-atlas-gold',
    bgColor: 'bg-atlas-gold/10',
    borderColor: 'border-atlas-gold/20'
  },
  {
    icon: <Calendar className="h-10 w-10" />,
    title: 'Activity Management',
    description: 'Schedule activities, track who\'s participating, and convert plans into shared expenses.',
    color: 'text-atlas-slate',
    bgColor: 'bg-atlas-slate/10',
    borderColor: 'border-atlas-slate/20'
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: 'Secure & Private',
    description: 'Your trip data is encrypted and private. Only invited members can see trip details.',
    color: 'text-atlas-forest',
    bgColor: 'bg-atlas-forest/10',
    borderColor: 'border-atlas-forest/20'
  },
  {
    icon: <Globe className="h-10 w-10" />,
    title: 'Multi-Currency',
    description: 'Support for multiple currencies with real-time conversion rates for international trips.',
    color: 'text-atlas-rust',
    bgColor: 'bg-atlas-rust/10',
    borderColor: 'border-atlas-rust/20'
  },
  {
    icon: <PieChart className="h-10 w-10" />,
    title: 'Visual Analytics',
    description: 'Beautiful charts and insights to understand your spending patterns across trips.',
    color: 'text-atlas-gold',
    bgColor: 'bg-atlas-gold/10',
    borderColor: 'border-atlas-gold/20'
  },
  {
    icon: <Sparkles className="h-10 w-10" />,
    title: 'Smart Suggestions',
    description: 'Get AI-powered recommendations for activities and budget optimization.',
    color: 'text-atlas-slate',
    bgColor: 'bg-atlas-slate/10',
    borderColor: 'border-atlas-slate/20'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Everything you need for group travel
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trip Atlas simplifies the logistics of traveling together so you can focus on creating memories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative bg-card p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border-2 ${feature.borderColor} overflow-hidden hover:-translate-y-2`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className={`mb-5 inline-flex p-3 rounded-xl ${feature.bgColor} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
              
              {/* Corner accent */}
              <div className={`absolute -top-2 -right-2 w-20 h-20 ${feature.bgColor} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
