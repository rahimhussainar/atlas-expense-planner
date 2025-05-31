import React from 'react';
import { ArrowRight, Users, CreditCard, Calendar, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Calendar className="w-6 h-6" />,
    title: 'Create your trip',
    description: 'Enter your destination, travel dates, and set the default currency for your trip expenses.',
    color: 'text-atlas-rust',
    bgColor: 'bg-atlas-rust'
  },
  {
    number: '02',
    icon: <Users className="w-6 h-6" />,
    title: 'Invite friends',
    description: 'Add travel companions by email. They\'ll get notified and can join your trip with one click.',
    color: 'text-atlas-forest',
    bgColor: 'bg-atlas-forest'
  },
  {
    number: '03',
    icon: <CreditCard className="w-6 h-6" />,
    title: 'Track expenses',
    description: 'Log expenses as they happen. Mark who paid and how the cost should be split among the group.',
    color: 'text-atlas-gold',
    bgColor: 'bg-atlas-gold'
  },
  {
    number: '04',
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Settle up',
    description: 'After the trip, view the simplified balance sheet showing who owes whom to settle all debts.',
    color: 'text-atlas-slate',
    bgColor: 'bg-atlas-slate'
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            How Trip Atlas works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Four simple steps to hassle-free group travel expenses
          </p>
        </div>
        
        {/* Desktop timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2" />
          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-background p-2 mx-auto w-fit">
                  <div className={`w-20 h-20 rounded-full ${step.bgColor} flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                    {step.number}
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <div className={`inline-flex p-3 rounded-xl ${step.bgColor}/10 ${step.color} mb-3`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute top-10 -right-4 text-muted-foreground/50 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative pl-12">
              {/* Vertical line */}
              {index < steps.length - 1 && (
                <div className="absolute left-10 top-20 bottom-0 w-0.5 bg-border" />
              )}
              
              <div className={`absolute left-0 w-20 h-20 rounded-full ${step.bgColor} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                {step.number}
              </div>
              
              <div className="bg-card p-6 rounded-xl shadow-sm border border-border ml-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`inline-flex p-2 rounded-lg ${step.bgColor}/10 ${step.color}`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                </div>
              <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
