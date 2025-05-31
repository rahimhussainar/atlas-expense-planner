import React from 'react';

const StatCard = ({ icon, title, value, subtitle, progressBar }: { icon: React.ReactNode, title: string, value: React.ReactNode, subtitle: string, progressBar?: React.ReactNode }) => (
  <div
    className="bg-white dark:bg-[#242529] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-[1.02] p-4 flex flex-col h-[150px] border border-gray-200 dark:border-white/10 cursor-pointer justify-between"
  >
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-2">{value}</div>
      <div className="text-gray-500 dark:text-gray-500 text-xs mb-1">{subtitle}</div>
    </div>
    {progressBar && <div className="mt-1">{progressBar}</div>}
  </div>
);

export default StatCard; 