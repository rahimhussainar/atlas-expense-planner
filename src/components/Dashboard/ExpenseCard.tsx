import React from 'react';
import { UserPlus } from 'lucide-react';

const ExpenseCard = ({ expense, index }: any) => (
  <div 
    className="relative group"
    style={{ transform: `rotate(${index % 2 === 0 ? '1' : '-1'}deg)` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-[#23272b] dark:to-[#23272b] rounded-lg transform -rotate-1 transition-transform group-hover:rotate-0" />
    <div className="relative bg-white dark:bg-[#23272b] rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-black dark:text-white">{expense.description}</h3>
          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-300">
            <UserPlus className="h-3 w-3 mr-1" />
            {expense.purchaser}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-300">${expense.amount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-300">{expense.date}</p>
        </div>
      </div>
    </div>
  </div>
);

export default ExpenseCard; 