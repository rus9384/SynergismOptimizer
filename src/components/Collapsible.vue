<script setup lang="ts">
import { useAttrs } from 'vue';
import './Collapsible.css';

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
</script>

<template>
  <details :id="(attrs.id as string)">
    <summary :title="(attrs.title as string)"><h3>{{ attrs.title }}</h3></summary>
    <hr>
    <slot></slot>
  </details>
</template>
