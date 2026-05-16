<template>
  <div class="space-y-4 sm:space-y-6 fade-in">
    <!-- Welcome Banner -->
    <div class="card bg-gradient-to-br from-primary-600 to-secondary-600 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
      <div class="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
      <div class="relative">
        <h1 class="text-2xl sm:text-3xl font-display font-bold mb-2">Günaydın! 👋</h1>
        <p class="text-primary-100 mb-4 sm:mb-6 text-sm sm:text-base">Bugün 12 müşterinizi aramanız gerekiyor.</p>
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <NuxtLink to="/danisman/gorevler" class="btn bg-white text-primary-600 hover:bg-gray-50 justify-center">
            <span>🎯</span>
            <span>Görevlere Başla</span>
          </NuxtLink>
          <NuxtLink to="/danisman/raporlar" class="btn bg-white/20 hover:bg-white/30 text-white border-white/30 justify-center">
            <span>📊</span>
            <span>Rapor</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="stat-card card-hover cursor-pointer scale-up"
        :class="stat.color"
        :style="{ animationDelay: `${stats.indexOf(stat) * 0.1}s` }"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="text-4xl">{{ stat.icon }}</div>
          <span
            class="badge text-xs px-2 py-1"
            :class="{
              'bg-white/20 text-white': stat.changeType === 'success',
              'bg-red-500/80 text-white': stat.changeType === 'danger',
              'bg-yellow-500/80 text-white': stat.changeType === 'warning',
            }"
          >
            {{ stat.change }}
          </span>
        </div>
        <div class="text-4xl font-bold mb-1">{{ stat.value }}</div>
        <div class="text-sm opacity-90">{{ stat.subtitle }}</div>
        <div class="text-xs opacity-75 mt-2">{{ stat.title }}</div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-4 sm:space-y-6">
        <!-- Bugün Aranacak Müşteriler -->
        <div class="card slide-up">
          <div class="flex items-center justify-between mb-4 sm:mb-6 gap-3">
            <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-lg sm:text-xl">📞</span>
              </div>
              <div class="min-w-0">
                <h3 class="text-base sm:text-lg font-bold text-dark-900 truncate">Bugün Aranacak</h3>
                <p class="text-xs sm:text-sm text-gray-500 hidden sm:block">Periyodik takip zamanı geldi</p>
              </div>
            </div>
            <NuxtLink to="/danisman/musteriler" class="btn btn-ghost btn-sm flex-shrink-0 text-xs sm:text-sm">Tümü</NuxtLink>
          </div>

          <div class="space-y-2 sm:space-y-3">
            <div
              v-for="musteri in bugunAranacaklar"
              :key="musteri.id"
              class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer group gap-3"
            >
              <div class="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                  {{ musteri.name.split(' ').map(n => n[0]).join('') }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="font-semibold text-dark-900 text-sm sm:text-base truncate">{{ musteri.name }}</h4>
                    <span
                      class="badge text-xs flex-shrink-0"
                      :class="{
                        'badge-danger': musteri.priority === 'high',
                        'badge-warning': musteri.priority === 'medium',
                      }"
                    >
                      {{ musteri.type }}
                    </span>
                  </div>
                  <div class="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span class="truncate">{{ musteri.phone }}</span>
                    <span class="hidden sm:inline">•</span>
                    <span class="text-xs">{{ musteri.lastCall }}</span>
                  </div>
                </div>
              </div>
              <a :href="`tel:${musteri.phone}`" class="btn btn-primary btn-sm flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                <span>📱</span>
                <span class="hidden sm:inline">Ara</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Geciken Aramalar -->
        <div class="card slide-up" style="animation-delay: 0.1s">
          <div class="flex items-center justify-between mb-4 sm:mb-6 gap-3">
            <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-danger-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-lg sm:text-xl">⏰</span>
              </div>
              <div class="min-w-0">
                <h3 class="text-base sm:text-lg font-bold text-dark-900 truncate">Geciken Aramalar</h3>
                <p class="text-xs sm:text-sm text-danger-600 hidden sm:block">Acil olarak aranmalı</p>
              </div>
            </div>
          </div>

          <div class="space-y-2 sm:space-y-3">
            <div
              v-for="musteri in gecikenAramalar"
              :key="musteri.id"
              class="flex items-center justify-between p-3 sm:p-4 bg-danger-50 hover:bg-danger-100 rounded-lg transition-all duration-200 cursor-pointer border border-danger-200 gap-3"
            >
              <div class="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-danger-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                  {{ musteri.name.split(' ').map(n => n[0]).join('') }}
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-dark-900 text-sm sm:text-base truncate">{{ musteri.name }}</h4>
                  <div class="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span class="truncate">{{ musteri.phone }}</span>
                    <span class="hidden sm:inline">•</span>
                    <span class="text-danger-600 font-medium text-xs">{{ musteri.gecikme }}</span>
                  </div>
                </div>
              </div>
              <a :href="`tel:${musteri.phone}`" class="btn btn-danger btn-sm flex-shrink-0">
                <span>🚨</span>
                <span class="hidden sm:inline">Ara</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column -->
      <div class="space-y-4 sm:space-y-6">
        <!-- Yaklaşan Özel Günler -->
        <div class="card slide-up" style="animation-delay: 0.15s">
          <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-lg sm:text-xl">🎉</span>
            </div>
            <div class="min-w-0">
              <h3 class="text-base sm:text-lg font-bold text-dark-900 truncate">Özel Günler</h3>
              <p class="text-xs sm:text-sm text-gray-500 hidden sm:block">Yaklaşan kutlamalar</p>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="event in yaklasanOzelGunler"
              :key="event.id"
              class="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200"
            >
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h4 class="font-semibold text-dark-900 text-sm">{{ event.name }}</h4>
                  <p class="text-xs text-gray-600">{{ event.event }}</p>
                </div>
                <span class="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">
                  {{ event.days }} gün
                </span>
              </div>
              <div class="text-xs text-gray-500">{{ event.date }}</div>
            </div>
          </div>
        </div>

        <!-- Günlük Görevler -->
        <div class="card slide-up" style="animation-delay: 0.2s">
          <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-lg sm:text-xl">✅</span>
            </div>
            <div class="min-w-0">
              <h3 class="text-base sm:text-lg font-bold text-dark-900 truncate">Günlük Görevler</h3>
              <p class="text-xs sm:text-sm text-gray-500 hidden sm:block">Bugün yapılacaklar</p>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="gorev in gunlukGorevler"
              :key="gorev.id"
              class="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-all duration-200"
              :class="{ 'opacity-50': gorev.done }"
            >
              <input
                type="checkbox"
                :checked="gorev.done"
                class="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-0.5 flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium text-dark-900" :class="{ 'line-through': gorev.done }">
                  {{ gorev.task }}
                </p>
                <p class="text-xs text-gray-500">{{ gorev.time }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: 'danisman',
  middleware: 'auth'
})

