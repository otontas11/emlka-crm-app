<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeOrientation } from '~/composables/useOfficeOrientation'

const { consultants } = useOffice()

const {
  currentUser,
  initAuth,
} = useCrmAuth()

const {
  ensureOrientationForConsultants,
  getStepsByConsultant,
  updateStepNote,
  completionPercent,
  waitingCount,
} = useOfficeOrientation()

initAuth()
ensureOrientationForConsultants()

const statusFilter = ref('Tümü')
const categoryFilter = ref('Tümü')
const successMessage = ref('')

const currentConsultantId = computed(() => {
  return currentUser.value?.consultantId || null
})

const currentConsultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(currentConsultantId.value))
})

const allSteps = computed(() => {
  if (!currentConsultantId.value) return []
  return getStepsByConsultant(currentConsultantId.value)
})

const mySteps = computed(() => {
  let list = allSteps.value

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (categoryFilter.value !== 'Tümü') {
    list = list.filter(item => item.category === categoryFilter.value)
  }

  return list
})

const categories = computed(() => {
  return [...new Set(allSteps.value.map(item => item.category))]
})

const completedCount = computed(() => {
  return allSteps.value.filter(item => item.status === 'Tamamlandı').length
})

const inProgressCount = computed(() => {
  return allSteps.value.filter(item => item.status === 'Devam Ediyor').length
})

const pendingCount = computed(() => {
  return allSteps.value.filter(item => item.status === 'Bekliyor').length
})

const updateConsultantNote = (item, value) => {
  updateStepNote(item.id, value)

  successMessage.value = 'Notunuz kaydedildi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 2500)
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Devam Ediyor') return 'bg-slate-200 text-slate-800'
  return 'bg-white text-slate-700 border border-slate-200'
}

const stepIcon = (status) => {
  if (status === 'Tamamlandı') return 'bi-check2-circle'
  if (status === 'Devam Ediyor') return 'bi-arrow-repeat'
  return 'bi-clock'
}

const clearFilters = () => {
  statusFilter.value = 'Tümü'
  categoryFilter.value = 'Tümü'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Danışman Paneli
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Oryantasyonum
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Ofise başlangıç sürecinizde tamamlanması gereken adımları, durumları ve broker notlarını buradan takip edebilirsiniz.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/consultant"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Danışman Paneline Dön
          </NuxtLink>

          <NuxtLink
            to="/consultant/notifications"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Bildirimlerim
          </NuxtLink>
        </div>
      </div>
    </section>

    <div
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-check2-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 lg:grid-cols-[1fr_180px_180px_180px_180px]">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Giriş Yapan Danışman
          </p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">
            {{ currentConsultant?.fullName || currentUser?.name || 'Danışman' }}
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ currentConsultant?.code }} · {{ currentConsultant?.workType }} · {{ currentConsultant?.expertiseRegion }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Tamamlanma</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            %{{ completionPercent(currentConsultantId) }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Tamamlanan</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            {{ completedCount }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Devam Eden</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            {{ inProgressCount }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Bekleyen</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            {{ pendingCount }}
          </p>
        </div>
      </div>

      <div class="mt-6">
        <div class="mb-2 flex items-center justify-between text-sm text-slate-500">
          <span>Genel oryantasyon ilerlemesi</span>
          <span>%{{ completionPercent(currentConsultantId) }}</span>
        </div>

        <div class="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            class="h-full rounded-full bg-slate-900"
            :style="{ width: completionPercent(currentConsultantId) + '%' }"
          ></div>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 md:grid-cols-[220px_220px_120px]">
        <UiSelect v-model="statusFilter" label="Adım Durumu" variant="outline" size="sm">
          <option>Tümü</option>
          <option>Bekliyor</option>
          <option>Devam Ediyor</option>
          <option>Tamamlandı</option>
        </UiSelect>

        <UiSelect v-model="categoryFilter" label="Kategori" variant="outline" size="sm">
          <option>Tümü</option>
          <option
            v-for="item in categories"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <div class="flex items-end">
          <button
            type="button"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="clearFilters"
          >
            Temizle
          </button>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Oryantasyon Adımlarım
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ mySteps.length }} adım listeleniyor · Eksik adım: {{ waitingCount(currentConsultantId) }}
        </p>
      </div>

      <div v-if="!mySteps.length" class="p-10 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-list-check"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Adım bulunamadı
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Filtreleri temizleyerek tekrar deneyebilirsiniz.
        </p>
      </div>

      <div v-else class="grid gap-4 p-6 xl:grid-cols-2">
        <div
          v-for="item in mySteps"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl text-slate-700 shadow-sm">
              <i class="bi" :class="stepIcon(item.status)"></i>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ item.category }}
                </span>

                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusClass(item.status)"
                >
                  {{ item.status }}
                </span>

                <span
                  v-if="item.completedAt"
                  class="text-xs text-slate-400"
                >
                  {{ item.completedAt }}
                </span>
              </div>

              <h3 class="mt-3 font-bold text-slate-900">
                {{ item.title }}
              </h3>

              <p class="mt-2 text-sm leading-6 text-slate-500">
                {{ item.description }}
              </p>

              <div
                v-if="item.note"
                class="mt-4 rounded-2xl bg-white p-4"
              >
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Broker Notu
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  {{ item.note }}
                </p>
              </div>

              <div class="mt-4">
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Danışman Notu
                </label>
                <textarea
                  :value="item.note"
                  rows="3"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  placeholder="Bu adımla ilgili notunuzu yazabilirsiniz..."
                  @change="updateConsultantNote(item, $event.target.value)"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
