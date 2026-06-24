<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeTraining } from '~/composables/useOfficeTraining'

const { consultants } = useOffice()

const {
  trainings,
  assignments,
  createTraining,
  assignTraining,
  updateAssignmentStatus,
  updateAssignmentField,
  deleteAssignment,
  getAssignmentsByConsultant,
  completionPercent,
  waitingCount,
  sendTrainingReminder,
  trainingStats,
} = useOfficeTraining()

const selectedConsultantId = ref(consultants.value[0]?.id || null)
const selectedTrainingId = ref(trainings.value[0]?.id || null)
const selectedConsultantIds = ref([])
const dueDate = ref('')
const successMessage = ref('')
const search = ref('')
const statusFilter = ref('Tümü')
const categoryFilter = ref('Tümü')

const trainingForm = ref({
  title: '',
  category: 'Genel',
  level: 'Başlangıç',
  duration: '',
  format: 'Doküman',
  description: '',
  documentUrl: '',
  videoUrl: '',
  isRequired: false,
})

const selectedConsultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(selectedConsultantId.value))
})

const categories = computed(() => {
  return [...new Set(trainings.value.map(item => item.category))]
})

const filteredConsultants = computed(() => {
  let list = consultants.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.fullName,
        item.code,
        item.status,
        item.workType,
        item.expertiseArea,
        item.expertiseRegion,
      ]
        .filter(Boolean)
        .some(value => String(value).toLocaleLowerCase('tr-TR').includes(q))
    })
  }

  return list
})

watch(
  filteredConsultants,
  (list) => {
    if (!list.length) {
      selectedConsultantId.value = null
      return
    }

    const selectedStillVisible = list.some(item => String(item.id) === String(selectedConsultantId.value))

    if (!selectedStillVisible) {
      selectedConsultantId.value = list[0].id
    }
  },
  { immediate: true }
)

const selectedAssignments = computed(() => {
  if (!selectedConsultantId.value) return []

  let list = getAssignmentsByConsultant(selectedConsultantId.value)

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (categoryFilter.value !== 'Tümü') {
    list = list.filter(item => item.category === categoryFilter.value)
  }

  return list
})