// Mock Data
const stats = ref([
  {
    title: 'Bugün Aranacak',
    value: '12',
    subtitle: 'müşteri',
    icon: '📞',
    color: 'from-blue-500 to-blue-600',
    change: '+3 yeni',
    changeType: 'success'
  },
  {
    title: 'Geciken Aramalar',
    value: '5',
    subtitle: 'müşteri',
    icon: '⏰',
    color: 'from-orange-500 to-red-500',
    change: '2 gün geçti',
    changeType: 'danger'
  },
  {
    title: 'Yaklaşan Görevler',
    value: '8',
    subtitle: 'görev',
    icon: '✅',
    color: 'from-success-500 to-success-600',
    change: 'Bu hafta',
    changeType: 'success'
  },
  {
    title: 'Özel Günler',
    value: '3',
    subtitle: 'yaklaşan',
    icon: '🎉',
    color: 'from-purple-500 to-pink-500',
    change: '7 gün içinde',
    changeType: 'warning'
  },
])

const bugunAranacaklar = ref([
  { id: 1, name: 'Mehmet Demir', phone: '0532 123 4567', lastCall: '15 gün önce', type: 'Alıcı', priority: 'high' },
  { id: 2, name: 'Ayşe Kaya', phone: '0542 987 6543', lastCall: '10 gün önce', type: 'Yatırımcı', priority: 'medium' },
  { id: 3, name: 'Fatma Şahin', phone: '0555 456 7890', lastCall: '20 gün önce', type: 'Satıcı', priority: 'high' },
])

const gecikenAramalar = ref([
  { id: 1, name: 'Ali Yılmaz', phone: '0533 222 3333', lastCall: '25 gün önce', gecikme: '5 gün' },
  { id: 2, name: 'Zeynep Arslan', phone: '0544 333 4444', lastCall: '32 gün önce', gecikme: '12 gün' },
])

const yaklasanOzelGunler = ref([
  { id: 1, name: 'Can Özdemir', event: 'Doğum Günü', date: '12 Mayıs', days: 3, type: 'birthday' },
  { id: 2, name: 'Elif Koç - Eşi', event: 'Evlilik Yıldönümü', date: '15 Mayıs', days: 6, type: 'anniversary' },
  { id: 3, name: 'Hasan Çelik', event: 'İş Yeri Açılışı', date: '18 Mayıs', days: 9, type: 'business' },
])


const gunlukGorevler = ref([
  { id: 1, task: 'Portföy fotoğrafları çek - Kadıköy', time: '10:00', done: false },
  { id: 2, task: 'Malik bilgilendirme - Bostancı Villa', time: '14:00', done: false },
  { id: 3, task: 'Ofis toplantısı', time: '16:00', done: true },
])

</script>