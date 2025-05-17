import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CreateTripFormProps {
  onSuccess: () => void;
}

const CreateTripForm: React.FC<CreateTripFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: 'Required Field Missing',
        description: 'Please provide a trip title.',
        variant: 'destructive',
      });
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      toast({
        title: 'Invalid Dates',
        description: 'End date cannot be before start date.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert({
          trip_title: title,
          destination: destination || null,
          description: description || null,
          start_date: startDate?.toISOString() || null,
          end_date: endDate?.toISOString() || null,
          cover_image: null,
          created_by: user!.id,
        })
        .select()
        .single();
      if (error) throw error;
      toast({
        title: 'Trip Created!',
        description: 'Your trip has been successfully created.',
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error Creating Trip',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Trip Title <span className="text-red-500">*</span></Label>
        <Input 
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summer Vacation 2025"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input 
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Paris, France"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={date => 
                  startDate ? date < startDate : false
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about your trip..."
          rows={4}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="submit" 
          className="bg-atlas-forest hover:bg-atlas-forest/90"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Trip'}
        </Button>
      </div>
    </form>
  );
};

export default CreateTripForm; 