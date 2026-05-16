<script setup>
definePageMeta({
  layout: 'danisman',
  middleware: 'auth'
})

// Mock data
const musteriler = ref([
  {
    id: 1,
    name: 'Mehmet Demir',
    phone: '0532 123 4567',
    email: 'mehmet.demir@email.com',
    type: 'Alıcı',
    status: 'Sıcak',
    budget: '2.5M - 3.5M TL',
    lastContact: '2024-05-05',
    nextContact: '2024-05-15',
    notes: 'Kadıköy bölgesinde 3+1 arıyor',
    createdAt: '2024-04-01',
    avatar: 'MD',
    priority: 'high'
  },
  {
    id: 2,
    name: 'Ayşe Kaya',
    phone: '0542 987 6543',
    email: 'ayse.kaya@email.com',
    type: 'Yatırımcı',
    status: 'Sıcak',
    budget: '5M - 8M TL',
    lastContact: '2024-05-01',
    nextContact: '2024-05-11',
    notes: 'Yatırımlık daire tercih ediyor',
    createdAt: '2024-03-15',
    avatar: 'AK',
    priority: 'high'
  },
  {
    id: 3,
    name: 'Fatma Şahin',
    phone: '0555 456 7890',
    email: 'fatma.sahin@email.com',
    type: 'Satıcı',
    status: 'Ilımlı',
    budget: '-',
    lastContact: '2024-04-25',
    nextContact: '2024-05-15',
    notes: 'Bostancı\'da villası var',
    createdAt: '2024-03-01',
    avatar: 'FS',
    priority: 'medium'
  },
  {
    id: 4,
    name: 'Ali Yılmaz',
    phone: '0533 222 3333',
    email: 'ali.yilmaz@email.com',
    type: 'Kiracı',
    status: 'Soğuk',
    budget: '15K - 20K TL/ay',
    lastContact: '2024-04-10',
    nextContact: '2024-05-10',
    notes: 'Ofis arıyor',
    createdAt: '2024-02-20',
    avatar: 'AY',
    priority: 'low'
  },
])

const stats = ref({
  toplam: 24,
  sicak: 8,
  ilimlı: 12,
  soguk: 4,
  bugunAranacak: 12
})

const filters = ref({
  search: '',
  type: '',
  status: '',
  priority: ''
})

const selectedMusteri = ref(null)

