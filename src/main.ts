import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('body')

export let isMouseDown = false
document.addEventListener('mousedown', () => {
  isMouseDown = true
})

document.addEventListener('mouseup', () => {
  isMouseDown = false
})
