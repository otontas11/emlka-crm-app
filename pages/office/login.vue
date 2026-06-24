<script setup>
definePageMeta({
  layout: false,
})

await navigateTo('/broker/login', { replace: true })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100">
    <div class="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Emlak CRM
      </p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">
        Broker girişine yönlendiriliyorsunuz
      </h1>
    </div>
  </div>
</template>


