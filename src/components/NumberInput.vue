<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs } from 'vue';
import { isMouseDown } from '../main';
import { formatNumber, parseDecimal } from '../utilities';
import './NumberInput.css';

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const inputElement = ref<HTMLInputElement>()
const buttonsDisabled = computed(() => attrs.disabled as boolean || attrs.readonly as boolean)
const stepAsNumber = Number(attrs.step)
const fractionsAllowed = stepAsNumber ? stepAsNumber % 1 !== 0 : true
const inputmode = fractionsAllowed ? 'decimal' : 'numeric'

const lowerBound = Number(attrs.min ?? Number.NEGATIVE_INFINITY)
const upperBound = Number(attrs.max ?? Number.POSITIVE_INFINITY)
let repeatDelay: number | undefined, repeatInterval: number | undefined

const onKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      step(-1)
      return
    case 'ArrowUp':
      event.preventDefault()
      step(1)
  }
}

const onBeforeInput = (event: InputEvent) => {
  const input = inputElement.value
  if (!input)
    return

  if (/[^\d-.,e]/.test(event.data ?? ''))
    event.preventDefault()
}

const onInput = () => {
  const input = inputElement.value
  if (!input)
    return

  input.classList.remove('error')
  if (input.value === '')
    return

  const valueAsDecimal = parseDecimal(input.value.replaceAll(',', ''))
  const outOfBounds = valueAsDecimal.lt(lowerBound) || valueAsDecimal.gt(upperBound)
  if (outOfBounds || Number.isNaN(valueAsDecimal.m))
    input.classList.add('error')
}

const onChange = () => {
  const input = inputElement.value
  if (!input)
    return

  input.classList.remove('error')
  if (input.value === '')
    return

  const valueAsDecimal = parseDecimal(input.value.replaceAll(',', ''))
  input.value = Number.isNaN(valueAsDecimal.m)
    ? ''
    : formatNumber(valueAsDecimal.clamp(lowerBound, upperBound), 3)
}

const step = (direction: 1 | -1): void => {
  const input = inputElement.value
  if (!input || input.disabled || input.readOnly || !input.step)
    return

  const valueAsNumber = Number(input.value)
  const previousValue = input.value
  if (Number.isNaN(valueAsNumber)) {
    input.value = input.min || '0'
  } else if (valueAsNumber % stepAsNumber === 0) {
    input.value = String(valueAsNumber + direction * stepAsNumber)
  } else {
    let value = valueAsNumber - valueAsNumber % stepAsNumber + (direction === 1 ? stepAsNumber : 0)
    input.value = String(value)
  }

  if (input.value !== previousValue)
    input.dispatchEvent(new Event('change'))
}

const onSpinButtonDown = (event: MouseEvent, direction: 1 | -1): void => {
  if (event.button !== 0)
    return

  stopHolding()
  step(direction)
  startHolding(direction, 400)
}

const startHolding = (direction: 1 | -1, delay = 0) => {
  repeatDelay = setTimeout(() => {
    if (!isMouseDown)
      return

    inputElement.value?.focus()
    step(direction)
    repeatInterval = setInterval(() => step(direction), 80)
  }, delay)
}

const stopHolding = (): void => {
  clearTimeout(repeatDelay)
  clearInterval(repeatInterval)
  repeatDelay = undefined
  repeatInterval = undefined
}

onBeforeUnmount(stopHolding)
</script>

<template>
  <span class="number-input">
    <input
      v-bind="attrs"
      ref="inputElement"
      :inputmode
      @keydown="onKeyDown"
      @beforeinput="onBeforeInput"
      @input="onInput"
      @change="onChange"
    >
    <button
      v-if="attrs.step"
      type="button"
      aria-label="Increase value"
      :disabled="buttonsDisabled"
      tabindex="-1"
      @focus="inputElement?.focus()"
      @mousedown="onSpinButtonDown($event, 1)"
      @mouseup="stopHolding"
      @mouseleave="stopHolding"
      @mouseenter="startHolding(1)"
    >❮</button>
    <button
      v-if="attrs.step"
      type="button"
      aria-label="Decrease value"
      :disabled="buttonsDisabled"
      tabindex="-1"
      @focus="inputElement?.focus()"
      @mousedown="onSpinButtonDown($event, -1)"
      @mouseup="stopHolding"
      @mouseleave="stopHolding"
      @mouseenter="startHolding(-1)"
    >❯</button>
  </span>
</template>
