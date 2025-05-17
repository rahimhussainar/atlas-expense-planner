
import React from 'react';
import { Trip } from '@/types/trip';

// Custom hook to filter trips based on dates
export const useFilterTrips = (trips: Trip[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison

  let debugInfo: string[] = [];

  const upcomingTrips = trips.filter(trip => {
    if (!trip.start_date) return false;
    const startDate = new Date(trip.start_date);
    const isUpcoming = startDate > today;
    if (process.env.NODE_ENV === 'development') debugInfo.push(`[Upcoming] ${trip.title}: ${startDate} > ${today} = ${isUpcoming}`);
    return isUpcoming;
  });

  const currentTrips = trips.filter(trip => {
    if (!trip.start_date || !trip.end_date) return false;
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const isCurrent = startDate <= today && endDate >= today;
    if (process.env.NODE_ENV === 'development') debugInfo.push(`[Current] ${trip.title}: ${startDate} <= ${today} && ${endDate} >= ${today} = ${isCurrent}`);
    return isCurrent;
  });

  const pastTrips = trips.filter(trip => {
    if (!trip.end_date) return false;
    const endDate = new Date(trip.end_date);
    const isPast = endDate < today;
    if (process.env.NODE_ENV === 'development') debugInfo.push(`[Past] ${trip.title}: ${endDate} < ${today} = ${isPast}`);
    return isPast;
  });

  // Combined upcoming and current trips for the "Upcoming" tab
  const allUpcomingTrips = [...upcomingTrips, ...currentTrips];

  if (process.env.NODE_ENV === 'development' && debugInfo.length > 0) {
    // Only log once per filter run
    console.log('TripFilters:', debugInfo.join(' | '));
  }

  return {
    allTrips: trips,
    upcomingTrips,
    currentTrips,
    pastTrips,
    allUpcomingTrips
  };
};
