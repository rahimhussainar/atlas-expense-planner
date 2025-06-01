import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { 
  DollarSign, 
  Calendar as CalendarIcon, 
  Tag, 
  Users, 
  User,
  Split,
  FileText,
  Hotel,
  Utensils,
  Car,
  ShoppingBag,
  MapPin,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  name: string;
  avatar_url?: string;
}

interface Payer {
  participantId: string;
  amount: number;
}

interface Debtor {
  participantId: string;
  amount: number;
}

interface ExpenseFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  submitButtonText: string;
  participants: Participant[];
  initialValues?: any;
  mode?: 'add' | 'edit';
}

const EXPENSE_CATEGORIES = [
  { value: 'accommodation', label: 'Accommodation', icon: Hotel },
  { value: 'food', label: 'Food & Drinks', icon: Utensils },
  { value: 'activities', label: 'Activities', icon: MapPin },
  { value: 'transport', label: 'Transport', icon: Car },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'other', label: 'Other', icon: MoreHorizontal },
];

// Custom component to render selected value with icon
const CategoryDisplay = ({ value }: { value: string }) => {
  const category = EXPENSE_CATEGORIES.find(opt => opt.value === value);
  if (!category) return <span>Select category</span>;
  const Icon = category.icon;
  
  return (
    <span className="flex items-center gap-2 truncate">
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{category.label}</span>
    </span>
  );
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  isLoading,
  submitButtonText,
  participants,
  initialValues = {},
  mode = 'add',
}) => {
  const [description, setDescription] = useState(initialValues?.description || '');
  const [totalAmount, setTotalAmount] = useState(initialValues?.totalAmount || '');
  const [date, setDate] = useState(initialValues?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(initialValues?.category || 'other');
  
  // Payers state
  const [payerType, setPayerType] = useState<'single' | 'multiple'>(
    initialValues?.payers?.length > 1 ? 'multiple' : 'single'
  );
  const [singlePayerId, setSinglePayerId] = useState(initialValues?.payers?.[0]?.participantId || '');
  const [multiplePayers, setMultiplePayers] = useState<{ [key: string]: number }>(
    initialValues?.payers?.reduce((acc: any, p: Payer) => ({ ...acc, [p.participantId]: p.amount }), {}) || {}
  );
  
  // Split state
  const [splitType, setSplitType] = useState<'equal' | 'custom'>(
    initialValues?.debtorSplitType || 'equal'
  );
  const [selectedSplitParticipants, setSelectedSplitParticipants] = useState<string[]>(
    initialValues?.debtors?.map((d: Debtor) => d.participantId) || participants.map(p => p.id)
  );
  const [customSplits, setCustomSplits] = useState<{ [key: string]: number }>(
    initialValues?.debtors?.reduce((acc: any, d: Debtor) => ({ ...acc, [d.participantId]: d.amount }), {}) || {}
  );
  
  const [submitting, setSubmitting] = useState(false);

  // Calculate totals for validation
  const multiplePayersTotal = Object.values(multiplePayers).reduce((sum, amount) => sum + (Number(amount) || 0), 0);
  const customSplitsTotal = Object.entries(customSplits)
    .filter(([id]) => selectedSplitParticipants.includes(id))
    .reduce((sum, [, amount]) => sum + (Number(amount) || 0), 0);

  // Auto-calculate equal splits
  useEffect(() => {
    if (splitType === 'equal' && totalAmount && selectedSplitParticipants.length > 0) {
      const amountPerPerson = Number(totalAmount) / selectedSplitParticipants.length;
      const newSplits: { [key: string]: number } = {};
      selectedSplitParticipants.forEach(id => {
        newSplits[id] = amountPerPerson;
      });
      setCustomSplits(newSplits);
    }
  }, [totalAmount, selectedSplitParticipants, splitType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare payers data
    let finalPayers: Payer[];
    if (payerType === 'single') {
      finalPayers = [{ participantId: singlePayerId, amount: Number(totalAmount) }];
    } else {
      finalPayers = Object.entries(multiplePayers)
        .filter(([, amount]) => amount > 0)
        .map(([participantId, amount]) => ({ participantId, amount }));
    }

    // Prepare debtors data
    const finalDebtors = selectedSplitParticipants.map(participantId => ({
      participantId,
      amount: customSplits[participantId] || 0,
    }));

    const formData = {
      ...(mode === 'edit' && initialValues.id ? { id: initialValues.id } : {}),
      description,
      totalAmount: Number(totalAmount),
      date,
      category,
      payers: finalPayers,
      debtors: finalDebtors,
      debtorSplitType: splitType,
    };

    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
  };

  const toggleSplitParticipant = (participantId: string) => {
    setSelectedSplitParticipants(prev =>
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col bg-background dark:bg-[#242529] rounded-xl">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-6 p-4 pb-6">
          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#4a6c6f]" />
              <Label htmlFor="description" className="text-foreground font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
            </div>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this expense for?"
              required
              className="bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f] rounded-lg px-3 py-2.5 text-base"
            />
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#4a6c6f]" />
                <Label htmlFor="amount" className="text-foreground font-medium">
                  Total Amount <span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                  className="pl-10 bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f] rounded-lg py-2.5 text-base"
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-4 h-4 text-[#4a6c6f]" />
                <Label htmlFor="date" className="text-foreground font-medium">
                  Date <span className="text-red-500">*</span>
                </Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-muted dark:bg-[#2e2f33] border-border hover:bg-muted/80 rounded-lg py-2.5 text-base",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(new Date(date), "MMM d, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-0 bg-background dark:bg-[#2e2f33] z-[200]" 
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        // Format date locally to avoid timezone issues
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const day = String(selectedDate.getDate()).padStart(2, '0');
                        setDate(`${year}-${month}-${day}`);
                      }
                    }}
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-[#4a6c6f]" />
              <Label htmlFor="category" className="text-foreground font-medium">
                Category
              </Label>
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full bg-muted dark:bg-[#2e2f33] border-border text-foreground text-base rounded-lg py-2.5 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span]:truncate">
                <SelectValue>
                  <CategoryDisplay value={category} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-[#2e2f33] border-border rounded-lg z-[200]">
                {EXPENSE_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value} className="text-foreground hover:bg-[#4a6c6f] hover:text-white focus:bg-[#4a6c6f] focus:text-white">
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Who Paid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#4a6c6f]" />
              <Label className="text-foreground font-medium">
                Who paid for this? <span className="text-red-500">*</span>
              </Label>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center bg-muted dark:bg-[#2e2f33] rounded-md p-0.5 border border-border">
                <button
                  type="button"
                  aria-label="Single Payer"
                  className={cn(
                    "px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-2",
                    payerType === 'single' 
                      ? 'bg-[#4a6c6f] text-white' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => setPayerType('single')}
                >
                  <User className="h-4 w-4" />
                  Single Payer
                </button>
                <button
                  type="button"
                  aria-label="Multiple Payers"
                  className={cn(
                    "px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-2",
                    payerType === 'multiple' 
                      ? 'bg-[#4a6c6f] text-white' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => setPayerType('multiple')}
                >
                  <Users className="h-4 w-4" />
                  Multiple Payers
                </button>
              </div>
            </div>

            {payerType === 'single' ? (
              <Select value={singlePayerId} onValueChange={setSinglePayerId}>
                <SelectTrigger className="w-full bg-muted dark:bg-[#2e2f33] border-border text-foreground text-base rounded-lg py-2.5">
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent className="bg-card dark:bg-[#2e2f33] border-border rounded-lg z-[200]">
                  {participants.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-foreground hover:bg-[#4a6c6f] hover:text-white focus:bg-[#4a6c6f] focus:text-white">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2 bg-muted dark:bg-[#2e2f33] rounded-lg">
                    <span className="flex-1 text-sm font-medium">{p.name}</span>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={multiplePayers[p.id] || ''}
                        onChange={(e) => setMultiplePayers(prev => ({
                          ...prev,
                          [p.id]: Number(e.target.value) || 0
                        }))}
                        className="w-24 pl-7 py-1 text-sm bg-background dark:bg-[#242529] border-border"
                      />
                    </div>
                  </div>
                ))}
                {totalAmount && Math.abs(Number(totalAmount) - multiplePayersTotal) > 0.01 && (
                  <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                    {multiplePayersTotal > Number(totalAmount) ? 'Excess' : 'Missing'}: ${Math.abs(Number(totalAmount) - multiplePayersTotal).toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Split Between */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Split className="w-4 h-4 text-[#4a6c6f]" />
              <Label className="text-foreground font-medium">
                Split between <span className="text-red-500">*</span>
              </Label>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center bg-muted dark:bg-[#2e2f33] rounded-md p-0.5 border border-border">
                <button
                  type="button"
                  aria-label="Equal Split"
                  className={cn(
                    "px-3 py-1.5 rounded text-sm font-medium transition-all",
                    splitType === 'equal' 
                      ? 'bg-[#4a6c6f] text-white' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => setSplitType('equal')}
                >
                  Equal Split
                </button>
                <button
                  type="button"
                  aria-label="Custom Split"
                  className={cn(
                    "px-3 py-1.5 rounded text-sm font-medium transition-all",
                    splitType === 'custom' 
                      ? 'bg-[#4a6c6f] text-white' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => setSplitType('custom')}
                >
                  Custom Split
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Select who should split this expense {splitType === 'equal' ? 'equally' : ''}
            </p>

            <div className="space-y-2">
              {participants.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 p-2 bg-muted dark:bg-[#2e2f33] rounded-lg cursor-pointer hover:bg-muted/80 dark:hover:bg-[#2e2f33]/80"
                >
                  <input
                    type="checkbox"
                    checked={selectedSplitParticipants.includes(p.id)}
                    onChange={() => toggleSplitParticipant(p.id)}
                    className="rounded border-gray-300 dark:border-gray-600 text-[#4a6c6f] focus:ring-[#4a6c6f]"
                  />
                  <span className="flex-1 text-sm font-medium">{p.name}</span>
                  {splitType === 'custom' ? (
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={customSplits[p.id] || ''}
                        onChange={(e) => setCustomSplits(prev => ({
                          ...prev,
                          [p.id]: Number(e.target.value) || 0
                        }))}
                        disabled={!selectedSplitParticipants.includes(p.id)}
                        className="w-24 pl-7 py-1 text-sm bg-background dark:bg-[#242529] border-border disabled:opacity-50"
                      />
                    </div>
                  ) : (
                    totalAmount && selectedSplitParticipants.includes(p.id) && (
                      <span className="text-sm text-muted-foreground">
                        ${(Number(totalAmount) / selectedSplitParticipants.length).toFixed(2)}
                      </span>
                    )
                  )}
                </label>
              ))}
              {splitType === 'custom' && totalAmount && Math.abs(Number(totalAmount) - customSplitsTotal) > 0.01 && (
                <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                  {customSplitsTotal > Number(totalAmount) ? 'Excess' : 'Missing'}: ${Math.abs(Number(totalAmount) - customSplitsTotal).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed Footer */}
      <div className="flex-shrink-0 bg-background dark:bg-[#242529] border-t border-border px-4 py-3 sm:py-4">
        <div className="flex justify-end">
          <Button 
            type="submit"
            className="bg-[#4a6c6f] hover:bg-[#395457] text-white font-semibold rounded-lg px-6 py-2.5 transition shadow-sm hover:shadow-md w-full sm:w-auto"
            disabled={isLoading || submitting}
          >
            {isLoading || submitting ? 'Submitting...' : submitButtonText}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ExpenseForm; 