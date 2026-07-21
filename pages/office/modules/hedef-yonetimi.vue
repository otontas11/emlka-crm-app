<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeTargets } from '~/composables/useOfficeTargets'
import { useOfficeCommissions } from '~/composables/useOfficeCommissions'
import { useOfficeAuthorizedListings } from '~/composables/useOfficeAuthorizedListings'

const { consultants } = useOffice()

const {
  targets,
  hydrateTargets,
  createTarget,
  updateTarget,
  deleteTarget,
  getTargetRange,
  isDateInRange,
  percent,
  targetStats,
  formatPrice,
} = useOfficeTargets()

const {
  commissions,
  hydrateCommissions,
} = useOfficeCommissions()

const {
  listings,
  hydrateListings,
} = useOfficeAuthorizedListings()

hydrateTargets()
hydrateCommissions()
hydrateListings()

const search = ref('')
const consultantFilter = ref('Tümü')
const periodTypeFilter = ref('Tümü')
const statusFilter = ref('Tümü')
const showForm = ref(false)
const successMessage = ref('')

const form = reactive({
  consultantId: '',
  periodType: 'Aylık',
  period: new Date().toISOString().slice(0, 7),
  revenueTarget: 0,
  dealTarget: 0,
  authorizedListingTarget: 0,
  note: '',
  status: 'Aktif',
})

const periodTypeOptions = [
  'Aylık',
  '1. Çeyrek',
  '2. Çeyrek',
  '3. Çeyrek',
  '4. Çeyrek',
  '6 Aylık',
  'Yıllık',
]

const statusOptions = [
  'Aktif',
  'Tamamlandı',
  'Pasif',
]

const consultantOptions = computed(() => {
  return consultants.value.filter(item => item.status !== 'Ayrıldı')
})

const selectedConsultant = computed(() => {
  return consultantOptions.value.find(item => String(item.id) === String(form.consultantId))
})

watch(
  () => form.periodType,
  (value) => {
    if (value === 'Aylık') {
      form.period = new Date().toISOString().slice(0, 7)
    } else {
      form.period = String(new Date().getFullYear())
    }
  }
)

const getTargetActuals = (target) => {
  const range = getTargetRange(target.periodType, target.period)

  const consultantCommissions = commissions.value
    .filter(item => String(item.consultantId) === String(target.consultantId))
    .filter(item => item.paymentStatus !== 'İptal')
    .filter(item => isDateInRange(item.closeDate || item.createdAt, range))

  const consultantListings = listings.value
    .filter(item => String(item.consultantId) === String(target.consultantId))
    .filter(item => isDateInRange(item.createdAt || item.startDate, range))

  const officeRevenue = consultantCommissions.reduce((sum, item) => {
    return sum + Number(item.officeShareAmount || 0)
  }, 0)

  const grossCommission = consultantCommissions.reduce((sum, item) => {
    return sum + Number(item.grossCommission || 0)
  }, 0)

  const dealCount = consultantCommissions.length
  const authorizedListingCount = consultantListings.length

  const revenuePercent = percent(officeRevenue, target.revenueTarget)
  const dealPercent = percent(dealCount, target.dealTarget)
  const listingPercent = percent(authorizedListingCount, target.authorizedListingTarget)

  const generalPercent = Math.round(
    (revenuePercent * 0.6) +
    (dealPercent * 0.25) +
    (listingPercent * 0.15)
  )

  return {
    range,
    officeRevenue,
    grossCommission,
    dealCount,
    authorizedListingCount,
    revenuePercent,
    dealPercent,
    listingPercent,
    generalPercent,
  }
}

const targetRows = computed(() => {
  return targets.value.map((target) => {
    return {
      ...target,
      actuals: getTargetActuals(target),
    }
  })
})

const filteredRows = computed(() => {
  let list = targetRows.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.consultantName,
        item.periodType,
        item.period,
        item.status,
        item.note,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  if (consultantFilter.value !== 'Tümü') {
    list = list.filter(item => String(item.consultantId) === String(consultantFilter.value))
  }

  if (periodTypeFilter.value !== 'Tümü') {
    list = list.filter(item => item.periodType === periodTypeFilter.value)
  }

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  return list.sort((a, b) => b.actuals.generalPercent - a.actuals.generalPercent)
})

