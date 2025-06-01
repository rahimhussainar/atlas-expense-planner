import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MobileDrawer } from './MobileDrawer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';

interface ResponsiveModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  mobileHeight?: string;
  maxWidth?: string;
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  className,
  mobileHeight = '95vh',
  maxWidth = 'sm:max-w-[600px]',
}) => {
  const isMobile = useIsMobile();

  // Mobile view - use bottom drawer
  if (isMobile) {
    return (
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
        title={title}
        description={description}
        height={mobileHeight}
        className={className}
      >
        <div className="h-full">
          {children}
        </div>
      </MobileDrawer>
    );
  }

  // Desktop view - use dialog
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        maxWidth,
        "bg-background dark:bg-[#242529] border border-border max-h-[90vh] flex flex-col z-[102]",
        className
      )}>
        <DialogHeader className="flex-shrink-0 px-4 pt-4">
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex-1 bg-background dark:bg-[#242529] rounded-xl">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 