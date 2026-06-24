<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeCommissions } from '~/composables/useOfficeCommissions'

const { consultants } = useOffice()

const {
  commissions,
  hydrateCommissions,
  calculateShares,
  createCommission,
  updateCommission,
  deleteCommission,
  isOverdue,
  commissionStats,
  consultantSummary,
  formatPrice,
} = useOfficeCommissions()

hydrateCommissions()

const search = ref('')
const consultantFilter = ref('Tümü')
const dealTypeFilter = ref('Tümü')
const paymentFilter = ref('Tümü')
const consultantPaymentFilter = ref('Tümü')
const showForm = ref(false)
const successMessage = ref('')

const form = reactive({
  consultantId: '',
  dealType: 'Satış',
  propertyTitle: '',
  customerName: '',
  transactionAmount: '',
  grossCommission: '',
  consultantSharePercent: 70,
  externalShareAmount: 0,
  paymentStatus: 'Tahsilat Bekliyor',
  consultantPaymentStatus: 'Beklemede',
  invoiceStatus: 'Beklemede',
  closeDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  paidDate: '',
  note: '',
})

const dealTypeOptions = [
  'Satış',
  'Kiralama',
  'Portföy Alma',
  'Danışmanlık',
  'Değerleme',
]

const paymentStatusOptions = [
  'Tahsilat Bekliyor',
  'Kısmi Tahsil Edildi',
  'Tahsil Edildi',
  'İptal',
]

const consultantPaymentStatusOptions = [
  'Beklemede',
  'Ödeme Bekliyor',
  'Kısmi Ödendi',
  'Ödendi',
  'İptal',
]

const invoiceStatusOptions = [
  'Beklemede',
  'Fatura Kesilecek',
  'Fatura Kesildi',
  'Makbuz Alındı',
  'İptal',
]

const consultantOptions = computed(() => {
  return consultants.value.filter(item => item.status !== 'Ayrıldı')
})

const selectedConsultant = computed(() => {
  return consultantOptions.value.find(item => String(item.id) === String(form.consultantId))
})

const formShares = computed(() => {
  return calculateShares({
    grossCommission: form.grossCommission,
    consultantSharePercent: form.consultantSharePercent,
    externalShareAmount: form.externalShareAmount,
  })
})

const filteredCommissions = computed(() => {
  let list = commissions.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.consultantName,
        item.dealType,
        item.propertyTitle,
        item.customerName,
        item.paymentStatus,
        item.consultantPaymentStatus,
        item.invoiceStatus,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  if (consultantFilter.value !== 'Tümü') {
    list = list.filter(item => String(item.consultantId) === String(consultantFilter.value))
  }

  if (dealTypeFilter.value !== 'Tümü') {
    list = list.filter(item => item.dealType === dealTypeFilter.value)
  }

  if (paymentFilter.value !== 'Tümü') {
    list = list.filter(item => item.paymentStatus === paymentFilter.value)
  }

  if (consultantPaymentFilter.value !== 'Tümü') {
    list = list.filter(item => item.consultantPaymentStatus === consultantPaymentFilter.value)
  }

  return list
})

const resetForm = () => {
  form.consultantId = ''
  form.dealType = 'Satış'
  form.propertyTitle = ''
  form.customerName = ''
  form.transactionAmount = ''
  form.grossCommission = ''
  form.consultantSharePercent = 70
  form.externalShareAmount = 0
  form.paymentStatus = 'Tahsilat Bekliyor'
  form.consultantPaymentStatus = 'Beklemede'
  form.invoiceStatus = 'Beklemede'
  form.closeDate = new Date().toISOString().slice(0, 10)
  form.dueDate = ''
  form.paidDate = ''
  form.note = ''
}

