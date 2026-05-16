<script setup>
const { user: authUser, logout, isAdmin } = useAuth()

if (!isAdmin.value) {
  navigateTo('/danisman')
}

const navigation = ref([
  { name: 'Dashboard', icon: '📊', path: '/admin', badge: null },
  { name: 'Danışmanlar', icon: '👥', path: '/admin/danismanlar', badge: '5' },
  { name: 'Ofis İşlemleri', icon: '💼', path: '/admin/islemler', badge: null },
  { name: 'Nöbet Yönetimi', icon: '📅', path: '/admin/nobetler', badge: null },
  { name: 'Raporlar', icon: '📈', path: '/admin/raporlar', badge: null },
  { name: 'Finans', icon: '💰', path: '/admin/finans', badge: null },
])

const user = computed(() => ({
  name: authUser.value?.name || 'Admin',
  role: 'Broker & Admin',
  avatar: authUser.value?.name?.split(' ').map(n => n[0]).join('') || 'A',
  stats: { danismanlar: 5, aktifIslem: 12, aylikCiro: 450000 }
}))

const sidebarOpen = ref(true)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <aside class="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-dark-900 to-dark-800 border-r border-dark-700 transition-transform duration-300" :class="{ '-translate-x-full': !sidebarOpen }">
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
            <div class="text-lg font-bold text-success-400">{{ user.stats.aktifIslem }}</div>
            <div class="text-xs text-gray-400">İşlem</div>
          </div>
          <div class="text-center p-2 bg-dark-700/50 rounded-lg">
            <div class="text-lg font-bold text-primary-400">{{ Math.floor(user.stats.aylikCiro / 1000) }}K</div>
            <div class="text-xs text-gray-400">Ciro</div>
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

    <div class="lg:pl-72">
      <header class="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center gap-4">
            <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden btn btn-ghost btn-sm"><span class="text-xl">☰</span></button>
            <div>
              <h2 class="text-xl font-bold text-dark-900">Broker Panel</h2>
              <p class="text-sm text-gray-500">Ofis yönetim sistemi</p>
            </div>
          </div>
          <button class="btn btn-primary btn-sm"><span>+ Yeni İşlem</span></button>
        </div>
      </header>
      <main class="p-6"><slot /></main>
    </div>
  </div>
</template>
