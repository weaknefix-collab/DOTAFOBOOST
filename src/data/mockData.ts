import type { Booster, Rank, Role } from '@/types';

// Empty initial data - no fake boosters
export const mockBoosters: Booster[] = [];

export const ranks: Rank[] = [
  'Herald',
  'Guardian',
  'Crusader',
  'Archon',
  'Legend',
  'Ancient',
  'Divine',
  'Immortal',
];

export const roles: Role[] = [
  'Carry',
  'Mid',
  'Offlane',
  'Support',
  'Hard Support',
];

export const languages = [
  'English',
  'Russian',
  'Ukrainian',
  'Spanish',
  'Portuguese',
  'German',
  'French',
  'Chinese',
];

export const getRankColor = (rank: Rank): string => {
  const colors: Record<Rank, string> = {
    'Herald': '#4a4a4a',
    'Guardian': '#6b6b6b',
    'Crusader': '#8b8b8b',
    'Archon': '#a0a0a0',
    'Legend': '#c0c0c0',
    'Ancient': '#d0d0d0',
    'Divine': '#e0e0e0',
    'Immortal': '#ffffff',
  };
  return colors[rank];
};

export const getRankIndex = (rank: Rank): number => {
  return ranks.indexOf(rank);
};
