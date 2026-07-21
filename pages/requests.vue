<script setup>
import { useRequests } from '~/composables/useRequests'
import { useOffice } from '~/composables/useOffice'
import JointTransactionsPanel from '~/components/JointTransactionsPanel.vue'

const {
  requests,
  hydrateRequests,
  createRequest,
  deleteRequest,
  closeRequest,
  reopenRequest,
  getMatchesForRequest,
  createMatchInteraction,
  updateMatchInteraction,
  deleteMatchInteraction,
  getInteractionStats,
  formatPrice,
  requestStats,
} = useRequests()

const { consultants } = useOffice()

hydrateRequests()

const showForm = ref(false)
const selectedRequest = ref(null)
const selectedMatch = ref(null)
const showInteractionForm = ref(false)
const search = ref('')
const typeFilter = ref('Tümü')
const transactionFilter = ref('Tümü')
const statusFilter = ref('Aktif')
const successMessage = ref('')
const activeRequestTab = ref('Talep Havuzu')

const currentConsultant = computed(() => {
  return consultants.value.find(item => item.status !== 'Ayrıldı') || consultants.value[0] || {
    id: 1,
    fullName: 'Danışman',
    phone: '',
  }
})

const form = reactive({
  title: '',
  requestType: 'Alıcı Talebi',
  transactionType: 'Satılık',
  propertyType: 'Dükkan',
  city: 'İzmir',
  district: '',
  neighborhood: '',
  minBudget: 0,
  maxBudget: 0,
  minM2: 0,
  maxM2: 0,
  usagePurpose: '',
  urgency: 'Normal',
  status: 'Aktif',
  customerVisibility: 'Gizli',
  customerName: '',
  customerPhone: '',
  ownerConsultantName: '',
  ownerConsultantPhone: '',
  note: '',
  expiresAt: '',
})

const interactionForm = reactive({
  contactMethod: 'Telefon',
  result: 'Görüşüldü',
  note: '',
  nextActionDate: '',
})

const requestTypeOptions = [
  'Alıcı Talebi',
  'Kiracı Talebi',
  'Yatırımcı Talebi',
  'Arsa Talebi',
  'Depo / Fabrika Talebi',
  'Dükkan / Mağaza Talebi',
  'Ofis Talebi',
  'Devren İşyeri Talebi',
]

const transactionOptions = [
  'Satılık',
  'Kiralık',
  'Devren Satılık',
  'Devren Kiralık',
]

const propertyTypeOptions = [
  'Dükkan',
  'Mağaza',
  'Ofis',
  'Depo',
  'Fabrika',
  'Arsa',
  'Konut',
  'İşyeri',
  'Plaza Katı',
  'Bina',
  'Diğer',
]

const urgencyOptions = [
  'Düşük',
  'Normal',
  'Sıcak',
  'Acil',
]

const visibilityOptions = [
  'Gizli',
  'Açık',
]

const statusOptions = [
  'Aktif',
  'Kapandı',
  'Pasif',
]

const contactMethodOptions = [
  'Telefon',
  'WhatsApp',
  'E-posta',
  'Yüz yüze',
  'Ofis içi görüşme',
]

const resultOptions = [
  'Görüşüldü',
  'Randevu Alındı',
  'Uygun Değil',
  'Teklif Aşamasında',
  'İşleme Döndü',
  'Beklemede',
]

const filteredRequests = computed(() => {
  let list = requests.value

  if (typeFilter.value !== 'Tümü') {
    list = list.filter(item => item.requestType === typeFilter.value)
  }

  if (transactionFilter.value !== 'Tümü') {
    list = list.filter(item => item.transactionType === transactionFilter.value)
  }

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.requestNo,
        item.title,
        item.requestType,
        item.transactionType,
        item.propertyType,
        item.city,
        item.district,
        item.neighborhood,
        item.ownerConsultantName,
        item.usagePurpose,
        item.note,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  return list
})

const selectedMatches = computed(() => {
  if (!selectedRequest.value) return []
  return getMatchesForRequest(selectedRequest.value)
})

const selectedInteractionStats = computed(() => {
  if (!selectedRequest.value) {
    return {
      total: 0,
      contacted: 0,
      appointment: 0,
      offer: 0,
      deal: 0,
      notSuitable: 0,
    }
  }

  return getInteractionStats(selectedRequest.value.id)
})

