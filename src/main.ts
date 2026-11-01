import { createApp } from 'vue'
import App from './App.vue'
import { addStatListeners, loadStats } from './stats/data.ts'

export const textMeasurer = document.createElement('canvas').getContext('2d')

export let isMouseDown = false
document.addEventListener('mousedown', () => {
  isMouseDown = true
})

document.addEventListener('mouseup', () => {
  isMouseDown = false
})

createApp(App).mount('body')
loadStats()
addStatListeners()
