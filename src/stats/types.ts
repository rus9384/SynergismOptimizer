import type { InputTypeHTMLAttribute, OptionHTMLAttributes } from "vue"

export type StatData = {
  field: string,
  title: string
  src?: string
  alt?: string
  type: InputTypeHTMLAttribute | "select"
  options?: OptionHTMLAttributes[]
  placeholder?: string
  min?: number
  max?: number
  step?: number
}

export type SectionData = {
  title: string
  statCards: boolean
  items: StatData[]
}
