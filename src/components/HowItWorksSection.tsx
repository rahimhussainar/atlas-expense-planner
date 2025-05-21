import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Create your trip',
    description: 'Enter your destination, travel dates, and set the default currency for your trip expenses.'
  },
  {
    number: '02',
    title: 'Invite friends',
    description: 'Add travel companions by email. They\'ll get notified and can join your trip with one click.'
  },
  {
    number: '03',
    title: 'Track expenses',
    description: 'Log expenses as they happen. Mark who paid and how the cost should be split among the group.'
  },
  {
    number: '04',
    title: 'Settle up',
    description: 'After the trip, view the simplified balance sheet showing who owes whom to settle all debts.'
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <div id="how-it-works" className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            How Trip Atlas works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Four simple steps to hassle-free group travel expenses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="mb-4 text-5xl font-bold text-muted-foreground">{step.number}</div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
