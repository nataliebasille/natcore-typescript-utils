import { RandomNumberGenerator } from './types';

export type GetInteger = {
  /**
   * Returns a random integer between 0 and max (exclusive)
   * @param rng A random number generator.
   * @param max The maximum value of the random integer.
   * @returns A random integer between 0 and max (exclusive)
   */
  (rng: RandomNumberGenerator, max: number): number;
  /**
   * Returns a random integer between min and max (exclusive)
   * @param rng A random number generator.
   * @param min The minimum value of the random integer.
   * @param max The maximum value of the random integer.
   * @returns A random integer between min and max (exclusive)
   */
  (rng: RandomNumberGenerator, min: number, max: number): number;
};

export const getInteger: GetInteger = (
  rng: RandomNumberGenerator,
  maxOrMin: number,
  possibleMax?: number,
): number => {
  const max = possibleMax === undefined ? maxOrMin : possibleMax;
  const min = possibleMax === undefined ? 0 : maxOrMin;

  return Math.floor(rng() * (max - min)) + min;
};
