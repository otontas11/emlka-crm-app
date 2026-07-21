<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeDocuments } from '~/composables/useOfficeDocuments'
import { useOfficeNotifications } from '~/composables/useOfficeNotifications'

const { consultants } = useOffice()

const {
  records,
  ensureDocumentsForConsultants,
  uploadDocumentFile,
  updateDocumentStatus,
  updateDocumentField,
  deleteDocumentFile,
  getDocumentsByConsultant,
  completionPercent,
  missingCount,
  documentStats,
  documentGroups,
} = useOfficeDocuments()

const {
  createOfficeAnnouncement,
  syncAnnouncementNotifications,
} = useOfficeNotifications()

const reminderSuccess = ref('')

ensureDocumentsForConsultants()

const selectedConsultantId = ref(consultants.value[0]?.id || null)
const search = ref('')
const statusFilter = ref('Tümü')
const groupFilter = ref('Tümü')
const workTypeFilter = ref('Tümü')

const statusOptions = [
  'Eksik',
  'Tamamlandı',
  'Kontrol Bekliyor',
  'Süresi Yaklaşıyor',
  'Geçersiz',
]

const selectedConsultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(selectedConsultantId.value))
})

const filteredConsultants = computed(() => {
  let list = consultants.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.fullName,
        item.code,
        item.workType,
        item.expertiseArea,
        item.expertiseRegion,
      ]
        .filter(Boolean)
        .some(value => String(value).toLocaleLowerCase('tr-TR').includes(q))
    })
  }

  if (workTypeFilter.value !== 'Tümü') {
    list = list.filter(item => item.workType === workTypeFilter.value)
  }

  return list
})

const selectedDocuments = computed(() => {
  if (!selectedConsultantId.value) return []

  let list = getDocumentsByConsultant(selectedConsultantId.value)

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (groupFilter.value !== 'Tümü') {
    list = list.filter(item => item.group === groupFilter.value)
  }

  return list
})

const selectConsultant = (id) => {
  selectedConsultantId.value = id
}

const handleFileUpload = (event, record) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadDocumentFile(record.id, file)

  event.target.value = ''
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Kontrol Bekliyor') return 'bg-slate-100 text-slate-700'
  if (status === 'Süresi Yaklaşıyor') return 'bg-slate-200 text-slate-800'
  if (status === 'Geçersiz') return 'bg-slate-300 text-slate-800'
  return 'bg-white text-slate-700 border border-slate-200'
}

const workTypeClass = (workType) => {
  if (workType === 'SGK’lı Danışman') return 'bg-slate-900 text-white'
  return 'bg-slate-100 text-slate-700'
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'Tümü'
  groupFilter.value = 'Tümü'
  workTypeFilter.value = 'Tümü'
}

