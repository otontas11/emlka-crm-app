<script setup>
definePageMeta({
  layout: false,
})

const { loginAsBroker } = useDemoLogin()

const form = ref({
  email: 'broker@emlakcrm.com',
  password: '123456',
})

const login = async () => {
  loginAsBroker({
    email: form.value.email,
    fullName: 'Ofis Brokeri',
  })

  await navigateTo('/office', { replace: true })
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <div class="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
      <section class="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_0.9fr]">
        <div class="bg-slate-900 p-10 text-white">
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Broker Paneli
          </p>

          <h1 class="mt-4 text-4xl font-bold tracking-tight">
            Ofis yönetimi için güvenli giriş
          </h1>

          <p class="mt-4 text-sm leading-7 text-slate-300">
            Broker girişi ile danışman yönetimi, duyuru merkezi, evrak takibi, oryantasyon, eğitimler ve nöbet yönetimi ekranlarına erişebilirsiniz.
          </p>

          <div class="mt-8 grid gap-3 text-sm text-slate-300">
            <p><i class="bi bi-check2-circle mr-2"></i> Ofis dashboard</p>
            <p><i class="bi bi-check2-circle mr-2"></i> Danışman yönetimi</p>
            <p><i class="bi bi-check2-circle mr-2"></i> Duyuru ve bildirim takibi</p>
            <p><i class="bi bi-check2-circle mr-2"></i> Eğitim, evrak ve nöbet yönetimi</p>
          </div>
        </div>

        <div class="p-10">
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Emlak CRM
          </p>

          <h2 class="mt-3 text-3xl font-bold text-slate-900">
            Broker Girişi
          </h2>

          <p class="mt-2 text-sm text-slate-500">
            Prototip için örnek bilgiler otomatik dolduruldu.
          </p>

          <div class="mt-8 grid gap-4">
            <UiInput
              v-model="form.email"
              label="E-posta"
              type="email"
              variant="outline"
              size="sm"
            />

            <UiInput
              v-model="form.password"
              label="Şifre"
              type="password"
              variant="outline"
              size="sm"
            />

            <UiButton
              type="button"
              variant="primary"
              shape="rounded"
              block
              class="mt-2"
              @click="login"
            >
              Broker Paneline Giriş Yap
            </UiButton>

            <NuxtLink
              to="/login"
              class="text-center text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              Giriş türünü değiştir
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>



