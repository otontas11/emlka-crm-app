<script setup>
const { user: authUser, logout, isCompanyAdmin } = useAuth()

const navigation = ref([
  { name: 'Dashboard', icon: '📊', path: '/danisman', badge: null },
  { name: 'Müşteriler', icon: '👥', path: '/danisman/musteriler', badge: '12' },
  { name: 'Görevler', icon: '✅', path: '/danisman/gorevler', badge: '5' },
  { name: 'Raporlar', icon: '📈', path: '/danisman/raporlar', badge: null },
])

const user = computed(() => {
  return {
    name: authUser.value?.name || 'Kullanıcı',
    role: authUser.value?.is_company_admin ? 'Broker & Danışman' : 'Gayrimenkul Danışmanı',
    avatar: authUser.value?.name?.split(' ').map(n => n[0]).join('') || 'U',
    stats: {
      bugunAranacak: 12,
      gecikenArama: 5,
      bekleyenGorev: 8,
    }
  }
})

// Mobilde kapalı, desktop'ta açık başlasın
const sidebarOpen = ref(false)

// Desktop'ta otomatik aç
onMounted(() => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = true
  }

  // Ekran boyutu değiştiğinde sidebar'ı kapat (mobil geçişte)
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      sidebarOpen.value = false
    }
  }

  window.addEventListener('resize', handleResize)

  // Cleanup
  return () => window.removeEventListener('resize', handleResize)
})

// Mobilde sidebar açıkken body scroll'unu engelle
watch(sidebarOpen, (isOpen) => {
  if (typeof window === 'undefined') return

  if (isOpen && window.innerWidth < 1024) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const handleLogout = () => {
  logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-80 sm:w-72 bg-white border-r border-gray-200 transition-transform duration-300 shadow-2xl"
      :class="{ '-translate-x-full lg:translate-x-0': !sidebarOpen }"
    >
      <!-- Logo & Brand -->
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
          E
        </div>
        <div>
          <h1 class="text-lg font-bold text-dark-900">Emlak CRM</h1>
          <p class="text-xs text-gray-500">Danışman Paneli</p>
        </div>
      </div>

      <!-- User Profile -->
      <div class="px-4 py-5 border-b border-gray-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {{ user.avatar }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-dark-900 truncate">{{ user.name }}</h3>
            <p class="text-xs text-gray-500 truncate">{{ user.role }}</p>
          </div>
        </div>
        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-2">
          <div class="text-center p-2 bg-gray-50 rounded-lg">
            <div class="text-lg font-bold text-primary-600">{{ user.stats.bugunAranacak }}</div>
            <div class="text-xs text-gray-600">Bugün</div>
          </div>
          <div class="text-center p-2 bg-gray-50 rounded-lg">
            <div class="text-lg font-bold text-danger-600">{{ user.stats.gecikenArama }}</div>
            <div class="text-xs text-gray-600">Geciken</div>
          </div>
          <div class="text-center p-2 bg-gray-50 rounded-lg">
            <div class="text-lg font-bold text-warning-600">{{ user.stats.bekleyenGorev }}</div>
            <div class="text-xs text-gray-600">Görev</div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-280px)]">
        <NuxtLink
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group"
          active-class="bg-primary-100 text-primary-700 font-medium shadow-sm"
        >
          <span class="text-xl group-hover:scale-110 transition-transform duration-200">{{ item.icon }}</span>
          <span class="flex-1">{{ item.name }}</span>
          <span
            v-if="item.badge"
            class="badge badge-primary"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </nav>

      <!-- Bottom Actions -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white space-y-1">
        <NuxtLink v-if="isCompanyAdmin" to="/admin" class="btn btn-outline w-full justify-start border-warning-300 text-warning-600 hover:bg-warning-50">
          <span class="text-xl">👑</span>
          <span>Broker Paneli</span>
        </NuxtLink>
        <button @click="handleLogout" class="btn btn-ghost w-full justify-start text-danger-600">
          <span class="text-xl">🚪</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-72 transition-all duration-300 min-h-screen">
      <!-- Top Header -->
      <header class="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="btn btn-ghost btn-sm flex-shrink-0 hover:bg-primary-50"
              aria-label="Menü"
            >
              <svg class="w-6 h-6 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div class="min-w-0">
              <h2 class="text-lg sm:text-xl font-bold text-dark-900 truncate">Hoş Geldiniz</h2>
              <p class="text-xs sm:text-sm text-gray-500 hidden sm:block">Bugün iş için harika bir gün</p>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <!-- Notifications -->
            <button class="relative btn btn-ghost btn-sm">
              <span class="text-lg sm:text-xl">🔔</span>
              <span class="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>

            <!-- Quick Actions -->
            <NuxtLink to="/danisman/musteriler" class="btn btn-primary btn-sm">
              <span class="hidden sm:inline">+ Yeni</span>
              <span class="sm:hidden">+</span>
            </NuxtLink>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
