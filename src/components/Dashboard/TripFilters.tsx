
import React from 'react';
import { Trip } from '@/types/trip';

// Custom hook to filter trips based on dates
export const useFilterTrips = (trips: Trip[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
  
  const upcomingTrips = trips.filter(trip => {
    if (!trip.start_date) return false;
    
    const startDate = new Date(trip.start_date);
    
    // A trip is upcoming if its start date is in the future
    const isUpcoming = startDate > today;
    
    console.log(`Trip: ${trip.title}, Start date: ${startDate}, Is upcoming: ${isUpcoming}`);
    
    return isUpcoming;
  });

  const currentTrips = trips.filter(trip => {
    if (!trip.start_date || !trip.end_date) return false;
    
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    
    // A trip is current if its start date is today or in the past AND its end date is today or in the future
    const isCurrent = startDate <= today && endDate >= today;
    
    console.log(`Trip: ${trip.title}, Start: ${startDate}, End: ${endDate}, Is current: ${isCurrent}`);
    
    return isCurrent;
  });

  const pastTrips = trips.filter(trip => {
    if (!trip.end_date) return false;
    
    const endDate = new Date(trip.end_date);
    
    // A trip is past if its end date is in the past
    const isPast = endDate < today;
    
    console.log(`Trip: ${trip.title}, End date: ${endDate}, Is past: ${isPast}`);
    
    return isPast;
  });

  // Combined upcoming and current trips for the "Upcoming" tab
  const allUpcomingTrips = [...upcomingTrips, ...currentTrips];

  return {
    allTrips: trips,
    upcomingTrips,
    currentTrips,
    pastTrips,
    allUpcomingTrips
  };
};
