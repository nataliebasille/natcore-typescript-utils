import { RandomNumberGenerator } from "./types";

export type GetInteger = {
  (rng: RandomNumberGenerator, max: number): number;
  (rng: RandomNumberGenerator, min: number, max: number): number;
};

export const getInteger: GetInteger = (
  rng: RandomNumberGenerator,
  maxOrMin: number,
  possibleMax?: number
): number => {
  const max = possibleMax === undefined ? maxOrMin : possibleMax;
  const min = possibleMax === undefined ? 0 : maxOrMin;

  return Math.floor(rng() * (max - min)) + min;
};
