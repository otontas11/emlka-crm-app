<script setup>
import { useFinance, deleteFinanceRecord } from '~/composables/useFinance'

const route = useRoute()
const financeRecords = useFinance()

const record = ref(null)
const isLoading = ref(true)
const isReady = ref(false)

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('tr-TR').format(date)
}

const formatMoney = (value, currency = 'TL') => {
  const amount = Number(value || 0)

  if (currency === 'USD') {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  if (currency === 'EUR') {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
  }

  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount)
}

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

const loadRecord = () => {
  const routeId = String(route.params.id)
  record.value = null

  const fromState = financeRecords.value.find(item => String(item.id) === routeId)
  if (fromState) {
    record.value = fromState
    return
  }

  if (import.meta.client) {
    const saved = localStorage.getItem('financeRecords')

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const found = parsed.find(item => String(item.id) === routeId)
        record.value = found || null
      } catch (error) {
        record.value = null
      }
    }
  }
}

const initializePage = async () => {
  isLoading.value = true
  isReady.value = false

  await nextTick()
  loadRecord()

  if (!record.value && import.meta.client) {
    await new Promise(resolve => setTimeout(resolve, 150))
    loadRecord()
  }

  isLoading.value = false
  isReady.value = true
}

const goToList = () => {
  window.location.href = '/finance'
}

const goToEdit = () => {
  if (!record.value) return
  window.location.href = '/finance/edit/' + record.value.id
}

const handleDelete = () => {
  if (!record.value) return

  const approved = window.confirm('Bu finans kaydını silmek istediğine emin misin?')
  if (!approved) return

  deleteFinanceRecord(record.value.id)
  window.location.href = '/finance'
}

watch(
  () => route.params.id,
  async () => {
    await initializePage()
  },
  { immediate: true }
)

onMounted(async () => {
  await initializePage()
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="isLoading || !isReady" class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"></div>
      <h4 class="text-xl font-bold text-slate-900">Finans kaydı yükleniyor</h4>
    </div>

    <template v-else-if="record">
      <section class="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl">
        <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Finans Detayı
            </p>
            <h1 class="mb-3 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              {{ record.title }}
            </h1>

            <div class="flex flex-wrap gap-2">
              <span :class="getTypeClass(record.type)" class="rounded-full px-4 py-2 text-sm font-semibold">
                {{ record.type }}
              </span>
              <span :class="getStatusClass(record.status)" class="rounded-full px-4 py-2 text-sm font-semibold">
                {{ record.status }}
              </span>
              <span class="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                {{ record.packageLevel }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            @click="goToList"
          >
            <i class="bi bi-arrow-left mr-2"></i>
            Listeye Dön
          </button>
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <h2 class="text-lg font-semibold text-slate-900">Kayıt Bilgileri</h2>
            </div>

            <div class="grid gap-4 p-6 md:grid-cols-2">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-500">Alt Tür</p>
                <p class="mt-2 font-semibold text-slate-900">{{ record.subType || '-' }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-500">Tutar</p>
                <p class="mt-2 text-xl font-bold text-slate-900">{{ formatMoney(record.amount, record.currency) }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-500">Kişi / Kurum</p>
                <p class="mt-2 font-semibold text-slate-900">{{ record.partyName || '-' }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-500">Ödeme Yöntemi</p>
                <p class="mt-2 font-semibold text-slate-900">{{ record.paymentMethod || '-' }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-500">Bağlı Modül</p>
                <p class="mt-2 font-semibold text-slate-900">{{ record.relatedModule || '-' }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-500">Bağlı Kayıt</p>
                <p class="mt-2 font-semibold text-slate-900">{{ record.relatedName || '-' }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-500">Kayıt Tarihi</p>
                <p class="mt-2 font-semibold text-slate-900">{{ formatDate(record.issueDate) }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-500">Vade Tarihi</p>
                <p class="mt-2 font-semibold text-slate-900">{{ formatDate(record.dueDate) }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-500">Ödeme Tarihi</p>
                <p class="mt-2 font-semibold text-slate-900">{{ formatDate(record.paymentDate) }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm font-semibold text-slate-500">Fatura No</p>
                <p class="mt-2 font-semibold text-slate-900">{{ record.invoiceNo || '-' }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                <p class="text-sm font-semibold text-slate-500">Notlar</p>
                <p class="mt-2 leading-7 text-slate-800">{{ record.notes || '-' }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-6">
          <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <h2 class="text-lg font-semibold text-slate-900">Hızlı Özet</h2>
            </div>

            <div class="space-y-4 p-6">
              <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <span class="text-sm text-slate-500">Tür</span>
                <strong class="text-right text-slate-900">{{ record.type || '-' }}</strong>
              </div>
              <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <span class="text-sm text-slate-500">Durum</span>
                <strong class="text-right text-slate-900">{{ record.status || '-' }}</strong>
              </div>
              <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <span class="text-sm text-slate-500">Paket</span>
                <strong class="text-right text-slate-900">{{ record.packageLevel || '-' }}</strong>
              </div>
              <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <span class="text-sm text-slate-500">Fatura Takibi</span>
                <strong class="text-right text-slate-900">{{ record.invoiceTracked || '-' }}</strong>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-sm text-slate-500">Para Birimi</span>
                <strong class="text-right text-slate-900">{{ record.currency || '-' }}</strong>
              </div>
            </div>
          </section>

          <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <h2 class="text-lg font-semibold text-slate-900">İşlemler</h2>
            </div>

            <div class="space-y-3 p-6">
              <button
                type="button"
                class="flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="goToList"
              >
                <i class="bi bi-arrow-left mr-2"></i>
                Listeye Dön
              </button>

              <button
                type="button"
                class="flex w-full items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="goToEdit"
              >
                <i class="bi bi-pencil-square mr-2"></i>
                Kaydı Düzenle
              </button>

              <button
                type="button"
                class="flex w-full items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                @click="handleDelete"
              >
                <i class="bi bi-trash mr-2"></i>
                Kaydı Sil
              </button>
            </div>
          </section>
        </div>
      </div>
    </template>

    <div v-else class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h4 class="text-xl font-bold text-slate-900">Finans kaydı bulunamadı</h4>
      <button
        type="button"
        class="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        @click="goToList"
      >
        Listeye Dön
      </button>
    </div>
  </div>
</template>