const saveCommission = () => {
  if (!form.consultantId || !form.propertyTitle || !form.customerName || !form.grossCommission) {
    successMessage.value = 'Danışman, işlem başlığı, müşteri adı ve brüt komisyon zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  createCommission({
    ...form,
    consultantName: selectedConsultant.value?.fullName || 'Danışman',
  })

  successMessage.value = 'Komisyon kaydı başarıyla oluşturuldu.'
  showForm.value = false
  resetForm()

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const clearFilters = () => {
  search.value = ''
  consultantFilter.value = 'Tümü'
  dealTypeFilter.value = 'Tümü'
  paymentFilter.value = 'Tümü'
  consultantPaymentFilter.value = 'Tümü'
}

const paymentClass = (status) => {
  if (status === 'Tahsil Edildi') return 'bg-slate-900 text-white'
  if (status === 'Kısmi Tahsil Edildi') return 'bg-slate-200 text-slate-800'
  if (status === 'Tahsilat Bekliyor') return 'bg-white text-slate-700 border border-slate-200'
  if (status === 'İptal') return 'bg-slate-100 text-slate-500'
  return 'bg-slate-100 text-slate-700'
}

const consultantPaymentClass = (status) => {
  if (status === 'Ödendi') return 'bg-slate-900 text-white'
  if (status === 'Kısmi Ödendi') return 'bg-slate-200 text-slate-800'
  if (status === 'Ödeme Bekliyor') return 'bg-slate-800 text-white'
  if (status === 'Beklemede') return 'bg-white text-slate-700 border border-slate-200'
  return 'bg-slate-100 text-slate-700'
}

const invoiceClass = (status) => {
  if (status === 'Fatura Kesildi') return 'bg-slate-900 text-white'
  if (status === 'Fatura Kesilecek') return 'bg-slate-200 text-slate-800'
  if (status === 'Makbuz Alındı') return 'bg-slate-800 text-white'
  return 'bg-white text-slate-700 border border-slate-200'
}

