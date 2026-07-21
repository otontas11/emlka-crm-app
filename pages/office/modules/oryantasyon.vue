<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeOrientation } from '~/composables/useOfficeOrientation'

const { consultants } = useOffice()

const {
  ensureOrientationForConsultants,
  getStepsByConsultant,
  updateStepStatus,
  updateStepNote,
  completionPercent,
  waitingCount,
  sendOrientationReminder,
  orientationStats,
} = useOfficeOrientation()

ensureOrientationForConsultants()

const selectedConsultantId = ref(consultants.value[0]?.id || null)
const search = ref('')
const statusFilter = ref('Tümü')
const workTypeFilter = ref('Tümü')
const stepStatusFilter = ref('Tümü')
const successMessage = ref('')

const selectedConsultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(selectedConsultantId.value))
})

const filteredConsultants = computed(() => {
  let list = consultants.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.fullName,
        item.code,
        item.status,
        item.workType,
        item.expertiseArea,
        item.expertiseRegion,
      ]
        .filter(Boolean)
        .some(value => String(value).toLocaleLowerCase('tr-TR').includes(q))
    })
  }

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (workTypeFilter.value !== 'Tümü') {
    list = list.filter(item => item.workType === workTypeFilter.value)
  }

  return list
})

watch(
  filteredConsultants,
  (list) => {
    if (!list.length) {
      selectedConsultantId.value = null
      return
    }

    const selectedStillVisible = list.some(item => {
      return String(item.id) === String(selectedConsultantId.value)
    })

    if (!selectedStillVisible) {
      selectedConsultantId.value = list[0].id
    }
  },
  { immediate: true }
)

const selectedSteps = computed(() => {
  if (!selectedConsultantId.value) return []

  let list = getStepsByConsultant(selectedConsultantId.value)

  if (stepStatusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === stepStatusFilter.value)
  }

  return list
})

const selectConsultant = (id) => {
  selectedConsultantId.value = id
  stepStatusFilter.value = 'Tümü'
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'Tümü'
  workTypeFilter.value = 'Tümü'
  stepStatusFilter.value = 'Tümü'
}

const sendReminder = () => {
  if (!selectedConsultantId.value) return

  successMessage.value = sendOrientationReminder(selectedConsultantId.value)

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Devam Ediyor') return 'bg-slate-200 text-slate-800'
  return 'bg-white text-slate-700 border border-slate-200'
}

const consultantStatusClass = (status) => {
  if (status === 'Aktif') return 'bg-slate-900 text-white'
  if (status === 'Aday') return 'bg-slate-100 text-slate-700'
  if (status === 'Pasif') return 'bg-slate-200 text-slate-700'
  if (status === 'Ayrılmış') return 'bg-slate-300 text-slate-800'
  return 'bg-slate-100 text-slate-700'
}

