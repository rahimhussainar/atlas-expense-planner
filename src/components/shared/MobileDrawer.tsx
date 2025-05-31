import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  height?: string; // Default '90vh'
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  height = '90vh',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [drawerHeight, setDrawerHeight] = useState('90vh');
  const [isSafari, setIsSafari] = useState(false);
  const [stableViewportHeight, setStableViewportHeight] = useState(0);

  // Detect Safari
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent) || 
                           /iPad|iPhone|iPod/.test(userAgent);
    setIsSafari(isSafariBrowser);
  }, []);

  // Handle Safari's dynamic viewport using visual viewport API
  useEffect(() => {
    const updateViewportHeight = () => {
      let height = window.innerHeight;
      
      // Use visual viewport API for Safari if available
      if (window.visualViewport && isSafari) {
        height = window.visualViewport.height;
      }
      
      // For Safari, use the larger of the two heights to get a stable reference
      if (isSafari) {
        height = Math.max(height, stableViewportHeight || height);
        if (!stableViewportHeight || height > stableViewportHeight) {
          setStableViewportHeight(height);
        }
      }
      
      // Calculate modal height - use stable height for Safari
      const referenceHeight = isSafari ? (stableViewportHeight || height) : height;
      const vh = referenceHeight * 0.01;
      const heightMultiplier = isSafari ? 85 : 90; // More conservative for Safari
      const calculatedHeight = `${vh * heightMultiplier}px`;
      setDrawerHeight(calculatedHeight);
    };

    updateViewportHeight();

    // Listen for all possible viewport changes
    const events = ['resize', 'orientationchange'];
    
    events.forEach(event => {
      window.addEventListener(event, updateViewportHeight);
    });

    // Safari-specific visual viewport listeners
    if (window.visualViewport && isSafari) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      window.visualViewport.addEventListener('scroll', updateViewportHeight);
    }

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateViewportHeight);
      });
      
      if (window.visualViewport && isSafari) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
        window.visualViewport.removeEventListener('scroll', updateViewportHeight);
      }
    };
  }, [isSafari, stableViewportHeight]);

  // Safari-specific scroll lock with viewport compensation
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      
      if (isSafari) {
        // Get the current viewport state before locking
        const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
        
        // Safari-specific scroll lock with viewport consideration
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.height = `${currentViewportHeight}px`;
        document.body.style.overflow = 'hidden';
        
        // Prevent iOS bounce and ensure stable viewport
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = `${currentViewportHeight}px`;
        
        // Additional Safari fixes
        (document.body.style as any).webkitOverflowScrolling = 'auto';
        document.body.style.touchAction = 'none';
      } else {
        // Standard scroll lock
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = '0';
      }
      
      setIsVisible(true);
      // Small delay to trigger animation
      setTimeout(() => setDragY(0), 10);
    } else {
      setDragY(100);
      setTimeout(() => {
        setIsVisible(false);
        
        if (isSafari) {
          // Safari-specific scroll restore
          const scrollY = document.body.style.top;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.width = '';
          document.body.style.height = '';
          document.body.style.overflow = '';
          (document.body.style as any).webkitOverflowScrolling = '';
          document.body.style.touchAction = '';
          document.documentElement.style.overflow = '';
          document.documentElement.style.height = '';
          
          if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }
        } else {
          // Standard scroll restore
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
        }
      }, 300);
    }

    return () => {
      // Cleanup on unmount
      if (isSafari) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
        (document.body.style as any).webkitOverflowScrolling = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
      }
    };
  }, [isOpen, isSafari]);

  // Improved touch event handlers for Safari
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSafari) {
      e.preventDefault(); // Prevent Safari quirks
    }
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    // Prevent default on Safari to avoid conflicts
    if (isSafari) {
      e.preventDefault();
    }
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    // Only allow dragging down with improved threshold for Safari
    if (diff > 0) {
      const maxDrag = isSafari ? (stableViewportHeight || window.innerHeight) * 0.7 : window.innerHeight;
      setDragY(Math.min(diff, maxDrag));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isSafari) {
      e.preventDefault();
    }
    
    setIsDragging(false);
    
    // Safari-specific threshold - more forgiving
    const referenceHeight = isSafari ? (stableViewportHeight || window.innerHeight) : window.innerHeight;
    const threshold = isSafari ? 
      Math.min(60, referenceHeight * 0.15) : 
      Math.min(100, referenceHeight * 0.25);
    
    if (dragY > threshold) {
      onClose();
    } else {
      // Spring back
      setDragY(0);
    }
  };

  // Mouse event handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const diff = e.clientY - startY;
    if (diff > 0) {
      setDragY(Math.min(diff, window.innerHeight));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    const threshold = Math.min(100, window.innerHeight * 0.25);
    if (dragY > threshold) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className={cn(
          "fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        style={{ 
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          // Ensure backdrop covers the stable viewport
          height: isSafari ? `${stableViewportHeight || window.innerHeight}px` : '100vh',
        }}
      />
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed left-0 right-0 z-[101] bg-background rounded-t-[20px] shadow-xl transition-transform duration-300 ease-out",
          className
        )}
        style={{
          bottom: '0px', // Always anchor to actual bottom
          height: drawerHeight,
          maxHeight: isSafari ? '85vh' : '90vh',
          transform: `translateY(${isOpen ? dragY : 100}%)`,
          transition: isDragging ? 'none' : undefined,
          // Safari-specific fixes
          WebkitTransform: `translateY(${isOpen ? dragY : 100}%)`,
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          // Ensure consistent positioning
          position: 'fixed',
        }}
      >
        {/* Drag handle */}
        <div
          className="absolute top-0 left-0 right-0 h-12 cursor-grab active:cursor-grabbing flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          style={{
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b">
          <div className="flex-1">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-muted transition-colors relative z-10 ml-2"
            type="button"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content - Fixed height with stable calculations */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{
            height: `calc(${drawerHeight} - 7rem)`, // Fixed height calculation
            WebkitOverflowScrolling: 'touch',
            transform: 'translate3d(0,0,0)',
            // Additional Safari fixes
            WebkitTouchCallout: 'none',
            overscrollBehavior: 'contain',
            // Ensure touch targets align correctly
            position: 'relative',
            zIndex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}; 