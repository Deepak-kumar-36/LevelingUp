/**
 * Calendar grid utility.
 *
 * Generates a flat array representing a month's calendar grid.
 * Empty slots before the first day and after the last day are `null`.
 * Each row is 7 cells wide (Mon–Sun).
 */

/**
 * Build a calendar grid for the given year/month.
 * @param year  Full year (e.g. 2026)
 * @param month Zero-indexed month (0 = January)
 * @returns Array of day numbers (1-based) or null for empty cells
 */
export function buildMonthGrid(year: number, month: number): (number | null)[] {
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array<null>(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete the last row
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}
