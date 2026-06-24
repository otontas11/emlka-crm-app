<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficePayments } from '~/composables/useOfficePayments'

const { consultants } = useOffice()

const {
  payments,
  hydratePayments,
  createPayment,
  updatePayment,
  deletePayment,
  markPaid,
  isOverdue,
  paymentStats,
  getSskSummary,
  paymentPersonSummary,
  formatPrice,
} = useOfficePayments()

hydratePayments()

const search = ref('')
const periodFilter = ref(new Date().toISOString().slice(0, 7))
const directionFilter = ref('Tümü')
const categoryFilter = ref('Tümü')
const statusFilter = ref('Tümü')
const showForm = ref(false)
const successMessage = ref('')

const form = reactive({
  category: 'Danışman SSK Tahsilatı',
  direction: 'Tahsilat',
  personType: 'Danışman',
  consultantId: '',
  personName: '',
  period: new Date().toISOString().slice(0, 7),
  amount: 0,
  dueDate: '',
  paidDate: '',
  status: 'Bekliyor',
  note: '',
})

const categoryOptions = [
  { label: 'Danışman SSK Tahsilatı', direction: 'Tahsilat', personType: 'Danışman' },
  { label: 'Danışman SSK Borç Ödemesi', direction: 'Ödeme', personType: 'Resmi Kurum' },
  { label: 'Danışman Ofis Aidatı Tahsilatı', direction: 'Tahsilat', personType: 'Danışman' },
  { label: 'Komisyon Ödemesi', direction: 'Ödeme', personType: 'Danışman' },
  { label: 'Avans', direction: 'Ödeme', personType: 'Danışman' },
  { label: 'Ofis Personel Maaşı', direction: 'Ödeme', personType: 'Ofis Personeli' },
  { label: 'Ofis Gideri', direction: 'Ödeme', personType: 'Tedarikçi' },
  { label: 'Kira / Aidat Ödemesi', direction: 'Ödeme', personType: 'Tedarikçi' },
  { label: 'Diğer Tahsilat', direction: 'Tahsilat', personType: 'Diğer' },
  { label: 'Diğer Ödeme', direction: 'Ödeme', personType: 'Diğer' },
]

const statusOptions = [
  'Bekliyor',
  'Ödendi',
  'Kısmi Ödendi',
  'Gecikti',
  'İptal',
]

const consultantOptions = computed(() => {
  return consultants.value.filter(item => item.status !== 'Ayrıldı')
})

const sskConsultants = computed(() => {
  return consultantOptions.value.filter(item => {
    const type = String(item.workType || '').toLocaleLowerCase('tr-TR')
    return type.includes('sgk') || type.includes('ssk')
  })
})

const selectedCategory = computed(() => {
  return categoryOptions.find(item => item.label === form.category)
})

const selectedConsultant = computed(() => {
  return consultantOptions.value.find(item => String(item.id) === String(form.consultantId))
})

const requiresConsultant = computed(() => {
  return (
    form.personType === 'Danışman' ||
    form.category.includes('Danışman SSK') ||
    form.category === 'Komisyon Ödemesi' ||
    form.category === 'Avans'
  )
})

watch(
  () => form.category,
  () => {
    const category = selectedCategory.value
    if (!category) return

    form.direction = category.direction
    form.personType = category.personType

    if (requiresConsultant.value) {
      form.personName = ''
    } else {
      form.consultantId = ''
    }
  }
)

