import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TripDateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

const TripDateRangePicker: React.FC<TripDateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-muted dark:bg-[#2e2f33] border-border hover:bg-muted/80",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "MMM d, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-background dark:bg-[#2e2f33] z-[110]" 
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
              className="p-3"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-muted dark:bg-[#2e2f33] border-border hover:bg-muted/80",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "MMM d, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-background dark:bg-[#2e2f33] z-[110]" 
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              initialFocus
              disabled={date => 
                startDate ? date < startDate : false
              }
              className="p-3"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TripDateRangePicker;