const createNewTraining = () => {
  if (!trainingForm.value.title.trim()) {
    alert('Eğitim başlığı zorunludur.')
    return
  }

  createTraining(trainingForm.value)

  trainingForm.value = {
    title: '',
    category: 'Genel',
    level: 'Başlangıç',
    duration: '',
    format: 'Doküman',
    description: '',
    documentUrl: '',
    videoUrl: '',
    isRequired: false,
  }

  successMessage.value = 'Yeni eğitim kütüphaneye eklendi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const assignSelectedTraining = () => {
  if (!selectedTrainingId.value) {
    alert('Eğitim seçiniz.')
    return
  }

  if (!selectedConsultantIds.value.length) {
    alert('En az bir danışman seçiniz.')
    return
  }

  const count = assignTraining({
    trainingId: selectedTrainingId.value,
    consultantIds: selectedConsultantIds.value,
    dueDate: dueDate.value,
  })

  successMessage.value = count > 0
    ? `${count} eğitim ataması oluşturuldu.`
    : 'Seçilen eğitim bu danışmanlara daha önce atanmış olabilir.'

  selectedConsultantIds.value = []
  dueDate.value = ''

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const sendReminder = () => {
  if (!selectedConsultantId.value) return

  successMessage.value = sendTrainingReminder(selectedConsultantId.value)

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'Tümü'
  categoryFilter.value = 'Tümü'
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Devam Ediyor') return 'bg-slate-200 text-slate-800'
  return 'bg-white text-slate-700 border border-slate-200'
}

const levelClass = (level) => {
  if (level === 'İleri') return 'bg-slate-900 text-white'
  if (level === 'Orta') return 'bg-slate-200 text-slate-800'
  return 'bg-slate-100 text-slate-700'
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
            Eğitim ve Dokümantasyon Merkezi
          </h1>
          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Ofis eğitimlerini oluşturun, danışmanlara eğitim atayın, tamamlanma durumunu takip edin ve eğitim hatırlatması gönderin.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/consultant/trainings"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <i class="bi bi-mortarboard mr-2"></i>
            Danışman Eğitimleri
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
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-check2-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Eğitim Kütüphanesi</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ trainingStats.totalTrainings }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam Atama</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ trainingStats.totalAssignments }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tamamlandı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ trainingStats.completed }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Devam Ediyor</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ trainingStats.inProgress }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Bekliyor</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ trainingStats.waiting }}</p>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Yeni Eğitim Ekle
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Ofis eğitim kütüphanesine yeni doküman, video veya sunum ekleyin.
          </p>
        </div>

        <div class="grid gap-4 p-6">
          <input
            v-model="trainingForm.title"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Eğitim başlığı"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <select
              v-model="trainingForm.category"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            >
              <option>Genel</option>
              <option>Oryantasyon</option>
              <option>Portföy</option>
              <option>Saha</option>
              <option>Pazarlama</option>
              <option>Ticari Gayrimenkul</option>
              <option>Hukuk</option>
              <option>CRM Kullanımı</option>
            </select>

            <select
              v-model="trainingForm.level"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            >
              <option>Başlangıç</option>
              <option>Orta</option>
              <option>İleri</option>
            </select>

            <input
              v-model="trainingForm.duration"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Süre: 45 dk"
            />

            <select
              v-model="trainingForm.format"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            >
              <option>Doküman</option>
              <option>Video</option>
              <option>Sunum</option>
              <option>Doküman + Video</option>
            </select>
          </div>

          <textarea
            v-model="trainingForm.description"
            rows="4"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Eğitim açıklaması..."
          ></textarea>

          <div class="grid gap-4 md:grid-cols-2">
            <input
              v-model="trainingForm.documentUrl"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Doküman linki"
            />

            <input
              v-model="trainingForm.videoUrl"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Video linki"
            />
          </div>

          <label class="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
            <input v-model="trainingForm.isRequired" type="checkbox" class="h-4 w-4" />
            <span>Zorunlu eğitim olarak işaretle</span>
          </label>

          <button
            type="button"
            class="rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
            @click="createNewTraining"
          >
            Eğitimi Kütüphaneye Ekle
          </button>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Eğitim Atama
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Bir eğitimi bir veya birden fazla danışmana atayın.
          </p>
        </div>

        <div class="grid gap-4 p-6">
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Eğitim Seç
            </label>
            <select
              v-model="selectedTrainingId"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            >
              <option
                v-for="item in trainings"
                :key="item.id"
                :value="item.id"
              >
                {{ item.title }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Son Tarih
            </label>
            <input
              v-model="dueDate"
              type="date"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <label class="mb-3 block text-sm font-semibold text-slate-700">
              Danışman Seç
            </label>

            <div class="grid max-h-[320px] gap-3 overflow-auto sm:grid-cols-2">
              <label
                v-for="item in consultants"
                :key="item.id"
                class="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3 text-sm font-semibold text-slate-700"
              >
                <input
                  v-model="selectedConsultantIds"
                  type="checkbox"
                  :value="item.id"
                  class="h-4 w-4"
                />
                <span>{{ item.fullName }}</span>
              </label>
            </div>
          </div>

          <button
            type="button"
            class="rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
            @click="assignSelectedTraining"
          >
            Seçili Danışmanlara Ata
          </button>
        </div>
      </section>
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_220px_120px]">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Danışman Ara
          </label>
          <div class="relative">
            <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="search"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-500"
              placeholder="Ad, kod, uzmanlık veya bölge ara..."
            />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Eğitim Durumu
          </label>
          <select
            v-model="statusFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option>Bekliyor</option>
            <option>Devam Ediyor</option>
            <option>Tamamlandı</option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Kategori
          </label>
          <select
            v-model="categoryFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option v-for="item in categories" :key="item">{{ item }}</option>
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

    <div class="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Danışman Eğitim Listesi
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ filteredConsultants.length }} danışman listeleniyor
          </p>
        </div>

        <div class="max-h-[760px] space-y-3 overflow-auto p-4">
          <button
            v-for="item in filteredConsultants"
            :key="item.id"
            type="button"
            class="w-full rounded-3xl border p-4 text-left transition hover:bg-slate-50"
            :class="String(selectedConsultantId) === String(item.id)
              ? 'border-slate-900 bg-slate-50'
              : 'border-slate-200 bg-white'"
            @click="selectedConsultantId = item.id"
          >
            <p class="font-bold text-slate-900">{{ item.fullName }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ item.code }} · {{ item.expertiseRegion }}</p>

            <div class="mt-4">
              <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>Eğitim Tamamlanma</span>
                <span>%{{ completionPercent(item.id) }}</span>
              </div>

              <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  class="h-full rounded-full bg-slate-900"
                  :style="{ width: completionPercent(item.id) + '%' }"
                ></div>
              </div>
            </div>

            <div class="mt-3 text-xs text-slate-500">
              Bekleyen Eğitim: <strong class="text-slate-900">{{ waitingCount(item.id) }}</strong>
            </div>
          </button>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 class="text-xl font-bold text-slate-900">
                {{ selectedConsultant?.fullName || 'Danışman' }} Eğitimleri
              </h2>
              <p class="mt-1 text-sm text-slate-500">
                {{ selectedAssignments.length }} eğitim listeleniyor
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button
                v-if="waitingCount(selectedConsultantId) > 0"
                type="button"
                class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="sendReminder"
              >
                <i class="bi bi-bell mr-2"></i>
                Hatırlatma Gönder
              </button>

              <div class="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                <p class="text-xs text-slate-500">Tamamlanma</p>
                <p class="text-xl font-bold text-slate-900">%{{ completionPercent(selectedConsultantId) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!selectedAssignments.length" class="p-10 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
            <i class="bi bi-mortarboard"></i>
          </div>

          <h3 class="mt-4 text-lg font-bold text-slate-900">
            Eğitim ataması bulunamadı
          </h3>

          <p class="mt-2 text-sm text-slate-500">
            Üst bölümden danışmana eğitim ataması yapabilirsiniz.
          </p>
        </div>

        <div v-else class="grid gap-4 p-6 xl:grid-cols-2">
          <div
            v-for="item in selectedAssignments"
            :key="item.id"
            class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {{ item.category }} · {{ item.format }}
                </p>
                <h3 class="mt-2 font-bold text-slate-900">
                  {{ item.trainingTitle }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-slate-500">
                  {{ item.description }}
                </p>
              </div>

              <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(item.status)">
                {{ item.status }}
              </span>
            </div>

            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Durum
                </label>
                <select
                  :value="item.status"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  @change="updateAssignmentStatus(item.id, $event.target.value)"
                >
                  <option>Bekliyor</option>
                  <option>Devam Ediyor</option>
                  <option>Tamamlandı</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Puan
                </label>
                <input
                  :value="item.score"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  @input="updateAssignmentField(item.id, 'score', $event.target.value)"
                />
              </div>
            </div>

            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <div class="rounded-2xl bg-white p-3">
                <p class="text-xs text-slate-400">Atama Tarihi</p>
                <p class="mt-1 text-sm font-semibold text-slate-900">{{ item.assignedAt }}</p>
              </div>

              <div class="rounded-2xl bg-white p-3">
                <p class="text-xs text-slate-400">Son Tarih</p>
                <p class="mt-1 text-sm font-semibold text-slate-900">{{ item.dueDate || '-' }}</p>
              </div>
            </div>

            <div class="mt-4">
              <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Broker Notu
              </label>
              <textarea
                :value="item.note"
                rows="3"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                placeholder="Bu eğitimle ilgili not..."
                @input="updateAssignmentField(item.id, 'note', $event.target.value)"
              ></textarea>
            </div>

            <div class="mt-4 flex justify-end">
              <button
                type="button"
                class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="deleteAssignment(item.id)"
              >
                Atamayı Kaldır
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Eğitim Kütüphanesi
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ trainings.length }} eğitim kaydı
        </p>
      </div>

      <div class="grid gap-4 p-6 xl:grid-cols-3">
        <div
          v-for="item in trainings"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {{ item.category }} · {{ item.format }}
              </p>
              <h3 class="mt-2 font-bold text-slate-900">
                {{ item.title }}
              </h3>
            </div>

            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="levelClass(item.level)">
              {{ item.level }}
            </span>
          </div>

          <p class="mt-3 text-sm leading-6 text-slate-500">
            {{ item.description }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
            <span class="rounded-full bg-white px-3 py-1">{{ item.duration || 'Süre yok' }}</span>
            <span v-if="item.isRequired" class="rounded-full bg-white px-3 py-1">Zorunlu</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


