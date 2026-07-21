<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeCommissions } from '~/composables/useOfficeCommissions'
import { useOfficeAuthorizedListings } from '~/composables/useOfficeAuthorizedListings'

const { consultants } = useOffice()

const {
  commissions,
  hydrateCommissions,
  formatPrice,
} = useOfficeCommissions()

const {
  listings,
  hydrateListings,
} = useOfficeAuthorizedListings()

hydrateCommissions()
hydrateListings()

const search = ref('')
const periodFilter = ref('Aylık')
const metricFilter = ref('Genel Performans')
const yearFilter = ref(String(new Date().getFullYear()))

const periodOptions = [
  'Aylık',
  '1. Çeyrek',
  '2. Çeyrek',
  '3. Çeyrek',
  '4. Çeyrek',
  '6 Aylık',
  'Yıllık',
]

const metricOptions = [
  'Genel Performans',
  'Komisyon Liderliği',
  'İşlem Liderliği',
  'Yetkili Portföy Liderliği',
]

const availableYears = computed(() => {
  const commissionYears = commissions.value
    .map(item => String(item.closeDate || item.createdAt || '').slice(0, 4))
    .filter(Boolean)

  const listingYears = listings.value
    .map(item => String(item.createdAt || item.startDate || '').slice(0, 4))
    .filter(Boolean)

  const years = [...new Set([...commissionYears, ...listingYears, String(new Date().getFullYear())])]

  return years.sort((a, b) => Number(b) - Number(a))
})

const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')

const selectedRange = computed(() => {
  const year = yearFilter.value

  if (periodFilter.value === 'Aylık') {
    return {
      start: `${year}-${currentMonth}-01`,
      end: `${year}-${currentMonth}-31`,
      label: `${currentMonth}. Ay / ${year}`,
    }
  }

  if (periodFilter.value === '1. Çeyrek') {
    return { start: `${year}-01-01`, end: `${year}-03-31`, label: `1. Çeyrek / ${year}` }
  }

  if (periodFilter.value === '2. Çeyrek') {
    return { start: `${year}-04-01`, end: `${year}-06-30`, label: `2. Çeyrek / ${year}` }
  }

  if (periodFilter.value === '3. Çeyrek') {
    return { start: `${year}-07-01`, end: `${year}-09-30`, label: `3. Çeyrek / ${year}` }
  }

  if (periodFilter.value === '4. Çeyrek') {
    return { start: `${year}-10-01`, end: `${year}-12-31`, label: `4. Çeyrek / ${year}` }
  }

  if (periodFilter.value === '6 Aylık') {
    return { start: `${year}-01-01`, end: `${year}-06-30`, label: `İlk 6 Ay / ${year}` }
  }

  return { start: `${year}-01-01`, end: `${year}-12-31`, label: `Yıllık / ${year}` }
})

const isInSelectedPeriod = (dateValue) => {
  if (!dateValue) return false

  const date = String(dateValue).slice(0, 10)

  return date >= selectedRange.value.start && date <= selectedRange.value.end
}

const activeConsultants = computed(() => {
  return consultants.value.filter(item => item.status !== 'Ayrıldı')
})

const validCommissions = computed(() => {
  return commissions.value
    .filter(item => item.paymentStatus !== 'İptal')
    .filter(item => isInSelectedPeriod(item.closeDate || item.createdAt))
})

const validListings = computed(() => {
  return listings.value
    .filter(item => isInSelectedPeriod(item.createdAt || item.startDate))
})

const baseRows = computed(() => {
  return activeConsultants.value.map((consultant) => {
    const consultantCommissions = validCommissions.value
      .filter(item => String(item.consultantId) === String(consultant.id))

    const consultantListings = validListings.value
      .filter(item => String(item.consultantId) === String(consultant.id))

    const officeRevenue = consultantCommissions.reduce((sum, item) => {
      return sum + Number(item.officeShareAmount || 0)
    }, 0)

    const grossCommission = consultantCommissions.reduce((sum, item) => {
      return sum + Number(item.grossCommission || 0)
    }, 0)

    const consultantShare = consultantCommissions.reduce((sum, item) => {
      return sum + Number(item.consultantShareAmount || 0)
    }, 0)

    const dealCount = consultantCommissions.length
    const authorizedListingCount = consultantListings.length

    const averageOfficeRevenue = dealCount > 0
      ? Math.round(officeRevenue / dealCount)
      : 0

    const highestOfficeRevenue = consultantCommissions.reduce((max, item) => {
      return Math.max(max, Number(item.officeShareAmount || 0))
    }, 0)

    return {
      consultant,
      officeRevenue,
      grossCommission,
      consultantShare,
      dealCount,
      authorizedListingCount,
      averageOfficeRevenue,
      highestOfficeRevenue,
    }
  })
})

