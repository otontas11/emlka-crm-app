<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeRegions } from '~/composables/useOfficeRegions'

const { consultants } = useOffice()

const {
  regions,
  hydrateRegions,
  createRegionAssignment,
  updateRegionAssignment,
  deleteRegionAssignment,
  regionStats,
} = useOfficeRegions()

hydrateRegions()

const search = ref('')
const consultantFilter = ref('Tümü')
const statusFilter = ref('Tümü')
const typeFilter = ref('Tümü')
const exclusivityFilter = ref('Tümü')
const showForm = ref(false)
const successMessage = ref('')

const form = reactive({
  consultantId: '',
  regionName: '',
  city: 'İzmir',
  district: '',
  neighborhood: '',
  streets: '',
  assignmentType: 'Ana Bölge',
  exclusivity: 'Tek Danışman',
  status: 'Aktif',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  monthlyListingTarget: 0,
  monthlyVisitTarget: 0,
  monthlyOwnerMeetingTarget: 0,
  note: '',
})

const statusOptions = [
  'Aktif',
  'Askıda',
  'Tamamlandı',
  'Pasif',
]

const assignmentTypeOptions = [
  'Ana Bölge',
  'Destek Bölge',
  'Geçici Bölge',
  'Proje Bölgesi',
]

const exclusivityOptions = [
  'Tek Danışman',
  'Ortak Çalışma',
  'Ofis Geneli',
]

const consultantOptions = computed(() => {
  return consultants.value.filter(item => item.status !== 'Ayrıldı')
})

const selectedConsultant = computed(() => {
  return consultantOptions.value.find(item => String(item.id) === String(form.consultantId))
})

const filteredRegions = computed(() => {
  let list = regions.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.consultantName,
        item.regionName,
        item.city,
        item.district,
        item.neighborhood,
        item.streets,
        item.assignmentType,
        item.exclusivity,
        item.note,
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
    list = list.filter(item => item.assignmentType === typeFilter.value)
  }

  if (exclusivityFilter.value !== 'Tümü') {
    list = list.filter(item => item.exclusivity === exclusivityFilter.value)
  }

  return list
})

const consultantRegionSummary = computed(() => {
  return consultantOptions.value.map((consultant) => {
    const items = regions.value.filter(item => String(item.consultantId) === String(consultant.id))

    return {
      consultant,
      total: items.length,
      active: items.filter(item => item.status === 'Aktif').length,
      main: items.filter(item => item.assignmentType === 'Ana Bölge').length,
      listingTarget: items.reduce((sum, item) => sum + Number(item.monthlyListingTarget || 0), 0),
      visitTarget: items.reduce((sum, item) => sum + Number(item.monthlyVisitTarget || 0), 0),
    }
  }).filter(item => item.total > 0)
})

const resetForm = () => {
  form.consultantId = ''
  form.regionName = ''
  form.city = 'İzmir'
  form.district = ''
  form.neighborhood = ''
  form.streets = ''
  form.assignmentType = 'Ana Bölge'
  form.exclusivity = 'Tek Danışman'
  form.status = 'Aktif'
  form.startDate = new Date().toISOString().slice(0, 10)
  form.endDate = ''
  form.monthlyListingTarget = 0
  form.monthlyVisitTarget = 0
  form.monthlyOwnerMeetingTarget = 0
  form.note = ''
}

const saveRegion = () => {
  if (!form.consultantId || !form.regionName || !form.district) {
    successMessage.value = 'Danışman, bölge adı ve ilçe bilgisi zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  createRegionAssignment({
    ...form,
    consultantName: selectedConsultant.value?.fullName || 'Danışman',
  })

  successMessage.value = 'Bölge ataması başarıyla oluşturuldu.'
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
  exclusivityFilter.value = 'Tümü'
}

const statusClass = (status) => {
  if (status === 'Aktif') return 'bg-slate-900 text-white'
  if (status === 'Askıda') return 'bg-slate-200 text-slate-800'
  if (status === 'Tamamlandı') return 'bg-slate-700 text-white'
  return 'bg-white text-slate-700 border border-slate-200'
}

const typeClass = (type) => {
  if (type === 'Ana Bölge') return 'bg-slate-900 text-white'
  if (type === 'Destek Bölge') return 'bg-slate-200 text-slate-800'
  if (type === 'Proje Bölgesi') return 'bg-slate-700 text-white'
  return 'bg-white text-slate-700 border border-slate-200'
}

