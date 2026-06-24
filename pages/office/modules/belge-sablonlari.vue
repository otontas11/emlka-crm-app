<script setup>
import { useOffice } from '~/composables/useOffice'
import { useDocumentTemplates } from '~/composables/useDocumentTemplates'

const { consultants } = useOffice()

const {
  templates,
  consultantDocuments,
  hydrateDocumentTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  approveConsultantDocument,
  requestRevisionForDocument,
  getRegistrationProgress,
  downloadTemplate,
  templateStats,
} = useDocumentTemplates()

hydrateDocumentTemplates()

const activeTab = ref('sablonlar')
const search = ref('')
const categoryFilter = ref('Tümü')
const statusFilter = ref('Tümü')
const showForm = ref(false)
const successMessage = ref('')
const revisionNotes = reactive({})

const form = reactive({
  title: '',
  category: 'Kiralama Belgeleri',
  usageArea: '',
  fileType: 'DOCX',
  version: '1.0',
  active: true,
  requiredForRegistration: false,
  approvalRequired: false,
  mobileEditable: true,
  description: '',
  content: '',
})

const categoryOptions = [
  'Kayıt Evrakı',
  'Kiralama Belgeleri',
  'Yetki Belgeleri',
  'Yer Gösterme / Teklif',
  'Hizmet Belgeleri',
  'Devir Belgeleri',
  'Portföy Belgeleri',
  'Tutanaklar',
  'KVKK Belgeleri',
  'Diğer',
]

const fileTypeOptions = [
  'DOCX',
  'PDF',
  'XLSX',
  'TXT',
]

const statusOptions = [
  'Tümü',
  'Yüklendi',
  'Onaya Gönderildi',
  'Onaylandı',
  'Revize İstendi',
]

const categories = computed(() => {
  return ['Tümü', ...new Set(templates.value.map(item => item.category))]
})

