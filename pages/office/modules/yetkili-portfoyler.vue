<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeAuthorizedListings } from '~/composables/useOfficeAuthorizedListings'

const { consultants } = useOffice()

const {
  listings,
  hydrateListings,
  createAuthorizedListing,
  updateAuthorizedListing,
  deleteAuthorizedListing,
  daysUntilEnd,
  listingStats,
  formatPrice,
} = useOfficeAuthorizedListings()

hydrateListings()

const search = ref('')
const consultantFilter = ref('Tümü')
const statusFilter = ref('Tümü')
const typeFilter = ref('Tümü')
const authorityFilter = ref('Tümü')
const showForm = ref(false)
const successMessage = ref('')

const form = reactive({
  consultantId: '',
  title: '',
  propertyType: 'Ticari Dükkan',
  location: '',
  ownerName: '',
  ownerPhone: '',
  authorizationType: 'Tek Yetki',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  price: '',
  status: 'Aktif Pazarlamada',
  stage: 'Portföy Alındı',
  source: 'Ofis Kaydı',
  brokerNote: '',
})

const propertyTypes = [
  'Ticari Dükkan',
  'Ofis',
  'Depo',
  'Fabrika',
  'Arsa',
  'Konut',
  'Plaza Katı',
  'Mağaza',
]

const statusOptions = [
  'Aktif Pazarlamada',
  'Müşteri Görüşmede',
  'Teklif Alındı',
  'Sözleşme Aşamasında',
  'İşlem Tamamlandı',
  'Yetki Süresi Yaklaşıyor',
  'Pasif',
]

const stageOptions = [
  'Portföy Alındı',
  'Fotoğraf / Video Hazırlanıyor',
  'İlan Yayında',
  'Pazarlama',
  'Talep Eşleşti',
  'Sunum Yapıldı',
  'Teklif Alındı',
  'Fiyat Güncelleme',
  'Sözleşme Aşaması',
  'İşlem Tamamlandı',
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

const filteredListings = computed(() => {
  let list = listings.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.title,
        item.location,
        item.ownerName,
        item.ownerPhone,
        item.consultantName,
        item.propertyType,
        item.stage,
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
    list = list.filter(item => item.propertyType === typeFilter.value)
  }

  if (authorityFilter.value !== 'Tümü') {
    list = list.filter(item => item.authorizationType === authorityFilter.value)
  }

  return list
})

const selectedConsultant = computed(() => {
  return consultantOptions.value.find(item => String(item.id) === String(form.consultantId))
})

watch(() => form.consultantId, () => {
  if (selectedConsultant.value) {
    form.consultantName = selectedConsultant.value.fullName
  }
})

const resetForm = () => {
  form.consultantId = ''
  form.title = ''
  form.propertyType = 'Ticari Dükkan'
  form.location = ''
  form.ownerName = ''
  form.ownerPhone = ''
  form.authorizationType = 'Tek Yetki'
  form.startDate = new Date().toISOString().slice(0, 10)
  form.endDate = ''
  form.price = ''
  form.status = 'Aktif Pazarlamada'
  form.stage = 'Portföy Alındı'
  form.source = 'Ofis Kaydı'
  form.brokerNote = ''
}

const saveListing = () => {
  if (!form.consultantId || !form.title || !form.location || !form.ownerName) {
    successMessage.value = 'Danışman, portföy adı, konum ve malik bilgisi zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  createAuthorizedListing({
    ...form,
    consultantName: selectedConsultant.value?.fullName || 'Danışman',
  })

  successMessage.value = 'Yetkili portföy ofis havuzuna eklendi.'
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
  authorityFilter.value = 'Tümü'
}

const authorityClass = (type) => {
  if (type === 'Tek Yetki') return 'bg-slate-900 text-white'
  return 'bg-slate-100 text-slate-700'
}

const statusClass = (status) => {
  if (status === 'Aktif Pazarlamada') return 'bg-slate-900 text-white'
  if (status === 'Müşteri Görüşmede') return 'bg-slate-200 text-slate-800'
  if (status === 'Teklif Alındı') return 'bg-slate-800 text-white'
  if (status === 'Sözleşme Aşamasında') return 'bg-slate-900 text-white'
  if (status === 'İşlem Tamamlandı') return 'bg-slate-950 text-white'
  if (status === 'Yetki Süresi Yaklaşıyor') return 'bg-slate-300 text-slate-900'
  return 'bg-white text-slate-700 border border-slate-200'
}

const expiryText = (endDate) => {
  const days = daysUntilEnd(endDate)

  if (days === null) return 'Süre yok'
  if (days < 0) return `${Math.abs(days)} gün geçti`
  if (days === 0) return 'Bugün bitiyor'
  return `${days} gün kaldı`
}

