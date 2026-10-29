<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const emit = defineEmits<{ file: [file: File] }>()
const overlay = ref<HTMLDivElement>()
let fileDragDepth = 0
let overlayVisible = false

const showFileDragOverlay = () => {
  if (overlayVisible || !overlay.value)
    return

  overlay.value.showPopover()
  overlayVisible = true
}

const hideFileDragOverlay = () => {
  fileDragDepth = 0
  if (overlayVisible) {
    overlay.value?.hidePopover()
    overlayVisible = false
  }
}

const onFileDragEnter = (event: DragEvent) => {
  if (!event.dataTransfer?.types.includes('Files'))
    return

  fileDragDepth += 1
  showFileDragOverlay()
}

const onFileDragLeave = (event: DragEvent) => {
  if (fileDragDepth === 0)
    return

  fileDragDepth -= 1
  if (fileDragDepth === 0 || (event.target === document.documentElement && event.relatedTarget === null))
    hideFileDragOverlay()
}

const onFileDragOver = (event: DragEvent) => {
  if (event.dataTransfer?.types.includes('Files')) {
    event.preventDefault()
    if (fileDragDepth === 0) {
      fileDragDepth = 1
      showFileDragOverlay()
    }
  }
}

const onFileDrop = (event: DragEvent) => {
  hideFileDragOverlay()
  if (!event.dataTransfer?.types.includes('Files'))
    return

  event.preventDefault()
  const [file] = event.dataTransfer.files
  if (file)
    emit('file', file)
}

onMounted(() => {
  globalThis.addEventListener('dragenter', onFileDragEnter)
  globalThis.addEventListener('dragleave', onFileDragLeave)
  globalThis.addEventListener('dragover', onFileDragOver)
  globalThis.addEventListener('drop', onFileDrop)
  globalThis.addEventListener('dragend', hideFileDragOverlay)
})

onBeforeUnmount(() => {
  globalThis.removeEventListener('dragenter', onFileDragEnter)
  globalThis.removeEventListener('dragleave', onFileDragLeave)
  globalThis.removeEventListener('dragover', onFileDragOver)
  globalThis.removeEventListener('drop', onFileDrop)
  globalThis.removeEventListener('dragend', hideFileDragOverlay)
  hideFileDragOverlay()
})
</script>

<template>
  <div ref="overlay"class="file-drag-overlay" popover="manual" aria-hidden="true">
    {{ $attrs.label }}
  </div>
</template>

<style>
.file-drag-overlay {
  place-items: center;
  place-content: center;
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  padding: 0;
  margin: 0;
  color: var(--text-color);
  background: #0008;
  border: 0;
  font-size: 32px;
  pointer-events: none;
}

.file-drag-overlay:popover-open {
  display: flex;
}
</style>
