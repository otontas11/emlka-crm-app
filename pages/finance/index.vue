<script setup>
import { useFinance } from '~/composables/useFinance'

const financeRecords = useFinance()

const viewMode = ref('card')
const searchTerm = ref('')
const selectedType = ref('Tümü')
const selectedStatus = ref('Tümü')
const selectedPackage = ref('Tümü')

const types = ['Tümü', 'Gelir', 'Gider', 'Fatura', 'Ödeme']
const statuses = ['Tümü', 'Tahsil Edildi', 'Ödendi', 'Bekliyor', 'Ödenecek', 'Gecikmiş', 'Kısmi Ödendi']
const packages = ['Tümü', 'Basic', 'Plus', 'Pro']

const normalizeText = (value) => {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
}

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('tr-TR').format(date)
}

const formatMoney = (value, currency = 'TL') => {
  const amount = Number(value || 0)

  if (currency === 'USD') {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (currency === 'EUR') {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(amount)
}

const filteredRecords = computed(() => {
  const term = normalizeText(searchTerm.value.trim())

  return financeRecords.value.filter((item) => {
    const searchableText = [
      item.title,
      item.subType,
      item.partyName,
      item.relatedName,
      item.notes,
    ]
      .map(normalizeText)
      .join(' ')

    const matchesSearch = !term || searchableText.includes(term)
    const matchesType = selectedType.value === 'Tümü' || item.type === selectedType.value
    const matchesStatus = selectedStatus.value === 'Tümü' || item.status === selectedStatus.value
    const matchesPackage = selectedPackage.value === 'Tümü' || item.packageLevel === selectedPackage.value

    return matchesSearch && matchesType && matchesStatus && matchesPackage
  })
})

const totalIncome = computed(() =>
  financeRecords.value
    .filter(item => item.type === 'Gelir')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)
)

const totalExpense = computed(() =>
  financeRecords.value
    .filter(item => item.type === 'Gider')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)
)

const totalReceivable = computed(() =>
  financeRecords.value
    .filter(item => item.type !== 'Gider' && ['Bekliyor', 'Ödenecek'].includes(item.status))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)
)

const totalPayable = computed(() =>
  financeRecords.value
    .filter(item => item.type === 'Gider' || item.type === 'Fatura')
    .filter(item => ['Bekliyor', 'Ödenecek', 'Gecikmiş'].includes(item.status))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)
)

const overdueCount = computed(() =>
  financeRecords.value.filter(item => item.status === 'Gecikmiş').length
)

const netBalance = computed(() => totalIncome.value - totalExpense.value)

const getTypeClass = (type) => {
  if (type === 'Gelir') return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  if (type === 'Gider') return 'bg-red-100 text-red-700 border border-red-200'
  if (type === 'Fatura') return 'bg-amber-100 text-amber-700 border border-amber-200'
  return 'bg-blue-100 text-blue-700 border border-blue-200'
}

const getStatusClass = (status) => {
  if (status === 'Tahsil Edildi' || status === 'Ödendi') return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  if (status === 'Gecikmiş') return 'bg-red-100 text-red-700 border border-red-200'
  if (status === 'Kısmi Ödendi') return 'bg-violet-100 text-violet-700 border border-violet-200'
  return 'bg-amber-100 text-amber-700 border border-amber-200'
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedType.value = 'Tümü'
  selectedStatus.value = 'Tümü'
  selectedPackage.value = 'Tümü'
  viewMode.value = 'card'
}

const goToNew = () => {
  window.location.href = '/finance/new'
}

const goToDetail = (id) => {
  window.location.href = '/finance/' + String(id)
}

const goToEdit = (id) => {
  window.location.href = '/finance/edit/' + String(id)
}
</script>

