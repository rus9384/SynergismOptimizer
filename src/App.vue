<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count = 1e6 * Math.random()">
    <span id="test" class="numeric">{{count.toLocaleString("en-US", {maximumSignificantDigits: 6, useGrouping: false})}}</span>
  </button>
</template>
