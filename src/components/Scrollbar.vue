<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import './Scrollbar.css';

const minThumbSize = 20

type Axis = 'horizontal' | 'vertical'

type Props = {
  viewportId: string,
  axis: Axis
}

const props = defineProps<Props>()
const track = ref<HTMLDivElement>()
const visible = ref(false)
const thumbSize = ref(0)
const thumbPosition = ref(0)
const dragging = ref(false)
const viewportActive = ref(false)

let viewport: HTMLElement
let resizeObserver: ResizeObserver | undefined
let mutationObserver: MutationObserver | undefined
const observedContents = new Set<Element>()

let updateFrame = 0
let viewportHovered = false
let viewportActivityTimeout: ReturnType<typeof setTimeout> | undefined
let drag: {
  pointerId: number
  startPosition: number
  startScroll: number
  travel: number
} | undefined

const updateMetrics = () => {
  visible.value = props.axis === 'vertical'
    ? viewport.scrollHeight > viewport.clientHeight
    : viewport.scrollWidth > viewport.clientWidth

  if (!track.value)
    return

  if (props.axis === 'vertical') {
    const visibleSize = track.value.clientHeight * viewport.clientHeight / viewport.scrollHeight
    thumbSize.value = Math.max(minThumbSize, visibleSize)
    const contentRange = viewport.scrollHeight - viewport.clientHeight
    thumbPosition.value = contentRange > 0
      ? (track.value.clientHeight - thumbSize.value) * viewport.scrollTop / contentRange
      : 0
  } else {
    const visibleSize = track.value.clientWidth * viewport.clientWidth / viewport.scrollWidth
    thumbSize.value = Math.max(minThumbSize, visibleSize)
    const contentRange = viewport.scrollWidth - viewport.clientWidth
    thumbPosition.value = contentRange > 0
      ? (track.value.clientWidth - thumbSize.value) * viewport.scrollLeft / contentRange
      : 0
  }
}

const scheduleMetricsUpdate = () => {
  if (updateFrame)
    return
  updateFrame = requestAnimationFrame(() => {
    updateFrame = 0
    updateMetrics()
  })
}

const observeChildren = () => {
  const elements = new Set(viewport.children)
  elements.delete(track.value as Element)
  for (const element of observedContents.difference(elements)) {
    resizeObserver?.unobserve(element)
    observedContents.delete(element)
  }
  for (const element of elements.difference(observedContents)) {
    resizeObserver?.observe(element)
    observedContents.add(element)
  }
  scheduleMetricsUpdate()
}

const moveThumb = (event: PointerEvent) => {
  if (event.target !== event.currentTarget || event.pointerType !== 'mouse' || event.button !== 0)
    return
  if (props.axis !== 'vertical' && props.axis !== 'horizontal')
    return

  const trackElement = track.value
  if (!trackElement)
    return

  const vertical = props.axis === 'vertical'
  const trackSize = vertical ? trackElement.clientHeight : trackElement.clientWidth
  const travel = trackSize - thumbSize.value
  if (travel <= 0)
    return

  const bounds = trackElement.getBoundingClientRect()
  let position = vertical ? event.clientY - bounds.top : event.clientX - bounds.left
  position = position < thumbPosition.value ? position : position - thumbSize.value
  position = Math.clamp(position, 0, travel)
  const contentRange = vertical
    ? viewport.scrollHeight - viewport.clientHeight
    : viewport.scrollWidth - viewport.clientWidth

  event.preventDefault()
  if (vertical)
    viewport.scrollTop = position * contentRange / travel
  else
    viewport.scrollLeft = position * contentRange / travel
}

