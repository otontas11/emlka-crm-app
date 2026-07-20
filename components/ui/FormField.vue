<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    hint?: string
    required?: boolean
  }>(),
  {
    label: '',
    hint: '',
    required: false,
  },
)
</script>

<template>
  <div>
    <label v-if="label" class="mb-2 block text-sm font-semibold text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot />
    <p v-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>
