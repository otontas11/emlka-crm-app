<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficePipeline } from '~/composables/useOfficePipeline'

const { consultants } = useOffice()

const {
  processes,
  hydrateProcesses,
  createPipelineProcess,
  updatePipelineProcess,
  deletePipelineProcess,
  isOverdue,
  pipelineStats,
  formatPrice,
} = useOfficePipeline()

hydrateProcesses()

const search = ref('')
const consultantFilter = ref('Tümü')
const statusFilter = ref('Tümü')
const typeFilter = ref('Tümü')
const stageFilter = ref('Tümü')
const showForm = ref(false)
const successMessage = ref('')

const form = reactive({
  consultantId: '',
  customerName: '',
  customerPhone: '',
  processType: 'Satış',
  propertyTitle: '',
  location: '',
  budget: '',
  offerAmount: '',
  commissionPotential: '',
  stage: 'Yeni Talep',
  status: 'Aktif',
  probability: 25,
  expectedCloseDate: '',
  source: 'Ofis Kaydı',
  nextAction: '',
  nextActionDate: '',
  note: '',
})

const processTypes = [
  'Satış',
  'Kiralama',
  'Portföy Alma',
  'Yer Gösterme',
  'Değerleme',
]

const stageOptions = [
  'Yeni Talep',
  'İlk Görüşme',
  'Portföy Eşleştirme',
  'Sunum Yapıldı',
  'Yer Gösterildi',
  'Teklif Alındı',
  'Fiyat Pazarlığı',
  'Sözleşme Aşaması',
  'Kapandı',
  'Kaybedildi',
]

const statusOptions = [
  'Aktif',
  'Aksiyon Bekliyor',
  'Beklemede',
  'Kapandı',
  'Kaybedildi',
]

const sourceOptions = [
  'Ofis Kaydı',
  'Saha Çalışması',
  'Referans',
  'Sosyal Medya',
  'Web Formu',
  'Telefon Araması',
  'Mevcut Müşteri',
]

const consultantOptions = computed(() => {
  return consultants.value.filter(item => item.status !== 'Ayrıldı')
})

const selectedConsultant = computed(() => {
  return consultantOptions.value.find(item => String(item.id) === String(form.consultantId))
})

const filteredProcesses = computed(() => {
  let list = processes.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.customerName,
        item.customerPhone,
        item.consultantName,
        item.propertyTitle,
        item.location,
        item.processType,
        item.stage,
        item.status,
        item.source,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  if (consultantFilter.value !== 'Tümü') {
    list = list.filter(item => String(item.consultantId) === String(consultantFilter.value))
  }

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (typeFilter.value !== 'Tümü') {
    list = list.filter(item => item.processType === typeFilter.value)
  }

  if (stageFilter.value !== 'Tümü') {
    list = list.filter(item => item.stage === stageFilter.value)
  }

  return list
})

const stageSummary = computed(() => {
  return stageOptions.map(stage => {
    const items = processes.value.filter(item => item.stage === stage)

    return {
      stage,
      count: items.length,
      commission: items.reduce((sum, item) => sum + Number(item.commissionPotential || 0), 0),
    }
  }).filter(item => item.count > 0)
})

const resetForm = () => {
  form.consultantId = ''
  form.customerName = ''
  form.customerPhone = ''
  form.processType = 'Satış'
  form.propertyTitle = ''
  form.location = ''
  form.budget = ''
  form.offerAmount = ''
  form.commissionPotential = ''
  form.stage = 'Yeni Talep'
  form.status = 'Aktif'
  form.probability = 25
  form.expectedCloseDate = ''
  form.source = 'Ofis Kaydı'
  form.nextAction = ''
  form.nextActionDate = ''
  form.note = ''
}

const saveProcess = () => {
  if (!form.consultantId || !form.customerName || !form.propertyTitle) {
    successMessage.value = 'Danışman, müşteri adı ve portföy/süreç başlığı zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  createPipelineProcess({
    ...form,
    consultantName: selectedConsultant.value?.fullName || 'Danışman',
  })

  successMessage.value = 'Pipeline süreci başarıyla oluşturuldu.'
  showForm.value = false
  resetForm()

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const clearFilters = () => {
  search.value = ''
  consultantFilter.value = 'Tümü'
  statusFilter.value = 'Tümü'
  typeFilter.value = 'Tümü'
  stageFilter.value = 'Tümü'
}

