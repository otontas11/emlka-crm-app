<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const showAddModal = ref(false)

const danismanlar = ref([
  {
    id: 1,
    name: 'Mehmet Demir',
    email: 'danisman@emlakcrm.com',
    telefon: '0532 123 4567',
    avatar: 'MD',
    baslangic: '2024-01-15',
    durum: 'aktif',
    performans: {
      satis: 8,
      kiralama: 15,
      ciro: 450000,
      komisyon: 45000,
      portfoy: 24,
      hedefOran: 92
    }
  },
  {
    id: 2,
    name: 'Ayşe Yılmaz',
    email: 'ayse.yilmaz@emlakcrm.com',
    telefon: '0533 234 5678',
    avatar: 'AY',
    baslangic: '2024-02-10',
    durum: 'aktif',
    performans: {
      satis: 6,
      kiralama: 12,
      ciro: 380000,
      komisyon: 38000,
      portfoy: 19,
      hedefOran: 85
    }
  },
  {
    id: 3,
    name: 'Can Öztürk',
    email: 'can.ozturk@emlakcrm.com',
    telefon: '0534 345 6789',
    avatar: 'CÖ',
    baslangic: '2024-03-05',
    durum: 'aktif',
    performans: {
      satis: 5,
      kiralama: 10,
      ciro: 320000,
      komisyon: 32000,
      portfoy: 16,
      hedefOran: 78
    }
  },
  {
    id: 4,
    name: 'Zeynep Kara',
    email: 'zeynep.kara@emlakcrm.com',
    telefon: '0535 456 7890',
    avatar: 'ZK',
    baslangic: '2024-04-20',
    durum: 'aktif',
    performans: {
      satis: 3,
      kiralama: 7,
      ciro: 210000,
      komisyon: 21000,
      portfoy: 12,
      hedefOran: 65
    }
  },
  {
    id: 5,
    name: 'Ali Şahin',
    email: 'ali.sahin@emlakcrm.com',
    telefon: '0536 567 8901',
    avatar: 'AŞ',
    baslangic: '2025-01-10',
    durum: 'yeni',
    performans: {
      satis: 1,
      kiralama: 3,
      ciro: 95000,
      komisyon: 9500,
      portfoy: 8,
      hedefOran: 42
    }
  }
])

const newDanisman = ref({
  name: '',
  email: '',
  telefon: '',
  password: ''
})

const stats = computed(() => ({
  toplam: danismanlar.value.length,
  aktif: danismanlar.value.filter(d => d.durum === 'aktif').length,
  toplamCiro: danismanlar.value.reduce((sum, d) => sum + d.performans.ciro, 0),
  toplamKomisyon: danismanlar.value.reduce((sum, d) => sum + d.performans.komisyon, 0)
}))

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(price)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDurumColor = (durum) => {
  return durum === 'aktif' ? 'bg-success-100 text-success-700' : 'bg-primary-100 text-primary-700'
}

const getDurumText = (durum) => {
  return durum === 'aktif' ? 'Aktif' : 'Yeni Başladı'
}

const getPerformansColor = (oran) => {
  if (oran >= 90) return 'text-success-600'
  if (oran >= 75) return 'text-warning-600'
  return 'text-danger-600'
}

const handleAddDanisman = () => {
  if (!newDanisman.value.name || !newDanisman.value.email || !newDanisman.value.telefon || !newDanisman.value.password) {
    alert('Lütfen tüm alanları doldurun')
    return
  }

  const avatar = newDanisman.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  danismanlar.value.push({
    id: danismanlar.value.length + 1,
    name: newDanisman.value.name,
    email: newDanisman.value.email,
    telefon: newDanisman.value.telefon,
    avatar: avatar,
    baslangic: new Date().toISOString().split('T')[0],
    durum: 'yeni',
    performans: {
      satis: 0,
      kiralama: 0,
      ciro: 0,
      komisyon: 0,
      portfoy: 0,
      hedefOran: 0
    }
  })

  newDanisman.value = { name: '', email: '', telefon: '', password: '' }
  showAddModal.value = false
}

