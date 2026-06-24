<script setup>
import { useOffice } from '~/composables/useOffice'

definePageMeta({
  layout: false,
})

const { consultants } = useOffice()

const {
  loginConsultant,
} = useCrmAuth()

const errorMessage = ref('')
const isLoading = ref(false)

const form = ref({
  identifier: '',
  password: '',
})

const normalizePhone = (value) => {
  return String(value || '').replace(/\D/g, '')
}

const login = async () => {
  errorMessage.value = ''

  if (!form.value.identifier.trim()) {
    errorMessage.value = 'Telefon numarası veya e-posta adresi giriniz.'
    return
  }

  if (!form.value.password.trim()) {
    errorMessage.value = 'Şifre giriniz.'
    return
  }

  isLoading.value = true

  const identifier = form.value.identifier.trim().toLocaleLowerCase('tr-TR')
  const identifierPhone = normalizePhone(identifier)

  const consultant = consultants.value.find((item) => {
    const email = String(item.email || '').toLocaleLowerCase('tr-TR')
    const phone = normalizePhone(item.phone)

    return email === identifier || phone === identifierPhone
  })

  if (!consultant) {
    isLoading.value = false
    errorMessage.value = 'Bu telefon veya e-posta ile kayıtlı danışman bulunamadı.'
    return
  }

  // Prototip şifresi. Gerçek sistemde bu alan backend auth ile kontrol edilecek.
  if (form.value.password !== '123456') {
    isLoading.value = false
    errorMessage.value = 'Şifre hatalı. Prototip şifresi: 123456'
    return
  }

  loginConsultant(consultant)

  await navigateTo('/consultant', { replace: true })
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <div class="mx-auto flex min-h-[88vh] max-w-6xl items-center justify-center">
      <section class="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <div class="bg-slate-900 p-10 text-white">
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Danışman Paneli
          </p>

          <h1 class="mt-4 text-4xl font-bold tracking-tight">
            Danışmana özel çalışma alanı
          </h1>

          <p class="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Size atanmış duyuruları, eğitimleri, nöbetleri ve ofis bildirimlerini tek panelden takip edin.
          </p>

          <div class="mt-8 grid gap-4 text-sm text-slate-300">
            <p><i class="bi bi-check2-circle mr-2"></i> Bana gelen duyurular</p>
            <p><i class="bi bi-check2-circle mr-2"></i> Bana atanan eğitimler</p>
            <p><i class="bi bi-check2-circle mr-2"></i> Bana atanan nöbetler</p>
            <p><i class="bi bi-check2-circle mr-2"></i> Okudum / onaylıyorum takibi</p>
          </div>
        </div>

        <div class="p-10">
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Emlak CRM
          </p>

          <h2 class="mt-3 text-3xl font-bold text-slate-900">
            Danışman Girişi
          </h2>

          <p class="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Telefon numaranız veya e-posta adresiniz ile giriş yapın. Giriş yaptıktan sonra sadece size ait bildirimler, eğitimler ve nöbetler görüntülenir.
          </p>

          <div
            v-if="errorMessage"
            class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            <i class="bi bi-exclamation-circle mr-2"></i>
            {{ errorMessage }}
          </div>

          <div class="mt-8 grid gap-5">
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">
                Telefon numarası veya e-posta
              </label>
              <input
                v-model="form.identifier"
                type="text"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-slate-500"
                placeholder="Örn: 0545 441 41 18 veya danisman@mail.com"
                @keyup.enter="login"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">
                Şifre
              </label>
              <input
                v-model="form.password"
                type="password"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-slate-500"
                placeholder="Şifrenizi giriniz"
                @keyup.enter="login"
              />
              <p class="mt-2 text-xs text-slate-400">
                Prototip şifresi: 123456
              </p>
            </div>

            <button
              type="button"
              class="rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isLoading"
              @click="login"
            >
              {{ isLoading ? 'Giriş yapılıyor...' : 'Danışman Paneline Giriş Yap' }}
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
