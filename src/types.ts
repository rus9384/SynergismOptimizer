import type Decimal from 'break_infinity.js'
import type { OptionHTMLAttributes } from 'vue'

export type DropdownValue = string | number | undefined

export type SelectData = {
  field: string,
  ariaLabelledby: string,
  options: OptionHTMLAttributes[]
}

export type Numeric = number | Decimal | null | undefined
