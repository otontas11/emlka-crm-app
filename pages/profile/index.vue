<script setup>
import { useProfile } from '~/composables/useProfile'
import { useProperties } from '~/composables/useProperties'
import { usePublicProfile } from '~/composables/usePublicProfile'

const profile = useProfile()
const properties = useProperties()
const { publicProfileUrl } = usePublicProfile()

const activeProperties = computed(() => {
  return properties.value
    .filter(item => item.status === 'Aktif')
    .slice(0, 6)
})

const formatPrice = (value, currency = 'TL') => {
  const amount = Number(value || 0)

  if (currency === 'USD') {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (currency === 'EUR') {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount)
}

const goToEdit = () => {
  window.location.href = '/profile/edit'
}

const goToPropertyDetail = (id) => {
  window.location.href = '/properties/' + String(id)
}

const openLink = (url) => {
  if (!url) return
  const normalized = url.startsWith('http') ? url : 'https://' + url
  window.open(normalized, '_blank')
}

const openWhatsapp = () => {
  const raw = String(profile.value.whatsapp || '').replace(/\D/g, '')
  if (!raw) return
  const phone = raw.startsWith('90') ? raw : '90' + raw
  window.open('https://wa.me/' + phone, '_blank')
}

const copyPublicLink = async () => {
  const fullUrl = window.location.origin + publicProfileUrl.value
  await navigator.clipboard.writeText(fullUrl)
  alert('Public profil linki kopyalandı.')
}
</script>

<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl">
      <div class="grid gap-6 p-6 lg:grid-cols-12 lg:p-8">
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-6 md:flex-row md:items-start">
            <div class="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/10 text-white shadow-xl">
              <img
                v-if="profile.profilePhoto"
                :src="profile.profilePhoto"
                alt="Profil Fotoğrafı"
                class="h-full w-full object-cover"
              />
              <i v-else class="bi bi-person-circle text-7xl"></i>
            </div>

            <div class="flex-1">
              <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Dijital Kartvizit
              </p>

              <h1 class="text-3xl font-bold tracking-tight text-white lg:text-5xl">
                {{ profile.fullName }}
              </h1>

              <p class="mt-2 text-lg font-semibold text-slate-200">
                {{ profile.title }}
              </p>

              <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                {{ profile.slogan }}
              </p>

              <div class="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  @click="openWhatsapp"
                >
                  <i class="bi bi-whatsapp mr-2"></i>
                  WhatsApp ile İletişim
                </button>

                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  @click="goToEdit"
                >
                  <i class="bi bi-pencil-square mr-2"></i>
                  Profili Düzenle
                </button>

                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  @click="copyPublicLink"
                >
                  <i class="bi bi-link-45deg mr-2"></i>
                  Public Linki Kopyala
                </button>
              </div>

              <div class="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-300">
                <strong class="text-white">Public Profil:</strong>
                <span class="ml-2">{{ publicProfileUrl }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid gap-4 lg:col-span-4">
          <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p class="text-[11px] font-medium uppercase tracking-wide text-slate-400">Telefon</p>
            <p class="mt-2 text-base font-semibold text-white">{{ profile.phone || '-' }}</p>
          </div>

          <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p class="text-[11px] font-medium uppercase tracking-wide text-slate-400">Uzmanlık Alanı</p>
            <p class="mt-2 text-base font-semibold text-white">{{ profile.expertiseAreas?.[0] || '-' }}</p>
          </div>

          <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p class="text-[11px] font-medium uppercase tracking-wide text-slate-400">Uzmanlık Bölgesi</p>
            <p class="mt-2 text-base font-semibold text-white">{{ profile.expertiseRegions?.[0] || '-' }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p class="text-slate-600">Profil vitrini hazır. Public link üst bölümde görünür ve kopyalanabilir.</p>
    </section>
  </div>
</template>


