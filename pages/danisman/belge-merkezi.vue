<script setup>
import { useOffice } from '~/composables/useOffice'
import { useDocumentTemplates } from '~/composables/useDocumentTemplates'

const { consultants } = useOffice()

const {
  templates,
  hydrateDocumentTemplates,
  getRegistrationTemplates,
  getConsultantDocumentStatus,
  uploadConsultantDocument,
  submitConsultantDocument,
  getRegistrationProgress,
  downloadTemplate,
} = useDocumentTemplates()

hydrateDocumentTemplates()

const activeTab = ref('kayit')
const search = ref('')
const categoryFilter = ref('Tümü')
const successMessage = ref('')

const activeConsultants = computed(() => {
  return consultants.value.filter(item => item.status !== 'Ayrıldı')
})

const currentConsultant = computed(() => {
  return activeConsultants.value[0] || consultants.value[0] || {
    id: 1,
    fullName: 'Danışman',
    status: 'Aday',
  }
})

const registrationTemplates = computed(() => {
  return getRegistrationTemplates()
})

const businessTemplates = computed(() => {
  return templates.value.filter(item => item.active && !item.requiredForRegistration)
})

const categories = computed(() => {
  return ['Tümü', ...new Set(businessTemplates.value.map(item => item.category))]
})

const filteredBusinessTemplates = computed(() => {
  let list = businessTemplates.value

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

const progress = computed(() => {
  return getRegistrationProgress(currentConsultant.value.id)
})

const handleUpload = (template, event) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadConsultantDocument({
    consultantId: currentConsultant.value.id,
    consultantName: currentConsultant.value.fullName,
    template,
    fileName: file.name,
  })

  successMessage.value = 'Belge yüklendi. Onaya gönderebilirsiniz.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const sendToApproval = (document) => {
  submitConsultantDocument(document.id)

  successMessage.value = 'Belge broker onayına gönderildi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const statusClass = (status) => {
  if (status === 'Onaylandı') return 'bg-slate-900 text-white'
  if (status === 'Onaya Gönderildi') return 'bg-slate-200 text-slate-800'
  if (status === 'Revize İstendi') return 'bg-white text-slate-700 border border-slate-300'
  if (status === 'Yüklendi') return 'bg-slate-100 text-slate-700'
  return 'bg-slate-100 text-slate-500'
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
            Danışman Paneli
          </p>

          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Belge ve Sözleşme Merkezi
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Kayıt evraklarınızı indirin, doldurup sisteme yükleyin. Günlük işinizde ihtiyaç duyacağınız sözleşme ve form şablonlarını buradan indirebilirsiniz.
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm text-slate-500">Kayıt Tamamlanma</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">%{{ progress.approvedPercent }}</p>
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

    <section class="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div class="flex gap-2 overflow-x-auto">
        <button
          type="button"
          class="shrink-0 rounded-2xl px-4 py-3 text-sm font-semibold transition"
          :class="activeTab === 'kayit' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="activeTab = 'kayit'"
        >
          Kayıt Evraklarım
        </button>

        <button
          type="button"
          class="shrink-0 rounded-2xl px-4 py-3 text-sm font-semibold transition"
          :class="activeTab === 'sablon' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="activeTab = 'sablon'"
        >
          Sözleşme Şablonları
        </button>
      </div>
    </section>

    <section
      v-if="activeTab === 'kayit'"
      class="space-y-6"
    >
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-bold text-slate-900">
          Kayıt Evrak Süreci
        </h2>

        <p class="mt-2 text-sm leading-6 text-slate-500">
          Broker tarafından kaydınızın tamamlanması için aşağıdaki belgeleri indirip doldurun, ardından sisteme yükleyip onaya gönderin.
        </p>

        <div class="mt-5">
          <div class="mb-2 flex justify-between text-xs text-slate-500">
            <span>Onaylanan belge</span>
            <span>{{ progress.approvedCount }} / {{ progress.total }}</span>
          </div>

          <div class="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full bg-slate-900"
              :style="{ width: progressWidth(progress.approvedPercent) }"
            ></div>
          </div>
        </div>
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <div
          v-for="template in registrationTemplates"
          :key="template.id"
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {{ template.category }}
              </p>

              <h3 class="mt-2 text-lg font-bold text-slate-900">
                {{ template.title }}
              </h3>

              <p class="mt-2 text-sm leading-6 text-slate-500">
                {{ template.description }}
              </p>

              <p class="mt-2 text-xs text-slate-400">
                {{ template.fileType }} · Versiyon {{ template.version }}
              </p>
            </div>

            <span
              class="w-fit rounded-full px-3 py-1 text-xs font-semibold"
              :class="statusClass(getConsultantDocumentStatus(currentConsultant.id, template.id)?.status || 'Bekliyor')"
            >
              {{ getConsultantDocumentStatus(currentConsultant.id, template.id)?.status || 'Bekliyor' }}
            </span>
          </div>

          <div
            v-if="getConsultantDocumentStatus(currentConsultant.id, template.id)?.fileName"
            class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"
          >
            <i class="bi bi-paperclip mr-1"></i>
            {{ getConsultantDocumentStatus(currentConsultant.id, template.id)?.fileName }}
          </div>

          <div
            v-if="getConsultantDocumentStatus(currentConsultant.id, template.id)?.revisionNote"
            class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"
          >
            <strong>Revize Notu:</strong>
            {{ getConsultantDocumentStatus(currentConsultant.id, template.id)?.revisionNote }}
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              @click="downloadTemplate(template)"
            >
              İndir
            </button>

            <label class="cursor-pointer rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
              Dosya Yükle
              <input
                type="file"
                class="hidden"
                @change="handleUpload(template, $event)"
              />
            </label>

            <button
              v-if="getConsultantDocumentStatus(currentConsultant.id, template.id)"
              type="button"
              class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
              @click="sendToApproval(getConsultantDocumentStatus(currentConsultant.id, template.id))"
            >
              Onaya Gönder
            </button>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="activeTab === 'sablon'"
      class="space-y-6"
    >
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="grid gap-4 xl:grid-cols-[1fr_260px]">
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Şablon Ara
            </label>
            <input
              v-model="search"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Konut kira, ticari kira, yer gösterme, teklif..."
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Kategori
            </label>
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

      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="template in filteredBusinessTemplates"
          :key="template.id"
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {{ template.category }}
          </p>

          <h3 class="mt-2 text-lg font-bold text-slate-900">
            {{ template.title }}
          </h3>

          <p class="mt-2 text-sm leading-6 text-slate-500">
            {{ template.description }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {{ template.fileType }}
            </span>

            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="template.mobileEditable ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
            >
              {{ template.mobileEditable ? 'Mobil uyumlu' : 'Sadece indir' }}
            </span>
          </div>

          <button
            type="button"
            class="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            @click="downloadTemplate(template)"
          >
            Şablonu İndir
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
