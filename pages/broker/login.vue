<script setup>
definePageMeta({
  layout: false,
})

const {
  loginBroker,
} = useCrmAuth()

const form = ref({
  email: 'broker@emlakcrm.com',
  password: '123456',
})

const login = async () => {
  loginBroker({
    email: form.value.email,
    name: 'Ofis Brokeri',
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
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">
                E-posta
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">
                Şifre
              </label>
              <input
                v-model="form.password"
                type="password"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <button
              type="button"
              class="mt-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
              @click="login"
            >
              Broker Paneline Giriş Yap
            </button>

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



