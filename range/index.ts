export function range(size: number, startAt: number = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}
