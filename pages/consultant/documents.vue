<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeDocuments } from '~/composables/useOfficeDocuments'

const { consultants } = useOffice()

const {
  user,
  initAuth,
  consultantId,
} = useAuth()

const {
  ensureDocumentsForConsultants,
  getDocumentsByConsultant,
  uploadDocumentFile,
  updateDocumentField,
  completionPercent,
  missingCount,
} = useOfficeDocuments()

initAuth()
ensureDocumentsForConsultants()

const statusFilter = ref('Tümü')
const groupFilter = ref('Tümü')
const successMessage = ref('')

const currentConsultantId = computed(() => {
  return consultantId.value
})

const currentConsultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(currentConsultantId.value))
})

const myDocuments = computed(() => {
  if (!currentConsultantId.value) return []

  let list = getDocumentsByConsultant(currentConsultantId.value)

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (groupFilter.value !== 'Tümü') {
    list = list.filter(item => item.group === groupFilter.value)
  }

  return list
})

const documentGroups = computed(() => {
  return [...new Set(getDocumentsByConsultant(currentConsultantId.value).map(item => item.group))]
})

const completedCount = computed(() => {
  return getDocumentsByConsultant(currentConsultantId.value).filter(item => item.status === 'Tamamlandı').length
})

const waitingCount = computed(() => {
  return getDocumentsByConsultant(currentConsultantId.value).filter(item => item.status === 'Kontrol Bekliyor').length
})

const handleFileUpload = (event, record) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadDocumentFile(record.id, file)

  successMessage.value = `${record.title} dosyası yüklendi.`
  event.target.value = ''

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Kontrol Bekliyor') return 'bg-slate-200 text-slate-800'
  if (status === 'Süresi Yaklaşıyor') return 'bg-slate-100 text-slate-700'
  if (status === 'Geçersiz') return 'bg-slate-300 text-slate-800'
  return 'bg-white text-slate-700 border border-slate-200'
}

const clearFilters = () => {
  statusFilter.value = 'Tümü'
  groupFilter.value = 'Tümü'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Danışman Paneli
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Evraklarım
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Ofis yönetimi tarafından talep edilen sözleşme, kimlik, sertifika ve diğer belgelerinizi buradan takip edip yükleyebilirsiniz.
          </p>
        </div>

        <NuxtLink
          to="/consultant"
          class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Danışman Paneline Dön
        </NuxtLink>
      </div>
    </section>

    <div
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-check2-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 lg:grid-cols-[1fr_220px_220px_220px]">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Giriş Yapan Danışman
          </p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">
            {{ currentConsultant?.fullName || user?.fullName || 'Danışman' }}
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ currentConsultant?.code }} · {{ currentConsultant?.workType }} · {{ currentConsultant?.expertiseRegion }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Tamamlanma</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            %{{ completionPercent(currentConsultantId) }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Eksik Evrak</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            {{ missingCount(currentConsultantId) }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Kontrol Bekliyor</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            {{ waitingCount }}
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 md:grid-cols-[220px_220px_120px]">
        <UiSelect v-model="statusFilter" label="Durum" variant="outline" size="sm">
          <option>Tümü</option>
          <option>Eksik</option>
          <option>Kontrol Bekliyor</option>
          <option>Tamamlandı</option>
          <option>Süresi Yaklaşıyor</option>
          <option>Geçersiz</option>
        </UiSelect>

        <UiSelect v-model="groupFilter" label="Evrak Grubu" variant="outline" size="sm">
          <option>Tümü</option>
          <option
            v-for="item in documentGroups"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

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
          Evrak Listem
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ myDocuments.length }} evrak listeleniyor
        </p>
      </div>

      <div v-if="!myDocuments.length" class="p-10 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-folder2-open"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Evrak bulunamadı
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Filtreleri temizleyerek tekrar deneyebilirsiniz.
        </p>
      </div>

      <div v-else class="grid gap-4 p-6 xl:grid-cols-2">
        <div
          v-for="item in myDocuments"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {{ item.group }}
              </p>
              <h3 class="mt-2 font-bold text-slate-900">
                {{ item.title }}
              </h3>
            </div>

            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="statusClass(item.status)"
            >
              {{ item.status }}
            </span>
          </div>

          <div class="mt-4 rounded-2xl bg-white p-4">
            <div v-if="item.fileName">
              <p class="text-sm font-semibold text-slate-900">
                <i class="bi bi-paperclip mr-2"></i>
                {{ item.fileName }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ item.fileSize }} · {{ item.uploadedAt }}
              </p>
            </div>

            <div v-else class="text-sm text-slate-500">
              Henüz dosya yüklenmedi.
            </div>
          </div>

          <div class="mt-4">
            <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Danışman Notu
            </label>
            <textarea
              :value="item.note"
              rows="3"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Belgeyle ilgili notunuz..."
              @input="updateDocumentField(item.id, 'note', $event.target.value)"
            ></textarea>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <label class="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <i class="bi bi-upload mr-2"></i>
              Dosya Yükle
              <input
                type="file"
                class="hidden"
                @change="handleFileUpload($event, item)"
              />
            </label>

            <span
              v-if="item.expireDate"
              class="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
            >
              Geçerlilik: {{ item.expireDate }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
