<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeDuties } from '~/composables/useOfficeDuties'

const { consultants } = useOffice()

const {
  duties,
  dutyRequests,
  createDutyPlan,
  updateDutyStatus,
  updateDutyField,
  deleteDuty,
  notifyDuty,
  notifyMultipleDuties,
  updateDutyRequestStatus,
  dutyStats,
  formatDate,
} = useOfficeDuties()

const successMessage = ref('')
const search = ref('')
const statusFilter = ref('Tümü')
const dateFilter = ref('')
const consultantFilter = ref('Tümü')

const assignmentSearch = ref('')
const assignmentStatusFilter = ref('Tümü')
const assignmentWorkTypeFilter = ref('Tümü')
const selectedConsultantIds = ref([])
const assignmentCurrentPage = ref(1)
const assignmentPageSize = ref(10)
const assignmentPageSizeOptions = [10, 25, 50, 100]

const selectedDutyIds = ref([])

const form = ref({
  date: new Date().toISOString().slice(0, 10),
  startTime: '09:00',
  endTime: '18:00',
  shiftType: 'Tam Gün',
  location: 'Ofis',
  description: '',
})

const statusOptions = [
  'Planlandı',
  'Danışman Onayladı',
  'Tamamlandı',
  'Gelmedi',
  'Mazeretli',
  'Değişim Talebi',
]

const filteredAssignmentConsultants = computed(() => {
  let list = consultants.value

  if (assignmentSearch.value.trim()) {
    const q = assignmentSearch.value.toLocaleLowerCase('tr-TR')

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

  if (assignmentStatusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === assignmentStatusFilter.value)
  }

  if (assignmentWorkTypeFilter.value !== 'Tümü') {
    list = list.filter(item => item.workType === assignmentWorkTypeFilter.value)
  }

  return list
})

const assignmentTotalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredAssignmentConsultants.value.length / assignmentPageSize.value))
})

const paginatedAssignmentConsultants = computed(() => {
  const start = (assignmentCurrentPage.value - 1) * assignmentPageSize.value
  const end = start + assignmentPageSize.value

  return filteredAssignmentConsultants.value.slice(start, end)
})

const allFilteredSelected = computed(() => {
  if (!paginatedAssignmentConsultants.value.length) return false

  return paginatedAssignmentConsultants.value.every(item => {
    return selectedConsultantIds.value.map(String).includes(String(item.id))
  })
})

watch(
  [assignmentSearch, assignmentStatusFilter, assignmentWorkTypeFilter, assignmentPageSize],
  () => {
    assignmentCurrentPage.value = 1
  }
)

const filteredDuties = computed(() => {
  let list = duties.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.consultantName,
        item.consultantCode,
        item.status,
        item.shiftType,
        item.location,
        item.description,
      ]
        .filter(Boolean)
        .some(value => String(value).toLocaleLowerCase('tr-TR').includes(q))
    })
  }

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (consultantFilter.value !== 'Tümü') {
    list = list.filter(item => String(item.consultantId) === String(consultantFilter.value))
  }

  if (dateFilter.value) {
    list = list.filter(item => item.date === dateFilter.value)
  }

  return [...list].sort((a, b) => {
    return String(a.date).localeCompare(String(b.date))
  })
})

const visibleDutyIds = computed(() => {
  return filteredDuties.value.map(item => item.id)
})

const allVisibleDutiesSelected = computed(() => {
  if (!visibleDutyIds.value.length) return false

  return visibleDutyIds.value.every(id => {
    return selectedDutyIds.value.map(String).includes(String(id))
  })
})

