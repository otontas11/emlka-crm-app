<script setup lang="ts">
type Variant = 'default' | 'ring' | 'outline'
type Size = 'md' | 'sm'

const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
    rows?: number | string
    variant?: Variant
    size?: Size
    shadow?: boolean
    required?: boolean
  }>(),
  {
    label: '',
    hint: '',
    rows: 4,
    variant: 'default',
    size: 'md',
    shadow: false,
    required: false,
  },
)

const model = defineModel<string | null>()

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const wrapperClass = computed(() => attrs.class)
const controlAttrs = computed(() => {
  const { class: _ignored, ...rest } = attrs
  return rest
})

const sizeClasses: Record<Size, string> = {
  md: 'px-4 py-3',
  sm: 'px-4 py-3 text-sm',
}

const variantClasses: Record<Variant, string> = {
  default: 'border-slate-200',
  ring: 'border-slate-200 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200',
  outline: 'border-slate-300 outline-none transition focus:border-slate-500',
}

const controlClasses = computed(() => [
  'w-full rounded-2xl border bg-white',
  sizeClasses[props.size],
  variantClasses[props.variant],
  props.shadow ? 'shadow-sm' : '',
])
</script>

<template>
  <div :class="wrapperClass">
    <label v-if="label" class="mb-2 block text-sm font-semibold text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      v-model="model"
      :rows="rows"
      :required="required"
      :class="controlClasses"
      v-bind="controlAttrs"
    ></textarea>
    <p v-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>
