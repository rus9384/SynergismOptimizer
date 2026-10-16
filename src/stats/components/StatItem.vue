<script setup lang="ts">
import Combobox from '../../components/Combobox.vue';
import PrettyInput from '../../components/PrettyInput.vue';
import type { StatData } from '../types.ts';

const props = defineProps<StatData>()
</script>

<template>
  <div :title>
    <img v-if="src" :src :alt />
    <h4>{{ title }}</h4>
    <Combobox v-if="type === 'select'" :id :options="options ?? []" />
    <PrettyInput v-else-if="type === 'number'" :id :type :placeholder :min :max :step />
    <input v-else-if="type === 'checkbox'" :id :type />
    <input v-else :id :type :placeholder :min :max :step />
  </div>
</template>
