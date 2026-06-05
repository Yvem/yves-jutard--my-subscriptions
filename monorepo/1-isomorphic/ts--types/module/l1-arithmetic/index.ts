/* For documentation only.
 * Obviously, this doesn't cause real additional safety.
 * TODO remove conflict with https://github.com/sindresorhus/type-fest?tab=readme-ov-file#numeric
 */

export type Integer = number
export type PositiveInteger = Integer
export type PositiveIntegerInRange<min = PositiveInteger, max = PositiveInteger> = PositiveInteger
export type LineNumber = PositiveIntegerInRange<1, 999999>

export type Percentage = number // between 0 and 1

export type Float = number
export type PositiveFloat = Float
export type FloatInRange<min = Float, max = Float> = Float
