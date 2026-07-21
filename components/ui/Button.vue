<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark-ghost'
type Size = 'md' | 'sm'
type Shape = 'pill' | 'rounded'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    shape?: Shape
    icon?: string
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    shape: 'pill',
    icon: '',
    type: 'button',
    block: false,
    loading: false,
  },
)

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { class: _class, disabled: _disabled, ...rest } = attrs
  return rest
})
const isDisabled = computed(
  () => props.loading || (attrs.disabled !== undefined && attrs.disabled !== false && attrs.disabled !== null),
)

const sizeClasses: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  sm: 'px-4 py-2 text-xs',
}

const shapeClasses: Record<Shape, string> = {
  pill: 'rounded-full',
  rounded: 'rounded-2xl',
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
  ghost: 'text-slate-600 hover:bg-slate-100',
  'dark-ghost': 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
}

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
  props.block ? 'w-full' : '',
  sizeClasses[props.size],
  shapeClasses[props.shape],
  variantClasses[props.variant],
])
</script>

<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :class="[buttonClasses, attrs.class]"
    v-bind="rootAttrs"
  >
    <span
      v-if="loading"
      class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    ></span>
    <i v-else-if="icon" :class="['bi', icon, 'mr-2']"></i>
    <slot />
  </button>
</template>
