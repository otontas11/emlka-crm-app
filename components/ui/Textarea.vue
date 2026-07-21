<script setup lang="ts">
type Variant = 'default' | 'ring' | 'outline'
type Size = 'md' | 'sm'

const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
    error?: string
    rows?: number | string
    variant?: Variant
    size?: Size
    shadow?: boolean
    required?: boolean
  }>(),
  {
    label: '',
    hint: '',
    error: '',
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
  const { class: _class, id: _id, ...rest } = attrs
  return rest
})

const generatedId = useId()
const controlId = computed(() => (attrs.id as string | undefined) ?? generatedId)
const describedById = computed(() =>
  props.error || props.hint ? `${controlId.value}-desc` : undefined,
)

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
  props.error
    ? 'text-slate-900 outline-none transition border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
    : variantClasses[props.variant],
  props.shadow ? 'shadow-sm' : '',
  'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
])
</script>

<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="controlId" class="mb-2 block text-sm font-semibold text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :id="controlId"
      v-model="model"
      :rows="rows"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedById"
      :class="controlClasses"
      v-bind="controlAttrs"
    ></textarea>
    <p v-if="error" :id="describedById" class="mt-1 text-xs text-red-600">{{ error }}</p>
    <p v-else-if="hint" :id="describedById" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>
