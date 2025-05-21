import React from 'react';

const StatCard = ({ icon, title, value, subtitle, progressBar }: { icon: React.ReactNode, title: string, value: React.ReactNode, subtitle: string, progressBar?: React.ReactNode }) => (
  <div
    className="bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-[1.02] p-4 flex flex-col h-[150px] border border-border cursor-pointer justify-between"
    style={{ boxShadow: '0 2px 8px 0 rgba(16,30,54,0.06)' }}
  >
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="font-semibold text-sm text-card-foreground">{title}</span>
      </div>
      <div className="text-2xl font-bold text-card-foreground leading-tight mb-2">{value}</div>
      <div className="text-muted-foreground text-xs mb-1">{subtitle}</div>
    </div>
    {progressBar && <div className="mt-1">{progressBar}</div>}
  </div>
);

export default StatCard; 