const filteredTemplates = computed(() => {
  let list = templates.value

  if (categoryFilter.value !== 'Tümü') {
    list = list.filter(item => item.category === categoryFilter.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.title,
        item.category,
        item.usageArea,
        item.description,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  return list
})

const filteredDocuments = computed(() => {
  let list = consultantDocuments.value

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.consultantName,
        item.templateTitle,
        item.category,
        item.fileName,
        item.status,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  return list
})

const consultantProgressRows = computed(() => {
  return consultants.value.map((consultant) => {
    return {
      consultant,
      progress: getRegistrationProgress(consultant.id),
    }
  })
})

const saveTemplate = () => {
  if (!form.title || !form.category) {
    successMessage.value = 'Şablon adı ve kategori zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  createTemplate({ ...form })

  successMessage.value = 'Belge şablonu oluşturuldu.'
  showForm.value = false

  form.title = ''
  form.category = 'Kiralama Belgeleri'
  form.usageArea = ''
  form.fileType = 'DOCX'
  form.version = '1.0'
  form.active = true
  form.requiredForRegistration = false
  form.approvalRequired = false
  form.mobileEditable = true
  form.description = ''
  form.content = ''

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const approveDocument = (document) => {
  approveConsultantDocument(document.id, 'Broker tarafından onaylandı.')

  successMessage.value = 'Belge onaylandı.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const requestRevision = (document) => {
  requestRevisionForDocument(document.id, revisionNotes[document.id] || 'Lütfen belgeyi kontrol ederek tekrar yükleyin.')

  successMessage.value = 'Revize talebi danışmana iletildi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const confirmDelete = (template) => {
  if (confirm(`${template.title} şablonunu silmek istiyor musunuz?`)) {
    deleteTemplate(template.id)
  }
}

const statusClass = (status) => {
  if (status === 'Onaylandı') return 'bg-slate-900 text-white'
  if (status === 'Onaya Gönderildi') return 'bg-slate-200 text-slate-800'
  if (status === 'Revize İstendi') return 'bg-white text-slate-700 border border-slate-300'
  return 'bg-slate-100 text-slate-600'
}

const progressWidth = (value) => {
  return `${Math.min(Number(value || 0), 100)}%`
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
            Belge Şablonları ve Kayıt Onayları
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Ofisin standart sözleşme ve form şablonlarını yönetin. Danışmanların kayıt evraklarını kontrol edip onaylayın.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="showForm = !showForm"
        >
          <i class="bi bi-plus-lg mr-2"></i>
          Yeni Şablon
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
        <p class="text-sm font-medium text-slate-500">Toplam Şablon</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ templateStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Aktif</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ templateStats.active }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Kayıt Evrakı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ templateStats.registration }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">İş Şablonu</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ templateStats.business }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Onay Bekleyen</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ templateStats.waitingApproval }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Revize</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ templateStats.revised }}</p>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div class="flex gap-2 overflow-x-auto">
        <button
          type="button"
          class="shrink-0 rounded-2xl px-4 py-3 text-sm font-semibold transition"
          :class="activeTab === 'sablonlar' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="activeTab = 'sablonlar'"
        >
          Şablon Yönetimi
        </button>

        <button
          type="button"
          class="shrink-0 rounded-2xl px-4 py-3 text-sm font-semibold transition"
          :class="activeTab === 'onaylar' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="activeTab = 'onaylar'"
        >
          Danışman Evrak Onayları
        </button>
      </div>
    </section>

    <section
      v-if="showForm"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 class="text-xl font-bold text-slate-900">
        Yeni Belge Şablonu
      </h2>

      <div class="mt-6 grid gap-4 xl:grid-cols-4">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Şablon Adı</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Örn: Ticari Kira Sözleşmesi"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
          <select
            v-model="form.category"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in categoryOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Dosya Tipi</label>
          <select
            v-model="form.fileType"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in fileTypeOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Versiyon</label>
          <input
            v-model="form.version"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div class="xl:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kullanım Alanı</label>
          <input
            v-model="form.usageArea"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Örn: Ticari kiralama, yer gösterme, teklif..."
          />
        </div>

        <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <input
            v-model="form.requiredForRegistration"
            type="checkbox"
          />
          <span class="text-sm font-semibold text-slate-700">Kayıt evrakı</span>
        </div>

        <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <input
            v-model="form.approvalRequired"
            type="checkbox"
          />
          <span class="text-sm font-semibold text-slate-700">Broker onayı gerekli</span>
        </div>

        <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <input
            v-model="form.mobileEditable"
            type="checkbox"
          />
          <span class="text-sm font-semibold text-slate-700">Mobil uyumlu</span>
        </div>

        <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <input
            v-model="form.active"
            type="checkbox"
          />
          <span class="text-sm font-semibold text-slate-700">Aktif</span>
        </div>

        <div class="xl:col-span-4">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Açıklama</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          ></textarea>
        </div>

        <div class="xl:col-span-4">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Şablon İçeriği / Not</label>
          <textarea
            v-model="form.content"
            rows="4"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          ></textarea>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="saveTemplate"
        >
          Şablonu Kaydet
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

    <section
      v-if="activeTab === 'sablonlar'"
      class="space-y-6"
    >
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="grid gap-4 xl:grid-cols-[1fr_260px]">
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Arama</label>
            <input
              v-model="search"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Şablon ara..."
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
            <select
              v-model="categoryFilter"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            >
              <option
                v-for="item in categories"
                :key="item"
              >
                {{ item }}
              </option>
            </select>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1300px] text-left text-sm">
            <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-6 py-4">Şablon</th>
                <th class="px-6 py-4">Kategori</th>
                <th class="px-6 py-4">Kullanım</th>
                <th class="px-6 py-4">Tip</th>
                <th class="px-6 py-4">Ayarlar</th>
                <th class="px-6 py-4 text-right">İşlem</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="template in filteredTemplates"
                :key="template.id"
                class="align-top hover:bg-slate-50"
              >
                <td class="px-6 py-5">
                  <p class="font-bold text-slate-900">{{ template.title }}</p>
                  <p class="mt-1 max-w-md text-xs leading-5 text-slate-500">{{ template.description }}</p>
                </td>

                <td class="px-6 py-5 font-semibold text-slate-900">
                  {{ template.category }}
                </td>

                <td class="px-6 py-5 text-slate-600">
                  {{ template.usageArea || '-' }}
                </td>

                <td class="px-6 py-5">
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {{ template.fileType }} · v{{ template.version }}
                  </span>
                </td>

                <td class="px-6 py-5">
                  <div class="space-y-2 text-xs">
                    <label class="flex items-center gap-2">
                      <input
                        :checked="template.active"
                        type="checkbox"
                        @change="updateTemplate(template.id, 'active', $event.target.checked)"
                      />
                      Aktif
                    </label>

                    <label class="flex items-center gap-2">
                      <input
                        :checked="template.requiredForRegistration"
                        type="checkbox"
                        @change="updateTemplate(template.id, 'requiredForRegistration', $event.target.checked)"
                      />
                      Kayıt evrakı
                    </label>

                    <label class="flex items-center gap-2">
                      <input
                        :checked="template.mobileEditable"
                        type="checkbox"
                        @change="updateTemplate(template.id, 'mobileEditable', $event.target.checked)"
                      />
                      Mobil uyumlu
                    </label>
                  </div>
                </td>

                <td class="px-6 py-5 text-right">
                  <div class="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      class="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                      @click="downloadTemplate(template)"
                    >
                      Test İndir
                    </button>

                    <button
                      type="button"
                      class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                      @click="confirmDelete(template)"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>

    <section
      v-if="activeTab === 'onaylar'"
      class="space-y-6"
    >
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-bold text-slate-900">
          Danışman Kayıt İlerleme Özeti
        </h2>

        <div class="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="row in consultantProgressRows"
            :key="row.consultant.id"
            class="rounded-3xl bg-slate-50 p-5"
          >
            <p class="font-bold text-slate-900">{{ row.consultant.fullName }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ row.consultant.status }} · {{ row.consultant.workType }}</p>

            <div class="mt-4">
              <div class="mb-2 flex justify-between text-xs text-slate-500">
                <span>Onay</span>
                <span>%{{ row.progress.approvedPercent }}</span>
              </div>

              <div class="h-2 overflow-hidden rounded-full bg-white">
                <div
                  class="h-full rounded-full bg-slate-900"
                  :style="{ width: progressWidth(row.progress.approvedPercent) }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="grid gap-4 xl:grid-cols-[1fr_220px]">
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Arama</label>
            <input
              v-model="search"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Danışman, belge, dosya ara..."
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">Durum</label>
            <select
              v-model="statusFilter"
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
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1250px] text-left text-sm">
            <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-6 py-4">Danışman</th>
                <th class="px-6 py-4">Belge</th>
                <th class="px-6 py-4">Dosya</th>
                <th class="px-6 py-4">Durum</th>
                <th class="px-6 py-4">Revize Notu</th>
                <th class="px-6 py-4 text-right">İşlem</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="document in filteredDocuments"
                :key="document.id"
                class="align-top hover:bg-slate-50"
              >
                <td class="px-6 py-5">
                  <p class="font-bold text-slate-900">{{ document.consultantName }}</p>
                  <p class="mt-1 text-xs text-slate-500">Yükleme: {{ document.uploadedAt || '-' }}</p>
                </td>

                <td class="px-6 py-5">
                  <p class="font-semibold text-slate-900">{{ document.templateTitle }}</p>
                  <p class="mt-1 text-xs text-slate-500">{{ document.category }}</p>
                </td>

                <td class="px-6 py-5 text-slate-600">
                  <i class="bi bi-paperclip mr-1"></i>
                  {{ document.fileName }}
                </td>

                <td class="px-6 py-5">
                  <span
                    class="rounded-full px-3 py-1 text-xs font-semibold"
                    :class="statusClass(document.status)"
                  >
                    {{ document.status }}
                  </span>
                </td>

                <td class="px-6 py-5">
                  <textarea
                    v-model="revisionNotes[document.id]"
                    rows="3"
                    class="w-full min-w-[260px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                    placeholder="Revize istenecekse açıklama yazın..."
                  ></textarea>
                </td>

                <td class="px-6 py-5 text-right">
                  <div class="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      class="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                      @click="approveDocument(document)"
                    >
                      Onayla
                    </button>

                    <button
                      type="button"
                      class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                      @click="requestRevision(document)"
                    >
                      Revize İste
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!filteredDocuments.length">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500">
                  Onay bekleyen danışman evrakı bulunmuyor.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  </div>
</template>
