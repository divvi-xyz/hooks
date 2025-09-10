/**
 * Utility functions for BigInt operations
 *
 * Note: JavaScript's built-in Math.min() and Math.max() don't support BigInt values
 * and will throw a TypeError if used with them.
 */

/**
 * Returns the smaller of two BigInt values
 * @param a First BigInt value
 * @param b Second BigInt value
 * @returns The smaller of the two values
 */
export const min = (a: bigint, b: bigint): bigint => (a < b ? a : b)

/**
 * Returns the larger of two BigInt values
 * @param a First BigInt value
 * @param b Second BigInt value
 * @returns The larger of the two values
 */
export const max = (a: bigint, b: bigint): bigint => (a > b ? a : b)

/**
 * Simulates ceiling division for BigInt values
 * @param dividend The number to be divided
 * @param divisor The number to divide by
 * @returns The ceiling of the division result
 */
export const ceilDiv = (dividend: bigint, divisor: bigint): bigint => {
  return (dividend + divisor - 1n) / divisor
}
