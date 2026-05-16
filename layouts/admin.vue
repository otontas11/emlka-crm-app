<script setup>
const { user: authUser, logout, isCompanyAdmin } = useAuth()

if (!isCompanyAdmin.value) {
  navigateTo('/danisman')
}

const navigation = ref([
  { name: 'Dashboard', icon: '📊', path: '/admin', badge: null },
  { name: 'Danışmanlar', icon: '👥', path: '/admin/danismanlar', badge: '5' },
  { name: 'Şirket Ayarları', icon: '⚙️', path: '/admin/ayarlar', badge: null },
])

const user = computed(() => ({
  name: authUser.value?.name || 'Admin',
  role: authUser.value?.is_consultant ? 'Broker & Danışman' : 'Broker',
  avatar: authUser.value?.name?.split(' ').map(n => n[0]).join('') || 'A',
  stats: { danismanlar: 5, bugunAranacak: 12, gecikenArama: 5 }
}))

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
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    ></div>

    <aside class="fixed inset-y-0 left-0 z-50 w-80 sm:w-72 bg-gradient-to-b from-dark-900 to-dark-800 border-r border-dark-700 transition-transform duration-300 shadow-2xl" :class="{ '-translate-x-full lg:translate-x-0': !sidebarOpen }">
      <div class="flex items-center gap-3 px-6 py-5 border-b border-dark-700">
        <div class="w-10 h-10 bg-gradient-to-br from-warning-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">E</div>
        <div>
          <h1 class="text-lg font-bold text-white">Emlak CRM</h1>
          <p class="text-xs text-gray-400">Broker Paneli</p>
        </div>
      </div>

      <div class="px-4 py-5 border-b border-dark-700">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-warning-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">{{ user.avatar }}</div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-white truncate">{{ user.name }}</h3>
            <p class="text-xs text-gray-400 truncate">{{ user.role }}</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="text-center p-2 bg-dark-700/50 rounded-lg">
            <div class="text-lg font-bold text-warning-400">{{ user.stats.danismanlar }}</div>
            <div class="text-xs text-gray-400">Danışman</div>
          </div>
          <div class="text-center p-2 bg-dark-700/50 rounded-lg">
            <div class="text-lg font-bold text-primary-400">{{ user.stats.bugunAranacak }}</div>
            <div class="text-xs text-gray-400">Bugün</div>
          </div>
          <div class="text-center p-2 bg-dark-700/50 rounded-lg">
            <div class="text-lg font-bold text-danger-400">{{ user.stats.gecikenArama }}</div>
            <div class="text-xs text-gray-400">Geciken</div>
          </div>
        </div>
      </div>

      <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-360px)]">
        <div class="mb-4">
          <p class="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Broker Yönetimi</p>
          <NuxtLink v-for="item in navigation" :key="item.path" :to="item.path" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-dark-700 hover:text-white transition-all duration-200 group" active-class="bg-warning-500/20 text-warning-400 font-medium">
            <span class="text-xl">{{ item.icon }}</span>
            <span class="flex-1">{{ item.name }}</span>
            <span v-if="item.badge" class="badge bg-warning-500/20 text-warning-300">{{ item.badge }}</span>
          </NuxtLink>
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Danışman Paneli</p>
          <NuxtLink to="/danisman" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-dark-700 hover:text-white transition-all duration-200">
            <span class="text-xl">🏠</span>
            <span>Danışman Dashboard</span>
          </NuxtLink>
        </div>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700 bg-dark-900">
        <button @click="logout" class="btn btn-ghost w-full justify-start text-danger-400 hover:text-danger-300">
          <span class="text-xl">🚪</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>

    <div class="lg:pl-72 min-h-screen">
      <header class="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="btn btn-ghost btn-sm flex-shrink-0 hover:bg-warning-50"
              aria-label="Menü"
            >
              <svg class="w-6 h-6 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div class="min-w-0">
              <h2 class="text-lg sm:text-xl font-bold text-dark-900 truncate">Broker Panel</h2>
              <p class="text-xs sm:text-sm text-gray-500 hidden sm:block">Ofis yönetim sistemi</p>
            </div>
          </div>
          <NuxtLink to="/admin/danismanlar" class="btn btn-primary btn-sm flex-shrink-0">
            <span class="hidden sm:inline">+ Yeni</span>
            <span class="sm:hidden">+</span>
          </NuxtLink>
        </div>
      </header>
      <main class="p-4 sm:p-6"><slot /></main>
    </div>
  </div>
</template>
