import React from 'react';
import StatCard from '@/components/Dashboard/StatCard';
import { Users, Activity as ActivityIcon, DollarSign, Calendar } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="text-blue-500" size={22} />,
  activities: <Calendar className="text-[#4a6c6f]" size={22} />,
  expenses: <DollarSign className="text-atlas-forest" size={22} />,
  countdown: <Calendar className="text-orange-500" size={22} />,
};

function renderProgressBar(type: string, value: number, max: number) {
  if (type === 'participants') {
    return (
      <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden relative">
        <div
          className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${value}%`, zIndex: 2 }}
        />
        <div
          className="absolute left-0 top-0 h-full bg-blue-300 rounded-full transition-all duration-300"
          style={{ width: `100%`, zIndex: 1 }}
        />
      </div>
    );
  }
  if (type === 'activities') {
    return (
      <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden relative">
        <div
          className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${value}%`, zIndex: 2 }}
        />
        <div
          className="absolute left-0 top-0 h-full bg-emerald-200 rounded-full transition-all duration-300"
          style={{ width: `100%`, zIndex: 1 }}
        />
      </div>
    );
  }
  if (type === 'countdown') {
    return (
      <div className="w-full h-3 bg-orange-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    );
  }
  return null;
}

const StatCardsSection = ({ statCards }: any) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {statCards.map((stat: any) => (
      <StatCard
        key={stat.title}
        icon={iconMap[stat.iconType]}
        title={stat.title}
        value={stat.value}
        subtitle={stat.subtitle}
        progressBar={stat.progressBarType ? renderProgressBar(stat.progressBarType, stat.progressValue, stat.progressMax) : null}
      />
    ))}
  </div>
);

export default StatCardsSection; 