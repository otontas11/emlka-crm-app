<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })

const stats = ref([
  { title: 'Toplam Danışman', value: '5', subtitle: '2 yeni', icon: '👥', color: 'from-blue-500 to-blue-600' },
  { title: 'Aktif İşlem', value: '12', subtitle: '3 bu hafta', icon: '💼', color: 'from-purple-500 to-purple-600' },
  { title: 'Aylık Ciro', value: '450K', subtitle: '+15% artış', icon: '💰', color: 'from-success-500 to-success-600' },
  { title: 'Toplam Portföy', value: '48', subtitle: '32 aktif', icon: '🏢', color: 'from-orange-500 to-orange-600' },
])

const danismanlar = ref([
  { id: 1, name: 'Ahmet Yılmaz', avatar: 'AY', satis: 3, kiralama: 5, ciro: 125000, hedef: 80 },
  { id: 2, name: 'Mehmet Demir', avatar: 'MD', satis: 2, kiralama: 4, ciro: 98000, hedef: 65 },
  { id: 3, name: 'Ayşe Kaya', avatar: 'AK', satis: 4, kiralama: 3, ciro: 156000, hedef: 95 },
])

const formatPrice = (price) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price)
</script>

<template>
  <div class="space-y-6">
    <div class="card bg-gradient-to-br from-warning-500 to-orange-600 text-white">
      <h1 class="text-3xl font-bold mb-2">Broker Dashboard</h1>
      <p class="mb-6">Ofis performansı ve danışman takibi</p>
      <div class="flex gap-3">
        <button class="btn bg-white text-warning-600">📊 Detaylı Rapor</button>
        <button class="btn bg-white/20 text-white">➕ Yeni Danışman</button>
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
      <h3 class="text-xl font-bold mb-6">Danışman Performansı</h3>
      <div class="space-y-4">
        <div v-for="d in danismanlar" :key="d.id" class="p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">{{ d.avatar }}</div>
              <div>
                <h4 class="font-semibold">{{ d.name }}</h4>
                <p class="text-sm text-gray-600">{{ d.satis }} satış, {{ d.kiralama }} kiralama</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-primary-600">{{ formatPrice(d.ciro) }}</div>
              <div class="text-xs text-gray-500">Ciro</div>
            </div>
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-sm">
              <span>Hedef</span>
              <span class="font-semibold" :class="d.hedef >= 80 ? 'text-success-600' : 'text-warning-600'">%{{ d.hedef }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full bg-gradient-to-r from-success-500 to-success-600" :style="{ width: `${d.hedef}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
