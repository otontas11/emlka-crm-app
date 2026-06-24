<script setup>
import { useOfficeNotifications } from '~/composables/useOfficeNotifications'

const {
  notifications,
  markNotificationRead,
  confirmNotification,
  unreadNotificationCount,
  syncAnnouncementNotifications,
} = useOfficeNotifications()

syncAnnouncementNotifications()

const search = ref('')
const statusFilter = ref('Tümü')

const filteredNotifications = computed(() => {
  let list = notifications.value

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.consultantName,
        item.title,
        item.type,
        item.priority,
      ]
        .filter(Boolean)
        .some(value => String(value).toLocaleLowerCase('tr-TR').includes(q))
    })
  }

  if (statusFilter.value === 'Okunmadı') {
    list = list.filter(item => !item.isRead)
  }

  if (statusFilter.value === 'Okundu') {
    list = list.filter(item => item.isRead)
  }

  if (statusFilter.value === 'Onay Bekliyor') {
    list = list.filter(item => item.requiresConfirmation && !item.isConfirmed)
  }

  if (statusFilter.value === 'Onaylandı') {
    list = list.filter(item => item.isConfirmed)
  }

  return list
})

const priorityClass = (priority) => {
  if (priority === 'Acil') return 'bg-slate-900 text-white'
  if (priority === 'Önemli') return 'bg-slate-200 text-slate-800'
  return 'bg-slate-100 text-slate-700'
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'Tümü'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Ofis Bildirim Merkezi
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Bildirimler
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Duyuruların danışmanlara ulaşıp ulaşmadığını, okunma durumunu ve gerekli onayları buradan takip edin.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/office/announcements"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <i class="bi bi-megaphone mr-2"></i>
            Duyuru Oluştur
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

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam Bildirim</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ notifications.length }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Okunmamış</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ unreadNotificationCount }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Onay Bekleyen</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">
          {{ notifications.filter(item => item.requiresConfirmation && !item.isConfirmed).length }}
        </p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Onaylanan</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">
          {{ notifications.filter(item => item.isConfirmed).length }}
        </p>
      </div>
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_120px]">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Bildirim Ara
          </label>
          <div class="relative">
            <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="search"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-500"
              placeholder="Danışman, duyuru veya tür ara..."
            />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Durum
          </label>
          <select
            v-model="statusFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          >
            <option>Tümü</option>
            <option>Okunmadı</option>
            <option>Okundu</option>
            <option>Onay Bekliyor</option>
            <option>Onaylandı</option>
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

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Bildirim Listesi
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ filteredNotifications.length }} bildirim listeleniyor
        </p>
      </div>

      <div v-if="filteredNotifications.length === 0" class="p-8 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-bell"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Bildirim bulunamadı
        </h3>

        <p class="mt-2 text-sm text-slate-500">
          Yeni bir duyuru yayınladığınızda hedef danışmanlar için bildirim kayıtları burada oluşur.
        </p>
      </div>

      <div v-else class="space-y-4 p-6">
        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ item.type }}
                </span>

                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="priorityClass(item.priority)">
                  {{ item.priority }}
                </span>

                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="item.isRead ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'">
                  {{ item.isRead ? 'Okundu' : 'Okunmadı' }}
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

              <p class="mt-2 text-sm text-slate-500">
                Danışman: {{ item.consultantName }}
              </p>

              <div class="mt-4 grid gap-3 md:grid-cols-3">
                <div class="rounded-2xl bg-white p-3">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Sistem</p>
                  <p class="mt-1 text-sm text-slate-600">{{ item.systemStatus }}</p>
                </div>

                <div class="rounded-2xl bg-white p-3">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Mobil</p>
                  <p class="mt-1 text-sm text-slate-600">{{ item.mobileStatus }}</p>
                </div>

                <div class="rounded-2xl bg-white p-3">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">WhatsApp</p>
                  <p class="mt-1 text-sm text-slate-600">{{ item.whatsappStatus }}</p>
                </div>
              </div>
            </div>

            <div class="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="markNotificationRead(item.id)"
              >
                Okundu Yap
              </button>

              <button
                v-if="item.requiresConfirmation"
                type="button"
                class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="confirmNotification(item.id)"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>



