import { RandomNumberGenerator } from "./types";

export function weighted(
  rng: RandomNumberGenerator,
  weights: number[]
): number {
  const total = weights.reduce((a, b) => a + b, 0);
  const random = rng() * total;
  let current = 0;
  for (let i = 0; i < weights.length; i++) {
    current += weights[i];
    if (random <= current) {
      return i;
    }
  }
  return weights.length - 1;
}
