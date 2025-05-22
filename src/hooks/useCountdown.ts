import { useMemo } from 'react';

export function useCountdown(trip: any) {
  const countdownProgress = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return 0;
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const now = new Date();
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    if (now < start) return 0;
    if (now > end) return 100;
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }, [trip]);

  const countdownInfo = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return { label: '-', color: 'text-foreground' };
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const now = new Date();
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    if (now < start) {
      const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { label: `${diff} days`, color: 'text-foreground' };
    } else if (now >= start && now <= end) {
      return { label: 'Trip in Progress', color: 'text-foreground font-semibold' };
    } else {
      return { label: 'Trip Ended', color: 'text-foreground font-semibold' };
    }
  }, [trip]);

  return { countdownProgress, countdownInfo };
} 