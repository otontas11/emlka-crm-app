<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeNotifications } from '~/composables/useOfficeNotifications'

const { consultants, announcements } = useOffice()

const {
  createOfficeAnnouncement,
  deleteAnnouncementWithNotifications,
  recipientSummary,
  recipientList,
  syncAnnouncementNotifications,
} = useOfficeNotifications()

syncAnnouncementNotifications()

const selectedAnnouncementId = ref(null)
const isTrackingOpen = ref(false)
const successMessage = ref('')

const form = ref({
  title: '',
  type: 'Duyuru',
  audience: 'Tüm Ofis',
  date: 'Bugün',
  priority: 'Normal',
  status: 'Yayınlandı',
  description: '',
  channels: ['Sistem İçi'],
  requiresConfirmation: false,
  selectedConsultantIds: [],
})

const typeOptions = [
  'Duyuru',
  'Oryantasyon',
  'Evrak',
  'Toplantı',
  'Eğitim',
  'Nöbet',
  'Başarı',
  'Yeni Portföy',
  'Kural',
  'Acil',
]

const audienceOptions = [
  'Tüm Ofis',
  'Aktif Danışmanlar',
  'Aday Danışmanlar',
  'SGK’lı Danışmanlar',
  'Bağ-Kur’lu Danışmanlar',
  'Belirli Danışmanlar',
  'Yönetim',
]

const priorityOptions = [
  'Normal',
  'Önemli',
  'Acil',
]

const channelOptions = [
  'Sistem İçi',
  'Mobil Bildirim',
  'WhatsApp Mesajı Hazırla',
]

const statusOptions = [
  'Yayınlandı',
  'Taslak',
]

const selectedAnnouncement = computed(() => {
  return announcements.value.find(item => String(item.id) === String(selectedAnnouncementId.value))
})

const selectedRecipients = computed(() => {
  if (!selectedAnnouncementId.value) return []
  return recipientList(selectedAnnouncementId.value)
})

