<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { SelectData } from '../types';
import './Combobox.css';
import Scrollbar from './Scrollbar.vue';

const props = defineProps<SelectData>()
const root = ref<HTMLButtonElement>()
const popup = ref<HTMLDivElement>()
const listbox = ref<HTMLUListElement>()
const isOpen = ref(false)
const selectedIndex = ref(initialIndex())
const activeIndex = ref(selectedIndex.value)
const selectedLabel = computed(() => props.options[selectedIndex.value]?.label)
let optionElements: HTMLLIElement[] = []

// oxlint-disable-next-line func-style
function initialIndex() {
  if (props.options.length === 0)
    return -1
  const markedIndex = props.options.findLastIndex(option => option.selected)
  return Math.max(0, markedIndex)
}

const isEnabled = (index: number) => (
  props.options[index] && !props.options[index]?.disabled
)

const openPopup = async() => {
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
  if (index === -1)
    return
  selectedIndex.value = index
  closePopup()
}

const findEnabledIndex = (start: number, offset: number) => {
  const direction = Math.sign(offset)
  let result = start
  start += direction
  for (let i = start, j = Math.abs(offset); props.options[i] && j; i += direction, j--) {
    if (selectedIndex.value !== i && !props.options[i].disabled)
      result = i
  }
  return isEnabled(result) ? result : -1
}

const moveActive = (offset: number) => {
  const start = activeIndex.value === -1 ? 0 : activeIndex.value
  activeIndex.value = findEnabledIndex(start, offset)
  scrollActiveOption()
}

const setActive = (index: number) => {
  activeIndex.value = isEnabled(index) ? index : -1
}

let typeahead = ''
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

const searchOptions = (key: string) => {
  typeahead += key.toLocaleLowerCase()
  clearTimeout(typeaheadTimer)
  typeaheadTimer = setTimeout(() => { typeahead = '' }, 700)

  const start = isOpen.value ? activeIndex.value + 1 : selectedIndex.value + 1
  for (let offset = 0; offset < props.options.length; offset++) {
    const index = (start + offset) % props.options.length
    if (!isEnabled(index) || !props.options[index]?.label)
      continue
    const label = props.options[index].label.toLocaleLowerCase()
    if (label.startsWith(typeahead)) {
      if (isOpen.value) {
        activeIndex.value = index
        scrollActiveOption()
      } else {
        selectedIndex.value = index
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
      event.preventDefault()
      if (!isOpen.value)
        void openPopup()
      return
    case 'Enter':
      event.preventDefault()
      if (isOpen.value)
        chooseOption(activeIndex.value)
      else
        void openPopup()
      return
    case 'Tab':
      if (isOpen.value) {
        event.preventDefault()
        chooseOption(activeIndex.value)
      }
      return
    default:
      if (event.key.length === 1 && event.key.trim().length > 0)
        searchOptions(event.key)
      return
  }

  event.preventDefault()
  if (!isOpen.value)
    selectedIndex.value = activeIndex.value
}

const updatePopover = () => {
  isOpen.value = !isOpen.value
  activeIndex.value = selectedIndex.value
}

onMounted(() => {
  cacheOptionElements()
})

onBeforeUnmount(() => {
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
    :popovertarget="`${id}-listbox`"
    @keydown="onKeydown"
  >
    <span>
      {{ selectedLabel }}
    </span>
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
          v-bind="option"
          role="option"
          :checked="index === selectedIndex ? '' : undefined"
          :active="index === activeIndex ? '' : undefined"
          @pointerdown.prevent
          @pointermove="setActive(index)"
          @click="chooseOption(activeIndex)"
        >
        </li>
      </ul>
      <Scrollbar axis="vertical" :viewport-id="`${id}-listbox-viewport`" />
    </div>
  </button>
</template>
