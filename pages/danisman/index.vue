<template>
  <div class="space-y-6 fade-in">
    <!-- Welcome Banner -->
    <div class="card bg-gradient-to-br from-primary-600 to-secondary-600 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
      <div class="relative">
        <h1 class="text-3xl font-display font-bold mb-2">Günaydın, Ahmet! 👋</h1>
        <p class="text-primary-100 mb-6">Bugün 12 müşterinizi aramanız ve 8 malik raporunu göndermeniz gerekiyor.</p>
        <div class="flex gap-3">
          <NuxtLink to="/danisman/gorevler" class="btn bg-white text-primary-600 hover:bg-gray-50">
            <span>🎯</span>
            <span>Görevlere Başla</span>
          </NuxtLink>
          <NuxtLink to="/danisman/raporlar" class="btn bg-white/20 hover:bg-white/30 text-white border-white/30">
            <span>📊</span>
            <span>Haftalık Rapor</span>
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
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Bugün Aranacak Müşteriler -->
        <div class="card slide-up">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <span class="text-xl">📞</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-dark-900">Bugün Aranacak Müşteriler</h3>
                <p class="text-sm text-gray-500">Periyodik takip zamanı geldi</p>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm">Tümünü Gör</button>
          </div>

          <div class="space-y-3">
            <div
              v-for="musteri in bugunAranacaklar"
              :key="musteri.id"
              class="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer group"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {{ musteri.name.split(' ').map(n => n[0]).join('') }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-dark-900">{{ musteri.name }}</h4>
                    <span
                      class="badge"
                      :class="{
                        'badge-danger': musteri.priority === 'high',
                        'badge-warning': musteri.priority === 'medium',
                      }"
                    >
                      {{ musteri.type }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-500 flex items-center gap-2">
                    <span>{{ musteri.phone }}</span>
                    <span>•</span>
                    <span>{{ musteri.lastCall }}</span>
                  </div>
                </div>
              </div>
              <button class="btn btn-primary btn-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span>📱</span>
                <span>Ara</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Geciken Aramalar -->
        <div class="card slide-up" style="animation-delay: 0.1s">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
                <span class="text-xl">⏰</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-dark-900">Geciken Aramalar</h3>
                <p class="text-sm text-danger-600">Acil olarak aranmalı</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="musteri in gecikenAramalar"
              :key="musteri.id"
              class="flex items-center justify-between p-4 bg-danger-50 hover:bg-danger-100 rounded-lg transition-all duration-200 cursor-pointer border border-danger-200"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-danger-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {{ musteri.name.split(' ').map(n => n[0]).join('') }}
                </div>
                <div>
                  <h4 class="font-semibold text-dark-900">{{ musteri.name }}</h4>
                  <div class="text-sm text-gray-600 flex items-center gap-2">
                    <span>{{ musteri.phone }}</span>
                    <span>•</span>
                    <span class="text-danger-600 font-medium">{{ musteri.gecikme }} gecikme</span>
                  </div>
                </div>
              </div>
              <button class="btn btn-danger btn-sm">
                <span>🚨</span>
                <span>Hemen Ara</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Aktif İşlemler -->
        <div class="card slide-up" style="animation-delay: 0.2s">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <span class="text-xl">💼</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-dark-900">Aktif İşlemler</h3>
                <p class="text-sm text-gray-500">Devam eden satış süreçleri</p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div
              v-for="islem in aktifIslemler"
              :key="islem.id"
              class="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h4 class="font-semibold text-dark-900">{{ islem.title }}</h4>
                  <p class="text-sm text-gray-600">{{ islem.customer }}</p>
                </div>
                <span class="badge badge-success">{{ islem.stage }}</span>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">İlerleme</span>
                  <span class="font-semibold text-primary-600">%{{ islem.progress }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-gradient-to-r from-success-500 to-primary-500 h-2 rounded-full transition-all duration-500"
                    :style="{ width: `${islem.progress}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Yaklaşan Özel Günler -->
        <div class="card slide-up" style="animation-delay: 0.15s">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-xl">🎉</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-dark-900">Özel Günler</h3>
              <p class="text-sm text-gray-500">Yaklaşan kutlamalar</p>
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
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <span class="text-xl">✅</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-dark-900">Günlük Görevler</h3>
              <p class="text-sm text-gray-500">Bugün yapılacaklar</p>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="gorev in gunlukGorevler"
              :key="gorev.id"
              class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200"
              :class="{ 'opacity-50': gorev.done }"
            >
              <input
                type="checkbox"
                :checked="gorev.done"
                class="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div class="flex-1">
                <p class="text-sm font-medium text-dark-900" :class="{ 'line-through': gorev.done }">
                  {{ gorev.task }}
                </p>
                <p class="text-xs text-gray-500">{{ gorev.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Aylık Hedef -->
        <div class="card slide-up bg-gradient-to-br from-success-500 to-primary-500 text-white" style="animation-delay: 0.25s">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">🎯</span>
            <div>
              <h3 class="text-lg font-bold">Aylık Hedefler</h3>
              <p class="text-sm text-white/80">Mayıs 2025</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">Satış</span>
                <span class="text-sm">{{ aylikHedef.satis.gerceklesen }} / {{ aylikHedef.satis.hedef }}</span>
              </div>
              <div class="w-full bg-white/20 rounded-full h-2">
                <div class="bg-white h-2 rounded-full" :style="{ width: `${aylikHedef.satis.oran}%` }"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">Kiralama</span>
                <span class="text-sm">{{ aylikHedef.kiralama.gerceklesen }} / {{ aylikHedef.kiralama.hedef }}</span>
              </div>
              <div class="w-full bg-white/20 rounded-full h-2">
                <div class="bg-white h-2 rounded-full" :style="{ width: `${aylikHedef.kiralama.oran}%` }"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">Portföy Alma</span>
                <span class="text-sm">{{ aylikHedef.portfoy.gerceklesen }} / {{ aylikHedef.portfoy.hedef }}</span>
              </div>
              <div class="w-full bg-white/20 rounded-full h-2">
                <div class="bg-white h-2 rounded-full" :style="{ width: `${aylikHedef.portfoy.oran}%` }"></div>
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
    title: 'Malik Raporları',
    value: '8',
    subtitle: 'rapor verilecek',
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
    change: 'Bugün',
    changeType: 'warning'
  },
  {
    title: 'Yaklaşan Yetkiler',
    value: '3',
    subtitle: 'yetki bitiyor',
    icon: '⚠️',
    color: 'from-yellow-500 to-orange-500',
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

const aktifIslemler = ref([
  { id: 1, title: 'Kadıköy Lüks Daire', stage: 'Teklif Alındı', customer: 'Mehmet D.', progress: 60 },
  { id: 2, title: 'Bostancı Villa', stage: 'Portföy Gösterildi', customer: 'Ayşe K.', progress: 30 },
  { id: 3, title: 'Maltepe Ofis', stage: 'Kapora Alındı', customer: 'Ali Y.', progress: 80 },
])

const gunlukGorevler = ref([
  { id: 1, task: 'Portföy fotoğrafları çek - Kadıköy', time: '10:00', done: false },
  { id: 2, task: 'Malik bilgilendirme - Bostancı Villa', time: '14:00', done: false },
  { id: 3, task: 'Ofis toplantısı', time: '16:00', done: true },
])

const aylikHedef = ref({
  satis: { hedef: 3, gerceklesen: 1, oran: 33 },
  kiralama: { hedef: 5, gerceklesen: 3, oran: 60 },
  portfoy: { hedef: 10, gerceklesen: 7, oran: 70 },
})
</script>