const behindTargets = computed(() => {
  return filteredRows.value
    .filter(item => item.status === 'Aktif')
    .filter(item => item.actuals.generalPercent < 60)
})

const completedTargets = computed(() => {
  return filteredRows.value
    .filter(item => item.actuals.generalPercent >= 100)
})

const summary = computed(() => {
  const totalOfficeRevenue = filteredRows.value.reduce((sum, item) => {
    return sum + Number(item.actuals.officeRevenue || 0)
  }, 0)

  const totalTargetRevenue = filteredRows.value.reduce((sum, item) => {
    return sum + Number(item.revenueTarget || 0)
  }, 0)

  const totalDeals = filteredRows.value.reduce((sum, item) => {
    return sum + Number(item.actuals.dealCount || 0)
  }, 0)

  const totalListings = filteredRows.value.reduce((sum, item) => {
    return sum + Number(item.actuals.authorizedListingCount || 0)
  }, 0)

  return {
    totalOfficeRevenue,
    totalTargetRevenue,
    totalDeals,
    totalListings,
    generalPercent: percent(totalOfficeRevenue, totalTargetRevenue),
  }
})

const saveTarget = () => {
  if (!form.consultantId || !form.period || !form.revenueTarget) {
    successMessage.value = 'Danışman, dönem ve ciro hedefi zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  createTarget({
    ...form,
    consultantName: selectedConsultant.value?.fullName || 'Danışman',
  })

  successMessage.value = 'Danışman hedefi oluşturuldu.'
  showForm.value = false

  form.consultantId = ''
  form.periodType = 'Aylık'
  form.period = new Date().toISOString().slice(0, 7)
  form.revenueTarget = 0
  form.dealTarget = 0
  form.authorizedListingTarget = 0
  form.note = ''
  form.status = 'Aktif'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const clearFilters = () => {
  search.value = ''
  consultantFilter.value = 'Tümü'
  periodTypeFilter.value = 'Tümü'
  statusFilter.value = 'Tümü'
}

const confirmDelete = (target) => {
  if (confirm(`${target.consultantName} hedef kaydını silmek istiyor musunuz?`)) {
    deleteTarget(target.id)
  }
}

const progressWidth = (value) => {
  return `${Math.min(Number(value || 0), 100)}%`
}

const statusClass = (status) => {
  if (status === 'Aktif') return 'bg-slate-900 text-white'
  if (status === 'Tamamlandı') return 'bg-slate-700 text-white'
  return 'bg-white text-slate-700 border border-slate-200'
}

