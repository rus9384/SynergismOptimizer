<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { allStats } from '../stats/data.ts';
import type { SelectData } from '../types';
import { toKebabCase } from '../utilities.ts';
import './Combobox.css';
import Scrollbar from './Scrollbar.vue';

const props = defineProps<SelectData>()
const id = ref(toKebabCase(props.field))
const root = ref<HTMLButtonElement>()
const popup = ref<HTMLDivElement>()
const listbox = ref<HTMLUListElement>()
const isOpen = ref(false)
const activeIndex = ref(-1)

let optionElements: HTMLLIElement[] = []
let optionObserver: MutationObserver | undefined

const getSelectedIndex = () => (
  props.options.findIndex(option => option.value === allStats[props.field])
)

const selectIndex = (index: number) => {
  if (!root.value || index === getSelectedIndex())
    return
  allStats[props.field] = props.options[index].value
  root.value.classList.remove('error')
  root.value.dispatchEvent(new Event('change'))
}

const selectedLabel = computed(() => {
  const selectedOption = props.options[getSelectedIndex()]
  return selectedOption?.label || String(selectedOption?.value ?? allStats[props.field])
})

const isEnabled = (index: number) => (
  props.options[index] && !props.options[index]?.disabled
)

const openPopup = () => {
  popup.value?.showPopover({ source: root.value })
}

const closePopup = () => {
  popup.value?.hidePopover()
}

const cacheOptionElements = () => {
  optionElements = [...listbox.value?.children ?? []] as HTMLLIElement[]
}

const scrollActiveOption = () => {
  optionElements[activeIndex.value]?.scrollIntoView({ block: 'nearest' })
}

const chooseOption = (index: number) => {
  if (index === -1 || !isEnabled(index))
    return
  selectIndex(index)
  closePopup()
}

const findEnabledIndex = (start: number, offset: number) => {
  const direction = Math.sign(offset)
  let result = start
  start += direction
  const selectedIndex = getSelectedIndex()
  for (let i = start, j = Math.abs(offset); props.options[i] && j; i += direction, j--) {
    if (i === selectedIndex || !isEnabled(i))
      j += 1
    else
      result = i
  }
  return isEnabled(result) ? result : -1
}

const moveActive = (offset: number) => {
  if (isOpen.value) {
    activeIndex.value = findEnabledIndex(activeIndex.value, offset)
    scrollActiveOption()
  } else {
    const nextIndex = findEnabledIndex(getSelectedIndex(), offset)
    if (nextIndex !== -1)
      selectIndex(nextIndex)
  }
}

const setActive = (index: number) => {
  if (isEnabled(index))
    activeIndex.value = index
}

let typeahead = ''
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

const searchOptions = (key: string) => {
  typeahead += key.toLocaleLowerCase()
  clearTimeout(typeaheadTimer)
  typeaheadTimer = setTimeout(() => { typeahead = '' }, 700)

  const selectedIndex = getSelectedIndex()
  const start = isOpen.value ? activeIndex.value + 1 : selectedIndex + 1
  for (let offset = 0; offset < props.options.length; offset++) {
    const index = (start + offset) % props.options.length
    if (!isEnabled(index) || (isOpen.value && index === selectedIndex))
      continue
    const text = props.options[index].label || String(props.options[index].value)
    const label = text.toLocaleLowerCase()
    if (label.startsWith(typeahead)) {
      if (isOpen.value) {
        activeIndex.value = index
        scrollActiveOption()
      } else {
        selectIndex(index)
      }
      return
    }
  }
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.altKey || event.ctrlKey || event.metaKey)
    return

  switch (event.key) {
    case 'ArrowDown':
      moveActive(1)
      break
    case 'ArrowUp':
      moveActive(-1)
      break
    case 'Home':
      moveActive(Number.NEGATIVE_INFINITY)
      break
    case 'End':
      moveActive(Number.POSITIVE_INFINITY)
      break
    case 'PageDown':
      moveActive(isOpen.value ? 10 : 3)
      break
    case 'PageUp':
      moveActive(isOpen.value ? -10 : -3)
      break
    case ' ':
    case 'Enter':
      event.preventDefault()
      if (isOpen.value)
        chooseOption(activeIndex.value)
      else
        openPopup()
      return
    case 'Tab':
      if (isOpen.value)
        closePopup()
      return
    default:
      if (event.key.length === 1 && event.key.trim().length > 0)
        searchOptions(event.key)
      return
  }

  event.preventDefault()
}

const updatePopover = (event: ToggleEvent) => {
  isOpen.value = event.newState === 'open'
  if (isOpen.value) {
    activeIndex.value = 0
    const hoveredItem = listbox.value?.querySelector(':hover:not([disabled])')
    const hoveredIndex = hoveredItem ? optionElements.indexOf(hoveredItem as HTMLLIElement) : -1
    if (hoveredIndex !== -1)
      setActive(hoveredIndex)
    else if (getSelectedIndex() === 0 || !isEnabled(0))
      moveActive(1)
  } else {
    activeIndex.value = -1
  }
}

onMounted(() => {
  cacheOptionElements()
  if (listbox.value) {
    optionObserver = new MutationObserver(cacheOptionElements)
    optionObserver.observe(listbox.value, { childList: true })
  }
})

onBeforeUnmount(() => {
  optionObserver?.disconnect()
  clearTimeout(typeaheadTimer)
})
</script>

<template>
  <button 
    ref="root"
    :id
    class="dropdown"
    type="button"
    role="combobox"
    :aria-labelledby="props.ariaLabelledby"
    :aria-expanded="isOpen"
    :aria-controls="`${id}-listbox-viewport`"
    :aria-activedescendant="isOpen && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined"
    aria-haspopup="listbox"
    :popovertarget="`${id}-listbox`"
    @keydown="onKeydown"
  >
    <label :for="id">
      {{ selectedLabel }}
    </label>
    <div
      ref="popup"
      :id="`${id}-listbox`"
      class="listbox"
      popover
      @toggle="updatePopover"
    >
      <ul ref="listbox" :id="`${id}-listbox-viewport`" role="listbox">
        <li
          v-for="(option, index) in options"
          :key="index"
          v-bind="option"
          :id="`${id}-option-${index}`"
          role="option"
          :aria-label="option.label || String(option.value ?? '')"
          :aria-selected="option.value === allStats[field]"
          :aria-disabled="option.disabled"
          :checked="option.value === allStats[field] ? '' : undefined"
          :active="index === activeIndex ? '' : undefined"
          @pointerdown.prevent
          @pointerover="setActive(index)"
          @click="chooseOption(index)"
        >
        {{ !option.label ? String(option.value) : undefined }}
        </li>
      </ul>
      <Scrollbar axis="vertical" :viewport-id="`${id}-listbox-viewport`" />
    </div>
  </button>
</template>
