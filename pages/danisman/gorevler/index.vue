<script setup>
definePageMeta({
  layout: 'danisman',
  middleware: 'auth'
})

const gorevler = ref([
  {
    id: 1,
    baslik: 'Kadıköy portföy fotoğrafları çek',
    aciklama: 'Yeni alınan Kadıköy lüks daire için profesyonel fotoğraflar çekilmeli',
    tarih: '2025-05-09',
    saat: '10:00',
    oncelik: 'high',
    durum: 'bekliyor',
    kategori: 'Portföy İşlemleri',
    lokasyon: 'Kadıköy, İstanbul'
  },
  {
    id: 2,
    baslik: 'Malik bilgilendirme - Bostancı Villa',
    aciklama: 'Haftalık portföy raporu gönderilmesi gerekiyor',
    tarih: '2025-05-09',
    saat: '14:00',
    oncelik: 'medium',
    durum: 'bekliyor',
    kategori: 'Malik İlişkileri',
    lokasyon: 'Bostancı, İstanbul'
  },
  {
    id: 3,
    baslik: 'Mehmet Demir ile görüşme',
    aciklama: 'Potansiyel müşteri ile portföy gösterimi',
    tarih: '2025-05-09',
    saat: '16:00',
    oncelik: 'high',
    durum: 'devam-ediyor',
    kategori: 'Müşteri Görüşmeleri',
    lokasyon: 'Ofis'
  },
  {
    id: 4,
    baslik: 'Yeni portföy ilan hazırlığı',
    aciklama: 'Maltepe ofis için ilan metni ve görselleri hazırla',
    tarih: '2025-05-10',
    saat: '09:00',
    oncelik: 'medium',
    durum: 'bekliyor',
    kategori: 'İlan Yönetimi',
    lokasyon: 'Ofis'
  },
  {
    id: 5,
    baslik: 'Kira sözleşmesi yenileme',
    aciklama: 'Ataşehir daire kiracısı ile sözleşme yenileme görüşmesi',
    tarih: '2025-05-10',
    saat: '15:00',
    oncelik: 'high',
    durum: 'bekliyor',
    kategori: 'Sözleşme İşlemleri',
    lokasyon: 'Ataşehir'
  },
  {
    id: 6,
    baslik: 'Haftalık ofis toplantısı',
    aciklama: 'Ekip toplantısına katılım',
    tarih: '2025-05-11',
    saat: '10:00',
    oncelik: 'low',
    durum: 'tamamlandi',
    kategori: 'Ofis İşleri',
    lokasyon: 'Ofis'
  },
])

const filters = ref({
  durum: '',
  oncelik: '',
  kategori: ''
})

const getOncelikColor = (oncelik) => {
  const colors = {
    'high': 'bg-danger-100 text-danger-700 border-danger-200',
    'medium': 'bg-warning-100 text-warning-700 border-warning-200',
    'low': 'bg-primary-100 text-primary-700 border-primary-200'
  }
  return colors[oncelik] || 'bg-gray-100 text-gray-700'
}

const getOncelikIcon = (oncelik) => {
  const icons = { 'high': '🔥', 'medium': '⚡', 'low': '📌' }
  return icons[oncelik] || '📌'
}

const getDurumColor = (durum) => {
  const colors = {
    'bekliyor': 'bg-gray-100 text-gray-700',
    'devam-ediyor': 'bg-primary-100 text-primary-700',
    'tamamlandi': 'bg-success-100 text-success-700'
  }
  return colors[durum] || 'bg-gray-100 text-gray-700'
}

const getDurumText = (durum) => {
  const text = {
    'bekliyor': 'Bekliyor',
    'devam-ediyor': 'Devam Ediyor',
    'tamamlandi': 'Tamamlandı'
  }
  return text[durum] || durum
}