const getStatusColor = (status) => {
  const colors = {
    'Sıcak': 'bg-danger-100 text-danger-700',
    'Ilımlı': 'bg-warning-100 text-warning-700',
    'Soğuk': 'bg-primary-100 text-primary-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const getPriorityIcon = (priority) => {
  const icons = {
    'high': '🔥',
    'medium': '⚡',
    'low': '💤'
  }
  return icons[priority] || '📌'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-display font-bold text-dark-900 mb-2">Müşteriler</h1>
        <p class="text-sm sm:text-base text-gray-600">Tüm müşterilerinizi yönetin ve takip edin</p>
      </div>
      <NuxtLink to="/danisman/musteriler/ekle" class="btn btn-primary btn-lg w-full sm:w-auto">
        <span class="text-xl">➕</span>
        <span>Yeni Müşteri</span>
      </NuxtLink>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
      <div class="card text-center hover:shadow-medium transition-shadow duration-200">
        <div class="text-2xl sm:text-3xl font-bold text-primary-600 mb-1">{{ stats.toplam }}</div>
        <div class="text-xs sm:text-sm text-gray-600">Toplam Müşteri</div>
      </div>
      <div class="card text-center hover:shadow-medium transition-shadow duration-200">
        <div class="text-2xl sm:text-3xl font-bold text-danger-600 mb-1">{{ stats.sicak }}</div>
        <div class="text-xs sm:text-sm text-gray-600">Sıcak Müşteri</div>
      </div>
      <div class="card text-center hover:shadow-medium transition-shadow duration-200">
        <div class="text-2xl sm:text-3xl font-bold text-warning-600 mb-1">{{ stats.ilimlı }}</div>
        <div class="text-xs sm:text-sm text-gray-600">Ilımlı Müşteri</div>
      </div>
      <div class="card text-center hover:shadow-medium transition-shadow duration-200">
        <div class="text-2xl sm:text-3xl font-bold text-primary-600 mb-1">{{ stats.soguk }}</div>
        <div class="text-xs sm:text-sm text-gray-600">Soğuk Müşteri</div>
      </div>
      <div class="card text-center bg-gradient-to-br from-success-500 to-primary-500 text-white hover:shadow-medium transition-shadow duration-200 col-span-2 sm:col-span-1">
        <div class="text-2xl sm:text-3xl font-bold mb-1">{{ stats.bugunAranacak }}</div>
        <div class="text-xs sm:text-sm">Bugün Aranacak</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Ara</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="İsim, telefon..."
            class="input text-sm"
          />
        </div>
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Müşteri Tipi</label>
          <select v-model="filters.type" class="input text-sm">
            <option value="">Tümü</option>
            <option value="Alıcı">Alıcı</option>
            <option value="Satıcı">Satıcı</option>
            <option value="Kiracı">Kiracı</option>
            <option value="Yatırımcı">Yatırımcı</option>
          </select>
        </div>
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Durum</label>
          <select v-model="filters.status" class="input text-sm">
            <option value="">Tümü</option>
            <option value="Sıcak">Sıcak</option>
            <option value="Ilımlı">Ilımlı</option>
            <option value="Soğuk">Soğuk</option>
          </select>
        </div>
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Öncelik</label>
          <select v-model="filters.priority" class="input text-sm">
            <option value="">Tümü</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Customer List -->
    <div class="grid grid-cols-1 gap-3 sm:gap-4">
      <div
        v-for="musteri in musteriler"
        :key="musteri.id"
        class="card card-hover group cursor-pointer transition-all duration-200"
        @click="selectedMusteri = musteri"
      >
        <div class="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
          <!-- Left: Customer Info -->
          <div class="flex items-start gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
            <!-- Avatar -->
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-xl flex-shrink-0">
              {{ musteri.avatar }}
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <h3 class="text-base sm:text-lg font-bold text-dark-900 truncate">{{ musteri.name }}</h3>
                <span class="text-lg sm:text-xl flex-shrink-0">{{ getPriorityIcon(musteri.priority) }}</span>
                <span :class="['badge text-xs', getStatusColor(musteri.status)]">
                  {{ musteri.status }}
                </span>
                <span class="badge badge-primary text-xs">{{ musteri.type }}</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div class="flex items-center gap-2 text-gray-600">
                  <span>📱</span>
                  <span class="truncate">{{ musteri.phone }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <span>✉️</span>
                  <span class="truncate">{{ musteri.email }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <span>💰</span>
                  <span class="truncate">{{ musteri.budget }}</span>
                </div>
              </div>

              <div class="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p class="text-xs sm:text-sm text-gray-700 line-clamp-2">
                  <span class="font-medium">Not:</span> {{ musteri.notes }}
                </p>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-3 text-xs text-gray-500">
                <span>Son: {{ new Date(musteri.lastContact).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) }}</span>
                <span class="hidden sm:inline">•</span>
                <span class="text-primary-600 font-medium">Sonraki: {{ new Date(musteri.nextContact).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) }}</span>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex flex-row sm:flex-col gap-2 w-full sm:w-auto sm:ml-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            <a :href="`tel:${musteri.phone}`" class="btn btn-primary btn-sm flex-1 sm:flex-initial justify-center">
              <span>📱</span>
              <span class="sm:inline">Ara</span>
            </a>
            <a :href="`https://wa.me/${musteri.phone.replace(/\s/g, '')}`" target="_blank" class="btn btn-success btn-sm flex-1 sm:flex-initial justify-center">
              <span>💬</span>
              <span class="hidden sm:inline">WhatsApp</span>
            </a>
            <NuxtLink :to="`/danisman/musteriler/${musteri.id}`" class="btn btn-outline btn-sm flex-1 sm:flex-initial justify-center" @click.stop>
              <span>✏️</span>
              <span class="sm:inline">Düzenle</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="musteriler.length === 0" class="card text-center py-12">
      <div class="text-6xl mb-4">👥</div>
      <h3 class="text-xl font-bold text-dark-900 mb-2">Henüz müşteri yok</h3>
      <p class="text-gray-600 mb-6">İlk müşterinizi ekleyerek başlayın</p>
      <NuxtLink to="/danisman/musteriler/ekle" class="btn btn-primary">
        <span>➕</span>
        <span>Yeni Müşteri Ekle</span>
      </NuxtLink>
    </div>
  </div>
</template>