const confirmDelete = (item) => {
  if (confirm(`${item.title} portföyünü silmek istiyor musunuz?`)) {
    deleteAuthorizedListing(item.id)
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
            Yetkili Portföyler
          </h1>
          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Ofise bağlı danışmanların aldığı yetkili portföyleri, yetki sürelerini, pazarlama aşamalarını ve broker notlarını tek ekrandan yönetin.
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
            Yeni Yetkili Portföy
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
        <p class="text-sm font-medium text-slate-500">Toplam Portföy</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ listingStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Aktif Pazarlama</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ listingStats.active }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Müşteri Sürecinde</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ listingStats.inProcess }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tek Yetki</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ listingStats.singleAuthority }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Süresi Yaklaşan</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ listingStats.expiringSoon }}</p>
      </div>
    </section>

    <section
      v-if="showForm"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">
          Yeni Yetkili Portföy Kaydı
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Portföy kaydı broker ofis havuzuna eklenecek.
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
          v-model="form.title"
          label="Portföy Başlığı"
          type="text"
          variant="outline"
          size="sm"
          placeholder="Örn: Gıda Çarşısı satılık dükkan"
        />

        <UiSelect v-model="form.propertyType" label="Portföy Türü" variant="outline" size="sm">
          <option
            v-for="item in propertyTypes"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiInput
          v-model="form.location"
          label="Konum"
          type="text"
          variant="outline"
          size="sm"
          placeholder="İzmir / Konak / Yenişehir"
        />

        <UiInput
          v-model="form.ownerName"
          label="Malik Adı"
          type="text"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-model="form.ownerPhone"
          label="Malik Telefon"
          type="text"
          variant="outline"
          size="sm"
        />

        <UiSelect v-model="form.authorizationType" label="Yetki Türü" variant="outline" size="sm">
          <option>Tek Yetki</option>
          <option>Standart Yetki</option>
          <option>Sözlü Yetki</option>
        </UiSelect>

        <UiInput
          v-model="form.price"
          label="Fiyat"
          type="number"
          variant="outline"
          size="sm"
        />

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

        <UiSelect v-model="form.status" label="Durum" variant="outline" size="sm">
          <option
            v-for="item in statusOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiSelect v-model="form.stage" label="Aşama" variant="outline" size="sm">
          <option
            v-for="item in stageOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>
      </div>

      <div class="mt-4 grid gap-4 xl:grid-cols-[260px_1fr]">
        <UiSelect v-model="form.source" label="Kaynak" variant="outline" size="sm">
          <option
            v-for="item in sourceOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiInput
          v-model="form.brokerNote"
          label="Broker Notu"
          type="text"
          variant="outline"
          size="sm"
          placeholder="Portföyle ilgili broker notu..."
        />
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <UiButton shape="rounded" @click="saveListing">
          Portföyü Kaydet
        </UiButton>

        <UiButton variant="secondary" shape="rounded" @click="showForm = false">
          Vazgeç
        </UiButton>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_220px_220px_170px]">
        <UiInput
          v-model="search"
          label="Arama"
          type="text"
          variant="outline"
          size="sm"
          placeholder="Portföy, malik, danışman, konum ara..."
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

        <UiSelect v-model="typeFilter" label="Portföy Türü" variant="outline" size="sm">
          <option>Tümü</option>
          <option
            v-for="item in propertyTypes"
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
          Ofis Portföy Havuzu
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ filteredListings.length }} portföy listeleniyor
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1300px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Portföy</th>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">Malik</th>
              <th class="px-6 py-4">Fiyat</th>
              <th class="px-6 py-4">Yetki</th>
              <th class="px-6 py-4">Süre</th>
              <th class="px-6 py-4">Durum</th>
              <th class="px-6 py-4">Aşama</th>
              <th class="px-6 py-4">Broker Notu</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in filteredListings"
              :key="item.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ item.title }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.propertyType }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.location }}</p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ item.consultantName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.source }}</p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ item.ownerName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.ownerPhone }}</p>
              </td>

              <td class="px-6 py-5 font-bold text-slate-900">
                {{ formatPrice(item.price) }}
              </td>

              <td class="px-6 py-5">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="authorityClass(item.authorizationType)"
                >
                  {{ item.authorizationType }}
                </span>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ expiryText(item.endDate) }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.startDate }} / {{ item.endDate }}</p>
              </td>

              <td class="px-6 py-5">
                <select
                  :value="item.status"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                  :class="statusClass(item.status)"
                  @change="updateAuthorizedListing(item.id, 'status', $event.target.value)"
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
                <select
                  :value="item.stage"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  @change="updateAuthorizedListing(item.id, 'stage', $event.target.value)"
                >
                  <option
                    v-for="stage in stageOptions"
                    :key="stage"
                  >
                    {{ stage }}
                  </option>
                </select>
              </td>

              <td class="px-6 py-5">
                <textarea
                  :value="item.brokerNote"
                  rows="2"
                  class="w-full min-w-[220px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                  placeholder="Broker notu..."
                  @input="updateAuthorizedListing(item.id, 'brokerNote', $event.target.value)"
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
        v-if="!filteredListings.length"
        class="p-10 text-center"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-buildings"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Portföy bulunamadı
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Filtreleri temizleyerek veya yeni portföy ekleyerek devam edebilirsiniz.
        </p>
      </div>
    </section>
  </div>
</template>
