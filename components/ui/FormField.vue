<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
    error?: string
    required?: boolean
  }>(),
  {
    label: '',
    hint: '',
    error: '',
    required: false,
  },
)

const controlId = useId()
const describedById = computed(() =>
  props.error || props.hint ? `${controlId}-desc` : undefined,
)
</script>

<template>
  <div>
    <label v-if="label" :for="controlId" class="mb-2 block text-sm font-semibold text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot :id="controlId" :described-by-id="describedById" />
    <p v-if="error" :id="describedById" class="mt-1 text-xs text-red-600">{{ error }}</p>
    <p v-else-if="hint" :id="describedById" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>
