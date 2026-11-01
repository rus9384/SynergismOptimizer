<script setup lang="ts">
import Combobox from '../../components/Combobox.vue';
import PrettyInput from '../../components/PrettyInput.vue';
import { toKebabCase } from '../../utilities.ts';
import type { StatData } from '../types.ts';

const props = defineProps<StatData>()
const id = toKebabCase(props.field)
const labelId = `${id}-title`
</script>

<template>
  <div :title>
    <img v-if="src" :src :alt aria-hidden="true" />
    <h4 :id="labelId">{{ title }}</h4>
    <Combobox v-if="type === 'select'"
      :id
      :field
      :ariaLabelledby="labelId"
      :options="options ?? []"
    />
    <input v-else-if="type === 'checkbox'"
      :id
      :type
      :aria-labelledby="labelId"
      @change="($event.currentTarget as HTMLInputElement).classList.remove('error')"
    />
    <PrettyInput v-else :field :type :placeholder :min :max :step :aria-labelledby="labelId" />
  </div>
</template>
