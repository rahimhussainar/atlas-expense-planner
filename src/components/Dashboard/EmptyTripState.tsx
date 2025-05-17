
import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyTripStateProps {
  message: string;
  description: string;
}

const EmptyTripState: React.FC<EmptyTripStateProps> = ({ message, description }) => {
  return (
    <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center py-16 px-8">
      <Plus className="h-12 w-12 text-gray-300 mb-4" />
      <h2 className="font-semibold text-xl mb-2">{message}</h2>
      <p className="text-gray-600 mb-2">{description}</p>
    </div>
  );
};

export default EmptyTripState;
