<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeOffboarding } from '~/composables/useOfficeOffboarding'

const { consultants } = useOffice()

const {
  offboardingRecords,
  hydrateOffboarding,
  createOffboardingRecord,
  updateOffboardingRecord,
  deleteOffboardingRecord,
  completeOffboardingRecord,
  offboardingStats,
  formatPrice,
} = useOfficeOffboarding()

hydrateOffboarding()

const search = ref('')
const statusFilter = ref('Tümü')
const showForm = ref(false)
const successMessage = ref('')

const form = reactive({
  consultantId: '',
  leaveDate: new Date().toISOString().slice(0, 10),
  reason: 'Kendi isteğiyle ayrıldı',
  status: 'Devam Ediyor',
  handoverConsultantId: '',
  customerCount: 0,
  listingCount: 0,
  openProcessCount: 0,
  pendingCommissionAmount: 0,
  note: '',
})

const reasonOptions = [
  'Kendi isteğiyle ayrıldı',
  'Performans nedeniyle ayrıldı',
  'Ofis değişikliği',
  'Sektörden ayrıldı',
  'Sözleşme sona erdi',
  'Diğer',
]

const statusOptions = [
  'Devam Ediyor',
  'Tamamlandı',
  'Beklemede',
]

const accessStatusOptions = [
  'Kapatılacak',
  'Kapatıldı',
  'Geçici Açık',
]

const dataStatusOptions = [
  'Yedeklenecek',
  'Yedeklendi',
  'Kontrol Edilecek',
]

const transferStatusOptions = [
  'Devredilecek',
  'Devredildi',
  'Kontrol Edilecek',
  'Broker Üzerinde',
]

const financeStatusOptions = [
  'Hesaplaşma Bekliyor',
  'Kısmi Kapatıldı',
  'Kapatıldı',
  'Ödeme Yok',
]

const documentStatusOptions = [
  'Arşivlenecek',
  'Arşivlendi',
  'Eksik Evrak Var',
]

const consultantOptions = computed(() => {
  return consultants.value
})

const activeConsultants = computed(() => {
  return consultants.value.filter(item => item.status !== 'Ayrıldı')
})

const selectedConsultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(form.consultantId))
})

const selectedHandoverConsultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(form.handoverConsultantId))
})

const filteredRecords = computed(() => {
  let list = offboardingRecords.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.consultantName,
        item.handoverConsultantName,
        item.reason,
        item.status,
        item.note,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  return list
})

const resetForm = () => {
  form.consultantId = ''
  form.leaveDate = new Date().toISOString().slice(0, 10)
  form.reason = 'Kendi isteğiyle ayrıldı'
  form.status = 'Devam Ediyor'
  form.handoverConsultantId = ''
  form.customerCount = 0
  form.listingCount = 0
  form.openProcessCount = 0
  form.pendingCommissionAmount = 0
  form.note = ''
}

const saveOffboarding = () => {
  if (!form.consultantId) {
    successMessage.value = 'Ayrılan danışman seçilmelidir.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  createOffboardingRecord({
    ...form,
    consultantName: selectedConsultant.value?.fullName || 'Danışman',
    handoverConsultantName: selectedHandoverConsultant.value?.fullName || '',
  })

  if (selectedConsultant.value) {
    selectedConsultant.value.status = 'Ayrıldı'
  }

  successMessage.value = 'Ayrılan personel süreci oluşturuldu.'
  showForm.value = false
  resetForm()

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'Tümü'
}

const completeProcess = (record) => {
  completeOffboardingRecord(record.id)

  const consultant = consultants.value.find(item => String(item.id) === String(record.consultantId))
  if (consultant) {
    consultant.status = 'Ayrıldı'
  }

  successMessage.value = 'Ayrılış süreci tamamlandı.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const confirmDelete = (record) => {
  if (confirm(`${record.consultantName} ayrılış kaydını silmek istiyor musunuz?`)) {
    deleteOffboardingRecord(record.id)
  }
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Devam Ediyor') return 'bg-slate-200 text-slate-800'
  if (status === 'Beklemede') return 'bg-white text-slate-700 border border-slate-200'
  return 'bg-slate-100 text-slate-700'
}

