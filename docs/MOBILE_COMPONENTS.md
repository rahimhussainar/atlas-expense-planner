# Mobile Components Guide

## Overview
This guide documents the mobile-first components created for the Atlas Expense Planner, focusing on providing a native-like experience on mobile devices.

## Components

### 1. MobileDrawer
A bottom sheet/drawer component that slides up from the bottom on mobile devices.

**Features:**
- Slides up to 90% of viewport height (customizable)
- Drag-to-dismiss by pulling down
- iOS safe area support
- Keyboard-aware (adjusts height when keyboard opens)
- Smooth animations
- Backdrop tap to close

**Usage:**
```tsx
<MobileDrawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add Activity"
  height="90vh"
>
  <YourContent />
</MobileDrawer>
```

**Props:**
- `isOpen`: boolean - Controls visibility
- `onClose`: () => void - Callback when closing
- `title`: string - Header title
- `height`: string - CSS height value (default: '90vh')
- `children`: ReactNode - Content to display
- `className`: string - Additional CSS classes

### 2. ResponsiveModal
A wrapper component that automatically uses MobileDrawer on mobile and Dialog on desktop.

**Features:**
- Automatic viewport detection
- Consistent API across devices
- Smooth transitions between mobile/desktop
- Preserves all functionality of both components

**Usage:**
```tsx
<ResponsiveModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  title="Add Expense"
  description="Track a new expense for your trip"
  mobileHeight="75vh"
>
  <ExpenseForm />
</ResponsiveModal>
```

**Props:**
- `isOpen`: boolean - Controls visibility
- `onOpenChange`: (open: boolean) => void - Callback for open state changes
- `title`: string - Modal title
- `description`: string (optional) - Description text
- `mobileHeight`: string - Height on mobile (default: '90vh')
- `maxWidth`: string - Max width on desktop (default: 'sm:max-w-[600px]')
- `children`: ReactNode - Content to display

### 3. useIsMobile Hook
A React hook that detects if the viewport is mobile-sized.

**Features:**
- Responsive to window resize
- Uses 767px breakpoint by default
- SSR safe

**Usage:**
```tsx
const isMobile = useIsMobile();

if (isMobile) {
  // Render mobile-specific UI
} else {
  // Render desktop UI
}
```

## Implementation Details

### Drag Gesture Handling
The MobileDrawer implements drag gestures using touch and mouse events:
- Tracks touch/mouse position
- Only allows dragging downward
- Closes if dragged > 100px or 25% of height
- Springs back if drag distance is below threshold

### Keyboard Handling
Uses the Visual Viewport API to detect keyboard presence:
- Adjusts content height when keyboard opens
- Ensures form inputs remain visible
- Adds padding to prevent content cutoff

### iOS Safe Areas
Uses CSS environment variables:
```css
padding-bottom: env(safe-area-inset-bottom);
```

### Performance Optimizations
- Uses CSS transforms for animations (GPU accelerated)
- Lazy mounting (only renders when visible)
- Event listeners cleaned up properly
- Body scroll locked when open

## Best Practices

1. **Content Scrolling**: Always wrap long content in scrollable containers
2. **Form Handling**: Ensure submit buttons are visible above keyboard
3. **Loading States**: Show loading indicators during async operations
4. **Error Handling**: Display errors within the drawer, not as separate toasts
5. **Accessibility**: Include proper ARIA labels and keyboard navigation

## Examples

### Activity Form (Current Implementation)
```tsx
<ResponsiveModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  title="Suggest an Activity"
  description="Propose a new activity for your trip"
>
  <SuggestActivityForm />
</ResponsiveModal>
```

### Expense Form (Future Implementation)
```tsx
<ResponsiveModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  title="Add Expense"
  description="Track expenses and split costs"
  mobileHeight="85vh" // Taller for more form fields
>
  <ExpenseForm />
</ResponsiveModal>
```

### Custom Implementation
```tsx
const MyFeature = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <MobileDrawer {...props}>
        <CustomMobileLayout />
      </MobileDrawer>
    );
  }
  
  return (
    <Dialog {...props}>
      <CustomDesktopLayout />
    </Dialog>
  );
};
```

## Testing

### Mobile Testing Checklist
- [ ] Drawer opens/closes smoothly
- [ ] Drag gesture works correctly
- [ ] Keyboard doesn't cover inputs
- [ ] Safe areas respected on iOS
- [ ] Backdrop closes drawer
- [ ] Content scrolls properly
- [ ] Animations are smooth (60fps)

### Cross-Device Testing
- Test on real devices when possible
- Use Chrome DevTools device emulation
- Test with keyboard open/closed
- Test in landscape orientation
- Test with different viewport heights 