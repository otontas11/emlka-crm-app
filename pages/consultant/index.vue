<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeNotifications } from '~/composables/useOfficeNotifications'
import { useOfficeDocuments } from '~/composables/useOfficeDocuments'
import { useOfficeOrientation } from '~/composables/useOfficeOrientation'
import { useOfficeTraining } from '~/composables/useOfficeTraining'
import { useOfficeDuties } from '~/composables/useOfficeDuties'

const { consultants } = useOffice()

const {
  currentUser,
  initAuth,
  logout,
} = useCrmAuth()

const {
  getConsultantNotifications,
  syncAnnouncementNotifications,
} = useOfficeNotifications()

const {
  ensureDocumentsForConsultants,
  getDocumentsByConsultant,
  completionPercent: documentCompletionPercent,
  missingCount: documentMissingCount,
} = useOfficeDocuments()

const {
  ensureOrientationForConsultants,
  getStepsByConsultant,
  completionPercent: orientationCompletionPercent,
  waitingCount: orientationWaitingCount,
} = useOfficeOrientation()

const {
  getAssignmentsByConsultant,
  completionPercent: trainingCompletionPercent,
  waitingCount: trainingWaitingCount,
} = useOfficeTraining()

const {
  getDutiesByConsultant,
  formatDate,
} = useOfficeDuties()

const router = useRouter()

initAuth()
syncAnnouncementNotifications()
ensureDocumentsForConsultants()
ensureOrientationForConsultants()

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

const myDocuments = computed(() => {
  if (!currentConsultantId.value) return []
  return getDocumentsByConsultant(currentConsultantId.value)
})

const myOrientationSteps = computed(() => {
  if (!currentConsultantId.value) return []
  return getStepsByConsultant(currentConsultantId.value)
})

const myTrainings = computed(() => {
  if (!currentConsultantId.value) return []
  return getAssignmentsByConsultant(currentConsultantId.value)
})

const myDuties = computed(() => {
  if (!currentConsultantId.value) return []
  return getDutiesByConsultant(currentConsultantId.value)
})

const unreadNotifications = computed(() => {
  return myNotifications.value.filter(item => !item.isRead)
})

const confirmationWaiting = computed(() => {
  return myNotifications.value.filter(item => item.requiresConfirmation && !item.isConfirmed)
})

const missingDocuments = computed(() => {
  return myDocuments.value.filter(item => item.status !== 'Tamamlandı')
})

const waitingOrientationSteps = computed(() => {
  return myOrientationSteps.value.filter(item => item.status !== 'Tamamlandı')
})

const waitingTrainings = computed(() => {
  return myTrainings.value.filter(item => item.status !== 'Tamamlandı')
})

const today = computed(() => {
  return new Date().toISOString().slice(0, 10)
})

const upcomingDuties = computed(() => {
  return myDuties.value
    .filter(item => item.date >= today.value && item.status !== 'Tamamlandı' && item.status !== 'Mazeretli')
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
})

const recentNotifications = computed(() => {
  return myNotifications.value.slice(0, 4)
})

const recentTrainings = computed(() => {
  return myTrainings.value.slice(0, 3)
})

const recentDuties = computed(() => {
  return upcomingDuties.value.slice(0, 3)
})

const actionItems = computed(() => {
  const list = []

  if (unreadNotifications.value.length > 0) {
    list.push({
      title: `${unreadNotifications.value.length} okunmamış bildiriminiz var`,
      text: 'Ofisten gelen duyuruları kontrol edin.',
      to: '/consultant/notifications',
      icon: 'bi-bell',
    })
  }

  if (missingDocuments.value.length > 0) {
    list.push({
      title: `${missingDocuments.value.length} eksik evrakınız var`,
      text: 'Dijital evrak dosyanızı tamamlayın.',
      to: '/consultant/documents',
      icon: 'bi-folder2-open',
    })
  }

  if (waitingOrientationSteps.value.length > 0) {
    list.push({
      title: `${waitingOrientationSteps.value.length} oryantasyon adımı bekliyor`,
      text: 'Başlangıç sürecindeki adımları takip edin.',
      to: '/consultant/orientation',
      icon: 'bi-list-check',
    })
  }

  if (waitingTrainings.value.length > 0) {
    list.push({
      title: `${waitingTrainings.value.length} eğitim tamamlanmayı bekliyor`,
      text: 'Size atanmış eğitimleri tamamlayın.',
      to: '/consultant/trainings',
      icon: 'bi-mortarboard',
    })
  }

  if (upcomingDuties.value.length > 0) {
    list.push({
      title: `${upcomingDuties.value.length} yaklaşan nöbetiniz var`,
      text: 'Nöbetlerinizi kontrol edin ve onaylayın.',
      to: '/consultant/duties',
      icon: 'bi-calendar-check',
    })
  }

  return list.slice(0, 5)
})

