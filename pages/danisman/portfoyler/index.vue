<script setup>
definePageMeta({
  layout: 'danisman',
  middleware: 'auth'
})

const portfoyler = ref([
  {
    id: 1,
    title: 'Kadıköy Lüks Daire',
    type: 'Satılık',
    category: 'Daire',
    price: 3500000,
    location: 'Kadıköy, İstanbul',
    area: 150,
    rooms: '3+1',
    floor: 5,
    status: 'Aktif',
    malik: 'Mehmet Demir',
    malikPhone: '0532 123 4567',
    ilanDate: '2024-04-01',
    yetkiBitis: '2024-10-01',
    lastReport: '2024-05-01',
    nextReport: '2024-05-15',
    goruntulenme: 245,
    favori: 18,
    images: ['🏢'],
    priority: 'high'
  },
  {
    id: 2,
    title: 'Bostancı Deniz Manzaralı Villa',
    type: 'Satılık',
    category: 'Villa',
    price: 12500000,
    location: 'Bostancı, İstanbul',
    area: 350,
    rooms: '5+2',
    floor: '-',
    status: 'Teklif Var',
    malik: 'Ayşe Kaya',
    malikPhone: '0542 987 6543',
    ilanDate: '2024-03-15',
    yetkiBitis: '2024-09-15',
    lastReport: '2024-05-03',
    nextReport: '2024-05-13',
    goruntulenme: 387,
    favori: 42,
    images: ['🏡'],
    priority: 'high'
  },
  {
    id: 3,
    title: 'Maltepe Merkezi Ofis',
    type: 'Kiralık',
    category: 'Ofis',
    price: 45000,
    location: 'Maltepe, İstanbul',
    area: 200,
    rooms: 'Open Plan',
    floor: 3,
    status: 'Aktif',
    malik: 'Fatma Şahin',
    malikPhone: '0555 456 7890',
    ilanDate: '2024-04-10',
    yetkiBitis: '2024-10-10',
    lastReport: '2024-04-30',
    nextReport: '2024-05-20',
    goruntulenme: 156,
    favori: 12,
    images: ['🏬'],
    priority: 'medium'
  },
])

const stats = ref({
  toplam: 18,
  aktif: 14,
  satilik: 12,
  kiralik: 6,
  teklifVar: 3
})

const filters = ref({
  search: '',
  type: '',
  category: '',
  status: ''
})