const saveRequest = () => {
  if (!form.title) {
    successMessage.value = 'Talep başlığı zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  createRequest({
    ...form,
    ownerConsultantName: form.ownerConsultantName || currentConsultant.value.fullName,
    ownerConsultantPhone: form.ownerConsultantPhone || currentConsultant.value.phone || '',
  })

  form.title = ''
  form.requestType = 'Alıcı Talebi'
  form.transactionType = 'Satılık'
  form.propertyType = 'Dükkan'
  form.city = 'İzmir'
  form.district = ''
  form.neighborhood = ''
  form.minBudget = 0
  form.maxBudget = 0
  form.minM2 = 0
  form.maxM2 = 0
  form.usagePurpose = ''
  form.urgency = 'Normal'
  form.status = 'Aktif'
  form.customerVisibility = 'Gizli'
  form.customerName = ''
  form.customerPhone = ''
  form.ownerConsultantName = ''
  form.ownerConsultantPhone = ''
  form.note = ''
  form.expiresAt = ''

  showForm.value = false
  successMessage.value = 'Talep ortak talep havuzuna eklendi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

const openMatches = (request) => {
  selectedRequest.value = request
  selectedMatch.value = null
  showInteractionForm.value = false
}

const openInteractionForm = (property) => {
  selectedMatch.value = property
  showInteractionForm.value = true
  interactionForm.contactMethod = 'Telefon'
  interactionForm.result = 'Görüşüldü'
  interactionForm.note = ''
  interactionForm.nextActionDate = ''
}

