import { useMemo } from 'react';

export function useStatCards({ participants, confirmedParticipants, activities, confirmedActivities, expenses, trip, countdownInfo, countdownProgress }: any) {
  // For demo, just sum all expenses with a 'fixed' flag
  const fixedCosts = useMemo(() => expenses.filter((e: any) => e.is_fixed), [expenses]);
  const totalFixedCosts = useMemo(() => fixedCosts.reduce((sum: number, e: any) => sum + (e.amount || 0), 0), [fixedCosts]);

  // Progress bar logic
  const participantProgress = participants.length > 0 ? (confirmedParticipants.length / participants.length) * 100 : 0;
  const activityProgress = activities.length > 0 ? (confirmedActivities.length / activities.length) * 100 : 0;

  // Stat cards (no JSX)
  const statCards = [
    {
      iconType: 'users',
      title: 'Participants',
      value: confirmedParticipants.length,
      subtitle: `confirmed of ${participants.length} invited`,
      progressBarType: 'participants',
      progressValue: participantProgress,
      progressMax: 100,
    },
    {
      iconType: 'activities',
      title: 'Activities',
      value: confirmedActivities.length,
      subtitle: `confirmed of ${activities.length} planned`,
      progressBarType: 'activities',
      progressValue: activityProgress,
      progressMax: 100,
    },
    {
      iconType: 'expenses',
      title: 'Expenses',
      value: `$${totalFixedCosts.toLocaleString()}`,
      subtitle: 'total fixed costs',
      progressBarType: null,
      progressValue: null,
      progressMax: null,
    },
  ];

  // Only show countdown card if trip hasn't started
  const showCountdown = countdownInfo.label !== 'Trip in Progress' && countdownInfo.label !== 'Trip Ended';
  if (showCountdown) {
    statCards.push({
      iconType: 'countdown',
      title: 'Countdown',
      value: countdownInfo.label,
      subtitle: countdownInfo.label === 'Trip in Progress' ? 'Trip has started' : countdownInfo.label === 'Trip Ended' ? 'Hope you had fun!' : 'until departure',
      progressBarType: 'countdown',
      progressValue: countdownProgress,
      progressMax: 100,
    });
  }

  return statCards;
}