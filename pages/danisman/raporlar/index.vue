<script setup>
definePageMeta({
  layout: 'danisman',
  middleware: 'auth'
})

const selectedPeriod = ref('week')

const weeklyStats = ref({
  aramalar: 45,
  gosterimler: 12,
  yeniMusteriler: 8,
  teklifler: 5,
  kapananIslemler: 2,
  malikRaporlari: 15
})

const monthlyStats = ref({
  satis: 3,
  kiralama: 5,
  toplamCiro: 450000,
  toplamKomisyon: 45000,
  yeniPortfoy: 8,
  toplamMusteri: 24
})

const performans = ref([
  { gun: 'Pazartesi', aramalar: 8, gosterimler: 2, teklifler: 1 },
  { gun: 'Salı', aramalar: 6, gosterimler: 1, teklifler: 0 },
  { gun: 'Çarşamba', aramalar: 10, gosterimler: 3, teklifler: 2 },
  { gun: 'Perşembe', aramalar: 7, gosterimler: 2, teklifler: 1 },
  { gun: 'Cuma', aramalar: 9, gosterimler: 3, teklifler: 1 },
  { gun: 'Cumartesi', aramalar: 5, gosterimler: 1, teklifler: 0 },
])

const enIyiPortfoyler = ref([
  { baslik: 'Kadıköy Lüks Daire', goruntulenme: 245, favori: 18, arama: 12 },
  { baslik: 'Bostancı Villa', goruntulenme: 387, favori: 42, arama: 25 },
  { baslik: 'Maltepe Ofis', goruntulenme: 156, favori: 12, arama: 8 },
])