const sendMissingDocumentReminder = () => {
  const consultant = selectedConsultant.value

  if (!consultant) return

  const missingDocs = getDocumentsByConsultant(consultant.id).filter(item => {
    return item.status !== 'Tamamlandı'
  })

  if (!missingDocs.length) {
    alert('Bu danışmanın eksik evrakı bulunmuyor.')
    return
  }

  const docList = missingDocs
    .map(item => `- ${item.title} (${item.status})`)
    .join('\n')

  createOfficeAnnouncement({
    title: `${consultant.fullName} eksik evrak hatırlatması`,
    type: 'Evrak',
    audience: 'Belirli Danışmanlar',
    date: 'Bugün',
    priority: 'Önemli',
    status: 'Yayınlandı',
    description: `Merhaba ${consultant.fullName}, ofis dijital evrak dosyanızda tamamlanması gereken belgeler bulunmaktadır:\n\n${docList}\n\nLütfen belgelerinizi en kısa sürede tamamlayınız.`,
    channels: ['Sistem İçi', 'Mobil Bildirim'],
    requiresConfirmation: true,
    selectedConsultantIds: [consultant.id],
  })

  syncAnnouncementNotifications()

  reminderSuccess.value = `${consultant.fullName} için eksik evrak hatırlatması gönderildi.`

  setTimeout(() => {
    reminderSuccess.value = ''
  }, 4000)
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Ofis Yönetimi
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Evrak Takibi ve Personel Dijital Evrak Dosyası
          </h1>
          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Danışman iş sözleşmesi, iş birliği sözleşmesi, gizlilik sözleşmesi, KVKK onayı, SGK evrakları, sağlık raporu, kimlik, sertifika ve diğer personel belgelerini danışman bazlı takip edin.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/office/consultants"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <i class="bi bi-people mr-2"></i>
            Danışmanlar
          </NuxtLink>

          <NuxtLink
            to="/office"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <i class="bi bi-arrow-left mr-2"></i>
            Ofise Dön
          </NuxtLink>
        </div>
      </div>
    </section>

    <div
      v-if="reminderSuccess"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-check2-circle mr-2"></i>
      {{ reminderSuccess }}
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam Evrak</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ documentStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tamamlanan</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ documentStats.completed }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Eksik</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ documentStats.missing }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Kontrol Bekliyor</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ documentStats.waiting }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Geçersiz</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ documentStats.invalid }}</p>
      </div>
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_220px_220px_120px]">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Danışman Ara
          </label>
          <div class="relative">
            <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="search"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-500"
              placeholder="Ad, kod, uzmanlık veya bölge ara..."
            />
          </div>
        </div>

        <UiSelect v-model="workTypeFilter" label="Çalışma Türü" variant="outline" size="sm">
          <option>Tümü</option>
          <option>SGK’lı Danışman</option>
          <option>Bağ-Kur’lu Danışman</option>
        </UiSelect>

        <UiSelect v-model="statusFilter" label="Evrak Durumu" variant="outline" size="sm">
          <option>Tümü</option>
          <option v-for="item in statusOptions" :key="item">{{ item }}</option>
        </UiSelect>

        <UiSelect v-model="groupFilter" label="Evrak Grubu" variant="outline" size="sm">
          <option>Tümü</option>
          <option v-for="item in documentGroups" :key="item">{{ item }}</option>
        </UiSelect>

        <div class="flex items-end">
          <UiButton variant="secondary" shape="rounded" block @click="clearFilters">Temizle</UiButton>
        </div>
      </div>
    </section>

    <div class="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Danışman Dosyaları
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ filteredConsultants.length }} danışman listeleniyor
          </p>
        </div>

        <div class="max-h-[720px] space-y-3 overflow-auto p-4">
          <button
            v-for="item in filteredConsultants"
            :key="item.id"
            type="button"
            class="w-full rounded-3xl border p-4 text-left transition hover:bg-slate-50"
            :class="String(selectedConsultantId) === String(item.id)
              ? 'border-slate-900 bg-slate-50'
              : 'border-slate-200 bg-white'"
            @click="selectConsultant(item.id)"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-bold text-slate-900">{{ item.fullName }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.code }} · {{ item.expertiseRegion }}</p>
              </div>

              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="workTypeClass(item.workType)"
              >
                {{ item.workType.includes('SGK') ? 'SGK' : 'Bağ-Kur' }}
              </span>
            </div>

            <div class="mt-4">
              <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>Dosya Tamamlanma</span>
                <span>%{{ completionPercent(item.id) }}</span>
              </div>

              <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  class="h-full rounded-full bg-slate-900"
                  :style="{ width: completionPercent(item.id) + '%' }"
                ></div>
              </div>
            </div>

            <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Eksik Evrak</span>
              <span class="font-bold text-slate-900">{{ missingCount(item.id) }}</span>
            </div>
          </button>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 class="text-xl font-bold text-slate-900">
                {{ selectedConsultant?.fullName || 'Danışman' }} Dijital Evrak Dosyası
              </h2>
              <p class="mt-1 text-sm text-slate-500">
                {{ selectedConsultant?.workType }} · {{ selectedConsultant?.expertiseArea }} · {{ selectedConsultant?.expertiseRegion }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button
                v-if="missingCount(selectedConsultantId) > 0"
                type="button"
                class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="sendMissingDocumentReminder"
              >
                <i class="bi bi-bell mr-2"></i>
                Eksik Evrak Hatırlat
              </button>

              <div class="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                <p class="text-xs text-slate-500">Tamamlanma</p>
                <p class="text-xl font-bold text-slate-900">%{{ completionPercent(selectedConsultantId) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!selectedDocuments.length" class="p-10 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
            <i class="bi bi-folder2-open"></i>
          </div>

          <h3 class="mt-4 text-lg font-bold text-slate-900">
            Evrak bulunamadı
          </h3>

          <p class="mt-2 text-sm text-slate-500">
            Filtreleri temizleyerek tekrar deneyebilirsiniz.
          </p>
        </div>

        <div v-else class="grid gap-4 p-6 xl:grid-cols-2">
          <div
            v-for="item in selectedDocuments"
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

            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Durum
                </label>
                <select
                  :value="item.status"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  @change="updateDocumentStatus(item.id, $event.target.value)"
                >
                  <option v-for="status in statusOptions" :key="status">
                    {{ status }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Geçerlilik Tarihi
                </label>
                <input
                  :value="item.expireDate"
                  type="date"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  @input="updateDocumentField(item.id, 'expireDate', $event.target.value)"
                />
              </div>
            </div>

            <div class="mt-4">
              <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Not
              </label>
              <textarea
                :value="item.note"
                rows="3"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                placeholder="Belge ile ilgili not..."
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

              <button
                v-if="item.fileName"
                type="button"
                class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="deleteDocumentFile(item.id)"
              >
                Dosyayı Kaldır
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>



