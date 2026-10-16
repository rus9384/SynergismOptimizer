<script setup lang="ts">
import Collapsible from '../../components/Collapsible.vue';
import type { SectionData } from '../types.ts';
import StatItem from './StatItem.vue';

const props = defineProps<SectionData>()
</script>

<template>
  <Collapsible :title>
    <div v-if="statCards" :class="{ 'stat-cards': statCards }">
      <StatItem v-for="itemProps in items" v-bind="itemProps" />
    </div>
    <StatItem v-else v-for="itemProps in items" v-bind="itemProps" />
  </Collapsible>
</template>
