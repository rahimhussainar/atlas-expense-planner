import React from 'react';
import { UserPlus } from 'lucide-react';

const ExpenseCard = ({ expense, index }: any) => (
  <div 
    className="relative group"
    style={{ transform: `rotate(${index % 2 === 0 ? '1' : '-1'}deg)` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#1f2023] dark:to-[#242529] rounded-lg transform -rotate-1 transition-transform group-hover:rotate-0" />
    <div className="relative bg-white dark:bg-[#252627] rounded-lg p-4 shadow-sm hover:shadow-lg transition-all border border-gray-200 dark:border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{expense.description}</h3>
          <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
            <UserPlus className="h-3 w-3 mr-1" />
            {expense.purchaser}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">${expense.amount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{expense.date}</p>
        </div>
      </div>
    </div>
  </div>
);

export default ExpenseCard; 