const onPointerDown = (event: PointerEvent) => {
  if (event.pointerType !== 'mouse' || event.button !== 0)
    return
  if (props.axis !== 'vertical' && props.axis !== 'horizontal')
    return

  const trackSize = props.axis === 'vertical'
    ? track.value?.clientHeight ?? viewport.clientHeight
    : track.value?.clientWidth ?? viewport.clientWidth
  const travel = trackSize - thumbSize.value
  if (travel <= 0)
    return

  event.preventDefault()
  const thumb = event.currentTarget as HTMLElement
  thumb.setPointerCapture(event.pointerId)
  drag = {
    pointerId: event.pointerId,
    startPosition: props.axis === 'vertical' ? event.clientY : event.clientX,
    startScroll: props.axis === 'vertical' ? viewport.scrollTop : viewport.scrollLeft,
    travel
  }
  dragging.value = true
}

const onPointerMove = (event: PointerEvent) => {
  if (!drag || event.pointerId !== drag.pointerId)
    return
  if (props.axis !== 'vertical' && props.axis !== 'horizontal')
    return

  const currentPosition = props.axis === 'vertical' ? event.clientY : event.clientX
  const contentRange = props.axis === 'vertical'
    ? viewport.scrollHeight - viewport.clientHeight
    : viewport.scrollWidth - viewport.clientWidth
  const delta = currentPosition - drag.startPosition
  const scrollPosition = drag.startScroll + delta * contentRange / drag.travel

  if (props.axis === 'vertical')
    viewport.scrollTop = scrollPosition
  else
    viewport.scrollLeft = scrollPosition
}

const onPointerUp = (event: PointerEvent) => {
  if (!drag || event.pointerId !== drag.pointerId)
    return
  drag = undefined
  dragging.value = false
}

const onViewportScroll = () => {
  scheduleMetricsUpdate()
  viewportActive.value = true
  clearTimeout(viewportActivityTimeout)
  viewportActivityTimeout = setTimeout(() => {
    viewportActivityTimeout = undefined
    viewportActive.value = viewportHovered
  }, 500)
}

const onViewportPointerEnter = () => {
  viewportHovered = true
  viewportActive.value = true
}

const onViewportPointerLeave = () => {
  viewportHovered = false
  viewportActive.value = viewportActivityTimeout !== undefined
}

onMounted(() => {
  const {viewportId} = props
  if (!track.value || typeof viewportId !== 'string')
    return

  const element = document.getElementById(viewportId)
  if (!(element instanceof HTMLElement))
    return

  viewport = element
  viewport.classList.add('scrollbar-viewport')
  viewport.addEventListener('scroll', onViewportScroll, { passive: true })
  viewport.addEventListener('pointerenter', onViewportPointerEnter)
  viewport.addEventListener('pointerleave', onViewportPointerLeave)

  resizeObserver = new ResizeObserver(scheduleMetricsUpdate)
  resizeObserver.observe(viewport)
  observeChildren()

  mutationObserver = new MutationObserver(observeChildren)
  mutationObserver.observe(viewport, { childList: true, characterData: true, subtree: true })
  updateMetrics()
})

onBeforeUnmount(() => {
  viewport?.classList.remove('scrollbar-viewport')
  viewport?.removeEventListener('scroll', onViewportScroll)
  viewport?.removeEventListener('pointerenter', onViewportPointerEnter)
  viewport?.removeEventListener('pointerleave', onViewportPointerLeave)

  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  if (updateFrame)
    cancelAnimationFrame(updateFrame)
  clearTimeout(viewportActivityTimeout)
})
</script>

<template>
    <div
      ref="track"
      class="scrollbar-track"
      :class="{
        'vertical': axis === 'vertical',
        'horizontal': axis === 'horizontal',
        'hidden': !visible,
        'dragging': dragging,
        'viewport-active': viewportActive
      }"
      @pointerdown="moveThumb"
      aria-hidden="true"
    >
      <div
        class="scrollbar-thumb"
        :style="{
          height: axis === 'vertical' ? `${thumbSize}px` : '',
          width: axis === 'horizontal' ? `${thumbSize}px` : '',
          '--position': `${thumbPosition}px`
        }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @lostpointercapture="onPointerUp"
      ></div>
    </div>
</template>