const logoutUser = async () => {
  logout()
  await navigateTo('/login', { replace: true })
}

const notificationTypeIcon = (type) => {
  if (type === 'Evrak') return 'bi-folder2-open'
  if (type === 'Oryantasyon') return 'bi-list-check'
  if (type === 'Eğitim') return 'bi-mortarboard'
  if (type === 'Nöbet') return 'bi-calendar-check'
  if (type === 'Toplantı') return 'bi-people'
  return 'bi-megaphone'
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Devam Ediyor') return 'bg-slate-200 text-slate-800'
  if (status === 'Danışman Onayladı') return 'bg-slate-900 text-white'
  if (status === 'Planlandı') return 'bg-slate-100 text-slate-700'
  if (status === 'Değişim Talebi') return 'bg-slate-200 text-slate-800'
  return 'bg-white text-slate-700 border border-slate-200'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Danışman Paneli
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Hoş geldiniz, {{ currentConsultant?.fullName || currentUser?.name || 'Danışman' }}
          </h1>
          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Size atanmış duyuruları, evrakları, oryantasyon adımlarını, eğitimleri ve nöbetleri tek ekrandan takip edin.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          @click="logoutUser"
        >
          <i class="bi bi-box-arrow-right mr-2"></i>
          Çıkış Yap
        </button>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 lg:grid-cols-[1fr_220px_220px_220px]">
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
          <p class="text-sm font-medium text-slate-500">Bildirim</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            {{ unreadNotifications.length }}
          </p>
          <p class="mt-1 text-xs text-slate-400">Okunmamış</p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Onay Bekleyen</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            {{ confirmationWaiting.length }}
          </p>
          <p class="mt-1 text-xs text-slate-400">Duyuru / görev</p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Yaklaşan Nöbet</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            {{ upcomingDuties.length }}
          </p>
          <p class="mt-1 text-xs text-slate-400">Bekleyen kayıt</p>
        </div>
      </div>
    </section>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <NuxtLink
        to="/consultant/notifications"
        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white">
          <i class="bi bi-bell"></i>
        </div>
        <h2 class="mt-4 text-lg font-bold text-slate-900">Bildirimlerim</h2>
        <p class="mt-2 text-sm text-slate-500">{{ unreadNotifications.length }} okunmamış bildirim</p>
      </NuxtLink>

      <NuxtLink
        to="/consultant/documents"
        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white">
          <i class="bi bi-folder2-open"></i>
        </div>
        <h2 class="mt-4 text-lg font-bold text-slate-900">Evraklarım</h2>
        <p class="mt-2 text-sm text-slate-500">%{{ documentCompletionPercent(currentConsultantId) }} tamamlandı</p>
      </NuxtLink>

      <NuxtLink
        to="/consultant/orientation"
        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white">
          <i class="bi bi-list-check"></i>
        </div>
        <h2 class="mt-4 text-lg font-bold text-slate-900">Oryantasyonum</h2>
        <p class="mt-2 text-sm text-slate-500">%{{ orientationCompletionPercent(currentConsultantId) }} tamamlandı</p>
      </NuxtLink>

      <NuxtLink
        to="/consultant/trainings"
        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white">
          <i class="bi bi-mortarboard"></i>
        </div>
        <h2 class="mt-4 text-lg font-bold text-slate-900">Eğitimlerim</h2>
        <p class="mt-2 text-sm text-slate-500">%{{ trainingCompletionPercent(currentConsultantId) }} tamamlandı</p>
      </NuxtLink>

      <NuxtLink
        to="/consultant/duties"
        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white">
          <i class="bi bi-calendar-check"></i>
        </div>
        <h2 class="mt-4 text-lg font-bold text-slate-900">Nöbetlerim</h2>
        <p class="mt-2 text-sm text-slate-500">{{ upcomingDuties.length }} yaklaşan nöbet</p>
      </NuxtLink>
    </div>

    <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Hızlı Aksiyonlar
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Öncelikli takip etmeniz gereken işler
          </p>
        </div>

        <div v-if="!actionItems.length" class="p-8 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
            <i class="bi bi-check2-circle"></i>
          </div>
          <h3 class="mt-4 text-lg font-bold text-slate-900">
            Şu an bekleyen aksiyon yok
          </h3>
          <p class="mt-2 text-sm text-slate-500">
            Yeni bildirim, evrak, eğitim veya nöbet atandığında burada görünecek.
          </p>
        </div>

        <div v-else class="space-y-3 p-5">
          <NuxtLink
            v-for="item in actionItems"
            :key="item.title"
            :to="item.to"
            class="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-900 hover:bg-white"
          >
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg text-slate-800 shadow-sm">
              <i class="bi" :class="item.icon"></i>
            </div>

            <div>
              <h3 class="font-bold text-slate-900">
                {{ item.title }}
              </h3>
              <p class="mt-1 text-sm leading-6 text-slate-500">
                {{ item.text }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Son Bildirimler
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Ofisten size gelen son duyurular
          </p>
        </div>

        <div v-if="!recentNotifications.length" class="p-8 text-center text-sm text-slate-500">
          Henüz bildiriminiz yok.
        </div>

        <div v-else class="space-y-3 p-5">
          <NuxtLink
            v-for="item in recentNotifications"
            :key="item.id"
            to="/consultant/notifications"
            class="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-900 hover:bg-white"
          >
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg text-slate-800 shadow-sm">
              <i class="bi" :class="notificationTypeIcon(item.type)"></i>
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ item.type }}
                </span>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="item.isRead ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white'"
                >
                  {{ item.isRead ? 'Okundu' : 'Yeni' }}
                </span>
              </div>

              <h3 class="mt-2 truncate font-bold text-slate-900">
                {{ item.title }}
              </h3>
              <p class="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                {{ item.description || 'Ofis yönetimi tarafından gönderildi.' }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Bekleyen Eğitimler
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Size atanmış eğitimlerden tamamlanmayanlar
          </p>
        </div>

        <div v-if="!recentTrainings.length" class="p-8 text-center text-sm text-slate-500">
          Henüz eğitim ataması yok.
        </div>

        <div v-else class="space-y-3 p-5">
          <NuxtLink
            v-for="item in recentTrainings"
            :key="item.id"
            to="/consultant/trainings"
            class="block rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-900 hover:bg-white"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {{ item.category }} · {{ item.format }}
                </p>
                <h3 class="mt-2 font-bold text-slate-900">
                  {{ item.trainingTitle }}
                </h3>
              </div>

              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="statusClass(item.status)"
              >
                {{ item.status }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Yaklaşan Nöbetler
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Size atanmış yaklaşan nöbetler
          </p>
        </div>

        <div v-if="!recentDuties.length" class="p-8 text-center text-sm text-slate-500">
          Yaklaşan nöbetiniz yok.
        </div>

        <div v-else class="space-y-3 p-5">
          <NuxtLink
            v-for="item in recentDuties"
            :key="item.id"
            to="/consultant/duties"
            class="block rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-900 hover:bg-white"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {{ item.shiftType }} · {{ item.location }}
                </p>
                <h3 class="mt-2 font-bold text-slate-900">
                  {{ formatDate(item.date) }} · {{ item.dayName }}
                </h3>
                <p class="mt-1 text-sm text-slate-500">
                  {{ item.startTime }} - {{ item.endTime }}
                </p>
              </div>

              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="statusClass(item.status)"
              >
                {{ item.status }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
