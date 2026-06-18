export const RANKS = [
  { l: 'E', min: 0, max: 1000 },
  { l: 'D', min: 1000, max: 3000 },
  { l: 'C', min: 3000, max: 8000 },
  { l: 'B', min: 8000, max: 20000 },
  { l: 'A', min: 20000, max: 50000 },
  { l: 'S', min: 50000, max: 100000 },
  { l: 'National Rank Hunter', min: 100000, max: 250000 },
  { l: 'Monarch Candidate', min: 250000, max: 500000 },
  { l: 'Shadow Monarch', min: 500000, max: Infinity },
];

export class XpService {
  static getRank(totalXp: number) {
    const rank = RANKS.find((r) => totalXp >= r.min && totalXp < r.max);
    return rank ?? RANKS[RANKS.length - 1];
  }

  static getNextRank(totalXp: number) {
    const rankIdx = RANKS.findIndex((r) => totalXp >= r.min && totalXp < r.max);
    if (rankIdx === -1 || rankIdx === RANKS.length - 1) return null;
    return RANKS[rankIdx + 1];
  }

  static getXpProgress(totalXp: number) {
    const currentRank = this.getRank(totalXp);
    const nextRank = this.getNextRank(totalXp);
    if (!nextRank) return 100; // maxed out
    const progress = ((totalXp - currentRank.min) / (nextRank.min - currentRank.min)) * 100;
    return Math.min(100, Math.max(0, Math.round(progress)));
  }
}
