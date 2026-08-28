export function percentageOf(amount: number, percentage: number): number {
  return Math.round((amount * percentage) / 100);
}

export function totalPercentage(percentages: number[]): number {
  return percentages.reduce((sum, value) => sum + value, 0);
}
