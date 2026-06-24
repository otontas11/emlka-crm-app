<script setup>
definePageMeta({
  layout: false,
})

onMounted(async () => {
  localStorage.removeItem('emlak-crm-auth-user')
  await navigateTo('/broker/login', { replace: true })
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100">
    <div class="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Emlak CRM
      </p>

      <h1 class="mt-3 text-2xl font-bold text-slate-900">
        Oturum bilgisi temizleniyor
      </h1>

      <p class="mt-2 text-sm text-slate-500">
        Broker giriş ekranına yönlendiriliyorsunuz.
      </p>
    </div>
  </div>
</template>