const confirmDelete = (item) => {
  if (confirm(`${item.propertyTitle} komisyon kaydını silmek istiyor musunuz?`)) {
    deleteCommission(item.id)
  }
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
            Komisyon Sistemi
          </h1>
          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Satış ve kiralama işlemlerindeki brüt komisyonu, danışman payını, ofis payını, tahsilatı, ödeme durumunu ve fatura sürecini tek ekrandan yönetin.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/office"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Ofis Paneline Dön
          </NuxtLink>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            @click="showForm = !showForm"
          >
            <i class="bi bi-plus-lg mr-2"></i>
            Yeni Komisyon
          </button>
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

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam İşlem</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ commissionStats.totalDealCount }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Brüt Komisyon</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(commissionStats.totalGrossCommission) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Ofis Payı</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(commissionStats.totalOfficeShare) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Danışman Payı</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(commissionStats.totalConsultantShare) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tahsil Edilen</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(commissionStats.collected) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tahsilat Bekleyen</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(commissionStats.waitingCollection) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Danışmana Ödenecek</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(commissionStats.waitingConsultantPayment) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Dış Paylaşım</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(commissionStats.totalExternalShare) }}</p>
      </div>
    </section>

    <section
      v-if="consultantSummary.length"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-5">
        <h2 class="text-xl font-bold text-slate-900">
          Danışman Komisyon Özeti
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Danışman bazlı işlem ve komisyon performansı.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in consultantSummary"
          :key="item.consultantId"
          class="rounded-3xl bg-slate-50 p-5"
        >
          <p class="font-bold text-slate-900">{{ item.consultantName }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ item.dealCount }} işlem</p>

          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between gap-3">
              <span class="text-slate-500">Brüt</span>
              <span class="font-semibold text-slate-900">{{ formatPrice(item.grossCommission) }}</span>
            </div>

            <div class="flex justify-between gap-3">
              <span class="text-slate-500">Danışman</span>
              <span class="font-semibold text-slate-900">{{ formatPrice(item.consultantShare) }}</span>
            </div>

            <div class="flex justify-between gap-3">
              <span class="text-slate-500">Ofis</span>
              <span class="font-semibold text-slate-900">{{ formatPrice(item.officeShare) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="showForm"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">
          Yeni Komisyon Kaydı
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          İşlem komisyonunu, ofis payını ve danışman payını hesaplayın.
        </p>
      </div>

      <div class="grid gap-4 xl:grid-cols-4">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Danışman</label>
          <select
            v-model="form.consultantId"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option value="">Danışman seçin</option>
            <option
              v-for="consultant in consultantOptions"
              :key="consultant.id"
              :value="consultant.id"
            >
              {{ consultant.fullName }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">İşlem Türü</label>
          <select
            v-model="form.dealType"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in dealTypeOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div class="xl:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Portföy / İşlem Başlığı</label>
          <input
            v-model="form.propertyTitle"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Örn: Gıda Çarşısı satılık dükkan işlemi"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Müşteri / Malik</label>
          <input
            v-model="form.customerName"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Müşteri adı"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">İşlem Tutarı</label>
          <input
            v-model="form.transactionAmount"
            type="number"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Brüt Komisyon</label>
          <input
            v-model="form.grossCommission"
            type="number"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Dış Paylaşım</label>
          <input
            v-model="form.externalShareAmount"
            type="number"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Varsa dış ofis / çözüm ortağı"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Danışman Payı %</label>
          <input
            v-model="form.consultantSharePercent"
            type="number"
            min="0"
            max="100"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Ofis Payı %</label>
          <input
            :value="formShares.officeSharePercent"
            type="number"
            disabled
            class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kapanış Tarihi</label>
          <input
            v-model="form.closeDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Tahsilat Vadesi</label>
          <input
            v-model="form.dueDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Tahsilat Tarihi</label>
          <input
            v-model="form.paidDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Tahsilat Durumu</label>
          <select
            v-model="form.paymentStatus"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in paymentStatusOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Danışman Ödemesi</label>
          <select
            v-model="form.consultantPaymentStatus"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in consultantPaymentStatusOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Fatura / Makbuz</label>
          <select
            v-model="form.invoiceStatus"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in invoiceStatusOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-5 grid gap-4 lg:grid-cols-3">
        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm text-slate-500">Hesaplanan Danışman Payı</p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ formatPrice(formShares.consultantShareAmount) }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm text-slate-500">Hesaplanan Ofis Payı</p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ formatPrice(formShares.officeShareAmount) }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm text-slate-500">Dış Paylaşım Sonrası</p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ formatPrice(Number(form.grossCommission || 0) - Number(form.externalShareAmount || 0)) }}
          </p>
        </div>
      </div>

      <div class="mt-4">
        <label class="mb-2 block text-sm font-semibold text-slate-700">Not</label>
        <textarea
          v-model="form.note"
          rows="3"
          class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          placeholder="Komisyon, ödeme veya fatura süreciyle ilgili not..."
        ></textarea>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="saveCommission"
        >
          Komisyonu Kaydet
        </button>

        <button
          type="button"
          class="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          @click="showForm = false"
        >
          Vazgeç
        </button>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_180px_220px_220px_140px]">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Arama</label>
          <input
            v-model="search"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Danışman, işlem, müşteri ara..."
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Danışman</label>
          <select
            v-model="consultantFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option
              v-for="consultant in consultantOptions"
              :key="consultant.id"
              :value="consultant.id"
            >
              {{ consultant.fullName }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">İşlem</label>
          <select
            v-model="dealTypeFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option
              v-for="item in dealTypeOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Tahsilat</label>
          <select
            v-model="paymentFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option
              v-for="item in paymentStatusOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Danışman Ödemesi</label>
          <select
            v-model="consultantPaymentFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option
              v-for="item in consultantPaymentStatusOptions"
              :key="item"
            >
              {{ item }}
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

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Komisyon Kayıtları
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ filteredCommissions.length }} kayıt listeleniyor
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1600px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">İşlem</th>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">Tutarlar</th>
              <th class="px-6 py-4">Paylaşım</th>
              <th class="px-6 py-4">Tahsilat</th>
              <th class="px-6 py-4">Danışman Ödemesi</th>
              <th class="px-6 py-4">Fatura</th>
              <th class="px-6 py-4">Tarihler</th>
              <th class="px-6 py-4">Not</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in filteredCommissions"
              :key="item.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ item.propertyTitle }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.customerName }}</p>
                <p class="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ item.dealType }}
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ item.consultantName }}</p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">İşlem: {{ formatPrice(item.transactionAmount) }}</p>
                <p class="mt-1 font-bold text-slate-900">Komisyon: {{ formatPrice(item.grossCommission) }}</p>
                <p class="mt-1 text-xs text-slate-500">Dış paylaşım: {{ formatPrice(item.externalShareAmount) }}</p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">
                  Danışman: %{{ item.consultantSharePercent }} · {{ formatPrice(item.consultantShareAmount) }}
                </p>
                <p class="mt-1 font-semibold text-slate-900">
                  Ofis: %{{ item.officeSharePercent }} · {{ formatPrice(item.officeShareAmount) }}
                </p>

                <div class="mt-3 grid grid-cols-2 gap-2">
                  <input
                    :value="item.consultantSharePercent"
                    type="number"
                    class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                    @input="updateCommission(item.id, 'consultantSharePercent', $event.target.value)"
                  />

                  <input
                    :value="item.grossCommission"
                    type="number"
                    class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                    @input="updateCommission(item.id, 'grossCommission', $event.target.value)"
                  />
                </div>
              </td>

              <td class="px-6 py-5">
                <select
                  :value="item.paymentStatus"
                  class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  :class="paymentClass(item.paymentStatus)"
                  @change="updateCommission(item.id, 'paymentStatus', $event.target.value)"
                >
                  <option
                    v-for="status in paymentStatusOptions"
                    :key="status"
                  >
                    {{ status }}
                  </option>
                </select>

                <p
                  v-if="isOverdue(item.dueDate, item.paymentStatus)"
                  class="mt-2 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                >
                  Gecikmiş Tahsilat
                </p>
              </td>

              <td class="px-6 py-5">
                <select
                  :value="item.consultantPaymentStatus"
                  class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  :class="consultantPaymentClass(item.consultantPaymentStatus)"
                  @change="updateCommission(item.id, 'consultantPaymentStatus', $event.target.value)"
                >
                  <option
                    v-for="status in consultantPaymentStatusOptions"
                    :key="status"
                  >
                    {{ status }}
                  </option>
                </select>
              </td>

              <td class="px-6 py-5">
                <select
                  :value="item.invoiceStatus"
                  class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  :class="invoiceClass(item.invoiceStatus)"
                  @change="updateCommission(item.id, 'invoiceStatus', $event.target.value)"
                >
                  <option
                    v-for="status in invoiceStatusOptions"
                    :key="status"
                  >
                    {{ status }}
                  </option>
                </select>
              </td>

              <td class="px-6 py-5">
                <p class="text-xs text-slate-500">Kapanış</p>
                <p class="font-semibold text-slate-900">{{ item.closeDate || '-' }}</p>
                <p class="mt-2 text-xs text-slate-500">Vade</p>
                <p class="font-semibold text-slate-900">{{ item.dueDate || '-' }}</p>
                <p class="mt-2 text-xs text-slate-500">Tahsilat</p>
                <p class="font-semibold text-slate-900">{{ item.paidDate || '-' }}</p>
              </td>

              <td class="px-6 py-5">
                <textarea
                  :value="item.note"
                  rows="3"
                  class="w-full min-w-[220px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  placeholder="Not..."
                  @input="updateCommission(item.id, 'note', $event.target.value)"
                ></textarea>
              </td>

              <td class="px-6 py-5 text-right">
                <button
                  type="button"
                  class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  @click="confirmDelete(item)"
                >
                  Sil
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!filteredCommissions.length"
        class="p-10 text-center"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-cash-stack"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Komisyon kaydı bulunamadı
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Filtreleri temizleyerek veya yeni komisyon kaydı ekleyerek devam edebilirsiniz.
        </p>
      </div>
    </section>
  </div>
</template>