const saveInteraction = () => {
  if (!selectedRequest.value || !selectedMatch.value) return

  createMatchInteraction(selectedRequest.value.id, {
    propertyId: selectedMatch.value.id,
    propertyTitle: selectedMatch.value.title,
    matchScore: selectedMatch.value.matchScore,
    requestConsultantName: selectedRequest.value.ownerConsultantName,
    requestConsultantPhone: selectedRequest.value.ownerConsultantPhone,
    portfolioConsultantName: selectedMatch.value.consultantName,
    portfolioConsultantPhone: selectedMatch.value.consultantPhone,
    contactMethod: interactionForm.contactMethod,
    result: interactionForm.result,
    note: interactionForm.note,
    nextActionDate: interactionForm.nextActionDate,
    createdBy: currentConsultant.value.fullName,
  })

  successMessage.value = 'Eşleşme iletişim kaydı oluşturuldu.'

  selectedMatch.value = null
  showInteractionForm.value = false
  interactionForm.contactMethod = 'Telefon'
  interactionForm.result = 'Görüşüldü'
  interactionForm.note = ''
  interactionForm.nextActionDate = ''

  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

const updateInteractionResult = (interaction, result) => {
  if (!selectedRequest.value) return
  updateMatchInteraction(selectedRequest.value.id, interaction.id, 'result', result)
}

const removeInteraction = (interaction) => {
  if (!selectedRequest.value) return

  if (confirm('Bu iletişim kaydını silmek istiyor musunuz?')) {
    deleteMatchInteraction(selectedRequest.value.id, interaction.id)
  }
}

const confirmDelete = (request) => {
  if (confirm(`${request.title} talebini silmek istiyor musunuz?`)) {
    deleteRequest(request.id)

    if (selectedRequest.value?.id === request.id) {
      selectedRequest.value = null
    }
  }
}

const toggleStatus = (request) => {
  if (request.status === 'Kapandı') {
    reopenRequest(request.id)
  } else {
    closeRequest(request.id)
  }
}

const clearFilters = () => {
  search.value = ''
  typeFilter.value = 'Tümü'
  transactionFilter.value = 'Tümü'
  statusFilter.value = 'Aktif'
}

const urgencyClass = (urgency) => {
  if (urgency === 'Acil') return 'bg-slate-900 text-white'
  if (urgency === 'Sıcak') return 'bg-slate-200 text-slate-800'
  return 'bg-slate-100 text-slate-700'
}

const statusClass = (status) => {
  if (status === 'Aktif') return 'bg-slate-900 text-white'
  if (status === 'Kapandı') return 'bg-slate-100 text-slate-500'
  return 'bg-white text-slate-700 border border-slate-300'
}

const resultClass = (result) => {
  if (result === 'İşleme Döndü') return 'bg-slate-900 text-white'
  if (result === 'Teklif Aşamasında') return 'bg-slate-200 text-slate-800'
  if (result === 'Randevu Alındı') return 'bg-slate-100 text-slate-800'
  if (result === 'Uygun Değil') return 'bg-white text-slate-500 border border-slate-300'
  return 'bg-slate-100 text-slate-700'
}

const customerLabel = (request) => {
  if (request.customerVisibility === 'Gizli') {
    return 'Müşteri bilgisi gizli'
  }

  return request.customerName || 'Müşteri adı girilmedi'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Ortak Çalışma Alanı
          </p>

          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Talepler
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Alıcı, kiracı ve yatırımcı taleplerini ortak havuzda paylaşın. Uygun portföyleri eşleştirin, danışman iletişimini ve sonuçları takip edin.
          </p>
        </div>

        <UiButton variant="primary" shape="rounded" icon="bi-plus-lg" @click="showForm = !showForm">
          Talep Ekle
        </UiButton>
      </div>
    </section>

    <div
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-info-circle mr-2"></i>
      {{ successMessage }}
    </div>

        <section class="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div class="grid gap-2 md:grid-cols-2">
        <button
          type="button"
          class="rounded-2xl px-5 py-4 text-sm font-bold transition"
          :class="activeRequestTab === 'Talep Havuzu' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
          @click="activeRequestTab = 'Talep Havuzu'"
        >
          Talep Havuzu
        </button>

        <button
          type="button"
          class="rounded-2xl px-5 py-4 text-sm font-bold transition"
          :class="activeRequestTab === 'Ortak İşlemler' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
          @click="activeRequestTab = 'Ortak İşlemler'"
        >
          Ortak İşlemler / Komisyon Paylaşımı
        </button>
      </div>
    </section>

    <JointTransactionsPanel v-if="activeRequestTab === 'Ortak İşlemler'" />

    <section v-if="activeRequestTab === 'Talep Havuzu'" class="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ requestStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Aktif</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ requestStats.active }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Sıcak</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ requestStats.hot }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Müşteri Gizli</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ requestStats.hiddenCustomer }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Kapalı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ requestStats.closed }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">İletişim</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ requestStats.interactions }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">İşleme Döndü</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ requestStats.deals }}</p>
      </div>
    </section>

    <section v-if="showForm && activeRequestTab === 'Talep Havuzu'" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 class="text-xl font-bold text-slate-900">
        Yeni Talep Ekle
      </h2>

      <div class="mt-6 grid gap-4 xl:grid-cols-4">
        <UiInput v-model="form.title" label="Talep Başlığı" variant="outline" size="sm" class="xl:col-span-2" placeholder="Örn: Konak'ta yatırım amaçlı satılık dükkan aranıyor" />

        <UiSelect v-model="form.requestType" label="Talep Tipi" variant="outline" size="sm">
          <option v-for="item in requestTypeOptions" :key="item">{{ item }}</option>
        </UiSelect>

        <UiSelect v-model="form.transactionType" label="İşlem Tipi" variant="outline" size="sm">
          <option v-for="item in transactionOptions" :key="item">{{ item }}</option>
        </UiSelect>

        <UiSelect v-model="form.propertyType" label="Mülk Tipi" variant="outline" size="sm">
          <option v-for="item in propertyTypeOptions" :key="item">{{ item }}</option>
        </UiSelect>

        <UiInput v-model="form.city" label="Şehir" variant="outline" size="sm" />

        <UiInput v-model="form.district" label="İlçe" variant="outline" size="sm" />

        <UiInput v-model="form.neighborhood" label="Mahalle / Bölge" variant="outline" size="sm" />

        <UiInput v-model="form.minBudget" label="Minimum Bütçe" type="number" variant="outline" size="sm" />

        <UiInput v-model="form.maxBudget" label="Maksimum Bütçe" type="number" variant="outline" size="sm" />

        <UiInput v-model="form.minM2" label="Minimum m²" type="number" variant="outline" size="sm" />

        <UiInput v-model="form.maxM2" label="Maksimum m²" type="number" variant="outline" size="sm" />

        <UiSelect v-model="form.urgency" label="Aciliyet" variant="outline" size="sm">
          <option v-for="item in urgencyOptions" :key="item">{{ item }}</option>
        </UiSelect>

        <UiSelect v-model="form.customerVisibility" label="Müşteri Bilgisi" variant="outline" size="sm">
          <option v-for="item in visibilityOptions" :key="item">{{ item }}</option>
        </UiSelect>

        <UiInput v-model="form.customerName" label="Müşteri Adı" variant="outline" size="sm" />

        <UiInput v-model="form.customerPhone" label="Müşteri Telefonu" variant="outline" size="sm" />

        <UiInput v-model="form.ownerConsultantName" label="Talep Sahibi Danışman" variant="outline" size="sm" :placeholder="currentConsultant.fullName" />

        <UiInput v-model="form.ownerConsultantPhone" label="Danışman Telefon" variant="outline" size="sm" />

        <UiInput v-model="form.expiresAt" label="Geçerlilik Tarihi" type="date" variant="outline" size="sm" />

        <UiTextarea v-model="form.usagePurpose" label="Kullanım Amacı" :rows="4" variant="outline" size="sm" class="xl:col-span-2" />

        <UiTextarea v-model="form.note" label="Not" :rows="4" variant="outline" size="sm" class="xl:col-span-2" />
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <UiButton variant="primary" shape="rounded" @click="saveRequest">
          Talebi Kaydet
        </UiButton>

        <UiButton variant="secondary" shape="rounded" @click="showForm = false">
          Vazgeç
        </UiButton>
      </div>
    </section>

    <section v-if="activeRequestTab === 'Talep Havuzu'" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div class="grid gap-4 xl:grid-cols-[1fr_220px_220px_220px_140px]">
        <UiInput v-model="search" label="Arama" variant="outline" size="sm" placeholder="Talep, bölge, danışman ara..." />

        <UiSelect v-model="typeFilter" label="Talep Tipi" variant="outline" size="sm">
          <option>Tümü</option>
          <option v-for="item in requestTypeOptions" :key="item">{{ item }}</option>
        </UiSelect>

        <UiSelect v-model="transactionFilter" label="İşlem" variant="outline" size="sm">
          <option>Tümü</option>
          <option v-for="item in transactionOptions" :key="item">{{ item }}</option>
        </UiSelect>

        <UiSelect v-model="statusFilter" label="Durum" variant="outline" size="sm">
          <option>Tümü</option>
          <option v-for="item in statusOptions" :key="item">{{ item }}</option>
        </UiSelect>

        <div class="flex items-end">
          <UiButton variant="secondary" shape="rounded" block @click="clearFilters">
            Temizle
          </UiButton>
        </div>
      </div>
    </section>

    <section v-if="activeRequestTab === 'Talep Havuzu'" class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Ortak Talep Havuzu
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          {{ filteredRequests.length }} talep listeleniyor.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1550px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Talep</th>
              <th class="px-6 py-4">Bölge</th>
              <th class="px-6 py-4">Bütçe / m²</th>
              <th class="px-6 py-4">Müşteri</th>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">Geçmiş</th>
              <th class="px-6 py-4">Durum</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="request in filteredRequests" :key="request.id" class="align-top hover:bg-slate-50">
              <td class="px-6 py-5">
                <p class="text-xs font-semibold text-slate-400">{{ request.requestNo }}</p>
                <p class="mt-1 font-bold text-slate-900">{{ request.title }}</p>

                <div class="mt-2 flex flex-wrap gap-2">
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{{ request.requestType }}</span>
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{{ request.transactionType }}</span>
                  <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="urgencyClass(request.urgency)">{{ request.urgency }}</span>
                </div>

                <p class="mt-2 max-w-md text-xs leading-5 text-slate-500">
                  {{ request.note || request.usagePurpose || '-' }}
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ request.city }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ request.district || '-' }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ request.neighborhood || '-' }}</p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">
                  {{ request.minBudget ? formatPrice(request.minBudget) : '-' }}
                  -
                  {{ request.maxBudget ? formatPrice(request.maxBudget) : '-' }}
                </p>

                <p class="mt-1 text-xs text-slate-500">
                  {{ request.minM2 || '-' }} m² - {{ request.maxM2 || '-' }} m²
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ customerLabel(request) }}</p>

                <p v-if="request.customerVisibility === 'Açık'" class="mt-1 text-xs text-slate-500">
                  {{ request.customerPhone || '-' }}
                </p>

                <p v-else class="mt-1 text-xs text-slate-500">
                  Detay için talep sahibi danışmanla görüşülür.
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ request.ownerConsultantName || '-' }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ request.ownerConsultantPhone || '-' }}</p>
              </td>

              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ request.matchInteractions?.length || 0 }} kayıt</p>
                <p class="mt-1 text-xs text-slate-500">
                  İşleme dönen: {{ request.matchInteractions?.filter(item => item.result === 'İşleme Döndü').length || 0 }}
                </p>
              </td>

              <td class="px-6 py-5">
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(request.status)">
                  {{ request.status }}
                </span>

                <p class="mt-2 text-xs text-slate-500">Oluşturma: {{ request.createdAt }}</p>
                <p v-if="request.expiresAt" class="mt-1 text-xs text-slate-500">Geçerlilik: {{ request.expiresAt }}</p>
              </td>

              <td class="px-6 py-5 text-right">
                <div class="flex flex-col items-end gap-2">
                  <UiButton variant="primary" size="sm" shape="rounded" @click="openMatches(request)">
                    Eşleşmeleri Gör
                  </UiButton>

                  <UiButton variant="secondary" size="sm" shape="rounded" @click="toggleStatus(request)">
                    {{ request.status === 'Kapandı' ? 'Aktife Al' : 'Kapat' }}
                  </UiButton>

                  <UiButton variant="secondary" size="sm" shape="rounded" @click="confirmDelete(request)">
                    Sil
                  </UiButton>
                </div>
              </td>
            </tr>

            <tr v-if="!filteredRequests.length">
              <td colspan="8" class="px-6 py-10 text-center text-sm text-slate-500">
                Talep kaydı bulunamadı.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="selectedRequest" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div class="max-h-[92vh] w-full max-w-6xl overflow-auto rounded-3xl bg-white p-6 shadow-xl">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-900">
              Talep Eşleşme ve İletişim Takibi
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              {{ selectedRequest.title }}
            </p>
          </div>

          <UiButton variant="secondary" size="sm" shape="rounded" @click="selectedRequest = null">
            Kapat
          </UiButton>
        </div>

        <section class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div class="rounded-3xl bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Toplam Kayıt</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ selectedInteractionStats.total }}</p>
          </div>

          <div class="rounded-3xl bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Görüşüldü</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ selectedInteractionStats.contacted }}</p>
          </div>

          <div class="rounded-3xl bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Randevu</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ selectedInteractionStats.appointment }}</p>
          </div>

          <div class="rounded-3xl bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Teklif</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ selectedInteractionStats.offer }}</p>
          </div>

          <div class="rounded-3xl bg-slate-50 p-4">
            <p class="text-xs text-slate-500">İşlem</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ selectedInteractionStats.deal }}</p>
          </div>

          <div class="rounded-3xl bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Uygun Değil</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ selectedInteractionStats.notSuitable }}</p>
          </div>
        </section>

        <section class="mt-6">
          <h3 class="text-lg font-bold text-slate-900">
            Uygun Portföy Eşleşmeleri
          </h3>

          <div v-if="!selectedMatches.length" class="mt-4 rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Bu talep için uygun portföy eşleşmesi bulunamadı.
          </div>

          <div v-else class="mt-4 grid gap-4 lg:grid-cols-2">
            <div v-for="property in selectedMatches" :key="`${property.id}-${property.title}`" class="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="font-bold text-slate-900">{{ property.title }}</p>
                  <p class="mt-1 text-xs text-slate-500">{{ property.city }} / {{ property.district }} / {{ property.neighborhood }}</p>
                </div>

                <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  %{{ property.matchScore }}
                </span>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div class="rounded-2xl bg-white p-3">
                  <p class="text-xs text-slate-400">Fiyat</p>
                  <p class="mt-1 font-semibold text-slate-900">{{ formatPrice(property.price) }}</p>
                </div>

                <div class="rounded-2xl bg-white p-3">
                  <p class="text-xs text-slate-400">m²</p>
                  <p class="mt-1 font-semibold text-slate-900">{{ property.m2 || '-' }}</p>
                </div>
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="reason in property.matchReasons" :key="reason" class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {{ reason }}
                </span>
              </div>

              <div class="mt-5 rounded-2xl bg-white p-4">
                <p class="text-xs text-slate-400">Portföy Danışmanı</p>
                <p class="mt-1 font-bold text-slate-900">{{ property.consultantName || '-' }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ property.consultantPhone || '-' }}</p>
              </div>

              <UiButton variant="primary" shape="rounded" block class="mt-4" @click="openInteractionForm(property)">
                İletişim Kaydı Oluştur
              </UiButton>
            </div>
          </div>
        </section>

        <section v-if="showInteractionForm && selectedMatch" class="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900">
                Eşleşme İletişim Kaydı
              </h3>

              <p class="mt-1 text-sm text-slate-500">
                {{ selectedMatch.title }}
              </p>
            </div>

            <UiButton variant="secondary" size="sm" shape="rounded" @click="showInteractionForm = false">
              Vazgeç
            </UiButton>
          </div>

          <div class="mt-5 grid gap-4 xl:grid-cols-4">
            <UiSelect v-model="interactionForm.contactMethod" label="İletişim Şekli" variant="outline" size="sm">
              <option v-for="item in contactMethodOptions" :key="item">{{ item }}</option>
            </UiSelect>

            <UiSelect v-model="interactionForm.result" label="Sonuç" variant="outline" size="sm">
              <option v-for="item in resultOptions" :key="item">{{ item }}</option>
            </UiSelect>

            <UiInput v-model="interactionForm.nextActionDate" label="Sonraki Aksiyon" type="date" variant="outline" size="sm" />

            <div class="flex items-end">
              <UiButton variant="primary" shape="rounded" block @click="saveInteraction">
                Kaydı Oluştur
              </UiButton>
            </div>

            <UiTextarea v-model="interactionForm.note" label="Görüşme Notu" :rows="4" variant="outline" size="sm" class="xl:col-span-4" placeholder="Talep sahibi danışmanla görüşüldü, portföy sunuldu, müşteri dönüşü bekleniyor..." />
          </div>
        </section>

        <section class="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 px-6 py-5">
            <h3 class="text-lg font-bold text-slate-900">
              Talep Geçmişi ve Görüşme Notları
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[1200px] text-left text-sm">
              <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th class="px-6 py-4">Portföy</th>
                  <th class="px-6 py-4">Danışmanlar</th>
                  <th class="px-6 py-4">İletişim</th>
                  <th class="px-6 py-4">Sonuç</th>
                  <th class="px-6 py-4">Not</th>
                  <th class="px-6 py-4 text-right">İşlem</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr v-for="interaction in selectedRequest.matchInteractions" :key="interaction.id" class="align-top hover:bg-slate-50">
                  <td class="px-6 py-5">
                    <p class="font-bold text-slate-900">{{ interaction.propertyTitle }}</p>
                    <p class="mt-1 text-xs text-slate-500">Eşleşme: %{{ interaction.matchScore }}</p>
                  </td>

                  <td class="px-6 py-5">
                    <p class="text-xs text-slate-400">Talep danışmanı</p>
                    <p class="font-semibold text-slate-900">{{ interaction.requestConsultantName || '-' }}</p>
                    <p class="mt-2 text-xs text-slate-400">Portföy danışmanı</p>
                    <p class="font-semibold text-slate-900">{{ interaction.portfolioConsultantName || '-' }}</p>
                  </td>

                  <td class="px-6 py-5">
                    <p class="font-semibold text-slate-900">{{ interaction.contactMethod }}</p>
                    <p class="mt-1 text-xs text-slate-500">{{ interaction.createdAt }}</p>
                    <p v-if="interaction.nextActionDate" class="mt-1 text-xs text-slate-500">
                      Sonraki: {{ interaction.nextActionDate }}
                    </p>
                  </td>

                  <td class="px-6 py-5">
                    <select
                      :value="interaction.result"
                      class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                      @change="updateInteractionResult(interaction, $event.target.value)"
                    >
                      <option v-for="item in resultOptions" :key="item">{{ item }}</option>
                    </select>

                    <div class="mt-2">
                      <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="resultClass(interaction.result)">
                        {{ interaction.result }}
                      </span>
                    </div>
                  </td>

                  <td class="px-6 py-5">
                    <p class="max-w-sm text-xs leading-5 text-slate-600">{{ interaction.note || '-' }}</p>
                    <p class="mt-2 text-xs text-slate-400">Kaydı açan: {{ interaction.createdBy || '-' }}</p>
                  </td>

                  <td class="px-6 py-5 text-right">
                    <UiButton variant="secondary" size="sm" shape="rounded" @click="removeInteraction(interaction)">
                      Sil
                    </UiButton>
                  </td>
                </tr>

                <tr v-if="!selectedRequest.matchInteractions?.length">
                  <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500">
                    Henüz iletişim kaydı oluşturulmadı.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