const percentClass = (value) => {
  if (value >= 100) return 'bg-slate-900 text-white'
  if (value >= 60) return 'bg-slate-200 text-slate-800'
  return 'bg-white text-slate-700 border border-slate-200'
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
            Hedef Yönetimi
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Danışmanların aylık, çeyreklik, 6 aylık ve yıllık ciro, işlem ve yetkili portföy hedeflerini takip edin.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/office"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Ofis Paneline Dön
          </NuxtLink>

          <UiButton
            variant="primary"
            shape="rounded"
            icon="bi-plus-lg"
            @click="showForm = !showForm"
          >
            Yeni Hedef
          </UiButton>
        </div>
      </div>
    </section>

    <div
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-info-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Aktif Hedef</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ targetStats.active }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <p class="text-sm font-medium text-slate-500">Toplam Ciro Hedefi</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(summary.totalTargetRevenue) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <p class="text-sm font-medium text-slate-500">Gerçekleşen Ofis Cirosu</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(summary.totalOfficeRevenue) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Genel Oran</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">%{{ summary.generalPercent }}</p>
      </div>
    </section>

    <section
      v-if="showForm"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 class="text-xl font-bold text-slate-900">Yeni Danışman Hedefi</h2>

      <div class="mt-6 grid gap-4 xl:grid-cols-4">
        <UiSelect
          v-model="form.consultantId"
          label="Danışman"
          variant="outline"
          size="sm"
        >
          <option value="">Danışman seçin</option>
          <option
            v-for="consultant in consultantOptions"
            :key="consultant.id"
            :value="consultant.id"
          >
            {{ consultant.fullName }}
          </option>
        </UiSelect>

        <UiSelect
          v-model="form.periodType"
          label="Hedef Dönemi"
          variant="outline"
          size="sm"
        >
          <option
            v-for="item in periodTypeOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiInput
          v-if="form.periodType === 'Aylık'"
          v-model="form.period"
          label="Ay"
          type="month"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-else
          v-model="form.period"
          label="Yıl"
          type="number"
          variant="outline"
          size="sm"
          min="2024"
          max="2035"
        />

        <UiSelect
          v-model="form.status"
          label="Durum"
          variant="outline"
          size="sm"
        >
          <option
            v-for="item in statusOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiInput
          v-model="form.revenueTarget"
          label="Ciro Hedefi"
          type="number"
          variant="outline"
          size="sm"
          min="0"
        />

        <UiInput
          v-model="form.dealTarget"
          label="İşlem Hedefi"
          type="number"
          variant="outline"
          size="sm"
          min="0"
        />

        <UiInput
          v-model="form.authorizedListingTarget"
          label="Yetkili Portföy Hedefi"
          type="number"
          variant="outline"
          size="sm"
          min="0"
        />

        <UiTextarea
          v-model="form.note"
          label="Broker Notu"
          :rows="3"
          variant="outline"
          size="sm"
          class="xl:col-span-4"
          placeholder="Hedefle ilgili not..."
        />
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <UiButton
          variant="primary"
          shape="rounded"
          @click="saveTarget"
        >
          Hedefi Kaydet
        </UiButton>

        <UiButton
          variant="secondary"
          shape="rounded"
          @click="showForm = false"
        >
          Vazgeç
        </UiButton>
      </div>
    </section>

    <section
      v-if="behindTargets.length || completedTargets.length"
      class="grid gap-4 xl:grid-cols-2"
    >
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-bold text-slate-900">Hedefte Geride Kalanlar</h2>
        <p class="mt-1 text-sm text-slate-500">%60 altında kalan aktif hedefler.</p>

        <div class="mt-5 space-y-3">
          <div
            v-for="item in behindTargets"
            :key="item.id"
            class="rounded-2xl bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-bold text-slate-900">{{ item.consultantName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.periodType }} · {{ item.actuals.range.label }}</p>
              </div>

              <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">
                %{{ item.actuals.generalPercent }}
              </span>
            </div>
          </div>

          <p v-if="!behindTargets.length" class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            Geride kalan hedef yok.
          </p>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-bold text-slate-900">Hedefi Tamamlayanlar</h2>
        <p class="mt-1 text-sm text-slate-500">%100 ve üzeri gerçekleşen hedefler.</p>

        <div class="mt-5 space-y-3">
          <div
            v-for="item in completedTargets"
            :key="item.id"
            class="rounded-2xl bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-bold text-slate-900">{{ item.consultantName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.periodType }} · {{ item.actuals.range.label }}</p>
              </div>

              <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                %{{ item.actuals.generalPercent }}
              </span>
            </div>
          </div>

          <p v-if="!completedTargets.length" class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            Henüz hedef tamamlayan yok.
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_220px_180px_140px]">
        <UiInput
          v-model="search"
          label="Arama"
          variant="outline"
          size="sm"
          placeholder="Danışman, dönem, not ara..."
        />

        <UiSelect
          v-model="consultantFilter"
          label="Danışman"
          variant="outline"
          size="sm"
        >
          <option>Tümü</option>
          <option
            v-for="consultant in consultantOptions"
            :key="consultant.id"
            :value="consultant.id"
          >
            {{ consultant.fullName }}
          </option>
        </UiSelect>

        <UiSelect
          v-model="periodTypeFilter"
          label="Dönem Türü"
          variant="outline"
          size="sm"
        >
          <option>Tümü</option>
          <option
            v-for="item in periodTypeOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiSelect
          v-model="statusFilter"
          label="Durum"
          variant="outline"
          size="sm"
        >
          <option>Tümü</option>
          <option
            v-for="item in statusOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <div class="flex items-end">
          <UiButton
            variant="secondary"
            shape="rounded"
            block
            @click="clearFilters"
          >
            Temizle
          </UiButton>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">Hedef Listesi</h2>
        <p class="mt-1 text-sm text-slate-500">{{ filteredRows.length }} hedef listeleniyor</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1500px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">Dönem</th>
              <th class="px-6 py-4">Ciro Hedefi</th>
              <th class="px-6 py-4">Ciro Gerçekleşen</th>
              <th class="px-6 py-4">İşlem</th>
              <th class="px-6 py-4">Yetkili Portföy</th>
              <th class="px-6 py-4">Genel Oran</th>
              <th class="px-6 py-4">Durum</th>
              <th class="px-6 py-4">Not</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in filteredRows"
              :key="item.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ item.consultantName }}</p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ item.periodType }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.actuals.range.label }}</p>
              </td>

              <td class="px-6 py-5">
                <input
                  :value="item.revenueTarget"
                  type="number"
                  class="w-36 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  @input="updateTarget(item.id, 'revenueTarget', $event.target.value)"
                />
              </td>

              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ formatPrice(item.actuals.officeRevenue) }}</p>
                <p class="mt-1 text-xs text-slate-500">%{{ item.actuals.revenuePercent }}</p>
              </td>

              <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900">{{ item.actuals.dealCount }}</span>
                  <span class="text-xs text-slate-400">/</span>
                  <input
                    :value="item.dealTarget"
                    type="number"
                    class="w-20 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                    @input="updateTarget(item.id, 'dealTarget', $event.target.value)"
                  />
                </div>
                <p class="mt-1 text-xs text-slate-500">%{{ item.actuals.dealPercent }}</p>
              </td>

              <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900">{{ item.actuals.authorizedListingCount }}</span>
                  <span class="text-xs text-slate-400">/</span>
                  <input
                    :value="item.authorizedListingTarget"
                    type="number"
                    class="w-20 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                    @input="updateTarget(item.id, 'authorizedListingTarget', $event.target.value)"
                  />
                </div>
                <p class="mt-1 text-xs text-slate-500">%{{ item.actuals.listingPercent }}</p>
              </td>

              <td class="px-6 py-5">
                <span class="rounded-full px-3 py-1 text-xs font-bold" :class="percentClass(item.actuals.generalPercent)">
                  %{{ item.actuals.generalPercent }}
                </span>

                <div class="mt-3 h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                  <div
                    class="h-full rounded-full bg-slate-900"
                    :style="{ width: progressWidth(item.actuals.generalPercent) }"
                  ></div>
                </div>
              </td>

              <td class="px-6 py-5">
                <select
                  :value="item.status"
                  class="rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  :class="statusClass(item.status)"
                  @change="updateTarget(item.id, 'status', $event.target.value)"
                >
                  <option
                    v-for="status in statusOptions"
                    :key="status"
                  >
                    {{ status }}
                  </option>
                </select>
              </td>

              <td class="px-6 py-5">
                <textarea
                  :value="item.note"
                  rows="3"
                  class="w-full min-w-[240px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  @input="updateTarget(item.id, 'note', $event.target.value)"
                ></textarea>
              </td>

              <td class="px-6 py-5 text-right">
                <UiButton
                  variant="secondary"
                  size="sm"
                  shape="rounded"
                  @click="confirmDelete(item)"
                >
                  Sil
                </UiButton>
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
          <i class="bi bi-bullseye"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Hedef bulunamadı
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Yeni danışman hedefi oluşturarak devam edebilirsiniz.
        </p>
      </div>
    </section>
  </div>
</template>
