<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="card bg-gradient-to-br from-warning-500 to-orange-600 text-white">
      <h1 class="text-2xl sm:text-3xl font-bold mb-2">Broker Paneli</h1>
      <p class="mb-4 sm:mb-6 text-sm sm:text-base">Danışmanların müşteri takip durumunu tek ekrandan izle</p>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <NuxtLink to="/admin/danismanlar" class="btn bg-white text-warning-600 justify-center">
          <span>👥</span>
          <span>Danışmanlar</span>
        </NuxtLink>
        <NuxtLink to="/admin/ayarlar" class="btn bg-white/20 text-white justify-center">
          <span>⚙️</span>
          <span>Ayarlar</span>
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.title" class="stat-card" :class="stat.color">
        <div class="flex items-start justify-between mb-4">
          <div class="text-4xl">{{ stat.icon }}</div>
          <span class="badge bg-white/20 text-white text-xs">{{ stat.subtitle }}</span>
        </div>
        <div class="text-4xl font-bold mb-1">{{ stat.value }}</div>
        <div class="text-sm opacity-90">{{ stat.title }}</div>
      </div>
    </div>

    <div class="card">
      <h3 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Danışman Takip Özeti</h3>
      <div class="space-y-3 sm:space-y-4">
        <div v-for="d in danismanlar" :key="d.id" class="p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="flex items-center justify-between mb-3 sm:mb-4 gap-3">
            <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">{{ d.avatar }}</div>
              <div class="min-w-0 flex-1">
                <h4 class="font-semibold text-sm sm:text-base truncate">{{ d.name }}</h4>
                <p class="text-xs text-gray-500 truncate">Son: {{ d.sonGorusme }}</p>
              </div>
            </div>
            <NuxtLink :to="`/admin/danismanlar`" class="btn btn-ghost btn-sm flex-shrink-0 text-xs sm:text-sm">Detay</NuxtLink>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div class="text-center p-2 bg-white rounded border border-gray-200">
              <div class="text-base sm:text-lg font-bold text-primary-600">{{ d.bugunAranacak }}</div>
              <div class="text-xs text-gray-600">Bugün</div>
            </div>
            <div class="text-center p-2 bg-white rounded border border-gray-200">
              <div class="text-base sm:text-lg font-bold text-danger-600">{{ d.gecikenArama }}</div>
              <div class="text-xs text-gray-600">Geciken</div>
            </div>
            <div class="text-center p-2 bg-white rounded border border-gray-200">
              <div class="text-base sm:text-lg font-bold text-success-600">{{ d.tamamlananGorev }}</div>
              <div class="text-xs text-gray-600">Tamamlandı</div>
            </div>
            <div class="text-center p-2 bg-white rounded border border-gray-200">
              <div class="text-base sm:text-lg font-bold text-warning-600">{{ d.bekleyenGorev }}</div>
              <div class="text-xs text-gray-600">Bekleyen</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })

const stats = ref([
  { title: 'Toplam Danışman', value: '5', subtitle: 'Aktif', icon: '👥', color: 'from-blue-500 to-blue-600' },
  { title: 'Bugün Aranacak', value: '32', subtitle: 'Şirket geneli', icon: '📞', color: 'from-primary-500 to-primary-600' },
  { title: 'Geciken Aramalar', value: '12', subtitle: 'Acil takip', icon: '⏰', color: 'from-danger-500 to-orange-600' },
  { title: 'Yaklaşan Görevler', value: '18', subtitle: 'Bu hafta', icon: '✅', color: 'from-success-500 to-success-600' },
])

const danismanlar = ref([
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    avatar: 'AY',
    bugunAranacak: 8,
    gecikenArama: 2,
    tamamlananGorev: 12,
    bekleyenGorev: 3,
    sonGorusme: 'Bugün'
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    avatar: 'MD',
    bugunAranacak: 12,
    gecikenArama: 5,
    tamamlananGorev: 8,
    bekleyenGorev: 7,
    sonGorusme: 'Dün'
  },
  {
    id: 3,
    name: 'Ayşe Kaya',
    avatar: 'AK',
    bugunAranacak: 6,
    gecikenArama: 1,
    tamamlananGorev: 15,
    bekleyenGorev: 4,
    sonGorusme: 'Bugün'
  },
  {
    id: 4,
    name: 'Can Öztürk',
    avatar: 'CÖ',
    bugunAranacak: 4,
    gecikenArama: 3,
    tamamlananGorev: 6,
    bekleyenGorev: 2,
    sonGorusme: '2 gün önce'
  },
  {
    id: 5,
    name: 'Zeynep Kara',
    avatar: 'ZK',
    bugunAranacak: 2,
    gecikenArama: 1,
    tamamlananGorev: 4,
    bekleyenGorev: 2,
    sonGorusme: 'Bugün'
  },
])
</script>