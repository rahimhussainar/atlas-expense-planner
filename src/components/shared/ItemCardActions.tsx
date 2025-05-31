import React from 'react';
import { Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItemCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
  position?: 'top-right' | 'bottom-right';
}

export const ItemCardActions: React.FC<ItemCardActionsProps> = ({
  onEdit,
  onDelete,
  className = "",
  position = 'top-right',
}) => {
  const positionClasses = position === 'top-right' 
    ? 'top-3 right-3' 
    : 'bottom-3 right-3';

  return (
    <div className={cn(
      `absolute ${positionClasses} flex space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10`,
      className
    )}>
      <button 
        className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm" 
        title="Edit" 
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </button>
      <button 
        className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm" 
        title="Delete" 
        onClick={onDelete}
      >
        <Trash className="h-4 w-4 text-red-500 dark:text-red-400" />
      </button>
    </div>
  );
}; 