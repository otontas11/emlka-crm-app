<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeMeetings } from '~/composables/useOfficeMeetings'

const { consultants } = useOffice()

const {
  meetings,
  hydrateMeetings,
  createMeeting,
  updateMeeting,
  updateAttendance,
  deleteMeeting,
  completeMeeting,
  meetingStats,
  getConsultantAttendanceSummary,
} = useOfficeMeetings()

hydrateMeetings()

const search = ref('')
const statusFilter = ref('Tümü')
const typeFilter = ref('Tümü')
const showForm = ref(false)
const successMessage = ref('')
const selectedConsultantIds = ref([])

const form = reactive({
  title: '',
  meetingType: 'Haftalık Toplantı',
  date: new Date().toISOString().slice(0, 10),
  startTime: '10:00',
  endTime: '11:00',
  location: 'Ofis',
  status: 'Planlandı',
  agenda: '',
  note: '',
})

const meetingTypeOptions = [
  'Haftalık Toplantı',
  'Aylık Değerlendirme',
  'Eğitim Toplantısı',
  'Pipeline Toplantısı',
  'Bölge Toplantısı',
  'Acil Toplantı',
]

const meetingStatusOptions = [
  'Planlandı',
  'Devam Ediyor',
  'Tamamlandı',
  'İptal',
]

const attendanceStatusOptions = [
  'Bekliyor',
  'Katıldı',
  'Katılmadı',
  'Mazeretli',
]

const activeConsultants = computed(() => {
  return consultants.value.filter(item => item.status !== 'Ayrıldı')
})

const filteredMeetings = computed(() => {
  let list = meetings.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.title,
        item.meetingType,
        item.location,
        item.agenda,
        item.note,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (typeFilter.value !== 'Tümü') {
    list = list.filter(item => item.meetingType === typeFilter.value)
  }

  return list
})

const consultantSummaries = computed(() => {
  return activeConsultants.value.map((consultant) => {
    return {
      consultant,
      ...getConsultantAttendanceSummary(consultant.id),
    }
  }).sort((a, b) => b.rate - a.rate)
})

const selectAllConsultants = () => {
  selectedConsultantIds.value = activeConsultants.value.map(item => item.id)
}

const clearConsultantSelection = () => {
  selectedConsultantIds.value = []
}

const resetForm = () => {
  form.title = ''
  form.meetingType = 'Haftalık Toplantı'
  form.date = new Date().toISOString().slice(0, 10)
  form.startTime = '10:00'
  form.endTime = '11:00'
  form.location = 'Ofis'
  form.status = 'Planlandı'
  form.agenda = ''
  form.note = ''
  selectedConsultantIds.value = []
}

