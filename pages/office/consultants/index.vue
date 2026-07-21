<script setup>
import { useOffice } from '~/composables/useOffice'

const { consultants } = useOffice()

const search = ref('')
const statusFilter = ref('Tümü')
const workTypeFilter = ref('Tümü')
const sortKey = ref('fullName')
const sortDirection = ref('asc')
const currentPage = ref(1)
const pageSize = ref(10)

const pageSizeOptions = [10, 25, 50, 100]

const filteredConsultants = computed(() => {
  let list = consultants.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.fullName,
        item.code,
        item.phone,
        item.email,
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

const sortedConsultants = computed(() => {
  const list = [...filteredConsultants.value]

  list.sort((a, b) => {
    const aValue = a[sortKey.value] ?? ''
    const bValue = b[sortKey.value] ?? ''

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection.value === 'asc'
        ? aValue - bValue
        : bValue - aValue
    }

    return sortDirection.value === 'asc'
      ? String(aValue).localeCompare(String(bValue), 'tr-TR')
      : String(bValue).localeCompare(String(aValue), 'tr-TR')
  })

  return list
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(sortedConsultants.value.length / pageSize.value))
})

const paginatedConsultants = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value

  return sortedConsultants.value.slice(start, end)
})

const tableStats = computed(() => {
  const total = consultants.value.length
  const active = consultants.value.filter(item => item.status === 'Aktif').length
  const candidate = consultants.value.filter(item => item.status === 'Aday').length
  const missingDocuments = consultants.value.reduce((sum, item) => {
    return sum + Number(item.missingDocuments || 0)
  }, 0)
  const totalRevenue = consultants.value.reduce((sum, item) => {
    return sum + Number(item.revenue || 0)
  }, 0)

  return {
    total,
    active,
    candidate,
    missingDocuments,
    totalRevenue,
  }
})

watch([search, statusFilter, workTypeFilter, pageSize], () => {
  currentPage.value = 1
})

const changeSort = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    return
  }

  sortKey.value = key
  sortDirection.value = 'asc'
}

const sortIcon = (key) => {
  if (sortKey.value !== key) return 'bi-arrow-down-up'
  return sortDirection.value === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up'
}

const formatMoney = (value) => {
  return Number(value || 0).toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  })
}

