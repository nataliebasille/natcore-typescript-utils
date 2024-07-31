/**
 * Returns an array of numbers from startAt to startAt + size - 1
 *
 * @param size - The size of the array to create
 * @param startAt - The number to start at
 * @returns An array of numbers from startAt to startAt + size - 1
 */
export function range(size: number, startAt: number = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}