const filteredPayments = computed(() => {
  let list = payments.value

  if (periodFilter.value) {
    list = list.filter(item => item.period === periodFilter.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.personName,
        item.workType,
        item.category,
        item.direction,
        item.status,
        item.note,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  if (directionFilter.value !== 'Tümü') {
    list = list.filter(item => item.direction === directionFilter.value)
  }

  if (categoryFilter.value !== 'Tümü') {
    list = list.filter(item => item.category === categoryFilter.value)
  }

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  return list
})

const sskRows = computed(() => {
  return sskConsultants.value.map((consultant) => {
    const summary = getSskSummary(consultant.id, periodFilter.value)

    return {
      consultant,
      ...summary,
    }
  })
})

const resetForm = () => {
  form.category = 'Danışman SSK Tahsilatı'
  form.direction = 'Tahsilat'
  form.personType = 'Danışman'
  form.consultantId = ''
  form.personName = ''
  form.period = new Date().toISOString().slice(0, 7)
  form.amount = 0
  form.dueDate = ''
  form.paidDate = ''
  form.status = 'Bekliyor'
  form.note = ''
}

const savePayment = () => {
  const category = selectedCategory.value

  if (!form.category || !form.period || Number(form.amount || 0) <= 0) {
    successMessage.value = 'Kategori, dönem ve tutar zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  let personId = ''
  let personName = form.personName
  let workType = form.personType

  if (requiresConsultant.value) {
    if (!form.consultantId) {
      successMessage.value = 'Danışman seçilmelidir.'

      setTimeout(() => {
        successMessage.value = ''
      }, 4000)

      return
    }

    personId = selectedConsultant.value?.id || ''
    personName = selectedConsultant.value?.fullName || ''
    workType = selectedConsultant.value?.workType || ''
  }

  if (!personName) {
    successMessage.value = 'Kişi / kurum adı zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  createPayment({
    direction: category?.direction || form.direction,
    category: form.category,
    personType: category?.personType || form.personType,
    personId,
    personName,
    workType,
    period: form.period,
    amount: form.amount,
    dueDate: form.dueDate,
    paidDate: form.paidDate,
    status: form.status,
    note: form.note,
  })

  successMessage.value = 'Ödeme / tahsilat kaydı oluşturuldu.'
  showForm.value = false
  resetForm()

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const createSskCollection = (consultant) => {
  createPayment({
    direction: 'Tahsilat',
    category: 'Danışman SSK Tahsilatı',
    personType: 'Danışman',
    personId: consultant.id,
    personName: consultant.fullName,
    workType: consultant.workType,
    period: periodFilter.value,
    amount: 0,
    dueDate: '',
    paidDate: '',
    status: 'Bekliyor',
    note: 'Danışmandan SSK bedeli tahsil edilecek.',
  })

  successMessage.value = 'SSK tahsilat kaydı açıldı. Tutarı listeden güncelleyebilirsiniz.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const createSskDebtPayment = (consultant) => {
  createPayment({
    direction: 'Ödeme',
    category: 'Danışman SSK Borç Ödemesi',
    personType: 'Resmi Kurum',
    personId: consultant.id,
    personName: consultant.fullName,
    workType: consultant.workType,
    period: periodFilter.value,
    amount: 0,
    dueDate: '',
    paidDate: '',
    status: 'Bekliyor',
    note: 'Danışmanın SSK borcu SGK’ya ödenecek.',
  })

  successMessage.value = 'SSK borç ödeme kaydı açıldı. Tutarı listeden güncelleyebilirsiniz.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const clearFilters = () => {
  search.value = ''
  periodFilter.value = new Date().toISOString().slice(0, 7)
  directionFilter.value = 'Tümü'
  categoryFilter.value = 'Tümü'
  statusFilter.value = 'Tümü'
}

const markRecordPaid = (record) => {
  markPaid(record.id)

  successMessage.value = record.direction === 'Tahsilat'
    ? 'Tahsilat tamamlandı olarak işaretlendi.'
    : 'Ödeme tamamlandı olarak işaretlendi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const confirmDelete = (record) => {
  if (confirm(`${record.personName} kaydını silmek istiyor musunuz?`)) {
    deletePayment(record.id)
  }
}

const statusClass = (status) => {
  if (status === 'Ödendi') return 'bg-slate-900 text-white'
  if (status === 'Kısmi Ödendi') return 'bg-slate-200 text-slate-800'
  if (status === 'Gecikti') return 'bg-slate-800 text-white'
  if (status === 'Bekliyor') return 'bg-white text-slate-700 border border-slate-200'
  if (status === 'Kayıt Yok') return 'bg-slate-100 text-slate-500'
  return 'bg-slate-100 text-slate-500'
}

const directionClass = (direction) => {
  if (direction === 'Tahsilat') return 'bg-slate-900 text-white'
  return 'bg-slate-200 text-slate-800'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Finans
          </p>

          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Ödemeler ve Tahsilatlar
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Danışman SSK tahsilatı, danışman SSK borç ödemesi, komisyon ödemesi, ofis aidatı, ofis gideri ve ofis personel maaşlarını tek ekrandan takip edin.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="showForm = !showForm"
        >
          <i class="bi bi-plus-lg mr-2"></i>
          Yeni Kayıt
        </button>
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
        <p class="text-sm font-medium text-slate-500">Kayıt</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ paymentStats.totalRecord }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tahsilat</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(paymentStats.collections) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Ödeme</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(paymentStats.expenses) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Net</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(paymentStats.net) }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Bekleyen</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">
          {{ formatPrice(paymentStats.waitingCollections + paymentStats.waitingExpenses) }}
        </p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Geciken</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ paymentStats.overdueCount }}</p>
      </div>
    </section>

    <section
      v-if="showForm"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 class="text-xl font-bold text-slate-900">
        Yeni Ödeme / Tahsilat Kaydı
      </h2>

      <div class="mt-6 grid gap-4 xl:grid-cols-4">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
          <select
            v-model="form.category"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in categoryOptions"
              :key="item.label"
              :value="item.label"
            >
              {{ item.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Yön</label>
          <input
            v-model="form.direction"
            disabled
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Dönem</label>
          <input
            v-model="form.period"
            type="month"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Durum</label>
          <select
            v-model="form.status"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in statusOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div v-if="requiresConsultant">
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
              {{ consultant.fullName }} · {{ consultant.workType }}
            </option>
          </select>
        </div>

        <div v-else>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kişi / Kurum</label>
          <input
            v-model="form.personName"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Asistan, temizlik personeli, tedarikçi..."
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Tutar</label>
          <input
            v-model="form.amount"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Vade Tarihi</label>
          <input
            v-model="form.dueDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Ödeme / Tahsil Tarihi</label>
          <input
            v-model="form.paidDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>
      </div>

      <div class="mt-4">
        <label class="mb-2 block text-sm font-semibold text-slate-700">Not</label>
        <textarea
          v-model="form.note"
          rows="3"
          class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          placeholder="Ödeme / tahsilat notu..."
        ></textarea>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="savePayment"
        >
          Kaydet
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
      <div class="mb-5">
        <h2 class="text-xl font-bold text-slate-900">
          Danışman SSK Takibi
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          SGK/SSK’lı danışman için iki ayrı kontrol yapılır: danışmandan SSK ücreti tahsil edildi mi, danışman adına SSK borcu ödendi mi?
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[950px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">SSK Tahsilatı</th>
              <th class="px-6 py-4">SSK Borç Ödemesi</th>
              <th class="px-6 py-4">Dönem</th>
              <th class="px-6 py-4 text-right">Hızlı İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="row in sskRows"
              :key="row.consultant.id"
            >
              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ row.consultant.fullName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ row.consultant.workType }}</p>
              </td>

              <td class="px-6 py-5">
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(row.collectionStatus)">
                  {{ row.collectionStatus }}
                </span>
                <p class="mt-2 font-semibold text-slate-900">{{ formatPrice(row.collectionAmount) }}</p>
              </td>

              <td class="px-6 py-5">
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(row.debtStatus)">
                  {{ row.debtStatus }}
                </span>
                <p class="mt-2 font-semibold text-slate-900">{{ formatPrice(row.debtAmount) }}</p>
              </td>

              <td class="px-6 py-5 font-semibold text-slate-900">
                {{ periodFilter }}
              </td>

              <td class="px-6 py-5 text-right">
                <div class="flex flex-wrap justify-end gap-2">
                  <button
                    v-if="!row.collection"
                    type="button"
                    class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    @click="createSskCollection(row.consultant)"
                  >
                    Tahsilat Aç
                  </button>

                  <button
                    v-if="!row.debtPayment"
                    type="button"
                    class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    @click="createSskDebtPayment(row.consultant)"
                  >
                    Borç Kaydı Aç
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!sskRows.length">
              <td colspan="5" class="px-6 py-8 text-center text-sm text-slate-500">
                SGK/SSK’lı danışman bulunmuyor.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section
      v-if="paymentPersonSummary.length"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-5">
        <h2 class="text-xl font-bold text-slate-900">
          Kişi / Kurum Bazlı Özet
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Danışman, ofis personeli veya tedarikçi bazında bekleyen ve toplam tutarlar.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in paymentPersonSummary"
          :key="`${item.personType}-${item.personName}`"
          class="rounded-3xl bg-slate-50 p-5"
        >
          <p class="font-bold text-slate-900">{{ item.personName }}</p>
          <p class="mt-1 text-xs text-slate-500">
            {{ item.personType }} · {{ item.workType || '-' }} · {{ item.recordCount }} kayıt
          </p>

          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between gap-3">
              <span class="text-slate-500">Tahsilat</span>
              <span class="font-semibold text-slate-900">{{ formatPrice(item.collectionAmount) }}</span>
            </div>

            <div class="flex justify-between gap-3">
              <span class="text-slate-500">Ödeme</span>
              <span class="font-semibold text-slate-900">{{ formatPrice(item.expenseAmount) }}</span>
            </div>

            <div class="flex justify-between gap-3">
              <span class="text-slate-500">Bekleyen</span>
              <span class="font-semibold text-slate-900">{{ formatPrice(item.waitingAmount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_170px_180px_260px_180px_140px]">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Arama</label>
          <input
            v-model="search"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Kişi, kategori, not ara..."
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Dönem</label>
          <input
            v-model="periodFilter"
            type="month"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Yön</label>
          <select
            v-model="directionFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option>Tahsilat</option>
            <option>Ödeme</option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
          <select
            v-model="categoryFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option
              v-for="item in categoryOptions"
              :key="item.label"
              :value="item.label"
            >
              {{ item.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Durum</label>
          <select
            v-model="statusFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option
              v-for="item in statusOptions"
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
          Ödeme / Tahsilat Listesi
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ filteredPayments.length }} kayıt listeleniyor
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1300px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Kişi / Kurum</th>
              <th class="px-6 py-4">Kategori</th>
              <th class="px-6 py-4">Yön</th>
              <th class="px-6 py-4">Tutar</th>
              <th class="px-6 py-4">Durum</th>
              <th class="px-6 py-4">Tarihler</th>
              <th class="px-6 py-4">Not</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="record in filteredPayments"
              :key="record.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ record.personName }}</p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ record.personType }} · {{ record.workType || '-' }}
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ record.category }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ record.period }}</p>
              </td>

              <td class="px-6 py-5">
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="directionClass(record.direction)">
                  {{ record.direction }}
                </span>
              </td>

              <td class="px-6 py-5">
                <input
                  :value="record.amount"
                  type="number"
                  class="w-32 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  @input="updatePayment(record.id, 'amount', $event.target.value)"
                />
                <p class="mt-2 font-bold text-slate-900">{{ formatPrice(record.amount) }}</p>
              </td>

              <td class="px-6 py-5">
                <select
                  :value="record.status"
                  class="rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  :class="statusClass(record.status)"
                  @change="updatePayment(record.id, 'status', $event.target.value)"
                >
                  <option
                    v-for="item in statusOptions"
                    :key="item"
                  >
                    {{ item }}
                  </option>
                </select>

                <p
                  v-if="isOverdue(record)"
                  class="mt-2 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                >
                  Gecikmiş
                </p>
              </td>

              <td class="px-6 py-5">
                <label class="text-xs text-slate-500">Vade</label>
                <input
                  :value="record.dueDate"
                  type="date"
                  class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  @input="updatePayment(record.id, 'dueDate', $event.target.value)"
                />

                <label class="mt-3 block text-xs text-slate-500">Ödeme / Tahsil</label>
                <input
                  :value="record.paidDate"
                  type="date"
                  class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  @input="updatePayment(record.id, 'paidDate', $event.target.value)"
                />
              </td>

              <td class="px-6 py-5">
                <textarea
                  :value="record.note"
                  rows="3"
                  class="w-full min-w-[240px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  @input="updatePayment(record.id, 'note', $event.target.value)"
                ></textarea>
              </td>

              <td class="px-6 py-5 text-right">
                <div class="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    class="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    @click="markRecordPaid(record)"
                  >
                    Tamamlandı Yap
                  </button>

                  <button
                    type="button"
                    class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    @click="confirmDelete(record)"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!filteredPayments.length"
        class="p-10 text-center"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-wallet2"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Kayıt bulunamadı
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Yeni ödeme veya tahsilat kaydı ekleyerek devam edebilirsiniz.
        </p>
      </div>
    </section>
  </div>
</template>