const createAnnouncement = () => {
  if (!form.value.title.trim()) {
    alert('Duyuru başlığı zorunludur.')
    return
  }

  if (!form.value.channels.length) {
    alert('En az bir bildirim kanalı seçilmelidir.')
    return
  }

  if (form.value.audience === 'Belirli Danışmanlar' && !form.value.selectedConsultantIds.length) {
    alert('Belirli danışmanlar seçildiğinde en az bir danışman seçilmelidir.')
    return
  }

  const created = createOfficeAnnouncement(form.value)
  syncAnnouncementNotifications()

  selectedAnnouncementId.value = created.id

  successMessage.value = created.status === 'Yayınlandı'
    ? 'Duyuru yayınlandı ve hedef danışmanlara bildirim kaydı oluşturuldu.'
    : 'Duyuru taslak olarak kaydedildi.'

  form.value = {
    title: '',
    type: 'Duyuru',
  audience: 'Tüm Ofis',
    date: 'Bugün',
    priority: 'Normal',
    status: 'Yayınlandı',
    description: '',
    channels: ['Sistem İçi'],
    requiresConfirmation: false,
    selectedConsultantIds: [],
  }

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const removeAnnouncement = (id) => {
  deleteAnnouncementWithNotifications(id)

  if (String(selectedAnnouncementId.value) === String(id)) {
    selectedAnnouncementId.value = null
    isTrackingOpen.value = false
  }
}

const openTracking = (item) => {
  syncAnnouncementNotifications()
  selectedAnnouncementId.value = item.id
  isTrackingOpen.value = true
}

const closeTracking = () => {
  isTrackingOpen.value = false
}

const summaryFor = (id) => {
  return recipientSummary(id)
}

const priorityClass = (priority) => {
  if (priority === 'Acil') return 'bg-slate-900 text-white'
  if (priority === 'Önemli') return 'bg-slate-200 text-slate-800'
  return 'bg-slate-100 text-slate-700'
}

const statusClass = (status) => {
  if (status === 'Yayınlandı') return 'bg-slate-900 text-white'
  return 'bg-slate-100 text-slate-700'
}

const typeClass = (type) => {
  if (type === 'Toplantı') return 'bi-people'
  if (type === 'Eğitim') return 'bi-mortarboard'
  if (type === 'Nöbet') return 'bi-calendar-check'
  if (type === 'Başarı') return 'bi-trophy'
  if (type === 'Yeni Portföy') return 'bi-building-add'
  if (type === 'Kural') return 'bi-shield-check'
  if (type === 'Acil') return 'bi-exclamation-circle'
  if (type === 'Evrak') return 'bi-folder2-open'
  if (type === 'Oryantasyon') return 'bi-list-check'
  return 'bi-megaphone'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Ofis İletişim Merkezi
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Duyuru ve Bildirim Yönetimi
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Broker duyuru yayınlar, sistem hedef danışmanlara bildirim kaydı oluşturur. Danışman okudu/onayladı bilgisini kendi panelinden işaretler.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/office/notifications"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <i class="bi bi-bell mr-2"></i>
            Bildirim Merkezi
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

    <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Yeni Duyuru Oluştur
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Yayınlanan duyurular danışman paneline bildirim olarak düşer.
          </p>
        </div>

        <div class="grid gap-4 p-6">
          <UiInput
            v-model="form.title"
            label="Duyuru Başlığı"
            variant="outline"
            size="sm"
            placeholder="Örn: Pazartesi toplantısı saat 10:00’da yapılacaktır."
          />

          <div class="grid gap-4 md:grid-cols-2">
            <UiSelect
              v-model="form.type"
              label="Duyuru Türü"
              variant="outline"
              size="sm"
            >
              <option v-for="item in typeOptions" :key="item">
                {{ item }}
              </option>
            </UiSelect>

            <UiSelect
              v-model="form.audience"
              label="Hedef Kitle"
              variant="outline"
              size="sm"
            >
              <option v-for="item in audienceOptions" :key="item">
                {{ item }}
              </option>
            </UiSelect>

            <UiSelect
              v-model="form.priority"
              label="Öncelik"
              variant="outline"
              size="sm"
            >
              <option v-for="item in priorityOptions" :key="item">
                {{ item }}
              </option>
            </UiSelect>

            <UiSelect
              v-model="form.status"
              label="Durum"
              variant="outline"
              size="sm"
            >
              <option v-for="item in statusOptions" :key="item">
                {{ item }}
              </option>
            </UiSelect>
          </div>

          <UiInput
            v-model="form.date"
            label="Tarih"
            variant="outline"
            size="sm"
            placeholder="Bugün, Yarın, Bu hafta..."
          />

          <div v-if="form.audience === 'Belirli Danışmanlar'" class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <label class="mb-3 block text-sm font-semibold text-slate-700">
              Danışman Seç
            </label>

            <div class="grid gap-3 sm:grid-cols-2">
              <label
                v-for="item in consultants"
                :key="item.id"
                class="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3 text-sm font-semibold text-slate-700"
              >
                <input
                  v-model="form.selectedConsultantIds"
                  type="checkbox"
                  :value="item.id"
                  class="h-4 w-4"
                />
                <span>{{ item.fullName }}</span>
              </label>
            </div>
          </div>

          <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <label class="mb-3 block text-sm font-semibold text-slate-700">
              Bildirim Kanalları
            </label>

            <div class="grid gap-3 md:grid-cols-3">
              <label
                v-for="item in channelOptions"
                :key="item"
                class="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3 text-sm font-semibold text-slate-700"
              >
                <input
                  v-model="form.channels"
                  type="checkbox"
                  :value="item"
                  class="h-4 w-4"
                />
                <span>{{ item }}</span>
              </label>
            </div>

            <p class="mt-3 text-xs leading-5 text-slate-500">
              Mobil bildirim ve WhatsApp şu an prototipte gönderim kuyruğu/taslak olarak gösterilir. Gerçek gönderim backend ve mobil uygulama entegrasyonunda aktif edilecektir.
            </p>
          </div>

          <label class="flex cursor-pointer items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
            <input
              v-model="form.requiresConfirmation"
              type="checkbox"
              class="h-4 w-4"
            />
            <span>Bu duyuru için danışman onayı zorunlu olsun</span>
          </label>

          <UiTextarea
            v-model="form.description"
            label="Açıklama"
            :rows="5"
            variant="outline"
            size="sm"
            placeholder="Duyuru detayını yazın..."
          />

          <UiButton
            variant="primary"
            shape="rounded"
            icon="bi-megaphone"
            block
            @click="createAnnouncement"
          >
            Duyuruyu Yayınla
          </UiButton>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Yayındaki Duyurular
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ announcements.length }} duyuru listeleniyor
          </p>
        </div>

        <div v-if="announcements.length === 0" class="p-8 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
            <i class="bi bi-megaphone"></i>
          </div>
          <h3 class="mt-4 text-lg font-bold text-slate-900">
            Henüz duyuru yok
          </h3>
          <p class="mt-2 text-sm text-slate-500">
            İlk duyuruyu sol taraftaki formdan oluşturabilirsiniz.
          </p>
        </div>

        <div v-else class="space-y-4 p-6">
          <div
            v-for="item in announcements"
            :key="item.id"
            class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl text-slate-700 shadow-sm">
                  <i class="bi" :class="typeClass(item.type)"></i>
                </div>

                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {{ item.type || 'Duyuru' }}
                    </span>

                    <span
                      class="rounded-full px-3 py-1 text-xs font-semibold"
                      :class="priorityClass(item.priority)"
                    >
                      {{ item.priority || 'Normal' }}
                    </span>

                    <span
                      class="rounded-full px-3 py-1 text-xs font-semibold"
                      :class="statusClass(item.status || 'Yayınlandı')"
                    >
                      {{ item.status || 'Yayınlandı' }}
                    </span>

                    <span class="text-xs text-slate-400">
                      {{ item.date || 'Bugün' }}
                    </span>
                  </div>

                  <h3 class="mt-3 font-bold text-slate-900">
                    {{ item.title }}
                  </h3>

                  <p v-if="item.description" class="mt-2 text-sm leading-6 text-slate-500">
                    {{ item.description }}
                  </p>

                  <div class="mt-4 grid gap-2 sm:grid-cols-4">
                    <div class="rounded-2xl bg-white p-3 text-center">
                      <p class="text-xs text-slate-400">Hedef</p>
                      <p class="mt-1 font-bold text-slate-900">{{ summaryFor(item.id).total }}</p>
                    </div>

                    <div class="rounded-2xl bg-white p-3 text-center">
                      <p class="text-xs text-slate-400">Okundu</p>
                      <p class="mt-1 font-bold text-slate-900">{{ summaryFor(item.id).read }}</p>
                    </div>

                    <div class="rounded-2xl bg-white p-3 text-center">
                      <p class="text-xs text-slate-400">Okunmadı</p>
                      <p class="mt-1 font-bold text-slate-900">{{ summaryFor(item.id).unread }}</p>
                    </div>

                    <div class="rounded-2xl bg-white p-3 text-center">
                      <p class="text-xs text-slate-400">Onay</p>
                      <p class="mt-1 font-bold text-slate-900">{{ summaryFor(item.id).confirmed }}</p>
                    </div>
                  </div>

                  <p class="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Hedef: {{ item.audience || 'Tüm Ofis' }} · Kanallar: {{ item.channels?.join(', ') || 'Sistem İçi' }}
                  </p>
                </div>
              </div>

              <div class="flex shrink-0 flex-col gap-2">
                <UiButton
                  variant="primary"
                  size="sm"
                  shape="rounded"
                  @click="openTracking(item)"
                >
                  Takip
                </UiButton>

                <UiButton
                  variant="secondary"
                  size="sm"
                  shape="rounded"
                  @click="removeAnnouncement(item.id)"
                >
                  Sil
                </UiButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div
      v-if="isTrackingOpen && selectedAnnouncement"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
    >
      <section class="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div class="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Duyuru Takip Paneli
            </p>
            <h2 class="mt-2 text-2xl font-bold text-slate-900">
              {{ selectedAnnouncement.title }}
            </h2>
            <p class="mt-2 text-sm text-slate-500">
              Hedef: {{ selectedAnnouncement.audience || 'Tüm Ofis' }} · Kanallar: {{ selectedAnnouncement.channels?.join(', ') || 'Sistem İçi' }}
            </p>
          </div>

          <button
            type="button"
            class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="closeTracking"
          >
            Kapat
          </button>
        </div>

        <div class="grid gap-4 border-b border-slate-200 bg-slate-50 p-6 sm:grid-cols-4">
          <div class="rounded-3xl bg-white p-5 text-center shadow-sm">
            <p class="text-sm text-slate-500">Hedef</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ summaryFor(selectedAnnouncement.id).total }}</p>
          </div>

          <div class="rounded-3xl bg-white p-5 text-center shadow-sm">
            <p class="text-sm text-slate-500">Okundu</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ summaryFor(selectedAnnouncement.id).read }}</p>
          </div>

          <div class="rounded-3xl bg-white p-5 text-center shadow-sm">
            <p class="text-sm text-slate-500">Okunmadı</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ summaryFor(selectedAnnouncement.id).unread }}</p>
          </div>

          <div class="rounded-3xl bg-white p-5 text-center shadow-sm">
            <p class="text-sm text-slate-500">Onay</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ summaryFor(selectedAnnouncement.id).confirmed }}</p>
          </div>
        </div>

        <div v-if="selectedRecipients.length === 0" class="p-8 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
            <i class="bi bi-people"></i>
          </div>

          <h3 class="mt-4 text-lg font-bold text-slate-900">
            Hedef danışman kaydı yok
          </h3>

          <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Bu duyuru taslak olabilir veya hedef danışman bildirimi henüz oluşturulmamış olabilir.
          </p>
        </div>

        <div v-else class="max-h-[48vh] overflow-auto">
          <table class="min-w-full divide-y divide-slate-200 text-sm">
            <thead class="sticky top-0 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-6 py-4">Danışman</th>
                <th class="px-6 py-4">Okundu</th>
                <th class="px-6 py-4">Onay</th>
                <th class="px-6 py-4">Sistem</th>
                <th class="px-6 py-4">Mobil</th>
                <th class="px-6 py-4">WhatsApp</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 bg-white">
              <tr
                v-for="item in selectedRecipients"
                :key="item.id"
                class="transition hover:bg-slate-50"
              >
                <td class="px-6 py-4">
                  <p class="font-semibold text-slate-900">{{ item.consultantName }}</p>
                  <p class="mt-1 text-xs text-slate-400">Bildirim ID: {{ item.id }}</p>
                </td>

                <td class="px-6 py-4">
                  <span
                    class="rounded-full px-3 py-1 text-xs font-semibold"
                    :class="item.isRead ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'"
                  >
                    {{ item.isRead ? 'Okundu' : 'Okunmadı' }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <span
                    class="rounded-full px-3 py-1 text-xs font-semibold"
                    :class="item.isConfirmed ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'"
                  >
                    {{ item.isConfirmed ? 'Onaylandı' : 'Bekliyor' }}
                  </span>
                </td>

                <td class="px-6 py-4 text-slate-500">{{ item.systemStatus }}</td>
                <td class="px-6 py-4 text-slate-500">{{ item.mobileStatus }}</td>
                <td class="px-6 py-4 text-slate-500">{{ item.whatsappStatus }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>





