import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-600">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>
      {actionLabel && onAction && (
        <Button
          className="flex items-center gap-2 bg-[#4a6c6f] hover:bg-[#395457] text-white rounded-lg font-semibold px-8 py-3 text-base shadow-sm hover:shadow-md focus:ring-2 focus:ring-[#4a6c6f]/30 focus:outline-none transition-all"
          onClick={onAction}
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}; 