/**
 *
 * Get a random number between floor argument and ceil argument
 */
export function randomiseNumInRange(floor: number, ceil: number) {
  const range = ceil - floor + 1;
  return Math.floor(Math.random() * range) + floor;
}
