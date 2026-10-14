<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import './Scrollbar.css';

const minThumbSize = 20

type Axis = 'horizontal' | 'vertical'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const track = ref<HTMLDivElement>()
const visible = ref(false)
const thumbSize = ref(0)
const thumbPosition = ref(0)
const dragging = ref(false)
const viewportHovered = ref(false)

let viewport: HTMLElement
let resizeObserver: ResizeObserver | undefined
let mutationObserver: MutationObserver | undefined
const observedContents = new Set<Element>()

let updateFrame = 0
let drag: {
  axis: Axis
  pointerId: number
  startPosition: number
  startScroll: number
  travel: number
} | undefined

const updateMetrics = () => {
  visible.value = viewport.scrollHeight > viewport.clientHeight

  if (!track.value)
    return

  if (attrs.axis === 'vertical') {
    const visibleSize = track.value.clientHeight * viewport.clientHeight / viewport.scrollHeight
    thumbSize.value = Math.max(minThumbSize, visibleSize)
    const contentRange = viewport.scrollHeight - viewport.clientHeight
    thumbPosition.value = contentRange > 0
      ? (track.value.clientHeight - thumbSize.value) * viewport.scrollTop / contentRange
      : 0
  } else if (attrs.axis === 'horizontal') {
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

const onPointerDown = (event: PointerEvent, axis: Axis) => {
  if (event.pointerType !== 'mouse' || event.button !== 0)
    return

  const trackSize = axis === 'vertical'
    ? track.value?.clientHeight ?? viewport.clientHeight
    : track.value?.clientWidth ?? viewport.clientWidth
  const travel = trackSize - thumbSize.value
  if (travel <= 0)
    return

  event.preventDefault()
  const thumb = event.currentTarget as HTMLElement
  thumb.setPointerCapture(event.pointerId)
  drag = {
    axis,
    pointerId: event.pointerId,
    startPosition: axis === 'vertical' ? event.clientY : event.clientX,
    startScroll: axis === 'vertical' ? viewport.scrollTop : viewport.scrollLeft,
    travel,
  }
  dragging.value = true
}

const onPointerMove = (event: PointerEvent) => {
  if (!drag || event.pointerId !== drag.pointerId)
    return

  const currentPosition = drag.axis === 'vertical' ? event.clientY : event.clientX
  const contentRange = drag.axis === 'vertical'
    ? viewport.scrollHeight - viewport.clientHeight
    : viewport.scrollWidth - viewport.clientWidth
  const delta = currentPosition - drag.startPosition
  const scrollPosition = drag.startScroll + delta * contentRange / drag.travel

  if (drag.axis === 'vertical')
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

const onViewportPointerEnter = () => { viewportHovered.value = true }
const onViewportPointerLeave = () => { viewportHovered.value = false }

onMounted(() => {
  const viewportId = attrs['viewport-id']
  if (!track.value || typeof viewportId !== 'string')
    return

  const element = document.getElementById(viewportId)
  if (!(element instanceof HTMLElement))
    return

  viewport = element
  viewport.classList.add('scrollbar-viewport')
  viewport.addEventListener('scroll', scheduleMetricsUpdate, { passive: true })
  viewport.addEventListener('pointerenter', onViewportPointerEnter)
  viewport.addEventListener('pointerleave', onViewportPointerLeave)

  resizeObserver = new ResizeObserver(scheduleMetricsUpdate)
  resizeObserver.observe(viewport)
  observeChildren()

  mutationObserver = new MutationObserver(scheduleMetricsUpdate)
  mutationObserver.observe(viewport, { childList: true, characterData: true, subtree: true })
  updateMetrics()
})

onBeforeUnmount(() => {
  viewport?.classList.remove('scrollbar-viewport')
  viewport?.removeEventListener('scroll', scheduleMetricsUpdate)
  viewport?.removeEventListener('pointerenter', onViewportPointerEnter)
  viewport?.removeEventListener('pointerleave', onViewportPointerLeave)

  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  if (updateFrame)
    cancelAnimationFrame(updateFrame)
})
</script>

<template>
    <div
      ref="track"
      class="scrollbar-track"
      :class="{
        'vertical': attrs.axis === 'vertical',
        'horizontal': attrs.axis === 'horizontal',
        'hidden': !visible,
        'dragging': dragging,
        'viewport-hovered': viewportHovered
      }"
      aria-hidden="true"
    >
      <div
        class="scrollbar-thumb"
        :style="{ height: `${thumbSize}px`, '--position': `${thumbPosition}px` }"
        @pointerdown="onPointerDown($event, 'vertical')"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @lostpointercapture="onPointerUp"
      ></div>
    </div>
</template>