const hedefler = ref({
  aylikSatis: { hedef: 3, gerceklesen: 2, oran: 67 },
  aylikKiralama: { hedef: 5, gerceklesen: 4, oran: 80 },
  aylikCiro: { hedef: 500000, gerceklesen: 450000, oran: 90 },
  yeniPortfoy: { hedef: 10, gerceklesen: 8, oran: 80 }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(price)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-display font-bold text-dark-900 mb-2">Raporlar</h1>
        <p class="text-gray-600">Performans analizi ve istatistikler</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="selectedPeriod = 'week'"
          :class="['btn btn-sm', selectedPeriod === 'week' ? 'btn-primary' : 'btn-outline']"
        >
          Haftalık
        </button>
        <button
          @click="selectedPeriod = 'month'"
          :class="['btn btn-sm', selectedPeriod === 'month' ? 'btn-primary' : 'btn-outline']"
        >
          Aylık
        </button>
        <button class="btn btn-outline btn-sm">
          <span>📥</span>
          <span>PDF İndir</span>
        </button>
      </div>
    </div>

    <!-- Haftalık Özet -->
    <div v-if="selectedPeriod === 'week'" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div class="card text-center">
        <div class="text-3xl mb-2">📞</div>
        <div class="text-2xl font-bold text-primary-600 mb-1">{{ weeklyStats.aramalar }}</div>
        <div class="text-sm text-gray-600">Aramalar</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl mb-2">👁️</div>
        <div class="text-2xl font-bold text-purple-600 mb-1">{{ weeklyStats.gosterimler }}</div>
        <div class="text-sm text-gray-600">Gösterimler</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl mb-2">👥</div>
        <div class="text-2xl font-bold text-success-600 mb-1">{{ weeklyStats.yeniMusteriler }}</div>
        <div class="text-sm text-gray-600">Yeni Müşteri</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl mb-2">💰</div>
        <div class="text-2xl font-bold text-warning-600 mb-1">{{ weeklyStats.teklifler }}</div>
        <div class="text-sm text-gray-600">Teklifler</div>
      </div>
      <div class="card text-center bg-gradient-to-br from-success-500 to-success-600 text-white">
        <div class="text-3xl mb-2">✓</div>
        <div class="text-2xl font-bold mb-1">{{ weeklyStats.kapananIslemler }}</div>
        <div class="text-sm">Kapanan İşlem</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl mb-2">📊</div>
        <div class="text-2xl font-bold text-primary-600 mb-1">{{ weeklyStats.malikRaporlari }}</div>
        <div class="text-sm text-gray-600">Malik Raporu</div>
      </div>
    </div>

    <!-- Aylık Özet -->
    <div v-if="selectedPeriod === 'month'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <span class="text-4xl">🏆</span>
          <span class="badge badge-success">+25%</span>
        </div>
        <div class="text-3xl font-bold text-dark-900 mb-1">{{ monthlyStats.satis }}</div>
        <div class="text-sm text-gray-600">Başarılı Satış</div>
      </div>
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <span class="text-4xl">🔑</span>
          <span class="badge badge-primary">+15%</span>
        </div>
        <div class="text-3xl font-bold text-dark-900 mb-1">{{ monthlyStats.kiralama }}</div>
        <div class="text-sm text-gray-600">Başarılı Kiralama</div>
      </div>
      <div class="card bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div class="flex items-center justify-between mb-4">
          <span class="text-4xl">💰</span>
          <span class="badge bg-white/20 text-white">+18%</span>
        </div>
        <div class="text-3xl font-bold mb-1">{{ formatPrice(monthlyStats.toplamCiro) }}</div>
        <div class="text-sm opacity-90">Toplam Ciro</div>
      </div>
      <div class="card">
        <span class="text-4xl mb-4 block">💵</span>
        <div class="text-3xl font-bold text-success-600 mb-1">{{ formatPrice(monthlyStats.toplamKomisyon) }}</div>
        <div class="text-sm text-gray-600">Toplam Komisyon</div>
      </div>
      <div class="card">
        <span class="text-4xl mb-4 block">🏢</span>
        <div class="text-3xl font-bold text-primary-600 mb-1">{{ monthlyStats.yeniPortfoy }}</div>
        <div class="text-sm text-gray-600">Yeni Portföy</div>
      </div>
      <div class="card">
        <span class="text-4xl mb-4 block">👥</span>
        <div class="text-3xl font-bold text-dark-900 mb-1">{{ monthlyStats.toplamMusteri }}</div>
        <div class="text-sm text-gray-600">Toplam Müşteri</div>
      </div>
    </div>

    <!-- Günlük Performans -->
    <div class="card">
      <h3 class="text-xl font-bold text-dark-900 mb-6">Haftalık Performans</h3>
      <div class="space-y-4">
        <div v-for="gun in performans" :key="gun.gun" class="flex items-center gap-4">
          <div class="w-24 font-semibold text-gray-700">{{ gun.gun }}</div>
          <div class="flex-1 grid grid-cols-3 gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Aramalar:</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full" :style="{ width: `${gun.aramalar * 10}%` }"></div>
              </div>
              <span class="text-sm font-semibold text-primary-600">{{ gun.aramalar }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Gösterimler:</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" :style="{ width: `${gun.gosterimler * 33}%` }"></div>
              </div>
              <span class="text-sm font-semibold text-purple-600">{{ gun.gosterimler }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Teklifler:</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full" :style="{ width: `${gun.teklifler * 50}%` }"></div>
              </div>
              <span class="text-sm font-semibold text-success-600">{{ gun.teklifler }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- En İyi Portföyler -->
    <div class="card">
      <h3 class="text-xl font-bold text-dark-900 mb-6">En Popüler Portföyler</h3>
      <div class="space-y-4">
        <div v-for="portfoy in enIyiPortfoyler" :key="portfoy.baslik" class="p-4 bg-gray-50 rounded-lg">
          <h4 class="font-semibold text-dark-900 mb-3">{{ portfoy.baslik }}</h4>
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div class="flex items-center gap-2">
              <span>👁️</span>
              <span class="text-gray-600">Görüntülenme:</span>
              <span class="font-bold text-primary-600">{{ portfoy.goruntulenme }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span>❤️</span>
              <span class="text-gray-600">Favori:</span>
              <span class="font-bold text-danger-600">{{ portfoy.favori }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span>📞</span>
              <span class="text-gray-600">Arama:</span>
              <span class="font-bold text-success-600">{{ portfoy.arama }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hedef Takibi -->
    <div class="card">
      <h3 class="text-xl font-bold text-dark-900 mb-6">Aylık Hedefler</h3>
      <div class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-gray-700">Satış Hedefi</span>
            <span class="text-sm">{{ hedefler.aylikSatis.gerceklesen }} / {{ hedefler.aylikSatis.hedef }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full" :style="{ width: `${hedefler.aylikSatis.oran}%` }"></div>
          </div>
          <div class="text-right text-sm font-semibold text-success-600 mt-1">%{{ hedefler.aylikSatis.oran }}</div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-gray-700">Kiralama Hedefi</span>
            <span class="text-sm">{{ hedefler.aylikKiralama.gerceklesen }} / {{ hedefler.aylikKiralama.hedef }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full" :style="{ width: `${hedefler.aylikKiralama.oran}%` }"></div>
          </div>
          <div class="text-right text-sm font-semibold text-primary-600 mt-1">%{{ hedefler.aylikKiralama.oran }}</div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-gray-700">Ciro Hedefi</span>
            <span class="text-sm">{{ formatPrice(hedefler.aylikCiro.gerceklesen) }} / {{ formatPrice(hedefler.aylikCiro.hedef) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="bg-gradient-to-r from-warning-500 to-warning-600 h-3 rounded-full" :style="{ width: `${hedefler.aylikCiro.oran}%` }"></div>
          </div>
          <div class="text-right text-sm font-semibold text-warning-600 mt-1">%{{ hedefler.aylikCiro.oran }}</div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-gray-700">Yeni Portföy Hedefi</span>
            <span class="text-sm">{{ hedefler.yeniPortfoy.gerceklesen }} / {{ hedefler.yeniPortfoy.hedef }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full" :style="{ width: `${hedefler.yeniPortfoy.oran}%` }"></div>
          </div>
          <div class="text-right text-sm font-semibold text-purple-600 mt-1">%{{ hedefler.yeniPortfoy.oran }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