const rows = computed(() => {
  const maxOfficeRevenue = Math.max(...baseRows.value.map(item => item.officeRevenue), 1)
  const maxDealCount = Math.max(...baseRows.value.map(item => item.dealCount), 1)
  const maxListingCount = Math.max(...baseRows.value.map(item => item.authorizedListingCount), 1)

  return baseRows.value.map((row) => {
    const commissionScore = Math.round((row.officeRevenue / maxOfficeRevenue) * 55)
    const dealScore = Math.round((row.dealCount / maxDealCount) * 30)
    const listingScore = Math.round((row.authorizedListingCount / maxListingCount) * 15)

    return {
      ...row,
      generalScore: commissionScore + dealScore + listingScore,
    }
  })
})

const createRankMap = (key, secondaryKey = 'officeRevenue') => {
  const sorted = [...rows.value].sort((a, b) => {
    const primary = Number(b[key] || 0) - Number(a[key] || 0)

    if (primary !== 0) return primary

    return Number(b[secondaryKey] || 0) - Number(a[secondaryKey] || 0)
  })

  const map = {}

  sorted.forEach((item, index) => {
    map[item.consultant.id] = index + 1
  })

  return map
}

const commissionRankMap = computed(() => createRankMap('officeRevenue', 'dealCount'))
const dealRankMap = computed(() => createRankMap('dealCount', 'officeRevenue'))
const listingRankMap = computed(() => createRankMap('authorizedListingCount', 'officeRevenue'))
const generalRankMap = computed(() => createRankMap('generalScore', 'officeRevenue'))

