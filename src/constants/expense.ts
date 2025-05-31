// Expense Categories
export const EXPENSE_CATEGORIES = [
  { value: 'accommodation', label: 'Accommodation', icon: '🏨' },
  { value: 'food', label: 'Food & Drinks', icon: '🍽️' },
  { value: 'transport', label: 'Transport', icon: '🚗' },
  { value: 'activities', label: 'Activities', icon: '🎟️' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'other', label: 'Other', icon: '📝' },
] as const;

// Category Badge Styles
export const EXPENSE_CATEGORY_BADGE_STYLES = {
  accommodation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  food: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  transport: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  activities: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  shopping: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
} as const;

// Split types
export const EXPENSE_SPLIT_TYPES = [
  { value: 'equal', label: 'Split Equally', description: 'Divide among all participants' },
  { value: 'custom', label: 'Custom Split', description: 'Specify custom amounts' },
  { value: 'by_participant', label: 'Select Participants', description: 'Choose who shares this expense' },
] as const; 