const smallStatusClass = (status) => {
  if (['Kapatıldı', 'Yedeklendi', 'Devredildi', 'Kapatıldı', 'Arşivlendi'].includes(status)) {
    return 'bg-slate-900 text-white'
  }

  if (['Kontrol Edilecek', 'Kısmi Kapatıldı', 'Geçici Açık'].includes(status)) {
    return 'bg-slate-200 text-slate-800'
  }

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
            Ayrılan Personel
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Ofisten ayrılan danışmanların müşteri, portföy, açık süreç, evrak, erişim ve hesaplaşma devirlerini kontrollü şekilde yönetin.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/office"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Ofis Paneline Dön
          </NuxtLink>

          <UiButton shape="rounded" icon="bi-plus-lg" @click="showForm = !showForm">
            Ayrılış Süreci Başlat
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

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam Kayıt</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ offboardingStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Devam Eden</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ offboardingStats.active }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tamamlanan</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ offboardingStats.completed }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Erişim Bekleyen</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ offboardingStats.accessWaiting }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Devir Bekleyen</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ offboardingStats.transferWaiting }}</p>
      </div>
    </section>

    <section
      v-if="showForm"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">
          Yeni Ayrılış Süreci
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Ayrılan danışmanın veri, portföy, müşteri ve hesaplaşma sürecini başlatın.
        </p>
      </div>

      <div class="grid gap-4 xl:grid-cols-4">
        <UiSelect v-model="form.consultantId" label="Ayrılan Danışman" variant="outline" size="sm">
          <option value="">Danışman seçin</option>
          <option
            v-for="consultant in consultantOptions"
            :key="consultant.id"
            :value="consultant.id"
          >
            {{ consultant.fullName }} · {{ consultant.status }}
          </option>
        </UiSelect>

        <UiSelect v-model="form.handoverConsultantId" label="Devir Alacak Danışman" variant="outline" size="sm">
          <option value="">Seçilmedi</option>
          <option
            v-for="consultant in activeConsultants"
            :key="consultant.id"
            :value="consultant.id"
          >
            {{ consultant.fullName }}
          </option>
        </UiSelect>

        <UiInput
          v-model="form.leaveDate"
          label="Ayrılış Tarihi"
          type="date"
          variant="outline"
          size="sm"
        />

        <UiSelect v-model="form.reason" label="Ayrılış Nedeni" variant="outline" size="sm">
          <option
            v-for="item in reasonOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiInput
          v-model="form.customerCount"
          label="Müşteri Sayısı"
          type="number"
          min="0"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-model="form.listingCount"
          label="Portföy Sayısı"
          type="number"
          min="0"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-model="form.openProcessCount"
          label="Açık Süreç"
          type="number"
          min="0"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-model="form.pendingCommissionAmount"
          label="Bekleyen Komisyon"
          type="number"
          min="0"
          variant="outline"
          size="sm"
        />
      </div>

      <div class="mt-4">
        <UiTextarea
          v-model="form.note"
          label="Broker Notu"
          :rows="3"
          variant="outline"
          size="sm"
          placeholder="Ayrılış süreciyle ilgili not..."
        />
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <UiButton shape="rounded" @click="saveOffboarding">
          Süreci Başlat
        </UiButton>

        <UiButton variant="secondary" shape="rounded" @click="showForm = false">
          Vazgeç
        </UiButton>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_140px]">
        <UiInput
          v-model="search"
          label="Arama"
          type="text"
          variant="outline"
          size="sm"
          placeholder="Danışman, devir alan, neden veya not ara..."
        />

        <UiSelect v-model="statusFilter" label="Durum" variant="outline" size="sm">
          <option>Tümü</option>
          <option
            v-for="item in statusOptions"
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

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Ayrılış Süreçleri
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ filteredRecords.length }} kayıt listeleniyor
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1600px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">Devir Bilgisi</th>
              <th class="px-6 py-4">Veri / Erişim</th>
              <th class="px-6 py-4">Müşteri / Portföy</th>
              <th class="px-6 py-4">Finans / Evrak</th>
              <th class="px-6 py-4">Sayılar</th>
              <th class="px-6 py-4">Not</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="record in filteredRecords"
              :key="record.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ record.consultantName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ record.reason }}</p>
                <p class="mt-1 text-xs text-slate-500">Ayrılış: {{ record.leaveDate }}</p>

                <select
                  :value="record.status"
                  class="mt-3 w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  :class="statusClass(record.status)"
                  @change="updateOffboardingRecord(record.id, 'status', $event.target.value)"
                >
                  <option
                    v-for="item in statusOptions"
                    :key="item"
                  >
                    {{ item }}
                  </option>
                </select>
              </td>

              <td class="px-6 py-5">
                <p class="text-xs text-slate-500">Devir Alacak Danışman</p>
                <p class="mt-1 font-semibold text-slate-900">
                  {{ record.handoverConsultantName || 'Broker üzerinde' }}
                </p>
              </td>

              <td class="px-6 py-5">
                <div class="space-y-3">
                  <select
                    :value="record.accessStatus"
                    class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                    :class="smallStatusClass(record.accessStatus)"
                    @change="updateOffboardingRecord(record.id, 'accessStatus', $event.target.value)"
                  >
                    <option
                      v-for="item in accessStatusOptions"
                      :key="item"
                    >
                      {{ item }}
                    </option>
                  </select>

                  <select
                    :value="record.dataStatus"
                    class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                    :class="smallStatusClass(record.dataStatus)"
                    @change="updateOffboardingRecord(record.id, 'dataStatus', $event.target.value)"
                  >
                    <option
                      v-for="item in dataStatusOptions"
                      :key="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                </div>
              </td>

              <td class="px-6 py-5">
                <div class="space-y-3">
                  <select
                    :value="record.customerTransferStatus"
                    class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                    :class="smallStatusClass(record.customerTransferStatus)"
                    @change="updateOffboardingRecord(record.id, 'customerTransferStatus', $event.target.value)"
                  >
                    <option
                      v-for="item in transferStatusOptions"
                      :key="item"
                    >
                      {{ item }}
                    </option>
                  </select>

                  <select
                    :value="record.listingTransferStatus"
                    class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                    :class="smallStatusClass(record.listingTransferStatus)"
                    @change="updateOffboardingRecord(record.id, 'listingTransferStatus', $event.target.value)"
                  >
                    <option
                      v-for="item in transferStatusOptions"
                      :key="item"
                    >
                      {{ item }}
                    </option>
                  </select>

                  <select
                    :value="record.pipelineTransferStatus"
                    class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                    :class="smallStatusClass(record.pipelineTransferStatus)"
                    @change="updateOffboardingRecord(record.id, 'pipelineTransferStatus', $event.target.value)"
                  >
                    <option
                      v-for="item in transferStatusOptions"
                      :key="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                </div>
              </td>

              <td class="px-6 py-5">
                <div class="space-y-3">
                  <select
                    :value="record.financeStatus"
                    class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                    :class="smallStatusClass(record.financeStatus)"
                    @change="updateOffboardingRecord(record.id, 'financeStatus', $event.target.value)"
                  >
                    <option
                      v-for="item in financeStatusOptions"
                      :key="item"
                    >
                      {{ item }}
                    </option>
                  </select>

                  <select
                    :value="record.documentStatus"
                    class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                    :class="smallStatusClass(record.documentStatus)"
                    @change="updateOffboardingRecord(record.id, 'documentStatus', $event.target.value)"
                  >
                    <option
                      v-for="item in documentStatusOptions"
                      :key="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                </div>
              </td>

              <td class="px-6 py-5">
                <div class="space-y-2 text-xs">
                  <p><strong>Müşteri:</strong> {{ record.customerCount }}</p>
                  <p><strong>Portföy:</strong> {{ record.listingCount }}</p>
                  <p><strong>Açık süreç:</strong> {{ record.openProcessCount }}</p>
                  <p><strong>Komisyon:</strong> {{ formatPrice(record.pendingCommissionAmount) }}</p>
                </div>
              </td>

              <td class="px-6 py-5">
                <textarea
                  :value="record.note"
                  rows="4"
                  class="w-full min-w-[260px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  placeholder="Ayrılış notu..."
                  @input="updateOffboardingRecord(record.id, 'note', $event.target.value)"
                ></textarea>
              </td>

              <td class="px-6 py-5 text-right">
                <div class="flex flex-col items-end gap-2">
                  <UiButton size="sm" shape="rounded" @click="completeProcess(record)">
                    Süreci Tamamla
                  </UiButton>

                  <UiButton variant="secondary" size="sm" shape="rounded" @click="confirmDelete(record)">
                    Sil
                  </UiButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!filteredRecords.length"
        class="p-10 text-center"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-person-dash"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Ayrılış kaydı bulunamadı
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Yeni ayrılış süreci başlatarak devam edebilirsiniz.
        </p>
      </div>
    </section>
  </div>
</template>
