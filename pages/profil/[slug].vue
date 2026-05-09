<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const slug = route.params.slug

// Mock danışman profil data
const danisman = ref({
  name: 'Ahmet Yılmaz',
  title: 'Gayrimenkul Danışmanı',
  avatar: 'AY',
  photo: null,
  bio: 'İstanbul\'da 8 yıldır gayrimenkul sektöründe çalışıyorum. Müşterilerime en iyi hizmeti sunmak için deneyim ve uzmanlığımı kullanıyorum.',
  uzmanlik: ['Satılık Daire', 'Kiralık Ofis', 'Lüks Konutlar'],
  bolgeler: ['Kadıköy', 'Bostancı', 'Maltepe', 'Kartal'],
  iletisim: {
    phone: '0532 123 4567',
    whatsapp: '905321234567',
    email: 'ahmet.yilmaz@emlakcrm.com'
  },
  social: {
    instagram: '@ahmetyilmaz.emlak',
    linkedin: 'ahmet-yilmaz-emlak',
    facebook: 'ahmetyilmaz.emlak'
  },
  stats: {
    yil: 8,
    satis: 150,
    mutluMusteri: 200,
    aktifIlan: 18
  },
  yetenekler: [
    { name: 'Pazarlama', level: 95 },
    { name: 'Müşteri İlişkileri', level: 98 },
    { name: 'Piyasa Analizi', level: 90 },
    { name: 'Satış & Kiralama', level: 92 }
  ]
})

