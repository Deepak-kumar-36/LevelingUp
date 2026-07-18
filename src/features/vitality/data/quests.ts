export const VITALITY_BOUNTIES = [
  {
    id: 'vitality_water',
    title: 'Hydration Target',
    description: 'Log at least 2000ml of water intake today.',
    xpReward: 15,
  },
  {
    id: 'vitality_mobility',
    title: 'Joint Integrity',
    description: 'Complete a mobility or stretching session of any duration.',
    xpReward: 20,
  },
  {
    id: 'vitality_meditation',
    title: 'Mental Override',
    description: 'Complete a meditation or breathing session.',
    xpReward: 20,
  },
  {
    id: 'vitality_sleep',
    title: 'Deep Recovery',
    description: 'Log 7-9 hours of sleep with a quality score of 4 or 5.',
    xpReward: 25,
  },
  {
    id: 'vitality_pr',
    title: 'Limiter Broken',
    description: 'Achieve a new Personal Record in any exercise.',
    xpReward: 50,
  }
];

export const VITALITY_BOSSES = [
  {
    id: 'boss_insomnia_wraith',
    name: 'The Insomnia Wraith',
    description: 'A shadowy manifestation of fatigue and restless nights.',
    winCondition: 'Hit sleep target (7+ hours) 5 out of 7 nights this week.',
    winXp: 500,
    lossPenalty: 'Condition permanently capped at 80% for next week unless defeated.',
  },
  {
    id: 'boss_iron_golem',
    name: 'Iron Golem of Stagnation',
    description: 'A massive beast that solidifies when you stop moving.',
    winCondition: 'Log 3 workouts and 2 mobility sessions this week.',
    winXp: 600,
    lossPenalty: 'Lose all active workout streaks.',
  }
];