const selectedDanisman = ref(null)

const viewDetails = (danisman) => {
  selectedDanisman.value = danisman
}

const closeDetails = () => {
  selectedDanisman.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-display font-bold text-dark-900 mb-2">Danışmanlar</h1>
        <p class="text-gray-600">Danışman ekibini yönetin ve performansı takip edin</p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary btn-lg">
        <span class="text-xl">➕</span>
        <span>Yeni Danışman</span>
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card text-center hover:shadow-medium transition-shadow">
        <div class="text-3xl mb-2">👥</div>
        <div class="text-3xl font-bold text-dark-900 mb-1">{{ stats.toplam }}</div>
        <div class="text-sm text-gray-600">Toplam Danışman</div>
      </div>
      <div class="card text-center hover:shadow-medium transition-shadow">
        <div class="text-3xl mb-2">✓</div>
        <div class="text-3xl font-bold text-success-600 mb-1">{{ stats.aktif }}</div>
        <div class="text-sm text-gray-600">Aktif Danışman</div>
      </div>
      <div class="card text-center bg-gradient-to-br from-warning-500 to-orange-500 text-white hover:shadow-medium transition-shadow">
        <div class="text-3xl mb-2">💰</div>
        <div class="text-2xl font-bold mb-1">{{ formatPrice(stats.toplamCiro) }}</div>
        <div class="text-sm">Toplam Ciro</div>
      </div>
      <div class="card text-center hover:shadow-medium transition-shadow">
        <div class="text-3xl mb-2">💵</div>
        <div class="text-2xl font-bold text-success-600 mb-1">{{ formatPrice(stats.toplamKomisyon) }}</div>
        <div class="text-sm text-gray-600">Toplam Komisyon</div>
      </div>
    </div>

    <!-- Danışman Listesi -->
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="danisman in danismanlar"
        :key="danisman.id"
        class="card card-hover group cursor-pointer"
        @click="viewDetails(danisman)"
      >
        <div class="flex items-start gap-6">
          <div class="flex-shrink-0">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {{ danisman.avatar }}
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h3 class="text-xl font-bold text-dark-900 mb-1">{{ danisman.name }}</h3>
                <div class="flex items-center gap-3 text-sm text-gray-600">
                  <span class="flex items-center gap-1">
                    <span>📧</span>
                    <span>{{ danisman.email }}</span>
                  </span>
                  <span class="flex items-center gap-1">
                    <span>📱</span>
                    <span>{{ danisman.telefon }}</span>
                  </span>
                </div>
              </div>
              <div class="text-right">
                <span :class="['badge', getDurumColor(danisman.durum)]">
                  {{ getDurumText(danisman.durum) }}
                </span>
                <p class="text-xs text-gray-500 mt-2">Başlangıç: {{ formatDate(danisman.baslangic) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-success-600">{{ danisman.performans.satis }}</div>
                <div class="text-xs text-gray-600">Satış</div>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-primary-600">{{ danisman.performans.kiralama }}</div>
                <div class="text-xs text-gray-600">Kiralama</div>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <div class="text-xl font-bold text-warning-600">{{ Math.floor(danisman.performans.ciro / 1000) }}K</div>
                <div class="text-xs text-gray-600">Ciro</div>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <div class="text-xl font-bold text-success-600">{{ Math.floor(danisman.performans.komisyon / 1000) }}K</div>
                <div class="text-xs text-gray-600">Komisyon</div>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-dark-900">{{ danisman.performans.portfoy }}</div>
                <div class="text-xs text-gray-600">Portföy</div>
              </div>
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <div :class="['text-2xl font-bold', getPerformansColor(danisman.performans.hedefOran)]">
                  %{{ danisman.performans.hedefOran }}
                </div>
                <div class="text-xs text-gray-600">Hedef</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Danışman Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showAddModal = false">
      <div class="bg-white rounded-2xl shadow-hard max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-dark-900">Yeni Danışman Ekle</h2>
          <button @click="showAddModal = false" class="btn btn-ghost btn-sm">
            <span class="text-xl">✕</span>
          </button>
        </div>

        <form @submit.prevent="handleAddDanisman" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
            <input v-model="newDanisman.name" type="text" placeholder="Ahmet Yılmaz" class="input" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input v-model="newDanisman.email" type="email" placeholder="ahmet.yilmaz@emlakcrm.com" class="input" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <input v-model="newDanisman.telefon" type="tel" placeholder="0532 123 4567" class="input" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
            <input v-model="newDanisman.password" type="password" placeholder="••••••••" class="input" required />
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="showAddModal = false" class="btn btn-outline flex-1">İptal</button>
            <button type="submit" class="btn btn-primary flex-1">
              <span>✓</span>
              <span>Danışman Ekle</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedDanisman" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeDetails">
      <div class="bg-white rounded-2xl shadow-hard max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {{ selectedDanisman.avatar }}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-dark-900">{{ selectedDanisman.name }}</h2>
              <p class="text-gray-600">{{ selectedDanisman.email }}</p>
              <span :class="['badge mt-2', getDurumColor(selectedDanisman.durum)]">
                {{ getDurumText(selectedDanisman.durum) }}
              </span>
            </div>
          </div>
          <button @click="closeDetails" class="btn btn-ghost btn-sm">
            <span class="text-xl">✕</span>
          </button>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-dark-900 mb-4">İletişim Bilgileri</h3>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-700">
                <span>📧</span>
                <span>{{ selectedDanisman.email }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-700">
                <span>📱</span>
                <span>{{ selectedDanisman.telefon }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-700">
                <span>📅</span>
                <span>Başlangıç: {{ formatDate(selectedDanisman.baslangic) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-bold text-dark-900 mb-4">Performans Özeti</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="card text-center">
                <div class="text-3xl mb-2">🏆</div>
                <div class="text-2xl font-bold text-success-600">{{ selectedDanisman.performans.satis }}</div>
                <div class="text-sm text-gray-600">Başarılı Satış</div>
              </div>
              <div class="card text-center">
                <div class="text-3xl mb-2">🔑</div>
                <div class="text-2xl font-bold text-primary-600">{{ selectedDanisman.performans.kiralama }}</div>
                <div class="text-sm text-gray-600">Başarılı Kiralama</div>
              </div>
              <div class="card text-center">
                <div class="text-3xl mb-2">💰</div>
                <div class="text-xl font-bold text-warning-600">{{ formatPrice(selectedDanisman.performans.ciro) }}</div>
                <div class="text-sm text-gray-600">Toplam Ciro</div>
              </div>
              <div class="card text-center">
                <div class="text-3xl mb-2">💵</div>
                <div class="text-xl font-bold text-success-600">{{ formatPrice(selectedDanisman.performans.komisyon) }}</div>
                <div class="text-sm text-gray-600">Komisyon</div>
              </div>
              <div class="card text-center">
                <div class="text-3xl mb-2">🏢</div>
                <div class="text-2xl font-bold text-dark-900">{{ selectedDanisman.performans.portfoy }}</div>
                <div class="text-sm text-gray-600">Aktif Portföy</div>
              </div>
              <div class="card text-center">
                <div class="text-3xl mb-2">🎯</div>
                <div :class="['text-2xl font-bold', getPerformansColor(selectedDanisman.performans.hedefOran)]">
                  %{{ selectedDanisman.performans.hedefOran }}
                </div>
                <div class="text-sm text-gray-600">Hedef Oranı</div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t">
            <button class="btn btn-outline flex-1">
              <span>✏️</span>
              <span>Düzenle</span>
            </button>
            <button class="btn btn-primary flex-1">
              <span>📊</span>
              <span>Detaylı Rapor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