const workTypeClass = (workType) => {
  if (workType === 'SGK’lı Danışman') return 'bg-slate-900 text-white'
  return 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Ofis Yönetimi
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Yeni Başlayan Danışman Oryantasyonu
          </h1>
          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Danışman kaydı, sözleşmeler, kullanıcı hesabı, eğitimler, ofis kuralları, bölge ataması, ilk hedef ve ilk saha planı adımlarını danışman bazlı takip edin.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/office/consultants"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <i class="bi bi-people mr-2"></i>
            Danışmanlar
          </NuxtLink>

          <NuxtLink
            to="/office"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <i class="bi bi-arrow-left mr-2"></i>
            Ofise Dön
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

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Danışman</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ orientationStats.totalConsultants }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tamamlanan</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ orientationStats.completedConsultants }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Devam Eden</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ orientationStats.inProgressConsultants }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Başlamayan</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ orientationStats.notStartedConsultants }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tamamlanan Adım</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ orientationStats.completedSteps }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Bekleyen Adım</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ orientationStats.waitingSteps }}</p>
      </div>
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_200px_240px_220px_120px]">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Danışman Ara
          </label>
          <div class="relative">
            <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="search"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-500"
              placeholder="Ad, kod, uzmanlık veya bölge ara..."
            />
          </div>
        </div>

        <UiSelect v-model="statusFilter" label="Danışman Durumu" variant="outline" size="sm">
          <option>Tümü</option>
          <option>Aday</option>
          <option>Aktif</option>
          <option>Pasif</option>
          <option>Ayrılmış</option>
        </UiSelect>

        <UiSelect v-model="workTypeFilter" label="Çalışma Türü" variant="outline" size="sm">
          <option>Tümü</option>
          <option>SGK’lı Danışman</option>
          <option>Bağ-Kur’lu Danışman</option>
        </UiSelect>

        <UiSelect v-model="stepStatusFilter" label="Adım Durumu" variant="outline" size="sm">
          <option>Tümü</option>
          <option>Bekliyor</option>
          <option>Devam Ediyor</option>
          <option>Tamamlandı</option>
        </UiSelect>

        <div class="flex items-end">
          <UiButton variant="secondary" shape="rounded" block @click="clearFilters">Temizle</UiButton>
        </div>
      </div>
    </section>

    <div class="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Danışman Oryantasyon Listesi
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ filteredConsultants.length }} danışman listeleniyor
          </p>
        </div>

        <div class="max-h-[760px] space-y-3 overflow-auto p-4">
          <button
            v-for="item in filteredConsultants"
            :key="item.id"
            type="button"
            class="w-full rounded-3xl border p-4 text-left transition hover:bg-slate-50"
            :class="String(selectedConsultantId) === String(item.id)
              ? 'border-slate-900 bg-slate-50'
              : 'border-slate-200 bg-white'"
            @click="selectConsultant(item.id)"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-bold text-slate-900">{{ item.fullName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.code }} · {{ item.expertiseRegion }}</p>
              </div>

              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="consultantStatusClass(item.status)"
              >
                {{ item.status }}
              </span>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="workTypeClass(item.workType)"
              >
                {{ item.workType.includes('SGK') ? 'SGK' : 'Bağ-Kur' }}
              </span>

              <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                Eksik: {{ waitingCount(item.id) }}
              </span>
            </div>

            <div class="mt-4">
              <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>Oryantasyon</span>
                <span>%{{ completionPercent(item.id) }}</span>
              </div>

              <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  class="h-full rounded-full bg-slate-900"
                  :style="{ width: completionPercent(item.id) + '%' }"
                ></div>
              </div>
            </div>
          </button>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 class="text-xl font-bold text-slate-900">
                {{ selectedConsultant?.fullName || 'Danışman' }} Oryantasyon Süreci
              </h2>
              <p class="mt-1 text-sm text-slate-500">
                {{ selectedConsultant?.workType }} · {{ selectedConsultant?.expertiseArea }} · {{ selectedConsultant?.expertiseRegion }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button
                v-if="waitingCount(selectedConsultantId) > 0"
                type="button"
                class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="sendReminder"
              >
                <i class="bi bi-bell mr-2"></i>
                Hatırlatma Gönder
              </button>

              <div class="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                <p class="text-xs text-slate-500">Tamamlanma</p>
                <p class="text-xl font-bold text-slate-900">%{{ completionPercent(selectedConsultantId) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!selectedSteps.length" class="p-10 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
            <i class="bi bi-list-check"></i>
          </div>

          <h3 class="mt-4 text-lg font-bold text-slate-900">
            Adım bulunamadı
          </h3>

          <p class="mt-2 text-sm text-slate-500">
            Filtreleri temizleyerek tekrar deneyebilirsiniz.
          </p>
        </div>

        <div v-else class="grid gap-4 p-6 xl:grid-cols-2">
          <div
            v-for="item in selectedSteps"
            :key="item.id"
            class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {{ item.category }}
                </p>
                <h3 class="mt-2 font-bold text-slate-900">
                  {{ item.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-slate-500">
                  {{ item.description }}
                </p>
              </div>

              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="statusClass(item.status)"
              >
                {{ item.status }}
              </span>
            </div>

            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Durum
                </label>
                <select
                  :value="item.status"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  @change="updateStepStatus(item.id, $event.target.value)"
                >
                  <option>Bekliyor</option>
                  <option>Devam Ediyor</option>
                  <option>Tamamlandı</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tamamlanma Tarihi
                </label>
                <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  {{ item.completedAt || '-' }}
                </div>
              </div>
            </div>

            <div class="mt-4">
              <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Broker Notu
              </label>
              <textarea
                :value="item.note"
                rows="3"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                placeholder="Bu adım ile ilgili not..."
                @input="updateStepNote(item.id, $event.target.value)"
              ></textarea>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>