const aktifIlanlar = ref([
  {
    id: 1,
    title: 'Kadıköy Lüks Daire',
    type: 'Satılık',
    price: 3500000,
    location: 'Kadıköy, İstanbul',
    area: 150,
    rooms: '3+1',
    image: '🏢'
  },
  {
    id: 2,
    title: 'Bostancı Villa',
    type: 'Satılık',
    price: 12500000,
    location: 'Bostancı, İstanbul',
    area: 350,
    rooms: '5+2',
    image: '🏡'
  },
  {
    id: 3,
    title: 'Maltepe Ofis',
    type: 'Kiralık',
    price: 45000,
    location: 'Maltepe, İstanbul',
    area: 200,
    rooms: 'Open Plan',
    image: '🏬'
  },
  {
    id: 4,
    title: 'Kartal Residence',
    type: 'Satılık',
    price: 2850000,
    location: 'Kartal, İstanbul',
    area: 120,
    rooms: '2+1',
    image: '🏢'
  }
])

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-purple-700 text-white overflow-hidden">
      <div class="absolute inset-0 bg-pattern opacity-10"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>

      <div class="relative max-w-6xl mx-auto px-6 py-16">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-40 h-40 bg-white rounded-2xl flex items-center justify-center text-primary-600 font-bold text-5xl shadow-hard">
              {{ danisman.avatar }}
            </div>
            <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-success-500 rounded-full flex items-center justify-center text-white shadow-lg">
              ✓
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-5xl font-display font-bold mb-3">{{ danisman.name }}</h1>
            <p class="text-2xl text-primary-100 mb-6">{{ danisman.title }}</p>
            <p class="text-lg text-white/90 mb-8 max-w-2xl">{{ danisman.bio }}</p>

            <!-- Contact Buttons -->
            <div class="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                :href="`tel:${danisman.iletisim.phone}`"
                class="btn bg-white text-primary-600 hover:bg-gray-50"
              >
                <span>📱</span>
                <span>Telefon</span>
              </a>
              <a
                :href="`https://wa.me/${danisman.iletisim.whatsapp}`"
                target="_blank"
                class="btn bg-success-600 hover:bg-success-700 text-white"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
              <a
                :href="`mailto:${danisman.iletisim.email}`"
                class="btn bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <span>✉️</span>
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div class="text-4xl font-bold mb-2">{{ danisman.stats.yil }}+</div>
            <div class="text-sm text-white/80">Yıl Deneyim</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div class="text-4xl font-bold mb-2">{{ danisman.stats.satis }}+</div>
            <div class="text-sm text-white/80">Başarılı Satış</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div class="text-4xl font-bold mb-2">{{ danisman.stats.mutluMusteri }}+</div>
            <div class="text-sm text-white/80">Mutlu Müşteri</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div class="text-4xl font-bold mb-2">{{ danisman.stats.aktifIlan }}</div>
            <div class="text-sm text-white/80">Aktif İlan</div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - About -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Uzmanlık Alanları -->
          <div class="card">
            <h3 class="text-xl font-bold text-dark-900 mb-4 flex items-center gap-2">
              <span>🎯</span>
              <span>Uzmanlık Alanları</span>
            </h3>
            <div class="space-y-2">
              <div
                v-for="uzmanlik in danisman.uzmanlik"
                :key="uzmanlik"
                class="badge badge-primary text-sm py-2 px-4"
              >
                {{ uzmanlik }}
              </div>
            </div>
          </div>

          <!-- Çalışma Bölgeleri -->
          <div class="card">
            <h3 class="text-xl font-bold text-dark-900 mb-4 flex items-center gap-2">
              <span>📍</span>
              <span>Çalışma Bölgeleri</span>
            </h3>
            <div class="space-y-2">
              <div
                v-for="bolge in danisman.bolgeler"
                :key="bolge"
                class="flex items-center gap-2 text-gray-700"
              >
                <span class="w-2 h-2 bg-primary-600 rounded-full"></span>
                <span>{{ bolge }}</span>
              </div>
            </div>
          </div>

          <!-- Yetenekler -->
          <div class="card">
            <h3 class="text-xl font-bold text-dark-900 mb-4 flex items-center gap-2">
              <span>⭐</span>
              <span>Yetenekler</span>
            </h3>
            <div class="space-y-4">
              <div v-for="yetenek in danisman.yetenekler" :key="yetenek.name">
                <div class="flex items-center justify-between mb-2 text-sm">
                  <span class="font-medium text-dark-900">{{ yetenek.name }}</span>
                  <span class="text-primary-600 font-bold">%{{ yetenek.level }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-1000"
                    :style="{ width: `${yetenek.level}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="card">
            <h3 class="text-xl font-bold text-dark-900 mb-4 flex items-center gap-2">
              <span>🔗</span>
              <span>Sosyal Medya</span>
            </h3>
            <div class="space-y-3">
              <a
                :href="`https://instagram.com/${danisman.social.instagram.replace('@', '')}`"
                target="_blank"
                class="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <span class="text-xl">📷</span>
                <span class="font-medium">{{ danisman.social.instagram }}</span>
              </a>
              <a
                :href="`https://linkedin.com/in/${danisman.social.linkedin}`"
                target="_blank"
                class="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <span class="text-xl">💼</span>
                <span class="font-medium">LinkedIn</span>
              </a>
              <a
                :href="`https://facebook.com/${danisman.social.facebook}`"
                target="_blank"
                class="flex items-center gap-3 p-3 bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <span class="text-xl">👥</span>
                <span class="font-medium">Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column - Listings -->
        <div class="lg:col-span-2">
          <div class="card mb-6">
            <h2 class="text-2xl font-display font-bold text-dark-900 mb-2">Aktif İlanlarım</h2>
            <p class="text-gray-600">Sizin için seçtiğim güncel gayrimenkuller</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="ilan in aktifIlanlar"
              :key="ilan.id"
              class="card card-hover group cursor-pointer"
            >
              <!-- Image -->
              <div class="relative h-48 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg mb-4 overflow-hidden flex items-center justify-center text-7xl">
                {{ ilan.image }}
                <div class="absolute top-3 right-3">
                  <span class="badge bg-dark-800 text-white">{{ ilan.type }}</span>
                </div>
              </div>

              <!-- Content -->
              <h3 class="text-lg font-bold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                {{ ilan.title }}
              </h3>
              <p class="text-sm text-gray-600 mb-3 flex items-center gap-1">
                <span>📍</span>
                <span>{{ ilan.location }}</span>
              </p>

              <!-- Details -->
              <div class="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div class="text-xs text-gray-500">Metrekare</div>
                  <div class="font-semibold text-dark-900">{{ ilan.area }} m²</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Oda</div>
                  <div class="font-semibold text-dark-900">{{ ilan.rooms }}</div>
                </div>
              </div>

              <!-- Price -->
              <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                <div class="text-2xl font-bold text-primary-600">
                  {{ formatPrice(ilan.price) }}
                  <span v-if="ilan.type === 'Kiralık'" class="text-xs text-gray-500">/ay</span>
                </div>
                <button class="btn btn-primary btn-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>👁️</span>
                  <span>Detay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="card bg-gradient-to-br from-primary-600 to-secondary-600 text-white text-center mt-12">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-3xl font-display font-bold mb-4">Hayalinizdeki Evi Bulalım</h2>
          <p class="text-lg text-primary-100 mb-8">
            İhtiyaçlarınıza en uygun gayrimenkulleri bulmak için benimle iletişime geçin.
            Profesyonel danışmanlık hizmetimle yanınızdayım.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a
              :href="`https://wa.me/${danisman.iletisim.whatsapp}?text=Merhaba, gayrimenkul konusunda bilgi almak istiyorum.`"
              target="_blank"
              class="btn bg-success-600 hover:bg-success-700 text-white btn-lg"
            >
              <span class="text-xl">💬</span>
              <span>WhatsApp ile İletişime Geç</span>
            </a>
            <a
              :href="`tel:${danisman.iletisim.phone}`"
              class="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg"
            >
              <span class="text-xl">📱</span>
              <span>Hemen Ara</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