const filteredRows = computed(() => {
  let list = rows.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(row => {
      return [
        row.consultant.fullName,
        row.consultant.code,
        row.consultant.workType,
        row.consultant.expertiseRegion,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  const metricMap = {
    'Genel Performans': 'generalScore',
    'Komisyon Liderliği': 'officeRevenue',
    'İşlem Liderliği': 'dealCount',
    'Yetkili Portföy Liderliği': 'authorizedListingCount',
  }

  const sortKey = metricMap[metricFilter.value] || 'generalScore'

  return [...list].sort((a, b) => {
    const primary = Number(b[sortKey] || 0) - Number(a[sortKey] || 0)

    if (primary !== 0) return primary

    return Number(b.officeRevenue || 0) - Number(a.officeRevenue || 0)
  })
})

const commissionLeaders = computed(() => {
  return [...rows.value].sort((a, b) => b.officeRevenue - a.officeRevenue).slice(0, 3)
})

const dealLeaders = computed(() => {
  return [...rows.value].sort((a, b) => {
    if (b.dealCount !== a.dealCount) return b.dealCount - a.dealCount
    return b.officeRevenue - a.officeRevenue
  }).slice(0, 3)
})

const listingLeaders = computed(() => {
  return [...rows.value].sort((a, b) => {
    if (b.authorizedListingCount !== a.authorizedListingCount) return b.authorizedListingCount - a.authorizedListingCount
    return b.officeRevenue - a.officeRevenue
  }).slice(0, 3)
})

const generalLeaders = computed(() => {
  return [...rows.value].sort((a, b) => {
    if (b.generalScore !== a.generalScore) return b.generalScore - a.generalScore
    return b.officeRevenue - a.officeRevenue
  }).slice(0, 3)
})

const summary = computed(() => {
  return {
    consultantCount: filteredRows.value.length,
    dealCount: filteredRows.value.reduce((sum, item) => sum + item.dealCount, 0),
    listingCount: filteredRows.value.reduce((sum, item) => sum + item.authorizedListingCount, 0),
    officeRevenue: filteredRows.value.reduce((sum, item) => sum + item.officeRevenue, 0),
    grossCommission: filteredRows.value.reduce((sum, item) => sum + item.grossCommission, 0),
    consultantShare: filteredRows.value.reduce((sum, item) => sum + item.consultantShare, 0),
  }
})

const clearFilters = () => {
  search.value = ''
  periodFilter.value = 'Aylık'
  metricFilter.value = 'Genel Performans'
  yearFilter.value = String(new Date().getFullYear())
}

const rankBadgeClass = (index) => {
  if (index === 0) return 'bg-slate-900 text-white'
  if (index === 1) return 'bg-slate-700 text-white'
  if (index === 2) return 'bg-slate-500 text-white'
  return 'bg-slate-100 text-slate-700'
}

const rankClass = (rank) => {
  if (rank === 1) return 'bg-slate-900 text-white'
  if (rank === 2) return 'bg-slate-700 text-white'
  if (rank === 3) return 'bg-slate-500 text-white'
  return 'bg-slate-100 text-slate-700'
}

const leaderValue = (type, row) => {
  if (type === 'commission') return formatPrice(row.officeRevenue)
  if (type === 'deal') return `${row.dealCount} işlem`
  if (type === 'listing') return `${row.authorizedListingCount} portföy`
  return `${row.generalScore} puan`
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Ofis Yönetimi
          </p>

          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Liderlik Tabloları
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Komisyon, işlem, yetkili portföy ve genel performans liderliklerini ayrı ayrı takip edin. Aynı danışman bir kategoride 1. olurken başka kategoride farklı sırada olabilir.
          </p>
        </div>

        <NuxtLink
          to="/office"
          class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Ofis Paneline Dön
        </NuxtLink>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Dönem</p>
        <p class="mt-3 text-lg font-bold text-slate-900">{{ selectedRange.label }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Ofis Cirosu</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(summary.officeRevenue) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Brüt Komisyon</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(summary.grossCommission) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">İşlem Sayısı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ summary.dealCount }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Yetkili Portföy</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ summary.listingCount }}</p>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_160px_220px_260px_140px]">
        <UiInput
          v-model="search"
          label="Danışman Ara"
          type="text"
          variant="outline"
          size="sm"
          placeholder="Danışman adı, kod, bölge ara..."
        />

        <UiSelect v-model="yearFilter" label="Yıl" variant="outline" size="sm">
          <option
            v-for="item in availableYears"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiSelect v-model="periodFilter" label="Dönem" variant="outline" size="sm">
          <option
            v-for="item in periodOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiSelect v-model="metricFilter" label="Ana Sıralama" variant="outline" size="sm">
          <option
            v-for="item in metricOptions"
            :key="item"
          >
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

    <section class="grid gap-4 xl:grid-cols-4">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900">Komisyon Liderliği</h2>
        <p class="mt-1 text-sm text-slate-500">Ofise kazandırılan ciroya göre</p>

        <div class="mt-5 space-y-3">
          <div
            v-for="(row, index) in commissionLeaders"
            :key="row.consultant.id"
            class="rounded-2xl bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-bold text-slate-900">{{ row.consultant.fullName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ leaderValue('commission', row) }}</p>
              </div>

              <span class="rounded-full px-3 py-1 text-xs font-bold" :class="rankBadgeClass(index)">
                {{ index + 1 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900">İşlem Liderliği</h2>
        <p class="mt-1 text-sm text-slate-500">Tamamlanan işlem sayısına göre</p>

        <div class="mt-5 space-y-3">
          <div
            v-for="(row, index) in dealLeaders"
            :key="row.consultant.id"
            class="rounded-2xl bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-bold text-slate-900">{{ row.consultant.fullName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ leaderValue('deal', row) }}</p>
              </div>

              <span class="rounded-full px-3 py-1 text-xs font-bold" :class="rankBadgeClass(index)">
                {{ index + 1 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900">Yetkili Portföy Liderliği</h2>
        <p class="mt-1 text-sm text-slate-500">Alınan yetkili portföye göre</p>

        <div class="mt-5 space-y-3">
          <div
            v-for="(row, index) in listingLeaders"
            :key="row.consultant.id"
            class="rounded-2xl bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-bold text-slate-900">{{ row.consultant.fullName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ leaderValue('listing', row) }}</p>
              </div>

              <span class="rounded-full px-3 py-1 text-xs font-bold" :class="rankBadgeClass(index)">
                {{ index + 1 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900">Genel Performans</h2>
        <p class="mt-1 text-sm text-slate-500">Komisyon + işlem + portföy puanı</p>

        <div class="mt-5 space-y-3">
          <div
            v-for="(row, index) in generalLeaders"
            :key="row.consultant.id"
            class="rounded-2xl bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-bold text-slate-900">{{ row.consultant.fullName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ leaderValue('general', row) }}</p>
              </div>

              <span class="rounded-full px-3 py-1 text-xs font-bold" :class="rankBadgeClass(index)">
                {{ index + 1 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Danışman Liderlik Tablosu
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ filteredRows.length }} danışman listeleniyor · Ana sıralama: {{ metricFilter }}
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1300px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Genel Sıra</th>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">Komisyon Sırası</th>
              <th class="px-6 py-4">İşlem Sırası</th>
              <th class="px-6 py-4">Portföy Sırası</th>
              <th class="px-6 py-4">Genel Puan</th>
              <th class="px-6 py-4">Ofis Cirosu</th>
              <th class="px-6 py-4">Brüt Komisyon</th>
              <th class="px-6 py-4">Danışman Payı</th>
              <th class="px-6 py-4">İşlem</th>
              <th class="px-6 py-4">Yetkili Portföy</th>
              <th class="px-6 py-4 text-right">Detay</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="row in filteredRows"
              :key="row.consultant.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <span
                  class="inline-flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-bold"
                  :class="rankClass(generalRankMap[row.consultant.id])"
                >
                  {{ generalRankMap[row.consultant.id] }}
                </span>
              </td>

              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ row.consultant.fullName }}</p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ row.consultant.code }} · {{ row.consultant.workType }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ row.consultant.expertiseRegion || '-' }}
                </p>
              </td>

              <td class="px-6 py-5">
                <span class="rounded-full px-3 py-1 text-xs font-bold" :class="rankClass(commissionRankMap[row.consultant.id])">
                  {{ commissionRankMap[row.consultant.id] }}. sıra
                </span>
              </td>

              <td class="px-6 py-5">
                <span class="rounded-full px-3 py-1 text-xs font-bold" :class="rankClass(dealRankMap[row.consultant.id])">
                  {{ dealRankMap[row.consultant.id] }}. sıra
                </span>
              </td>

              <td class="px-6 py-5">
                <span class="rounded-full px-3 py-1 text-xs font-bold" :class="rankClass(listingRankMap[row.consultant.id])">
                  {{ listingRankMap[row.consultant.id] }}. sıra
                </span>
              </td>

              <td class="px-6 py-5">
                <p class="text-2xl font-bold text-slate-900">
                  {{ row.generalScore }}
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="text-lg font-bold text-slate-900">
                  {{ formatPrice(row.officeRevenue) }}
                </p>
              </td>

              <td class="px-6 py-5 font-semibold text-slate-900">
                {{ formatPrice(row.grossCommission) }}
              </td>

              <td class="px-6 py-5 font-semibold text-slate-900">
                {{ formatPrice(row.consultantShare) }}
              </td>

              <td class="px-6 py-5 font-bold text-slate-900">
                {{ row.dealCount }}
              </td>

              <td class="px-6 py-5 font-bold text-slate-900">
                {{ row.authorizedListingCount }}
              </td>

              <td class="px-6 py-5 text-right">
                <NuxtLink
                  :to="`/office/consultants/${row.consultant.id}`"
                  class="inline-flex rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Detay
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!filteredRows.length"
        class="p-10 text-center"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-trophy"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Bu dönemde kayıt bulunamadı
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Farklı bir dönem seçerek tekrar deneyebilirsiniz.
        </p>
      </div>
    </section>
  </div>
</template>