const saveMeeting = () => {
  if (!form.title || selectedConsultantIds.value.length === 0) {
    successMessage.value = 'Toplantı başlığı ve katılımcı danışman seçimi zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  const attendees = activeConsultants.value
    .filter(item => selectedConsultantIds.value.includes(item.id))
    .map(item => ({
      consultantId: item.id,
      consultantName: item.fullName,
      status: 'Bekliyor',
      note: '',
    }))

  createMeeting({
    ...form,
    attendees,
  })

  successMessage.value = 'Toplantı ve yoklama listesi oluşturuldu.'
  showForm.value = false
  resetForm()

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'Tümü'
  typeFilter.value = 'Tümü'
}

const markAllAttended = (meeting) => {
  meeting.attendees.forEach((attendee) => {
    updateAttendance(meeting.id, attendee.consultantId, 'status', 'Katıldı')
  })

  successMessage.value = 'Tüm katılımcılar katıldı olarak işaretlendi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const completeMeetingProcess = (meeting) => {
  completeMeeting(meeting.id)

  successMessage.value = 'Toplantı tamamlandı.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const confirmDelete = (meeting) => {
  if (confirm(`${meeting.title} toplantısını silmek istiyor musunuz?`)) {
    deleteMeeting(meeting.id)
  }
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Devam Ediyor') return 'bg-slate-700 text-white'
  if (status === 'Planlandı') return 'bg-slate-100 text-slate-700'
  if (status === 'İptal') return 'bg-white text-slate-500 border border-slate-200'
  return 'bg-slate-100 text-slate-700'
}

const attendanceClass = (status) => {
  if (status === 'Katıldı') return 'bg-slate-900 text-white'
  if (status === 'Katılmadı') return 'bg-slate-700 text-white'
  if (status === 'Mazeretli') return 'bg-slate-200 text-slate-800'
  return 'bg-white text-slate-700 border border-slate-200'
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
            Toplantı / Yoklama
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Ofis toplantılarını planlayın, katılımcı danışmanları seçin ve toplantı katılım durumlarını düzenli olarak takip edin.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/office"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Ofis Paneline Dön
          </NuxtLink>

          <UiButton
            variant="primary"
            shape="rounded"
            icon="bi-plus-lg"
            @click="showForm = !showForm"
          >
            Yeni Toplantı
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

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplantı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ meetingStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Planlanan</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ meetingStats.planned }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tamamlanan</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ meetingStats.completed }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Katıldı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ meetingStats.attended }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Katılmadı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ meetingStats.absent }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Bekliyor</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ meetingStats.waiting }}</p>
      </div>
    </section>

    <section
      v-if="showForm"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">
          Yeni Toplantı Oluştur
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Toplantı bilgilerini girin ve katılımcı danışmanları seçin.
        </p>
      </div>

      <div class="grid gap-4 xl:grid-cols-4">
        <UiInput
          v-model="form.title"
          label="Toplantı Başlığı"
          variant="outline"
          size="sm"
          class="xl:col-span-2"
          placeholder="Haftalık ofis toplantısı"
        />

        <UiSelect
          v-model="form.meetingType"
          label="Toplantı Türü"
          variant="outline"
          size="sm"
        >
          <option
            v-for="item in meetingTypeOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiSelect
          v-model="form.status"
          label="Durum"
          variant="outline"
          size="sm"
        >
          <option
            v-for="item in meetingStatusOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiInput
          v-model="form.date"
          label="Tarih"
          type="date"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-model="form.startTime"
          label="Başlangıç"
          type="time"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-model="form.endTime"
          label="Bitiş"
          type="time"
          variant="outline"
          size="sm"
        />

        <UiInput
          v-model="form.location"
          label="Lokasyon"
          variant="outline"
          size="sm"
          placeholder="Ofis"
        />
      </div>

      <div class="mt-4 grid gap-4 xl:grid-cols-2">
        <UiTextarea
          v-model="form.agenda"
          label="Toplantı Gündemi"
          :rows="4"
          variant="outline"
          size="sm"
          placeholder="Toplantı gündem maddeleri..."
        />

        <UiTextarea
          v-model="form.note"
          label="Broker Notu"
          :rows="4"
          variant="outline"
          size="sm"
          placeholder="Toplantı notu..."
        />
      </div>

      <div class="mt-6 rounded-3xl bg-slate-50 p-5">
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="font-bold text-slate-900">Katılımcı Danışmanlar</h3>
            <p class="mt-1 text-sm text-slate-500">
              {{ selectedConsultantIds.length }} danışman seçildi
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <UiButton
              variant="primary"
              size="sm"
              shape="rounded"
              @click="selectAllConsultants"
            >
              Tümünü Seç
            </UiButton>

            <UiButton
              variant="secondary"
              size="sm"
              shape="rounded"
              @click="clearConsultantSelection"
            >
              Temizle
            </UiButton>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label
            v-for="consultant in activeConsultants"
            :key="consultant.id"
            class="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700"
          >
            <input
              v-model="selectedConsultantIds"
              type="checkbox"
              :value="consultant.id"
            />
            <span>{{ consultant.fullName }}</span>
          </label>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <UiButton
          variant="primary"
          shape="rounded"
          @click="saveMeeting"
        >
          Toplantıyı Kaydet
        </UiButton>

        <UiButton
          variant="secondary"
          shape="rounded"
          @click="showForm = false"
        >
          Vazgeç
        </UiButton>
      </div>
    </section>

    <section
      v-if="consultantSummaries.length"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="mb-5">
        <h2 class="text-xl font-bold text-slate-900">
          Danışman Katılım Özeti
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Danışman bazlı toplantı katılım oranları.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in consultantSummaries"
          :key="item.consultant.id"
          class="rounded-3xl bg-slate-50 p-5"
        >
          <p class="font-bold text-slate-900">{{ item.consultant.fullName }}</p>
          <p class="mt-1 text-xs text-slate-500">
            {{ item.attended }} katıldı · {{ item.absent }} katılmadı · {{ item.excused }} mazeretli
          </p>

          <div class="mt-4">
            <div class="mb-2 flex justify-between text-xs text-slate-500">
              <span>Katılım oranı</span>
              <span>%{{ item.rate }}</span>
            </div>

            <div class="h-2 overflow-hidden rounded-full bg-white">
              <div
                class="h-full rounded-full bg-slate-900"
                :style="{ width: progressWidth(item.rate) }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_220px_140px]">
        <UiInput
          v-model="search"
          label="Arama"
          variant="outline"
          size="sm"
          placeholder="Toplantı, gündem, lokasyon ara..."
        />

        <UiSelect
          v-model="statusFilter"
          label="Durum"
          variant="outline"
          size="sm"
        >
          <option>Tümü</option>
          <option
            v-for="item in meetingStatusOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <UiSelect
          v-model="typeFilter"
          label="Toplantı Türü"
          variant="outline"
          size="sm"
        >
          <option>Tümü</option>
          <option
            v-for="item in meetingTypeOptions"
            :key="item"
          >
            {{ item }}
          </option>
        </UiSelect>

        <div class="flex items-end">
          <UiButton
            variant="secondary"
            shape="rounded"
            block
            @click="clearFilters"
          >
            Temizle
          </UiButton>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Toplantı Listesi
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ filteredMeetings.length }} toplantı listeleniyor
        </p>
      </div>

      <div class="space-y-5 p-6">
        <div
          v-for="meeting in filteredMeetings"
          :key="meeting.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ meeting.meetingType }}
                </span>

                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusClass(meeting.status)"
                >
                  {{ meeting.status }}
                </span>
              </div>

              <h3 class="mt-3 text-xl font-bold text-slate-900">
                {{ meeting.title }}
              </h3>

              <p class="mt-2 text-sm text-slate-500">
                {{ meeting.date }} · {{ meeting.startTime }} - {{ meeting.endTime }} · {{ meeting.location }}
              </p>

              <p v-if="meeting.agenda" class="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
                {{ meeting.agenda }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <UiButton
                variant="secondary"
                size="sm"
                shape="rounded"
                @click="markAllAttended(meeting)"
              >
                Tümünü Katıldı Yap
              </UiButton>

              <UiButton
                variant="primary"
                size="sm"
                shape="rounded"
                @click="completeMeetingProcess(meeting)"
              >
                Tamamla
              </UiButton>

              <UiButton
                variant="secondary"
                size="sm"
                shape="rounded"
                @click="confirmDelete(meeting)"
              >
                Sil
              </UiButton>
            </div>
          </div>

          <div class="mt-5 overflow-x-auto">
            <table class="w-full min-w-[900px] text-left text-sm">
              <thead class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th class="px-4 py-3">Danışman</th>
                  <th class="px-4 py-3">Katılım</th>
                  <th class="px-4 py-3">Not</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-200">
                <tr
                  v-for="attendee in meeting.attendees"
                  :key="attendee.consultantId"
                >
                  <td class="px-4 py-4 font-semibold text-slate-900">
                    {{ attendee.consultantName }}
                  </td>

                  <td class="px-4 py-4">
                    <select
                      :value="attendee.status"
                      class="rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-slate-500"
                      :class="attendanceClass(attendee.status)"
                      @change="updateAttendance(meeting.id, attendee.consultantId, 'status', $event.target.value)"
                    >
                      <option
                        v-for="item in attendanceStatusOptions"
                        :key="item"
                      >
                        {{ item }}
                      </option>
                    </select>
                  </td>

                  <td class="px-4 py-4">
                    <input
                      :value="attendee.note"
                      type="text"
                      class="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-500"
                      placeholder="Katılım notu..."
                      @input="updateAttendance(meeting.id, attendee.consultantId, 'note', $event.target.value)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-5">
            <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Toplantı Notu
            </label>
            <textarea
              :value="meeting.note"
              rows="3"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Toplantı sonucu / kararlar..."
              @input="updateMeeting(meeting.id, 'note', $event.target.value)"
            ></textarea>
          </div>
        </div>

        <div
          v-if="!filteredMeetings.length"
          class="p-10 text-center"
        >
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
            <i class="bi bi-clipboard-check"></i>
          </div>

          <h3 class="mt-4 text-lg font-bold text-slate-900">
            Toplantı bulunamadı
          </h3>

          <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Yeni toplantı oluşturarak yoklama sürecini başlatabilirsiniz.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