const statusClass = (status) => {
  if (status === 'Aktif') return 'bg-slate-900 text-white'
  if (status === 'Aksiyon Bekliyor') return 'bg-slate-200 text-slate-800'
  if (status === 'Beklemede') return 'bg-slate-100 text-slate-700'
  if (status === 'Kapandı') return 'bg-slate-950 text-white'
  if (status === 'Kaybedildi') return 'bg-white text-slate-600 border border-slate-200'
  return 'bg-slate-100 text-slate-700'
}

const probabilityClass = (value) => {
  const number = Number(value || 0)

  if (number >= 70) return 'bg-slate-900 text-white'
  if (number >= 40) return 'bg-slate-200 text-slate-800'
  return 'bg-white text-slate-700 border border-slate-200'
}

const confirmDelete = (item) => {
  if (confirm(`${item.customerName} sürecini silmek istiyor musunuz?`)) {
    deletePipelineProcess(item.id)
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
            Ofis Pipeline
          </h1>
          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Ofisteki tüm danışmanların satış, kiralama, portföy alma, yer gösterme ve teklif süreçlerini tek ekrandan takip edin.
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
            Yeni Süreç
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

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam Süreç</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ pipelineStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Aktif</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ pipelineStats.active }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Aksiyon Bekliyor</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ pipelineStats.waitingAction }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Teklif / Pazarlık</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ pipelineStats.offerStage }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Kapandı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ pipelineStats.closed }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Komisyon Potansiyeli</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(pipelineStats.totalCommission) }}</p>
      </div>
    </section>

    <section
      v-if="stageSummary.length"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-5">
        <h2 class="text-xl font-bold text-slate-900">
          Aşama Özeti
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Süreçlerin hangi aşamada yoğunlaştığını gösterir.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in stageSummary"
          :key="item.stage"
          class="rounded-3xl bg-slate-50 p-5"
        >
          <p class="text-sm font-semibold text-slate-900">{{ item.stage }}</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ item.count }}</p>
          <p class="mt-1 text-xs text-slate-500">
            {{ formatPrice(item.commission) }} potansiyel
          </p>
        </div>
      </div>
    </section>

    <section
      v-if="showForm"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">
          Yeni Pipeline Süreci
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Danışmana bağlı müşteri, portföy ve işlem sürecini kaydedin.
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
          <label class="mb-2 block text-sm font-semibold text-slate-700">Müşteri Adı</label>
          <input
            v-model="form.customerName"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Müşteri adı"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Müşteri Telefon</label>
          <input
            v-model="form.customerPhone"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="05xx xxx xx xx"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Süreç Türü</label>
          <select
            v-model="form.processType"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in processTypes"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div class="xl:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Portföy / Süreç Başlığı</label>
          <input
            v-model="form.propertyTitle"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Örn: Gıda Çarşısı satılık dükkan müşteri süreci"
          />
        </div>

        <div class="xl:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Konum</label>
          <input
            v-model="form.location"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="İzmir / Konak / Yenişehir"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Bütçe / Fiyat</label>
          <input
            v-model="form.budget"
            type="number"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Teklif Tutarı</label>
          <input
            v-model="form.offerAmount"
            type="number"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Komisyon Potansiyeli</label>
          <input
            v-model="form.commissionPotential"
            type="number"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kapanış Olasılığı</label>
          <input
            v-model="form.probability"
            type="number"
            min="0"
            max="100"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Aşama</label>
          <select
            v-model="form.stage"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in stageOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
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

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Beklenen Kapanış</label>
          <input
            v-model="form.expectedCloseDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kaynak</label>
          <select
            v-model="form.source"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in sourceOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-4 grid gap-4 xl:grid-cols-[260px_1fr]">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Sonraki Aksiyon Tarihi</label>
          <input
            v-model="form.nextActionDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Sonraki Aksiyon</label>
          <input
            v-model="form.nextAction"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Örn: Malik ile fiyat görüşmesi yapılacak"
          />
        </div>
      </div>

      <div class="mt-4">
        <label class="mb-2 block text-sm font-semibold text-slate-700">Broker Notu</label>
        <textarea
          v-model="form.note"
          rows="3"
          class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          placeholder="Süreçle ilgili özel not..."
        ></textarea>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="saveProcess"
        >
          Süreci Kaydet
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
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_220px_220px_220px_140px]">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Arama</label>
          <input
            v-model="search"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Müşteri, danışman, portföy, konum ara..."
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

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Tür</label>
          <select
            v-model="typeFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option
              v-for="item in processTypes"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Aşama</label>
          <select
            v-model="stageFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option
              v-for="item in stageOptions"
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
          Pipeline Süreçleri
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ filteredProcesses.length }} süreç listeleniyor
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1500px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Müşteri / Süreç</th>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">Bütçe / Teklif</th>
              <th class="px-6 py-4">Komisyon</th>
              <th class="px-6 py-4">Olasılık</th>
              <th class="px-6 py-4">Aşama</th>
              <th class="px-6 py-4">Durum</th>
              <th class="px-6 py-4">Sonraki Aksiyon</th>
              <th class="px-6 py-4">Not</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in filteredProcesses"
              :key="item.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ item.customerName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.customerPhone }}</p>
                <p class="mt-3 font-semibold text-slate-800">{{ item.propertyTitle }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.location }}</p>
                <p class="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ item.processType }}
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ item.consultantName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.source }}</p>
              </td>

              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ formatPrice(item.budget) }}</p>
                <p class="mt-1 text-xs text-slate-500">Teklif: {{ formatPrice(item.offerAmount) }}</p>
              </td>

              <td class="px-6 py-5 font-bold text-slate-900">
                {{ formatPrice(item.commissionPotential) }}
              </td>

              <td class="px-6 py-5">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="probabilityClass(item.probability)"
                >
                  %{{ item.probability }}
                </span>

                <div class="mt-3 h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                  <div
                    class="h-full rounded-full bg-slate-900"
                    :style="{ width: Number(item.probability || 0) + '%' }"
                  ></div>
                </div>
              </td>

              <td class="px-6 py-5">
                <select
                  :value="item.stage"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  @change="updatePipelineProcess(item.id, 'stage', $event.target.value)"
                >
                  <option
                    v-for="stage in stageOptions"
                    :key="stage"
                  >
                    {{ stage }}
                  </option>
                </select>

                <p class="mt-2 text-xs text-slate-500">
                  Kapanış: {{ item.expectedCloseDate || '-' }}
                </p>
              </td>

              <td class="px-6 py-5">
                <select
                  :value="item.status"
                  class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  :class="statusClass(item.status)"
                  @change="updatePipelineProcess(item.id, 'status', $event.target.value)"
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
                <p
                  class="font-semibold"
                  :class="isOverdue(item.nextActionDate) ? 'text-slate-950' : 'text-slate-900'"
                >
                  {{ item.nextActionDate || '-' }}
                </p>

                <p
                  v-if="isOverdue(item.nextActionDate)"
                  class="mt-1 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                >
                  Gecikmiş Aksiyon
                </p>

                <textarea
                  :value="item.nextAction"
                  rows="2"
                  class="mt-3 w-full min-w-[220px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  placeholder="Sonraki aksiyon..."
                  @input="updatePipelineProcess(item.id, 'nextAction', $event.target.value)"
                ></textarea>
              </td>

              <td class="px-6 py-5">
                <textarea
                  :value="item.note"
                  rows="3"
                  class="w-full min-w-[220px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  placeholder="Broker notu..."
                  @input="updatePipelineProcess(item.id, 'note', $event.target.value)"
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
        v-if="!filteredProcesses.length"
        class="p-10 text-center"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-diagram-3"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Pipeline süreci bulunamadı
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Filtreleri temizleyerek veya yeni süreç ekleyerek devam edebilirsiniz.
        </p>
      </div>
    </section>
  </div>
</template>
