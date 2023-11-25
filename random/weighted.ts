import { RandomNumberGenerator } from './types';

/**
 * Returns a random index based on the weights provided.
 * @param rng A random number generator.
 * @param weights An array of weights.
 * @returns A random index based on the weights provided.
 */
export function weighted(
  rng: RandomNumberGenerator,
  weights: number[],
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
