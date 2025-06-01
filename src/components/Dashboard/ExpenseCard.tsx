import React, { useState } from 'react';
import { 
  Users, 
  Receipt, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Hotel,
  Utensils,
  Car,
  ShoppingBag,
  MapPin,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemCardActions } from '@/components/shared/ItemCardActions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface Payer {
  participantId: string;
  name: string;
  amount: number;
}

interface Debtor {
  participantId: string;
  name: string;
  amount: number;
}

interface ExpenseCardProps {
  expense: {
    id: string;
    description: string;
    totalAmount: number;
    date: string;
    category?: string;
    payers: Payer[];
    debtors: Debtor[];
  };
  expanded?: boolean;
  onExpand?: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Category icon mapping
const categoryIcons = {
  accommodation: Hotel,
  food: Utensils,
  transport: Car,
  activities: MapPin,
  shopping: ShoppingBag,
  other: MoreHorizontal,
};

// Category badge styles matching activity section
const categoryStyles = {
  accommodation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  food: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  activities: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  transport: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  shopping: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300',
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense, 
  expanded = false,
  onExpand,
  onEdit, 
  onDelete 
}) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryIcon = (category?: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.other;
    return IconComponent;
  };

  const CategoryIcon = getCategoryIcon(expense.category);

  return (
    <div className="group relative">
      <div className={cn(
        "bg-white dark:bg-[#242529] rounded-xl border border-gray-200 dark:border-white/10 transition-all overflow-hidden",
        expanded 
          ? "shadow-sm" // Reduced shadow in expanded state
          : "shadow-sm hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-0.5"
      )}>
        {/* Edit/Delete icons - positioned at bottom right */}
        <ItemCardActions onEdit={onEdit} onDelete={onDelete} position="bottom-right" />
        
        {/* Main Content */}
        <div className={cn("p-4", expanded ? "pb-4" : "pb-4")}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-16 md:pr-12">
              <div className="flex items-center gap-2 mb-2">
                <CategoryIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                  {expense.description}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    categoryStyles[expense.category as keyof typeof categoryStyles] || categoryStyles.other
                  }`}
                >
                  {expense.category ? expense.category.charAt(0).toUpperCase() + expense.category.slice(1) : 'Other'}
                </span>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-500 dark:text-gray-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDate(expense.date)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatAmount(expense.totalAmount)}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                total
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <Collapsible open={expanded} onOpenChange={onExpand}>
          {!expanded && (
            <CollapsibleTrigger asChild>
              <button 
                className="w-full px-4 py-1 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center transition-colors duration-200 bg-transparent"
              >
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-500 transition-transform duration-200 ease-in-out" />
              </button>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <div className="px-4 py-4 bg-gray-50 dark:bg-[#1f2023]">
              {/* Payers Section */}
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-3">
                  <Receipt className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Paid by
                  </span>
                </div>
                <div className="space-y-2">
                  {expense.payers.map((payer, index) => (
                    <div key={payer.participantId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {payer.name}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatAmount(payer.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-200 dark:border-white/10 my-3" />

              {/* Debtors Section */}
              <div>
                <div className="flex items-center gap-1 mb-3">
                  <Users className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Split between
                  </span>
                </div>
                <div className="space-y-2">
                  {expense.debtors.map((debtor, index) => (
                    <div key={debtor.participantId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {debtor.name}
                      </span>
                      <span className={cn(
                        "font-medium",
                        expense.payers.some(p => p.participantId === debtor.participantId)
                          ? "text-gray-500 dark:text-gray-500"
                          : "text-red-600 dark:text-red-400"
                      )}>
                        {formatAmount(debtor.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
          {expanded && (
            <CollapsibleTrigger asChild>
              <button 
                className="w-full px-4 py-1 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center transition-colors duration-200 bg-gray-50 dark:bg-[#1f2023]"
              >
                <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-500 transition-transform duration-200 ease-in-out" />
              </button>
            </CollapsibleTrigger>
          )}
        </Collapsible>
      </div>
    </div>
  );
};

export default ExpenseCard; 