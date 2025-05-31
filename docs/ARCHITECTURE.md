# Atlas Expense Planner - Architecture Guide

## Overview
This document outlines the refactored architecture for the Atlas Expense Planner, focusing on maintainability, modularity, and extensibility.

## Directory Structure

```
src/
├── components/
│   ├── shared/               # Reusable components across features
│   │   ├── DeleteConfirmationDialog.tsx
│   │   ├── EmptyStateCard.tsx
│   │   ├── ItemCardActions.tsx
│   │   └── ...
│   ├── Dashboard/
│   │   ├── ActivityCard.tsx
│   │   ├── ExpenseCard.tsx  # To be implemented
│   │   └── ...
├── constants/
│   ├── activity.ts          # Activity-specific constants
│   ├── expense.ts           # Expense-specific constants
│   └── ...
├── hooks/
│   ├── useCrudOperations.ts # Reusable CRUD operations hook
│   ├── useImageUpload.ts
│   └── ...
├── types/
│   ├── shared.ts           # Shared base types and interfaces
│   ├── activity.ts         # Activity-specific types
│   ├── expense.ts          # Expense-specific types
│   └── ...
├── utils/
│   ├── supabase-storage.ts # Storage utility functions
│   └── ...
```

## Key Design Patterns

### 1. Shared Base Types
All entities extend from common base types for consistency:

```typescript
// Base types that activities, expenses, etc. extend from
interface BaseItem {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  created_by_name?: string;
}

interface ItemWithCost {
  price_type: 'per_person' | 'total';
  price: number | null;
  total_price: number | null;
}
```

### 2. Reusable Components

#### ItemCardActions
A shared component for edit/delete actions on cards:
```typescript
<ItemCardActions onEdit={handleEdit} onDelete={handleDelete} />
```

#### EmptyStateCard
Consistent empty states across features:
```typescript
<EmptyStateCard
  icon={<Calendar className="w-12 h-12" />}
  title="No activities yet!"
  description="Be the first to suggest an activity."
  actionLabel="Suggest an Activity"
  onAction={handleAdd}
/>
```

#### DeleteConfirmationDialog
Standardized deletion flow:
```typescript
<DeleteConfirmationDialog
  isOpen={isOpen}
  onConfirm={handleConfirm}
  title="Delete Activity"
  description="This action cannot be undone."
/>
```

### 3. CRUD Operations Hook
The `useCrudOperations` hook provides consistent CRUD behavior:

```typescript
const crud = useCrudOperations<TripActivity>({ onRefresh: refetch });

// Usage
crud.openAddForm();
crud.openEditForm(item);
crud.handleDelete(item);
crud.confirmDelete(deleteFunction, successMessage);
```

### 4. Storage Utilities
Centralized storage operations with automatic cleanup:

```typescript
// Upload with automatic old image cleanup
const imageUrl = await uploadActivityImage(file, userId, oldImageUrl);

// Delete image from storage
await deleteActivityImage(imageUrl);
```

## Adding New Features (e.g., Expenses)

### 1. Define Types
Create types extending shared base types:
```typescript
// types/expense.ts
interface TripExpense extends BaseItem, ItemWithCost {
  trip_id: string;
  title: string;
  category: ExpenseCategory;
  // ... expense-specific fields
}
```

### 2. Create Constants
Define feature-specific constants:
```typescript
// constants/expense.ts
export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food & Drinks', icon: '🍽️' },
  // ...
];
```

### 3. Build Components
Use shared components and patterns:
```typescript
// components/Dashboard/ExpenseCard.tsx
const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="group relative">
      <ItemCardActions onEdit={onEdit} onDelete={onDelete} />
      {/* Expense-specific content */}
    </div>
  );
};
```

### 4. Implement CRUD Logic
Use the CRUD hook in your feature:
```typescript
const expenseCrud = useCrudOperations<TripExpense>({ onRefresh });

// Handle form submission
const handleSubmitExpense = async (data) => {
  // Process data
  await supabase.from('trip_expenses').insert(payload);
  expenseCrud.closeForm();
};
```

## Best Practices

1. **Type Safety**: Always extend from shared base types
2. **Component Reuse**: Use shared components wherever possible
3. **Consistent Patterns**: Follow established patterns for CRUD operations
4. **Storage Management**: Always clean up old files when updating
5. **Error Handling**: Use the toast system for user feedback
6. **Mobile First**: Ensure all components work well on mobile devices

## Future Enhancements

1. **Code Splitting**: Implement dynamic imports for large features
2. **Optimistic Updates**: Add optimistic UI updates for better UX
3. **Real-time Sync**: Implement Supabase real-time subscriptions
4. **Offline Support**: Add PWA capabilities with service workers
5. **Testing**: Add comprehensive test coverage for shared components 