const confirmDelete = (item) => {
  if (confirm(`${item.regionName} bölge atamasını silmek istiyor musunuz?`)) {
    deleteRegionAssignment(item.id)
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
            Bölge Ataması
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Danışmanlara çalışma bölgesi, mahalle, sokak, hedef ve sorumluluk ataması yapın. Hangi danışmanın hangi bölgede çalışacağını netleştirin.
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
            Yeni Bölge Ataması
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
        <p class="text-sm font-medium text-slate-500">Toplam Bölge</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ regionStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Aktif Bölge</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ regionStats.active }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Ana Bölge</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ regionStats.mainRegion }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Destek Bölge</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ regionStats.supportRegion }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tek Danışman</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ regionStats.exclusive }}</p>
      </div>
    </section>

    <section
      v-if="showForm"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">
          Yeni Bölge Ataması
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Danışmanın sorumlu olacağı bölgeyi ve aylık saha hedeflerini tanımlayın.
        </p>
      </div>

      <div class="grid gap-4 xl:grid-cols-4">
        <UiSelect v-model="form.consultantId" label="Danışman" variant="outline" size="sm">
          <option value="">Danışman seçin</option>
          <option
            v-for="consultant in consultantOptions"
            :key="consultant.id"
            :value="consultant.id"
          >
            {{ consultant.fullName }}
          </option>
        </UiSelect>

        <UiInput
          v-model="form.regionName"
          label="Bölge Adı"
          type="text"
          variant="outline"
          size="sm"
          placeholder="Yenişehir Gıda Çarşısı"
        />

        <UiInput
          v-model="form.city"
          label="İl"
          type="text"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-model="form.district"
          label="İlçe"
          type="text"
          variant="outline"
          size="sm"
          placeholder="Konak"
        />

        <UiInput
          v-model="form.neighborhood"
          label="Mahalle"
          type="text"
          variant="outline"
          size="sm"
          placeholder="Yenişehir"
        />

        <UiInput
          v-model="form.streets"
          label="Sokak / Cadde / Alan"
          type="text"
          variant="outline"
          size="sm"
          class="xl:col-span-3"
          placeholder="1145/7 Sokak, Gaziler Caddesi..."
        />

        <UiSelect v-model="form.assignmentType" label="Atama Türü" variant="outline" size="sm">
          <option
            v-for="item in assignmentTypeOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiSelect v-model="form.exclusivity" label="Çalışma Şekli" variant="outline" size="sm">
          <option
            v-for="item in exclusivityOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiSelect v-model="form.status" label="Durum" variant="outline" size="sm">
          <option
            v-for="item in statusOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiInput
          v-model="form.startDate"
          label="Başlangıç"
          type="date"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-model="form.endDate"
          label="Bitiş"
          type="date"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-model="form.monthlyListingTarget"
          label="Aylık Portföy Hedefi"
          type="number"
          variant="outline"
          size="sm"
          min="0"
        />

        <UiInput
          v-model="form.monthlyVisitTarget"
          label="Aylık Saha Ziyareti"
          type="number"
          variant="outline"
          size="sm"
          min="0"
        />

        <UiInput
          v-model="form.monthlyOwnerMeetingTarget"
          label="Aylık Malik Görüşmesi"
          type="number"
          variant="outline"
          size="sm"
          min="0"
        />
      </div>

      <UiTextarea
        v-model="form.note"
        label="Broker Notu"
        :rows="3"
        variant="outline"
        size="sm"
        class="mt-4"
        placeholder="Bölgeyle ilgili özel not..."
      />

      <div class="mt-6 flex flex-wrap gap-2">
        <UiButton shape="rounded" @click="saveRegion">
          Bölgeyi Kaydet
        </UiButton>

        <UiButton variant="secondary" shape="rounded" @click="showForm = false">
          Vazgeç
        </UiButton>
      </div>
    </section>

    <section
      v-if="consultantRegionSummary.length"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-5">
        <h2 class="text-xl font-bold text-slate-900">Danışman Bölge Özeti</h2>
        <p class="mt-1 text-sm text-slate-500">
          Danışman bazlı bölge ve saha hedefleri.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in consultantRegionSummary"
          :key="item.consultant.id"
          class="rounded-3xl bg-slate-50 p-5"
        >
          <p class="font-bold text-slate-900">{{ item.consultant.fullName }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ item.active }} aktif bölge · {{ item.main }} ana bölge</p>

          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between gap-3">
              <span class="text-slate-500">Portföy hedefi</span>
              <span class="font-semibold text-slate-900">{{ item.listingTarget }}</span>
            </div>

            <div class="flex justify-between gap-3">
              <span class="text-slate-500">Saha ziyareti</span>
              <span class="font-semibold text-slate-900">{{ item.visitTarget }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_180px_220px_220px_140px]">
        <UiInput
          v-model="search"
          label="Arama"
          type="text"
          variant="outline"
          size="sm"
          placeholder="Danışman, bölge, mahalle, sokak ara..."
        />

        <UiSelect v-model="consultantFilter" label="Danışman" variant="outline" size="sm">
          <option>Tümü</option>
          <option
            v-for="consultant in consultantOptions"
            :key="consultant.id"
            :value="consultant.id"
          >
            {{ consultant.fullName }}
          </option>
        </UiSelect>

        <UiSelect v-model="statusFilter" label="Durum" variant="outline" size="sm">
          <option>Tümü</option>
          <option
            v-for="item in statusOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiSelect v-model="typeFilter" label="Atama Türü" variant="outline" size="sm">
          <option>Tümü</option>
          <option
            v-for="item in assignmentTypeOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiSelect v-model="exclusivityFilter" label="Çalışma Şekli" variant="outline" size="sm">
          <option>Tümü</option>
          <option
            v-for="item in exclusivityOptions"
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
          Bölge Atama Listesi
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ filteredRegions.length }} bölge ataması listeleniyor
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1450px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Bölge</th>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">Atama</th>
              <th class="px-6 py-4">Durum</th>
              <th class="px-6 py-4">Hedefler</th>
              <th class="px-6 py-4">Tarih</th>
              <th class="px-6 py-4">Broker Notu</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in filteredRegions"
              :key="item.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ item.regionName }}</p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ item.city }} / {{ item.district }} / {{ item.neighborhood }}
                </p>
                <p class="mt-2 text-xs leading-5 text-slate-500">
                  {{ item.streets || '-' }}
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ item.consultantName }}</p>
              </td>

              <td class="px-6 py-5">
                <div class="flex flex-col gap-2">
                  <span class="inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold" :class="typeClass(item.assignmentType)">
                    {{ item.assignmentType }}
                  </span>

                  <span class="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {{ item.exclusivity }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-5">
                <select
                  :value="item.status"
                  class="w-full rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  :class="statusClass(item.status)"
                  @change="updateRegionAssignment(item.id, 'status', $event.target.value)"
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
                <div class="grid gap-2">
                  <div class="rounded-2xl bg-white p-3">
                    <p class="text-xs text-slate-400">Portföy hedefi</p>
                    <input
                      :value="item.monthlyListingTarget"
                      type="number"
                      class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-500"
                      @input="updateRegionAssignment(item.id, 'monthlyListingTarget', $event.target.value)"
                    />
                  </div>

                  <div class="rounded-2xl bg-white p-3">
                    <p class="text-xs text-slate-400">Saha ziyareti</p>
                    <input
                      :value="item.monthlyVisitTarget"
                      type="number"
                      class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-500"
                      @input="updateRegionAssignment(item.id, 'monthlyVisitTarget', $event.target.value)"
                    />
                  </div>
                </div>
              </td>

              <td class="px-6 py-5">
                <p class="text-xs text-slate-500">Başlangıç</p>
                <p class="font-semibold text-slate-900">{{ item.startDate || '-' }}</p>
                <p class="mt-2 text-xs text-slate-500">Bitiş</p>
                <p class="font-semibold text-slate-900">{{ item.endDate || 'Süresiz' }}</p>
              </td>

              <td class="px-6 py-5">
                <textarea
                  :value="item.note"
                  rows="3"
                  class="w-full min-w-[260px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  placeholder="Broker notu..."
                  @input="updateRegionAssignment(item.id, 'note', $event.target.value)"
                ></textarea>
              </td>

              <td class="px-6 py-5 text-right">
                <UiButton variant="secondary" size="sm" shape="rounded" @click="confirmDelete(item)">
                  Sil
                </UiButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!filteredRegions.length"
        class="p-10 text-center"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-map"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Bölge ataması bulunamadı
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Filtreleri temizleyerek veya yeni bölge ataması ekleyerek devam edebilirsiniz.
        </p>
      </div>
    </section>
  </div>
</template>