const stats = ref({
  toplam: gorevler.value.length,
  bekliyor: gorevler.value.filter(g => g.durum === 'bekliyor').length,
  devamEdiyor: gorevler.value.filter(g => g.durum === 'devam-ediyor').length,
  tamamlandi: gorevler.value.filter(g => g.durum === 'tamamlandi').length
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-display font-bold text-dark-900 mb-2">Görevler</h1>
        <p class="text-gray-600">Tüm görevlerinizi takip edin ve yönetin</p>
      </div>
      <button class="btn btn-primary btn-lg">
        <span class="text-xl">➕</span>
        <span>Yeni Görev</span>
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card text-center hover:shadow-medium transition-shadow">
        <div class="text-3xl font-bold text-dark-900 mb-1">{{ stats.toplam }}</div>
        <div class="text-sm text-gray-600">Toplam Görev</div>
      </div>
      <div class="card text-center hover:shadow-medium transition-shadow">
        <div class="text-3xl font-bold text-warning-600 mb-1">{{ stats.bekliyor }}</div>
        <div class="text-sm text-gray-600">Bekliyor</div>
      </div>
      <div class="card text-center hover:shadow-medium transition-shadow">
        <div class="text-3xl font-bold text-primary-600 mb-1">{{ stats.devamEdiyor }}</div>
        <div class="text-sm text-gray-600">Devam Ediyor</div>
      </div>
      <div class="card text-center bg-gradient-to-br from-success-500 to-success-600 text-white hover:shadow-medium transition-shadow">
        <div class="text-3xl font-bold mb-1">{{ stats.tamamlandi }}</div>
        <div class="text-sm">Tamamlandı</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Durum</label>
          <select v-model="filters.durum" class="input">
            <option value="">Tümü</option>
            <option value="bekliyor">Bekliyor</option>
            <option value="devam-ediyor">Devam Ediyor</option>
            <option value="tamamlandi">Tamamlandı</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
          <select v-model="filters.oncelik" class="input">
            <option value="">Tümü</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <select v-model="filters.kategori" class="input">
            <option value="">Tümü</option>
            <option value="Portföy İşlemleri">Portföy İşlemleri</option>
            <option value="Müşteri Görüşmeleri">Müşteri Görüşmeleri</option>
            <option value="Malik İlişkileri">Malik İlişkileri</option>
            <option value="İlan Yönetimi">İlan Yönetimi</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Görev Listesi -->
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="gorev in gorevler"
        :key="gorev.id"
        class="card card-hover group"
        :class="{ 'opacity-60': gorev.durum === 'tamamlandi' }"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">{{ getOncelikIcon(gorev.oncelik) }}</span>
              <h3 class="text-xl font-bold text-dark-900" :class="{ 'line-through': gorev.durum === 'tamamlandi' }">
                {{ gorev.baslik }}
              </h3>
            </div>
            <p class="text-gray-600 mb-3">{{ gorev.aciklama }}</p>

            <div class="flex flex-wrap gap-2 mb-3">
              <span :class="['badge border', getOncelikColor(gorev.oncelik)]">
                {{ gorev.oncelik === 'high' ? 'Yüksek Öncelik' : gorev.oncelik === 'medium' ? 'Orta Öncelik' : 'Düşük Öncelik' }}
              </span>
              <span :class="['badge', getDurumColor(gorev.durum)]">
                {{ getDurumText(gorev.durum) }}
              </span>
              <span class="badge badge-primary">{{ gorev.kategori }}</span>
            </div>

            <div class="flex items-center gap-4 text-sm text-gray-600">
              <span class="flex items-center gap-1">
                <span>📅</span>
                <span>{{ new Date(gorev.tarih).toLocaleDateString('tr-TR') }}</span>
              </span>
              <span class="flex items-center gap-1">
                <span>🕐</span>
                <span>{{ gorev.saat }}</span>
              </span>
              <span class="flex items-center gap-1">
                <span>📍</span>
                <span>{{ gorev.lokasyon }}</span>
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button v-if="gorev.durum !== 'tamamlandi'" class="btn btn-success btn-sm">
              <span>✓</span>
              <span>Tamamla</span>
            </button>
            <button class="btn btn-outline btn-sm">
              <span>✏️</span>
              <span>Düzenle</span>
            </button>
            <button class="btn btn-ghost btn-sm text-danger-600">
              <span>🗑️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
