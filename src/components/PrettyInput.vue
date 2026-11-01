<script setup lang="ts">
import Decimal from 'break_infinity.js';
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, type InputHTMLAttributes } from 'vue';
import { d0 } from '../constants';
import { isMouseDown, textMeasurer } from '../main';
import { allStats, baseStats } from '../stats/data';
import { formatNumber, getWidthFromStyle, parseDecimal, toKebabCase } from '../utilities';
import './PrettyInput.css';

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const input = ref<HTMLInputElement>()
const element = ref<HTMLSpanElement>()
const spinnerDown = ref<HTMLButtonElement>()
const spinnerUp = ref<HTMLButtonElement>()
const buttonsDisabled = computed(() => attrs.disabled === true || attrs.readonly === true)
const stepAsNumber = Number(attrs.step)
const fractionsAllowed = stepAsNumber ? stepAsNumber % 1 !== 0 : true
const inputmode = attrs.type === 'number' ? (fractionsAllowed ? 'decimal' : 'numeric') : 'text'
const showButtons = attrs.type === 'number' && stepAsNumber
const long = typeof(attrs.step) === 'number' && (0 < attrs.step && attrs.step < 1e6)

const lowerBound = Number(attrs.min ?? Number.NEGATIVE_INFINITY)
const upperBound = Number(attrs.max ?? Number.POSITIVE_INFINITY)

const pattern = attrs.pattern && typeof(attrs.pattern) === 'string'
  ? new RegExp(`^${attrs.pattern}$`)
  : (attrs.type === 'number' ? /^[\d.e-]*$/ : /^[\u0020-\u007E]*$/)

let offset = 0
let shadeLeft = 0
let shadeRight = 0
let charWidth = 0

let repeatDelay: number | undefined, repeatInterval: number | undefined
let spinDirection: 1 | -1 = 1
let updateFrame = 0

const updateCharWidth = () => {
  if (!input.value || textMeasurer === null)
    return

  let style = getComputedStyle(input.value)
  textMeasurer.font = style.font
  textMeasurer.letterSpacing = style.letterSpacing
  charWidth = textMeasurer.measureText('0').width
}

const updateShadeWidth = () => {
  if (!element.value)
    return

  shadeLeft = getWidthFromStyle(getComputedStyle(element.value, '::before'))
  shadeRight = getWidthFromStyle(getComputedStyle(element.value, '::after'))
}

const checkPattern = (event: InputEvent) => {
  if (event.data && pattern && !pattern.test(event.data)) {
    event.preventDefault()
  } else if (input.value && allStats[attrs.field as string] === 'FAIL') {
    allStats[attrs.field as string] = undefined
    input.value.value = ''
    element.value?.classList.remove('error')
  }
}

const resetOffset = () => {
  offset = shadeLeft
  input.value?.style.setProperty('--offset', `${shadeLeft}px`)
}

const calculateOffset = () => {
  if (!input.value)
    return

  const { clientWidth, selectionEnd, selectionStart, scrollLeft } = input.value
  const selection = input.value.selectionDirection === 'backward' ? selectionStart : selectionEnd
  if (selection === null)
    return

  const caretX = selection * charWidth

  // Check if the caret is behind the left shade
  const caretLeft = shadeLeft + scrollLeft - caretX
  if (offset < caretLeft)
    return caretLeft

  // Check if the caret is behind the right shade
  const caretRight = clientWidth + scrollLeft - shadeRight - caretX
  if (offset > caretRight)
    return caretRight

  // Check if the text would fit if we moved the input to the right
  const symbolX = input.value.value.length * charWidth
  if (symbolX < clientWidth - shadeLeft - shadeRight)
    return clientWidth - symbolX - shadeRight
}

