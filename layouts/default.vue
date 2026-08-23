<script setup>
const route = useRoute()
const router = useRouter()

const {
  user,
  initAuth,
  logout,
  displayName,
  displayTitle,
  avatarText,
  isCompanyAdmin,
  isConsultant,
} = useAuth()

onMounted(() => {
  initAuth()
})

const sidebarOpen = ref(false)

const personalMenu = [
  { label: 'Dashboard', to: '/', icon: 'bi-grid-1x2-fill', exact: true },
  { label: 'Müşteriler', to: '/contacts', icon: 'bi-people-fill' },
  { label: 'Talepler', to: '/requests', icon: 'bi-clipboard-check-fill' },
  { label: 'Belge Merkezi', to: '/danisman/belge-merkezi', icon: 'bi-file-earmark-text-fill' },
  { label: 'Portföyler', to: '/properties', icon: 'bi-buildings-fill' },
  { label: 'Görevler', to: '/tasks', icon: 'bi-check2-square' },
  { label: 'Finans', to: '/finance', icon: 'bi-wallet2' },
  { label: 'Profil Sayfam', to: '/profile', icon: 'bi-person-badge-fill' },
]

const officeMenu = [
  { label: 'Ofis Paneli', to: '/office', icon: 'bi-building-gear', exact: true },
  { label: 'Danışmanlar', to: '/office/consultants', icon: 'bi-person-lines-fill' },
  { label: 'Duyurular', to: '/office/announcements', icon: 'bi-megaphone-fill' },
  { label: 'Bildirim Merkezi', to: '/office/notifications', icon: 'bi-bell-fill' },
  { label: 'Evrak Takibi', to: '/office/modules/evrak-takibi', icon: 'bi-folder2-open' },
  { label: 'Belge Şablonları', to: '/office/modules/belge-sablonlari', icon: 'bi-file-earmark-richtext-fill' },
  { label: 'Oryantasyon', to: '/office/modules/oryantasyon', icon: 'bi-list-check' },
  { label: 'Eğitimler', to: '/office/modules/egitimler', icon: 'bi-mortarboard-fill' },
  { label: 'Toplantı / Yoklama', to: '/office/modules/toplanti-yoklama', icon: 'bi-clipboard-check-fill' },
  { label: 'Nöbet Yönetimi', to: '/office/modules/nobet-yonetimi', icon: 'bi-calendar-check-fill' },
  { label: 'Komisyon Sistemi', to: '/office/modules/komisyon-sistemi', icon: 'bi-cash-stack' },
  { label: 'Liderlik Tabloları', to: '/office/modules/liderlik-tablolari', icon: 'bi-trophy-fill' },
  { label: 'Hedef Yönetimi', to: '/office/modules/hedef-yonetimi', icon: 'bi-bullseye' },
]

const consultantMenu = [
  { label: 'Danışman Paneli', to: '/consultant', icon: 'bi-grid-1x2-fill', exact: true },
  { label: 'Bildirimlerim', to: '/consultant/notifications', icon: 'bi-bell-fill' },
  { label: 'Evraklarım', to: '/consultant/documents', icon: 'bi-folder2-open' },
  { label: 'Oryantasyonum', to: '/consultant/orientation', icon: 'bi-list-check' },
  { label: 'Eğitimlerim', to: '/consultant/trainings', icon: 'bi-mortarboard-fill' },
  { label: 'Nöbetlerim', to: '/consultant/duties', icon: 'bi-calendar-check-fill' },
]

const isBrokerUser = computed(() => isCompanyAdmin.value)

const isConsultantUser = computed(() => isConsultant.value)

const menuGroups = computed(() => {
  if (isConsultantUser.value) {
    return [
      {
        title: 'Kişisel CRM',
        items: personalMenu,
      },
      {
        title: 'Danışman Paneli',
        items: consultantMenu,
      },
    ]
  }

  if (isBrokerUser.value) {
    return [
      {
        title: 'Kişisel CRM',
        items: personalMenu,
      },
      {
        title: 'Ofis Yönetimi',
        items: officeMenu,
      },
    ]
  }

  return [
    {
      title: 'Kişisel CRM',
      items: personalMenu,
    },
  ]
})

const visibleMenuGroups = computed(() => {
  return menuGroups.value.filter(group => {
    if (!group.brokerOnly) return true
    return isBrokerUser.value
  })
})

const isActive = (item) => {
  if (item.exact) {
    return route.path === item.to
  }

  return route.path === item.to || route.path.startsWith(item.to + '/')
}

const pageTitle = computed(() => {
  const allItems = [
    ...personalMenu,
    ...officeMenu,
    ...consultantMenu,
  ]

  const activeItem = allItems
    .filter(item => isActive(item))
    .sort((a, b) => b.to.length - a.to.length)[0]

  return activeItem?.label || 'Emlak CRM'
})

const userName = displayName

const userTitle = displayTitle



const logoutUser = async () => {
  logout()
  await navigateTo('/login', { replace: true })
}

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-[292px] flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-20 items-center gap-3 border-b border-white/10 px-5">
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl">
          <i class="bi bi-buildings-fill"></i>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Emlak CRM
          </p>
          <h1 class="text-lg font-bold leading-tight text-white">
            Yönetim Paneli
          </h1>
        </div>
      </div>

      <nav class="flex-1 space-y-7 overflow-y-auto px-4 py-6">
        <div
          v-for="group in visibleMenuGroups"
          :key="group.title"
        >
          <p class="mb-3 px-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            {{ group.title }}
          </p>

          <div class="space-y-1.5">
            <NuxtLink
              v-for="item in group.items"
              :key="item.to"
              :to="item.to"
              class="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition"
              :class="isActive(item)
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'"
              @click="closeSidebar"
            >
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition"
                :class="isActive(item)
                  ? 'bg-slate-950 text-white'
                  : 'bg-white/10 text-slate-300 group-hover:bg-white/15 group-hover:text-white'"
              >
                <i class="bi" :class="item.icon"></i>
              </span>

              <span class="truncate">
                {{ item.label }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <div class="border-t border-white/10 p-4">
        <div class="rounded-3xl bg-white/10 p-4">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-950">
              {{ avatarText }}
            </div>

            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-white">
                {{ userName }}
              </p>
              <p class="mt-1 truncate text-xs text-slate-400">
                {{ userTitle }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="mt-4 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            @click="logoutUser"
          >
            <i class="bi bi-box-arrow-right mr-2"></i>
            Çıkış Yap
          </button>
        </div>
      </div>
    </aside>

    <div class="lg:pl-[292px]">
      <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div class="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
              @click="sidebarOpen = true"
            >
              <i class="bi bi-list text-xl"></i>
            </button>

            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Emlak CRM
              </p>
              <h2 class="text-lg font-bold text-slate-900">
                {{ pageTitle }}
              </h2>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink
              v-if="isBrokerUser"
              to="/office"
              class="hidden rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 md:inline-flex"
            >
              <i class="bi bi-building-gear mr-2"></i>
              Ofis Yönetimi
            </NuxtLink>

            <div class="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                {{ avatarText }}
              </div>

              <div class="hidden min-w-0 sm:block">
                <p class="truncate text-sm font-bold text-slate-900">
                  {{ userName }}
                </p>
                <p class="truncate text-xs text-slate-500">
                  {{ userTitle }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>