const createPlan = () => {
  if (!form.value.date) {
    alert('Nöbet tarihi zorunludur.')
    return
  }

  if (!selectedConsultantIds.value.length) {
    alert('En az bir danışman seçmelisiniz.')
    return
  }

  const count = createDutyPlan({
    ...form.value,
    consultantIds: selectedConsultantIds.value,
  })

  successMessage.value = count > 0
    ? `${count} nöbet kaydı oluşturuldu.`
    : 'Seçilen danışmanlar için bu tarihte aynı nöbet daha önce oluşturulmuş olabilir.'

  selectedConsultantIds.value = []

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const toggleAllFilteredConsultants = () => {
  const visibleIds = paginatedAssignmentConsultants.value.map(item => item.id)
  const visibleIdsAsString = visibleIds.map(String)

  if (allFilteredSelected.value) {
    selectedConsultantIds.value = selectedConsultantIds.value.filter(id => {
      return !visibleIdsAsString.includes(String(id))
    })
    return
  }

  visibleIds.forEach((id) => {
    const exists = selectedConsultantIds.value.some(selectedId => String(selectedId) === String(id))

    if (!exists) {
      selectedConsultantIds.value.push(id)
    }
  })
}

const previousAssignmentPage = () => {
  if (assignmentCurrentPage.value > 1) {
    assignmentCurrentPage.value--
  }
}

const nextAssignmentPage = () => {
  if (assignmentCurrentPage.value < assignmentTotalPages.value) {
    assignmentCurrentPage.value++
  }
}

const clearSelectedConsultants = () => {
  selectedConsultantIds.value = []
}

const clearAssignmentFilters = () => {
  assignmentSearch.value = ''
  assignmentStatusFilter.value = 'Tümü'
  assignmentWorkTypeFilter.value = 'Tümü'
}

const toggleAllVisibleDuties = () => {
  if (allVisibleDutiesSelected.value) {
    selectedDutyIds.value = selectedDutyIds.value.filter(id => {
      return !visibleDutyIds.value.map(String).includes(String(id))
    })
    return
  }

  visibleDutyIds.value.forEach((id) => {
    const exists = selectedDutyIds.value.some(selectedId => String(selectedId) === String(id))

    if (!exists) {
      selectedDutyIds.value.push(id)
    }
  })
}

const notifySelectedDuties = () => {
  if (!selectedDutyIds.value.length) {
    alert('Bildirim göndermek için en az bir nöbet seçiniz.')
    return
  }

  const count = notifyMultipleDuties(selectedDutyIds.value)

  successMessage.value = `${count} nöbet bildirimi gönderildi.`
  selectedDutyIds.value = []

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const notifySingleDuty = (duty) => {
  successMessage.value = notifyDuty(duty.id)

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'Tümü'
  dateFilter.value = ''
  consultantFilter.value = 'Tümü'
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Danışman Onayladı') return 'bg-slate-800 text-white'
  if (status === 'Planlandı') return 'bg-slate-100 text-slate-700'
  if (status === 'Değişim Talebi') return 'bg-slate-200 text-slate-800'
  if (status === 'Mazeretli') return 'bg-slate-300 text-slate-800'
  if (status === 'Gelmedi') return 'bg-slate-900 text-white'
  return 'bg-slate-100 text-slate-700'
}

const requestClass = (status) => {
  if (status === 'Onaylandı') return 'bg-slate-900 text-white'
  if (status === 'Reddedildi') return 'bg-slate-300 text-slate-800'
  return 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Ofis Operasyon
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Nöbet Yönetimi
          </h1>
          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Haftalık ve aylık nöbet planı oluşturun, danışmanlara bildirim gönderin, nöbet onayı ve değişim taleplerini takip edin.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/consultant/duties"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <i class="bi bi-calendar-check mr-2"></i>
            Danışman Nöbetleri
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

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ dutyStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Bugün</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ dutyStats.today }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Planlandı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ dutyStats.planned }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Onaylandı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ dutyStats.confirmed }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tamamlandı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ dutyStats.completed }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Gelmedi</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ dutyStats.absent }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Değişim Talebi</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ dutyStats.requests }}</p>
      </div>
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Nöbet Planı Oluştur
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Bir tarihe bir veya birden fazla danışman için nöbet ataması yapın.
        </p>
      </div>

      <div class="grid gap-5 p-6">
        <div class="grid gap-4 xl:grid-cols-5">
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Tarih</label>
            <input
              v-model="form.date"
              type="date"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Başlangıç</label>
            <input
              v-model="form.startTime"
              type="time"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Bitiş</label>
            <input
              v-model="form.endTime"
              type="time"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Nöbet Türü</label>
            <select
              v-model="form.shiftType"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            >
              <option>Tam Gün</option>
              <option>Sabah</option>
              <option>Öğleden Sonra</option>
              <option>Hafta Sonu</option>
              <option>Telefon Nöbeti</option>
              <option>Ofis Nöbeti</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Lokasyon</label>
            <input
              v-model="form.location"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Ofis"
            />
          </div>
        </div>

        <textarea
          v-model="form.description"
          rows="3"
          class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          placeholder="Nöbet açıklaması veya özel not..."
        ></textarea>

        <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 class="font-bold text-slate-900">Danışman Seç</h3>
              <p class="mt-1 text-xs text-slate-500">
                {{ selectedConsultantIds.length }} danışman seçildi · {{ filteredAssignmentConsultants.length }} danışman listeleniyor
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="toggleAllFilteredConsultants"
              >
                {{ allFilteredSelected ? 'Sayfadakileri Kaldır' : 'Sayfadakileri Seç' }}
              </button>

              <button
                type="button"
                class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="clearSelectedConsultants"
              >
                Seçimi Temizle
              </button>
            </div>
          </div>

          <div class="mt-4 grid gap-3 xl:grid-cols-[1fr_180px_220px_100px]">
            <div class="relative">
              <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                v-model="assignmentSearch"
                type="text"
                class="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-500"
                placeholder="Danışman ara..."
              />
            </div>

            <select
              v-model="assignmentStatusFilter"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            >
              <option>Tümü</option>
              <option>Aday</option>
              <option>Aktif</option>
              <option>Pasif</option>
              <option>Ayrılmış</option>
            </select>

            <select
              v-model="assignmentWorkTypeFilter"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            >
              <option>Tümü</option>
              <option>SGK’lı Danışman</option>
              <option>Bağ-Kur’lu Danışman</option>
            </select>

            <button
              type="button"
              class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              @click="clearAssignmentFilters"
            >
              Filtre Sil
            </button>
          </div>

          <div class="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div class="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-sm font-bold text-slate-900">
                  Danışman Listesi
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ filteredAssignmentConsultants.length }} kayıttan sayfa {{ assignmentCurrentPage }} / {{ assignmentTotalPages }} gösteriliyor
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <select
                  v-model.number="assignmentPageSize"
                  class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-slate-500"
                >
                  <option
                    v-for="item in assignmentPageSizeOptions"
                    :key="item"
                    :value="item"
                  >
                    {{ item }} kayıt
                  </option>
                </select>

                <button
                  type="button"
                  class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="assignmentCurrentPage === 1"
                  @click="previousAssignmentPage"
                >
                  Önceki
                </button>

                <button
                  type="button"
                  class="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="assignmentCurrentPage === assignmentTotalPages"
                  @click="nextAssignmentPage"
                >
                  Sonraki
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-[850px] w-full divide-y divide-slate-200 text-sm">
                <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th class="w-14 px-4 py-3">
                      Seç
                    </th>
                    <th class="px-4 py-3">
                      Danışman
                    </th>
                    <th class="px-4 py-3">
                      Kod
                    </th>
                    <th class="px-4 py-3">
                      Durum
                    </th>
                    <th class="px-4 py-3">
                      Çalışma Türü
                    </th>
                    <th class="px-4 py-3">
                      Uzmanlık Bölgesi
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr
                    v-for="item in paginatedAssignmentConsultants"
                    :key="item.id"
                    class="transition hover:bg-slate-50"
                  >
                    <td class="px-4 py-3">
                      <input
                        v-model="selectedConsultantIds"
                        type="checkbox"
                        :value="item.id"
                        class="h-4 w-4"
                      />
                    </td>

                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xs font-bold text-slate-900">
                          {{ item.fullName?.charAt(0) || 'D' }}
                        </div>

                        <div>
                          <p class="font-bold text-slate-900">
                            {{ item.fullName }}
                          </p>
                          <p class="mt-1 text-xs text-slate-500">
                            {{ item.phone || '-' }}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td class="px-4 py-3 text-slate-700">
                      {{ item.code }}
                    </td>

                    <td class="px-4 py-3">
                      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {{ item.status }}
                      </span>
                    </td>

                    <td class="px-4 py-3">
                      <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="item.workType.includes('SGK') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'">
                        {{ item.workType.includes('SGK') ? 'SGK' : 'Bağ-Kur' }}
                      </span>
                    </td>

                    <td class="px-4 py-3 text-slate-600">
                      {{ item.expertiseRegion || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="!paginatedAssignmentConsultants.length"
              class="p-8 text-center text-sm text-slate-500"
            >
              Filtreye uygun danışman bulunamadı.
            </div>

            <div class="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
              <p class="text-xs text-slate-500">
                Seçili danışman: <strong class="text-slate-900">{{ selectedConsultantIds.length }}</strong>
              </p>

              <p class="text-xs text-slate-500">
                Bu yapı 100+ danışman için liste/sayfalama mantığında çalışır.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
          @click="createPlan"
        >
          Nöbet Planını Oluştur
        </button>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_180px_180px_220px_120px]">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Nöbet Ara</label>
          <div class="relative">
            <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="search"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-500"
              placeholder="Danışman, kod, lokasyon veya açıklama ara..."
            />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Tarih</label>
          <input
            v-model="dateFilter"
            type="date"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Durum</label>
          <select
            v-model="statusFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option v-for="item in statusOptions" :key="item">{{ item }}</option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Danışman</label>
          <select
            v-model="consultantFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option
              v-for="item in consultants"
              :key="item.id"
              :value="item.id"
            >
              {{ item.fullName }}
            </option>
          </select>
        </div>

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

    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900">
            Nöbet Listesi
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ filteredDuties.length }} nöbet kaydı listeleniyor
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="toggleAllVisibleDuties"
          >
            {{ allVisibleDutiesSelected ? 'Görünen Seçimi Kaldır' : 'Sayfadakileri Seç' }}
          </button>

          <button
            type="button"
            class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            @click="notifySelectedDuties"
          >
            Seçili Nöbetlere Bildirim Gönder
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-[1300px] w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Seç</th>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">Tarih</th>
              <th class="px-6 py-4">Saat</th>
              <th class="px-6 py-4">Tür</th>
              <th class="px-6 py-4">Lokasyon</th>
              <th class="px-6 py-4">Durum</th>
              <th class="px-6 py-4">Bildirim</th>
              <th class="px-6 py-4">Broker Notu</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 bg-white">
            <tr
              v-for="item in filteredDuties"
              :key="item.id"
              class="transition hover:bg-slate-50"
            >
              <td class="px-6 py-4">
                <input
                  v-model="selectedDutyIds"
                  type="checkbox"
                  :value="item.id"
                  class="h-4 w-4"
                />
              </td>

              <td class="px-6 py-4">
                <p class="font-bold text-slate-900">{{ item.consultantName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.consultantCode }}</p>
              </td>

              <td class="px-6 py-4">
                <p class="font-semibold text-slate-900">{{ formatDate(item.date) }}</p>
                <p class="mt-1 text-xs capitalize text-slate-500">{{ item.dayName }}</p>
              </td>

              <td class="px-6 py-4 font-semibold text-slate-700">
                {{ item.startTime }} - {{ item.endTime }}
              </td>

              <td class="px-6 py-4 text-slate-700">
                {{ item.shiftType }}
              </td>

              <td class="px-6 py-4 text-slate-700">
                {{ item.location }}
              </td>

              <td class="px-6 py-4">
                <select
                  :value="item.status"
                  class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  @change="updateDutyStatus(item.id, $event.target.value)"
                >
                  <option v-for="status in statusOptions" :key="status">
                    {{ status }}
                  </option>
                </select>

                <div class="mt-2">
                  <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(item.status)">
                    {{ item.status }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="item.notified ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'"
                >
                  {{ item.notified ? 'Gönderildi' : 'Bekliyor' }}
                </span>
              </td>

              <td class="px-6 py-4">
                <input
                  :value="item.brokerNote"
                  type="text"
                  class="w-full min-w-[220px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  placeholder="Not yaz..."
                  @input="updateDutyField(item.id, 'brokerNote', $event.target.value)"
                />
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    @click="notifySingleDuty(item)"
                  >
                    Bildir
                  </button>

                  <button
                    type="button"
                    class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    @click="deleteDuty(item.id)"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!filteredDuties.length" class="p-10 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-calendar-check"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Nöbet kaydı bulunamadı
        </h3>

        <p class="mt-2 text-sm text-slate-500">
          Filtreleri temizleyebilir veya yeni nöbet planı oluşturabilirsiniz.
        </p>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Nöbet Değişim Talepleri
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Danışmanların mazeret ve değişim taleplerini buradan yönetin.
        </p>
      </div>

      <div v-if="!dutyRequests.length" class="p-8 text-center text-sm text-slate-500">
        Henüz nöbet değişim talebi bulunmuyor.
      </div>

      <div v-else class="space-y-4 p-6">
        <div
          v-for="item in dutyRequests"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="requestClass(item.status)">
                  {{ item.status }}
                </span>
                <span class="text-xs text-slate-400">{{ item.createdAt }}</span>
              </div>

              <h3 class="mt-3 font-bold text-slate-900">
                {{ item.consultantName }}
              </h3>

              <p class="mt-2 text-sm text-slate-500">
                Mevcut nöbet: {{ formatDate(item.dutyDate) }} · {{ item.dutyDayName }} · {{ item.dutyTime }}
              </p>

              <p v-if="item.requestedDate" class="mt-1 text-sm text-slate-500">
                Talep edilen yeni tarih: {{ formatDate(item.requestedDate) }}
              </p>

              <p class="mt-3 text-sm leading-6 text-slate-600">
                {{ item.reason || 'Mazeret belirtilmedi.' }}
              </p>
            </div>

            <div class="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="updateDutyRequestStatus(item.id, 'Onaylandı', 'Talep broker tarafından onaylandı.')"
              >
                Onayla
              </button>

              <button
                type="button"
                class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="updateDutyRequestStatus(item.id, 'Reddedildi', 'Talep broker tarafından reddedildi.')"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>