const getStatusColor = (status) => {
  const colors = {
    'Aktif': 'bg-success-100 text-success-700',
    'Teklif Var': 'bg-warning-100 text-warning-700',
    'Opsiyonlu': 'bg-primary-100 text-primary-700',
    'Satıldı': 'bg-gray-100 text-gray-700',
    'Beklemede': 'bg-gray-100 text-gray-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const getDaysUntil = (date) => {
  const today = new Date()
  const target = new Date(date)
  const diffTime = target - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-display font-bold text-dark-900 mb-2">Portföyler</h1>
        <p class="text-gray-600">İlanlarınızı yönetin ve takip edin</p>
      </div>
      <button class="btn btn-primary btn-lg">
        <span class="text-xl">➕</span>
        <span>Yeni Portföy</span>
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="card text-center hover:shadow-medium transition-shadow duration-200">
        <div class="text-3xl font-bold text-primary-600 mb-1">{{ stats.toplam }}</div>
        <div class="text-sm text-gray-600">Toplam Portföy</div>
      </div>
      <div class="card text-center hover:shadow-medium transition-shadow duration-200">
        <div class="text-3xl font-bold text-success-600 mb-1">{{ stats.aktif }}</div>
        <div class="text-sm text-gray-600">Aktif İlan</div>
      </div>
      <div class="card text-center hover:shadow-medium transition-shadow duration-200">
        <div class="text-3xl font-bold text-primary-600 mb-1">{{ stats.satilik }}</div>
        <div class="text-sm text-gray-600">Satılık</div>
      </div>
      <div class="card text-center hover:shadow-medium transition-shadow duration-200">
        <div class="text-3xl font-bold text-secondary-600 mb-1">{{ stats.kiralik }}</div>
        <div class="text-sm text-gray-600">Kiralık</div>
      </div>
      <div class="card text-center bg-gradient-to-br from-warning-500 to-orange-500 text-white hover:shadow-medium transition-shadow duration-200">
        <div class="text-3xl font-bold mb-1">{{ stats.teklifVar }}</div>
        <div class="text-sm">Teklif Var</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ara</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Başlık, lokasyon..."
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tip</label>
          <select v-model="filters.type" class="input">
            <option value="">Tümü</option>
            <option value="Satılık">Satılık</option>
            <option value="Kiralık">Kiralık</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <select v-model="filters.category" class="input">
            <option value="">Tümü</option>
            <option value="Daire">Daire</option>
            <option value="Villa">Villa</option>
            <option value="Ofis">Ofis</option>
            <option value="Arsa">Arsa</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Durum</label>
          <select v-model="filters.status" class="input">
            <option value="">Tümü</option>
            <option value="Aktif">Aktif</option>
            <option value="Teklif Var">Teklif Var</option>
            <option value="Opsiyonlu">Opsiyonlu</option>
            <option value="Beklemede">Beklemede</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Portfolio Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="portfoy in portfoyler"
        :key="portfoy.id"
        class="card card-hover group cursor-pointer"
      >
        <!-- Image -->
        <div class="relative h-48 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg mb-4 overflow-hidden flex items-center justify-center text-8xl">
          {{ portfoy.images[0] }}
          <div class="absolute top-3 right-3 flex gap-2">
            <span :class="['badge', getStatusColor(portfoy.status)]">
              {{ portfoy.status }}
            </span>
            <span class="badge bg-dark-800 text-white">{{ portfoy.type }}</span>
          </div>
        </div>

        <!-- Content -->
        <div>
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-dark-900 mb-1">{{ portfoy.title }}</h3>
              <p class="text-sm text-gray-600 flex items-center gap-1">
                <span>📍</span>
                <span>{{ portfoy.location }}</span>
              </p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-primary-600">{{ formatPrice(portfoy.price) }}</div>
              <div v-if="portfoy.type === 'Kiralık'" class="text-xs text-gray-500">/ay</div>
            </div>
          </div>

          <!-- Details -->
          <div class="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-1">Metrekare</div>
              <div class="font-semibold text-dark-900">{{ portfoy.area }} m²</div>
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-1">Oda</div>
              <div class="font-semibold text-dark-900">{{ portfoy.rooms }}</div>
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-1">Kat</div>
              <div class="font-semibold text-dark-900">{{ portfoy.floor }}</div>
            </div>
          </div>

          <!-- Malik Info -->
          <div class="p-3 bg-purple-50 rounded-lg mb-4">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm">
                <span class="text-gray-600">Malik:</span>
                <span class="font-semibold text-dark-900 ml-2">{{ portfoy.malik }}</span>
              </div>
              <button class="btn btn-ghost btn-sm">
                <span>📞</span>
                <span class="text-xs">{{ portfoy.malikPhone }}</span>
              </button>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-gray-600">Son Rapor:</span>
                <span class="ml-1">{{ new Date(portfoy.lastReport).toLocaleDateString('tr-TR') }}</span>
              </div>
              <div>
                <span class="text-gray-600">Sonraki:</span>
                <span class="ml-1 text-primary-600 font-medium">{{ new Date(portfoy.nextReport).toLocaleDateString('tr-TR') }}</span>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center justify-between mb-4 text-sm text-gray-600">
            <div class="flex items-center gap-1">
              <span>👁️</span>
              <span>{{ portfoy.goruntulenme }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span>❤️</span>
              <span>{{ portfoy.favori }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span>📅</span>
              <span>Yetki: {{ getDaysUntil(portfoy.yetkiBitis) }} gün</span>
            </div>
          </div>

          <!-- Yetki Warning -->
          <div v-if="getDaysUntil(portfoy.yetkiBitis) <= 30" class="p-3 bg-warning-50 border border-warning-200 rounded-lg mb-4">
            <div class="flex items-center gap-2 text-warning-700">
              <span>⚠️</span>
              <span class="text-sm font-medium">Yetki {{ getDaysUntil(portfoy.yetkiBitis) }} gün içinde bitiyor!</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="grid grid-cols-3 gap-2">
            <button class="btn btn-outline btn-sm">
              <span>👁️</span>
              <span>Detay</span>
            </button>
            <button class="btn btn-primary btn-sm">
              <span>✏️</span>
              <span>Düzenle</span>
            </button>
            <button class="btn btn-success btn-sm">
              <span>📊</span>
              <span>Rapor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
