import Decimal from 'break_infinity.js';
import { d0 } from './constants';
import type { Numeric } from './types';

declare global {
  interface Math {
    clamp: (value: number, min: number, max: number) => number;
  }
}

/**
 * @param value - The value to be clamped
 * @param min - The lower bound
 * @param max - The upper bound
 * @returns Clamped number
 */
Math.clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

/**
 * @param string - The string to be converted to kebab case
 * @returns The string converted to kebab case
 */
export const toKebabCase = (string: string) => (
  string.replaceAll(/([a-z])([A-Z])/g, '$1-$2').replaceAll(/[\s_]+/g, '-').toLowerCase()
)

/**
 * Overrides behavior of division from break_infinity.js
 * @param value - DecimalSource - a divisor
 * @returns Decimal - a divided number
 */
Decimal.prototype.div = function (value) {
  // Avoid conversion to Decimal
  if (typeof value === "number") {
    if (-1e-307 < value && value < 1e-307)
      return Decimal.fromMantissaExponent(this.m * 1e-307 / value, this.e + 307);
    // A safe range where we can just divide the mantissa directly
    return Decimal.fromMantissaExponent(this.m / value, this.e);
  }

  const decimal = typeof value === "string" ? new Decimal(value) : value;
  return Decimal.fromMantissaExponent(this.m / decimal.m, this.e - decimal.e);
}

/**
 * @param value - string to be parsed
 * @returns Decimal
 */
export const parseDecimal = (value: string): Decimal => {
  const parts = value.split('e')
  if (!(parts[0] || parts[1] || parts[2]))
    return Decimal.fromMantissaExponent_noNormalize(Number.NaN, Number.NaN)

  let mantissa = parts[0] ? Number(parts[0]) : 1
  let exponent = parts[1] ? Number(parts[1]) : (parts[2] ? 1 : 0)
  exponent *= parts[2] ? 10 ** Number(parts[2]) : 1
  if (Number.isNaN(mantissa) || Number.isNaN(exponent))
    return Decimal.fromMantissaExponent_noNormalize(Number.NaN, Number.NaN)

  mantissa *= 10 ** (exponent % 1)
  exponent = Math.trunc(exponent)
  return Decimal.fromMantissaExponent(mantissa, exponent)
}

// Caching different formatters to not initialize them every time
const formatters: Record<string, Intl.NumberFormat> = {}
const getFormatter = (digits: number, notation?: 'scientific') => {
  const keyString = `${digits}${notation?.[0] ?? ''}`
  formatters[keyString] ??= new Intl.NumberFormat('en-US', {
    maximumFractionDigits: notation === undefined ? digits : undefined,
    maximumSignificantDigits: notation === undefined ? undefined : 1 + digits,
    notation,
    roundingMode: 'trunc',
    signDisplay: 'never'
  });
  return formatters[keyString]
}

/**
 * This function displays the numbers such as 1,234 or 1.00e1234 or 1.00e1.234M.
 * @param input - value to format
 * @param accuracy - how many decimal points that are to be displayed
 * @returns Formatted number
 */
export const formatNumber = (
  input: Numeric,
  accuracy = 0,
  long = false
): string => {
  // oxlint-disable-next-line eqeqeq
  if (input == undefined)
    return '0 [und.]'

  const inputType = typeof input

  let power = 0
  let mantissa = 0
  if (inputType === 'number') {
    if (Number.isNaN(input))
      return '0 [NaN]'
    // oxlint-disable-next-line no-unsafe-type-assertion
    const num = input as number
    if (num < 0) {
      return `-${formatNumber(-num, accuracy)}`
    } else if (num > 0) {
      power = Math.floor(Math.log10(num))
      mantissa = num / 10 ** power
    }
  } else if (input instanceof Decimal) {
    if (Number.isNaN(input.m))
      return '0 [NaN]'
    if (input.lt(d0))
      return `-${formatNumber(input.negated(), accuracy)}`
    power = input.e
    mantissa = input.m
  } else {
    return '0 [und.]'
  }

  if (!Number.isFinite(power))
    return 'Infinity'

  if (input instanceof Decimal && power >= (long ? 12 : 6)) {
    // Fix mantissa
    if (mantissa > 9.9999999) {
      mantissa = 1
      power += 1
    } else if (0.9999999 < mantissa && mantissa < 1) {
      mantissa = 1
    }
  }

  if (power < (long ? 12 : 6)) {
    // oxlint-disable-next-line no-unsafe-type-assertion
    let standard = inputType === 'number' ? input as number : mantissa * 10 ** power
    const tooSmallForStandard = power < -3 || (0 < accuracy && accuracy < -power)

    // Rounds up if the number experiences a rounding error
    const powerDelta = tooSmallForStandard ? power : 0
    const delta = 10 ** (powerDelta - accuracy)
    if (delta - standard % delta < 1e-7)
      standard += 1e-7 * 10 ** powerDelta

    if (tooSmallForStandard)
      return getFormatter(accuracy, 'scientific').format(standard).toLowerCase() // We want 'e' to be in lower case
    return getFormatter(Math.clamp(accuracy + 1 - power, 0, accuracy)).format(standard)
  }

  if (power < 1e4) {
    // If the power is less than 1e6 then apply standard scientific notation
    // Makes mantissa be rounded down to 'accuracy' decimal places

    // Formatter for 'accuracy' decimal places (only if power < 1000)
    const formatter = getFormatter(power < 1000 ? Math.max(2, accuracy) : 0)
    const mantissaLook = mantissa === 1 ? '' : formatter.format(mantissa)
    return `${mantissaLook}e${formatNumber(power, 0)}` // Returns format (1.23e456,789)
  }
  return `e${formatNumber(power, accuracy)}`
}

/**
 * @param style CCS style of an element
 * @returns Width in pixels, if possible, otherwise 0
 */
export const getWidthFromStyle = (style: CSSStyleDeclaration) => {
  let width = Number.parseFloat(style.width)
  width = Number.isNaN(width) ? 0 : width
  let minWidth = Number.parseFloat(style.minWidth)
  minWidth = Number.isNaN(minWidth) ? 0 : minWidth
  let maxWidth = Number.parseFloat(style.maxWidth)
  maxWidth = Number.isNaN(maxWidth) ? Number.POSITIVE_INFINITY : maxWidth
  return Math.clamp(width, minWidth, maxWidth)
}
