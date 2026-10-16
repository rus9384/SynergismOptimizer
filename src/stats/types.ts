import type { InputTypeHTMLAttribute, OptionHTMLAttributes } from "vue"

export type StatData = {
  title: string
  src?: string
  alt?: string
  id: string
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