const statusClass = (status) => {
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

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'Tümü'
  workTypeFilter.value = 'Tümü'
  sortKey.value = 'fullName'
  sortDirection.value = 'asc'
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
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
            Danışman Yönetimi
          </h1>
          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Ofise bağlı danışmanların çalışma türü, durum, uzmanlık, ciro, portföy, işlem, eksik evrak ve hedef takibini tablo görünümünde yönetin.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/office/consultants/new"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <i class="bi bi-person-plus mr-2"></i>
            Yeni Danışman
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

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam Danışman</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ tableStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Aktif Danışman</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ tableStats.active }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Aday Danışman</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ tableStats.candidate }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Eksik Evrak</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ tableStats.missingDocuments }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam Ciro</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatMoney(tableStats.totalRevenue) }}</p>
      </div>
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_200px_240px_150px_120px]">
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
              placeholder="Ad, kod, telefon, email, uzmanlık veya bölge ara..."
            />
          </div>
        </div>

        <UiSelect v-model="statusFilter" label="Durum" variant="outline" size="sm">
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

        <UiSelect v-model.number="pageSize" label="Sayfa Başına" variant="outline" size="sm">
          <option v-for="item in pageSizeOptions" :key="item" :value="item">
            {{ item }}
          </option>
        </UiSelect>

        <div class="flex items-end">
          <UiButton variant="secondary" shape="rounded" block @click="clearFilters">
            Temizle
          </UiButton>
        </div>
      </div>
    </section>

    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900">
            Danışman Listesi
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ filteredConsultants.length }} danışman bulundu · Sayfa {{ currentPage }} / {{ totalPages }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="previousPage"
          >
            Önceki
          </button>

          <button
            type="button"
            class="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            Sonraki
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-[1350px] w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">
                <button type="button" class="flex items-center gap-2" @click="changeSort('fullName')">
                  Danışman
                  <i class="bi" :class="sortIcon('fullName')"></i>
                </button>
              </th>

              <th class="px-6 py-4">İletişim</th>

              <th class="px-6 py-4">
                <button type="button" class="flex items-center gap-2" @click="changeSort('status')">
                  Durum
                  <i class="bi" :class="sortIcon('status')"></i>
                </button>
              </th>

              <th class="px-6 py-4">
                <button type="button" class="flex items-center gap-2" @click="changeSort('workType')">
                  Çalışma Türü
                  <i class="bi" :class="sortIcon('workType')"></i>
                </button>
              </th>

              <th class="px-6 py-4">Uzmanlık</th>

              <th class="px-6 py-4 text-center">
                <button type="button" class="mx-auto flex items-center gap-2" @click="changeSort('activeListings')">
                  İlan
                  <i class="bi" :class="sortIcon('activeListings')"></i>
                </button>
              </th>

              <th class="px-6 py-4 text-center">
                <button type="button" class="mx-auto flex items-center gap-2" @click="changeSort('missingDocuments')">
                  Eksik Evrak
                  <i class="bi" :class="sortIcon('missingDocuments')"></i>
                </button>
              </th>

              <th class="px-6 py-4 text-right">
                <button type="button" class="ml-auto flex items-center gap-2" @click="changeSort('revenue')">
                  Ciro
                  <i class="bi" :class="sortIcon('revenue')"></i>
                </button>
              </th>

              <th class="px-6 py-4 text-center">
                <button type="button" class="mx-auto flex items-center gap-2" @click="changeSort('dealCount')">
                  İşlem
                  <i class="bi" :class="sortIcon('dealCount')"></i>
                </button>
              </th>

              <th class="px-6 py-4 text-center">Toplantı</th>
              <th class="px-6 py-4">Hedef</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 bg-white">
            <tr
              v-for="item in paginatedConsultants"
              :key="item.id"
              class="transition hover:bg-slate-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-900">
                    {{ item.fullName?.charAt(0) || 'D' }}
                  </div>

                  <div class="min-w-0">
                    <p class="truncate font-bold text-slate-900">
                      {{ item.fullName }}
                    </p>
                    <p class="mt-1 text-xs text-slate-500">
                      {{ item.code }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <p class="whitespace-nowrap text-slate-700">{{ item.phone || '-' }}</p>
                <p class="mt-1 max-w-[210px] truncate text-xs text-slate-500">{{ item.email || '-' }}</p>
              </td>

              <td class="px-6 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusClass(item.status)"
                >
                  {{ item.status || '-' }}
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="workTypeClass(item.workType)"
                >
                  {{ item.workType?.includes('SGK') ? 'SGK’lı' : 'Bağ-Kur’lu' }}
                </span>
              </td>

              <td class="px-6 py-4">
                <p class="max-w-[220px] truncate font-semibold text-slate-900">
                  {{ item.expertiseArea || '-' }}
                </p>
                <p class="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                  {{ item.expertiseRegion || '-' }}
                </p>
              </td>

              <td class="px-6 py-4 text-center font-bold text-slate-900">
                {{ item.activeListings || 0 }}
              </td>

              <td class="px-6 py-4 text-center">
                <span
                  class="rounded-full px-3 py-1 text-xs font-bold"
                  :class="Number(item.missingDocuments || 0) > 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'"
                >
                  {{ item.missingDocuments || 0 }}
                </span>
              </td>

              <td class="px-6 py-4 text-right font-bold text-slate-900">
                {{ formatMoney(item.revenue) }}
              </td>

              <td class="px-6 py-4 text-center font-bold text-slate-900">
                {{ item.dealCount || 0 }}
              </td>

              <td class="px-6 py-4 text-center text-slate-700">
                %{{ item.meetingAttendance || 0 }}
              </td>

              <td class="px-6 py-4">
                <div class="min-w-[150px]">
                  <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Oryantasyon</span>
                    <span>%{{ item.orientationProgress || 0 }}</span>
                  </div>

                  <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      class="h-full rounded-full bg-slate-900"
                      :style="{ width: Number(item.orientationProgress || 0) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                    :to="`/office/consultants/${item.id}`"
                    class="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    Detay
                  </NuxtLink>

                  <NuxtLink
                    to="/office/modules/evrak-takibi"
                    class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Evrak
                  </NuxtLink>

                  <NuxtLink
                    to="/office/modules/oryantasyon"
                    class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Oryantasyon
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!paginatedConsultants.length"
        class="p-10 text-center"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-people"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Danışman bulunamadı
        </h3>

        <p class="mt-2 text-sm text-slate-500">
          Filtreleri temizleyerek tekrar deneyebilirsiniz.
        </p>
      </div>

      <div class="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <p class="text-sm text-slate-500">
          {{ sortedConsultants.length }} kayıttan
          {{ sortedConsultants.length ? ((currentPage - 1) * pageSize) + 1 : 0 }}
          -
          {{ Math.min(currentPage * pageSize, sortedConsultants.length) }}
          arası gösteriliyor.
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="previousPage"
          >
            Önceki
          </button>

          <span class="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-900">
            {{ currentPage }} / {{ totalPages }}
          </span>

          <button
            type="button"
            class="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            Sonraki
          </button>
        </div>
      </div>
    </section>
  </div>
</template>


