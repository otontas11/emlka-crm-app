<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeNotifications } from '~/composables/useOfficeNotifications'

const { consultants } = useOffice()

const {
  currentUser,
  initAuth,
} = useCrmAuth()

const {
  getConsultantNotifications,
  markNotificationRead,
  confirmNotification,
  syncAnnouncementNotifications,
} = useOfficeNotifications()

initAuth()
syncAnnouncementNotifications()

const currentConsultantId = computed(() => {
  return currentUser.value?.consultantId || null
})

const currentConsultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(currentConsultantId.value))
})

const myNotifications = computed(() => {
  if (!currentConsultantId.value) return []
  return getConsultantNotifications(currentConsultantId.value)
})

const unreadCount = computed(() => {
  return myNotifications.value.filter(item => !item.isRead).length
})

const confirmationWaitingCount = computed(() => {
  return myNotifications.value.filter(item => item.requiresConfirmation && !item.isConfirmed).length
})

const priorityClass = (priority) => {
  if (priority === 'Acil') return 'bg-slate-900 text-white'
  if (priority === 'Önemli') return 'bg-slate-200 text-slate-800'
  return 'bg-slate-100 text-slate-700'
}

const readClass = (item) => {
  return item.isRead
    ? 'bg-slate-100 text-slate-600'
    : 'bg-slate-900 text-white'
}

const typeIcon = (type) => {
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

const openWhatsappDraft = (item) => {
  const text = encodeURIComponent(
`Merhaba,
"${item.title}" duyurusunu gördüm.

Danışman: ${item.consultantName}`
  )

  window.open(`https://wa.me/?text=${text}`, '_blank')
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
            Bana Gelen Duyurular
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Ofis tarafından size gönderilen toplantı, eğitim, nöbet, kural değişikliği ve genel duyuruları buradan takip edebilirsiniz.
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

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Giriş Yapan Danışman
          </p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">
            {{ currentConsultant?.fullName || currentUser?.name || 'Danışman' }}
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ currentConsultant?.code }} · {{ currentConsultant?.workType }} · {{ currentConsultant?.expertiseRegion }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Okunmamış</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ unreadCount }}</p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Onay Bekleyen</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ confirmationWaitingCount }}</p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Bildirimlerim
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ myNotifications.length }} bildirim listeleniyor
        </p>
      </div>

      <div v-if="myNotifications.length === 0" class="p-10 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-bell"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Henüz size gelen duyuru yok
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Broker size duyuru, evrak hatırlatması, eğitim bildirimi veya nöbet bildirimi gönderdiğinde burada görünecek.
        </p>
      </div>

      <div v-else class="space-y-4 p-6">
        <div
          v-for="item in myNotifications"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-sm"
        >
          <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl text-slate-700 shadow-sm">
                <i class="bi" :class="typeIcon(item.type)"></i>
              </div>

              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {{ item.type }}
                  </span>

                  <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="priorityClass(item.priority)">
                    {{ item.priority }}
                  </span>

                  <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="readClass(item)">
                    {{ item.isRead ? 'Okundu' : 'Yeni' }}
                  </span>

                  <span
                    v-if="item.requiresConfirmation"
                    class="rounded-full px-3 py-1 text-xs font-semibold"
                    :class="item.isConfirmed ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'"
                  >
                    {{ item.isConfirmed ? 'Onaylandı' : 'Onay Bekliyor' }}
                  </span>
                </div>

                <h3 class="mt-3 text-lg font-bold text-slate-900">
                  {{ item.title }}
                </h3>

                <p v-if="item.description" class="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
                  {{ item.description }}
                </p>

                <p v-else class="mt-2 text-sm leading-6 text-slate-500">
                  Bu duyuru size ofis yönetimi tarafından gönderildi.
                </p>
              </div>
            </div>

            <div class="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="markNotificationRead(item.id)"
              >
                Okudum
              </button>

              <button
                v-if="item.requiresConfirmation"
                type="button"
                class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="confirmNotification(item.id)"
              >
                Onaylıyorum
              </button>

              <button
                v-if="item.channels?.includes('WhatsApp Mesajı Hazırla')"
                type="button"
                class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="openWhatsappDraft(item)"
              >
                WhatsApp Cevapla
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
