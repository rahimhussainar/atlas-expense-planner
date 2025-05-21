import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyTripStateProps {
  message: string;
  description: string;
}

const EmptyTripState = ({ message, description }: { message: string, description: string }) => (
  <div className="bg-card rounded-lg shadow flex flex-col items-center justify-center py-16 px-8 border border-border">
    <div className="text-4xl text-muted-foreground mb-2">+</div>
    <div className="text-lg font-semibold text-card-foreground mb-1">{message}</div>
    <div className="text-muted-foreground mb-2">{description}</div>
    <div className="text-muted-foreground text-sm">Start planning your next adventure!</div>
  </div>
);

export default EmptyTripState;