const scrollText = () => {
  if (!input.value || document.activeElement !== input.value)
    return

  updateFrame = requestAnimationFrame(() => {
    updateFrame = 0
    if (!input.value || document.activeElement !== input.value)
      return

    let nextOffset = calculateOffset()
    if (nextOffset === undefined)
      return // No scrolling is needed

    if (nextOffset < 0) {
      // If the caret is too far right, scroll the input to the left
      const { clientWidth, scrollLeft, scrollWidth } = input.value
      const available = scrollWidth - clientWidth - scrollLeft
      const scrollDelta = Math.min(-nextOffset, available)
      input.value.scrollLeft += scrollDelta
      nextOffset += scrollDelta
    } else if (nextOffset > 0) {
      // If the caret is too far left, scroll the input to the right
      const available = input.value.scrollLeft
      const scrollDelta = Math.min(nextOffset, available)
      input.value.scrollLeft -= scrollDelta
      nextOffset -= scrollDelta
    }

    nextOffset = Math.clamp(nextOffset, -shadeRight, shadeLeft)
    if (offset !== nextOffset) {
      input.value.style.setProperty('--offset', `${nextOffset}px`)
      offset = nextOffset
    }
  })
}

const checkNumber = () => {
  if (!input.value || !element.value || attrs.type !== 'number')
    return

  element.value.classList.remove('error')
  if (input.value.value === '')
    return

  const valueAsDecimal = parseDecimal(input.value.value.replaceAll(',', ''))
  let outOfBounds = Number.isNaN(valueAsDecimal.m)
  outOfBounds ||= valueAsDecimal.lt(lowerBound) || valueAsDecimal.gt(upperBound)
  if (outOfBounds)
    element.value.classList.add('error')
}

const updateText = () => {
  checkNumber()
  scrollText()
}

const updateValue = () => {
  if (!input.value || !element.value)
    return

  element.value.classList.remove('error')
  if (attrs.type === 'number')
    validateNumber()
  else
    allStats[attrs.field as string] = input.value.value
}

const validateNumber = () => {
  if (!input.value || !element.value || attrs.type !== 'number')
    return

  if (input.value.value === '') {
    allStats[attrs.field as string] = undefined
    return
  }

  const valueAsDecimal = parseDecimal(input.value.value.replaceAll(',', ''))
  let fixedValue: Decimal | undefined = valueAsDecimal
  if (Number.isNaN(valueAsDecimal.m)) {
    fixedValue = undefined
    input.value.value = ''
  } else if (stepAsNumber) {
    fixedValue = valueAsDecimal.div(stepAsNumber).round().mul(stepAsNumber)
    fixedValue = fixedValue.clamp(lowerBound, upperBound)
    input.value.value = formatNumber(fixedValue.clamp(lowerBound, upperBound), 3, long)
  } else {
    fixedValue = valueAsDecimal.clamp(lowerBound, upperBound)
    input.value.value = formatNumber(valueAsDecimal.clamp(lowerBound, upperBound), 3, long)
  }
  input.value.value = input.value.value.replaceAll(',', '')

  allStats[attrs.field as string] =
    typeof baseStats[attrs.field as string] === 'number' && fixedValue !== undefined
      ? fixedValue.toNumber()
      : fixedValue
}

const step = (direction: 1 | -1) => {
  if (!input.value || input.value.disabled || input.value.readOnly || !input.value.step)
    return

  const valueAsString = input.value.value === 'FAIL' ? '0' : input.value.value || '0'
  const valueAsDecimal = parseDecimal(valueAsString)
  const absValue = valueAsDecimal.abs()
  if (absValue.gte(long ? 1e12 : 1e6) || absValue.neq(d0) && absValue.lt(Number.MIN_VALUE))
    return

  const valueAsNumber = Number.parseFloat(valueAsString)
  const previousValue = input.value.value
  if (Number.isNaN(valueAsNumber)) {
    allStats[attrs.field as string] = input.value.min || 0
    input.value.value = String(allStats[attrs.field as string])
  } else if (valueAsNumber % stepAsNumber === 0) {
    const nextValue = valueAsNumber + direction * stepAsNumber
    if (nextValue < (long ? 1e12 : 1e6)) {
      allStats[attrs.field as string] = nextValue
      input.value.value = String(nextValue)
    }
  } else {
    const smallerValue = valueAsNumber - valueAsNumber % stepAsNumber
    allStats[attrs.field as string] = smallerValue + (direction === 1 ? stepAsNumber : 0)
    input.value.value = String(allStats[attrs.field as string])
  }

  if (input.value.value !== previousValue)
    input.value.dispatchEvent(new Event('change'))
}