<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl">
      <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Finans Yönetimi
          </p>
          <h1 class="mb-3 text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Finans Dashboard
          </h1>
          <p class="max-w-3xl text-sm leading-7 text-slate-300">
            Gelir, gider, fatura ve ödeme kayıtlarını paket seviyesine göre yönet.
            Tahsilatlarını, ödemelerini ve finansal hareketlerini tek ekrandan takip et.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            @click="goToNew"
          >
            <i class="bi bi-plus-lg mr-2"></i>
            Yeni Finans Kaydı
          </button>
        </div>
      </div>
    </section>

    <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam Gelir</p>
        <h2 class="mt-2 text-3xl font-bold text-emerald-600">{{ formatMoney(totalIncome) }}</h2>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam Gider</p>
        <h2 class="mt-2 text-3xl font-bold text-red-600">{{ formatMoney(totalExpense) }}</h2>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tahsil Edilecek</p>
        <h2 class="mt-2 text-3xl font-bold text-blue-600">{{ formatMoney(totalReceivable) }}</h2>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Ödenecek</p>
        <h2 class="mt-2 text-3xl font-bold text-amber-600">{{ formatMoney(totalPayable) }}</h2>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam Kayıt</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">{{ financeRecords.length }}</h2>
      </article>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">Filtreler</h2>
        <p class="mt-1 text-sm text-slate-500">Kayıtları tür, durum ve paket seviyesine göre filtrele.</p>
      </div>

      <div class="p-6">
        <div class="grid gap-4 md:grid-cols-12">
          <UiInput
            v-model="searchTerm"
            label="Arama"
            class="md:col-span-4"
            placeholder="Başlık, kişi, alt tür, not ile ara"
          />

          <UiSelect v-model="selectedType" label="Tür" class="md:col-span-2">
            <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
          </UiSelect>

          <UiSelect v-model="selectedStatus" label="Durum" class="md:col-span-3">
            <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
          </UiSelect>

          <UiSelect v-model="selectedPackage" label="Paket" class="md:col-span-2">
            <option v-for="level in packages" :key="level" :value="level">{{ level }}</option>
          </UiSelect>

          <div class="flex items-end md:col-span-1">
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
      </div>
    </section>

    <section v-if="filteredRecords.length === 0" class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h4 class="text-xl font-bold text-slate-900">Kayıt bulunamadı</h4>
      <p class="mt-2 text-slate-500">Filtre kriterlerini temizleyip tekrar deneyin.</p>
    </section>

    <template v-else>
      <section class="flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="viewMode === 'card' ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-700'"
          @click="viewMode = 'card'"
        >
          <i class="bi bi-grid mr-2"></i>Kart
        </button>

        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="viewMode === 'table' ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-700'"
          @click="viewMode = 'table'"
        >
          <i class="bi bi-table mr-2"></i>Tablo
        </button>
      </section>

      <section v-if="viewMode === 'card'" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="item in filteredRecords"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-bold text-slate-900">{{ item.title }}</h3>
              <p class="mt-1 text-sm text-slate-500">{{ item.subType }}</p>
            </div>

            <span :class="getTypeClass(item.type)" class="rounded-full px-3 py-2 text-xs font-semibold">
              {{ item.type }}
            </span>
          </div>

          <div class="mb-4 flex flex-wrap gap-2">
            <span :class="getStatusClass(item.status)" class="rounded-full px-3 py-2 text-xs font-semibold">
              {{ item.status }}
            </span>
            <span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
              {{ item.packageLevel }}
            </span>
          </div>

          <div class="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Tutar</p>
            <p class="mt-1 text-2xl font-bold text-slate-900">{{ formatMoney(item.amount, item.currency) }}</p>
          </div>

          <div class="space-y-2 text-sm text-slate-600">
            <p><strong>Kişi / Kurum:</strong> {{ item.partyName || '-' }}</p>
            <p><strong>Bağlantı:</strong> {{ item.relatedModule }} · {{ item.relatedName }}</p>
            <p><strong>Vade:</strong> {{ formatDate(item.dueDate) }}</p>
            <p><strong>Ödeme Tarihi:</strong> {{ formatDate(item.paymentDate) }}</p>
            <p><strong>Yöntem:</strong> {{ item.paymentMethod || '-' }}</p>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              @click="goToDetail(item.id)"
            >
              Detay
            </button>

            <button
              type="button"
              class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              @click="goToEdit(item.id)"
            >
              Düzenle
            </button>
          </div>
        </article>
      </section>

      <section v-else class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Başlık</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tür</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Alt Tür</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Kişi/Kurum</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tutar</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Durum</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Paket</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Vade</th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">İşlem</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="item in filteredRecords" :key="item.id" class="hover:bg-slate-50/70">
                <td class="px-6 py-4 font-semibold text-slate-900">{{ item.title }}</td>
                <td class="px-6 py-4">
                  <span :class="getTypeClass(item.type)" class="rounded-full px-3 py-2 text-xs font-semibold">
                    {{ item.type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-600">{{ item.subType }}</td>
                <td class="px-6 py-4 text-slate-600">{{ item.partyName }}</td>
                <td class="px-6 py-4 font-semibold text-slate-900">{{ formatMoney(item.amount, item.currency) }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(item.status)" class="rounded-full px-3 py-2 text-xs font-semibold">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-600">{{ item.packageLevel }}</td>
                <td class="px-6 py-4 text-slate-600">{{ formatDate(item.dueDate) }}</td>
                <td class="px-6 py-4 text-right">
                  <button
                    type="button"
                    class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    @click="goToDetail(item.id)"
                  >
                    Detay
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>


