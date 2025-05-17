
import React, { useState } from 'react';
import { Trip } from '@/types/trip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TripOverviewTab from './TripOverviewTab';
import TripActivitiesTab from './TripActivitiesTab';
import TripExpensesTab from './TripExpensesTab';

interface TripDetailTabsProps {
  trip: Trip;
  isCreator: boolean;
}

const TripDetailTabs: React.FC<TripDetailTabsProps> = ({ trip, isCreator }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activities">Activities</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <TripOverviewTab trip={trip} />
      </TabsContent>
      
      <TabsContent value="activities">
        <TripActivitiesTab tripId={trip.id} isCreator={isCreator} />
      </TabsContent>
      
      <TabsContent value="expenses">
        <TripExpensesTab tripId={trip.id} isCreator={isCreator} />
      </TabsContent>
    </Tabs>
  );
};

export default TripDetailTabs;