const updateSpinnerButtonState = () => {
  if (document.activeElement !== input.value)
    return

  spinnerUp.value?.classList.toggle('pressed', spinDirection === 1)
  spinnerDown.value?.classList.toggle('pressed', spinDirection === -1)
}

const onSpinButtonDown = (event: PointerEvent, direction: 1 | -1) => {
  stopHolding()
  const button = event.currentTarget as HTMLButtonElement
  button.setPointerCapture(event.pointerId)
  step(direction)
  startHolding(direction, 400)
}

const startHolding = (direction: 1 | -1, delay = 0) => {
  spinDirection = direction
  document.documentElement.style.setProperty('cursor', 'pointer')
  document.documentElement.style.setProperty('pointer-events', 'none')
  repeatDelay = setTimeout(() => {
    if (!isMouseDown)
      return

    input.value?.focus()
    step(spinDirection)
    updateSpinnerButtonState()
    repeatInterval = setInterval(() => {
      step(spinDirection)
    }, 80)
  }, delay)
}

const updateHoldingDirection = (event: PointerEvent) => {
  if (!isMouseDown || !spinnerDown.value || !spinnerUp.value)
    return

  const upBounds = spinnerUp.value.getBoundingClientRect()
  const downBounds = spinnerDown.value.getBoundingClientRect()
  const upCenter = (upBounds.top + upBounds.bottom) / 2
  const downCenter = (downBounds.top + downBounds.bottom) / 2
  const upDistance = Math.abs(event.clientY - upCenter)
  const downDistance = Math.abs(event.clientY - downCenter)
  spinDirection = upDistance < downDistance ? 1 : -1
  updateSpinnerButtonState()
}

const stopHolding = () => {
  spinnerUp.value?.classList.remove('pressed')
  spinnerDown.value?.classList.remove('pressed')
  document.documentElement.style.removeProperty('cursor')
  document.documentElement.style.removeProperty('pointer-events')
  clearTimeout(repeatDelay)
  clearInterval(repeatInterval)
  repeatDelay = undefined
  repeatInterval = undefined
}

onMounted(() => {
  updateCharWidth()
  updateShadeWidth()
  resetOffset()
  document.addEventListener('pointermove', updateHoldingDirection)
  document.addEventListener('pointerup', stopHolding)
})

onBeforeUnmount(() => {
  stopHolding()
  document.removeEventListener('pointermove', updateHoldingDirection)
  document.removeEventListener('pointerup', stopHolding)
  if (updateFrame)
    cancelAnimationFrame(updateFrame)
})
</script>

<template>
  <span
    ref="element"
    class="pretty-input"
    :step="attrs.step"
    :disabled="attrs.disabled"
    @pointerdown.self.prevent
    @keydown.up.prevent="step(1)"
    @keydown.down.prevent="step(-1)"
  >
    <input
      ref="input"
      v-bind="attrs"
      :id="toKebabCase($attrs.field as string)"
      :type="'text'"
      :inputmode="attrs.inputmode as InputHTMLAttributes['inputmode'] ?? inputmode"
      @beforeinput="checkPattern"
      @input="updateText"
      @change="updateValue"
      @selectionchange="scrollText"
      @blur="resetOffset"
    >
    <button
      v-if="showButtons"
      ref="spinnerUp"
      type="button"
      class="material-symbols-rounded"
      aria-label="Increase value"
      :disabled="buttonsDisabled"
      tabindex="-1"
      @focus="input?.focus()"
      @pointerdown.left="onSpinButtonDown($event, 1)"
    >keyboard_arrow_up</button>
    <button
      v-if="showButtons"
      ref="spinnerDown"
      type="button"
      class="material-symbols-rounded"
      aria-label="Decrease value"
      :disabled="buttonsDisabled"
      tabindex="-1"
      @focus="input?.focus()"
      @pointerdown.left="onSpinButtonDown($event, -1)"
    >keyboard_arrow_down</button>
  </span>
</template>
