<script setup>
import { useProfile } from '~/composables/useProfile'
import { useProperties } from '~/composables/useProperties'
import { usePublicProfile } from '~/composables/usePublicProfile'

definePageMeta({
  layout: false,
})

const route = useRoute()
const profile = useProfile()
const properties = useProperties()
const { publicSlug } = usePublicProfile()

const isValidProfile = computed(() => {
  return String(route.params.slug || '') === String(publicSlug.value || '')
})

const portfolioFilter = ref('Tümü')
const selectedProperty = ref(null)
const activePhotoIndex = ref(0)

const filteredProperties = computed(() => {
  const list = properties.value.filter(item => item.status === 'Aktif')

  if (portfolioFilter.value === 'Satılık') {
    return list.filter(item => String(item.listingType || '').toLowerCase().includes('sat'))
  }

  if (portfolioFilter.value === 'Kiralık') {
    return list.filter(item => String(item.listingType || '').toLowerCase().includes('kira'))
  }

  return list
})

const selectedPropertyPhotos = computed(() => {
  if (!selectedProperty.value) return []
  return Array.isArray(selectedProperty.value.photos)
    ? selectedProperty.value.photos.slice(0, 20)
    : []
})

const currentMainPhoto = computed(() => {
  return selectedPropertyPhotos.value[activePhotoIndex.value] || selectedPropertyPhotos.value[0] || ''
})

const selectedPropertyVideo = computed(() => {
  if (!selectedProperty.value) return ''
  return selectedProperty.value.video || selectedProperty.value.videoUrl || selectedProperty.value.introVideo || ''
})

const similarProperties = computed(() => {
  if (!selectedProperty.value) return []

  const current = selectedProperty.value

  return properties.value
    .filter(item => item.status === 'Aktif')
    .filter(item => item.id !== current.id)
    .filter(item => {
      const sameDistrict = item.district && current.district && item.district === current.district
      const sameType = item.propertyType && current.propertyType && item.propertyType === current.propertyType
      return sameDistrict || sameType
    })
    .slice(0, 4)
})

const propertyInquiryForm = ref({
  name: '',
  phone: '',
  message: '',
})

const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const formatPrice = (value, currency = 'TL') => {
  const amount = Number(value || 0)

  if (currency === 'USD') {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (currency === 'EUR') {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatArea = (value) => {
  if (!value) return '-'
  return `${value} m²`
}

const openLink = (url) => {
  if (!url) return
  const normalized = url.startsWith('http') ? url : 'https://' + url
  window.open(normalized, '_blank')
}

const openWhatsapp = () => {
  const raw = String(profile.value.whatsapp || '').replace(/\D/g, '')
  if (!raw) return
  const phone = raw.startsWith('90') ? raw : '90' + raw
  window.open('https://wa.me/' + phone, '_blank')
}

const openPhone = () => {
  if (!profile.value.phone) return
  window.open('tel:' + profile.value.phone)
}

const openPropertyDetail = (item) => {
  selectedProperty.value = item
  activePhotoIndex.value = 0
  propertyInquiryForm.value = {
    name: '',
    phone: '',
    message: item?.title
      ? `${item.title} ilanı hakkında bilgi almak istiyorum.`
      : '',
  }

  setTimeout(() => {
    document.getElementById('portfoy-detay')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 50)
}

const closePropertyDetail = () => {
  selectedProperty.value = null
  activePhotoIndex.value = 0
}

const selectDetailPhoto = (index) => {
  activePhotoIndex.value = index
}

const buildWhatsappPhone = () => {
  const raw = String(profile.value.whatsapp || '').replace(/\D/g, '')
  if (!raw) return ''
  return raw.startsWith('90') ? raw : '90' + raw
}

const sendPropertyInquiry = () => {
  const phone = buildWhatsappPhone()
  if (!phone || !selectedProperty.value) return

  const text = encodeURIComponent(
`Merhaba,
İlan: ${selectedProperty.value.title || '-'}
Ad Soyad: ${propertyInquiryForm.value.name || '-'}
Telefon: ${propertyInquiryForm.value.phone || '-'}
Mesaj: ${propertyInquiryForm.value.message || '-'}`
  )

  window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
}

const sendFormToWhatsapp = () => {
  const phone = buildWhatsappPhone()
  if (!phone) return

  const text = encodeURIComponent(
`Merhaba,
Ad Soyad: ${contactForm.value.name || '-'}
E-posta: ${contactForm.value.email || '-'}
Konu: ${contactForm.value.subject || '-'}
Mesaj: ${contactForm.value.message || '-'}`
  )

  window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
}

const videoEmbedUrl = (url) => {
  const value = String(url || '').trim()
  if (!value) return ''

  if (value.includes('youtube.com/watch?v=')) {
    const id = value.split('v=')[1]?.split('&')[0]
    return id ? `https://www.youtube.com/embed/${id}` : value
  }

  if (value.includes('youtu.be/')) {
    const id = value.split('youtu.be/')[1]?.split('?')[0]
    return id ? `https://www.youtube.com/embed/${id}` : value
  }

  return value
}

const mapUrl = computed(() => {
  const q = encodeURIComponent(profile.value.officeAddress || 'İzmir')
  return `https://www.google.com/maps?q=${q}&output=embed`
})

const propertyFeatures = computed(() => {
  if (!selectedProperty.value) return []

  const item = selectedProperty.value

  return [
    { label: 'İlan Türü', value: item.listingType || '-' },
    { label: 'Mülk Tipi', value: item.propertyType || '-' },
    { label: 'Durum', value: item.status || '-' },
    { label: 'Metrekare', value: formatArea(item.squareMeters || item.netArea) },
    { label: 'İl', value: item.city || '-' },
    { label: 'İlçe', value: item.district || '-' },
    { label: 'Mahalle', value: item.neighborhood || item.area || '-' },
    { label: 'Fiyat', value: formatPrice(item.price, item.currency) },
  ]
})

useHead(() => ({
  title: profile.value.fullName
    ? `${profile.value.fullName} | ${profile.value.title || 'Gayrimenkul Danışmanı'}`
    : 'Profil',
  meta: [
    {
      name: 'description',
      content: profile.value.shortBio || profile.value.slogan || 'Dijital kartvizit ve danışman profili',
    },
  ],
}))
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <div v-if="isValidProfile" class="mx-auto max-w-[1600px] p-4 md:p-6">
      <div class="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div class="sticky top-6 flex h-full flex-col">
            <div class="flex flex-col items-center border-b border-slate-200 pb-6 text-center">
              <div class="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                <img
                  v-if="profile.profilePhoto"
                  :src="profile.profilePhoto"
                  alt="Profil"
                  class="h-full w-full object-cover"
                />
                <i v-else class="bi bi-person-circle text-5xl text-slate-400"></i>
              </div>

              <h1 class="text-xl font-bold tracking-tight text-slate-900">
                {{ profile.fullName }}
              </h1>

              <p class="mt-2 text-sm font-medium text-slate-500">
                {{ profile.title }}
              </p>
            </div>

            <nav class="mt-6 flex flex-col gap-2">
              <a href="#anasayfa" class="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">Anasayfa</a>
              <a href="#portfoyler" class="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">Portföyler</a>
              <a href="#uzmanlik" class="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">Uzmanlık</a>
              <a href="#hakkimda" class="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">Hakkımda</a>
              <a href="#iletisim-form" class="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">İletişim</a>
            </nav>

            <div class="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
              <button type="button" class="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100" @click="openLink(profile.instagram)">
                <i class="bi bi-instagram"></i>
              </button>
              <button type="button" class="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100" @click="openLink(profile.facebook)">
                <i class="bi bi-facebook"></i>
              </button>
              <button type="button" class="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100" @click="openLink(profile.linkedin)">
                <i class="bi bi-linkedin"></i>
              </button>
              <button type="button" class="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100" @click="openLink(profile.youtube)">
                <i class="bi bi-youtube"></i>
              </button>
            </div>

            <div class="mt-auto pt-8 text-xs text-slate-400">
              © 2026 {{ profile.fullName }}
            </div>
          </div>
        </aside>

        <main class="space-y-4">
          <section id="anasayfa" class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div class="grid gap-0 xl:grid-cols-[1.05fr_1fr]">
              <div class="min-h-[420px] bg-slate-100">
                <img
                  v-if="profile.profilePhoto"
                  :src="profile.profilePhoto"
                  alt="Profil"
                  class="h-full w-full object-cover"
                />
                <img
                  v-else-if="profile.galleryPhotos && profile.galleryPhotos[0]"
                  :src="profile.galleryPhotos[0]"
                  alt="Profil"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full min-h-[420px] items-center justify-center text-slate-300">
                  <i class="bi bi-person-circle text-8xl"></i>
                </div>
              </div>

              <div class="flex items-center p-8 lg:p-10">
                <div class="max-w-xl">
                  <p class="text-sm font-medium text-slate-500">{{ profile.title || 'Gayrimenkul Danışmanı' }}</p>

                  <h2 class="mt-2 text-4xl font-bold tracking-tight text-slate-900 lg:text-6xl">
                    {{ profile.fullName }}
                  </h2>

                  <p class="mt-6 text-base leading-8 text-slate-600">
                    {{ profile.shortBio || '-' }}
                  </p>

                  <div class="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      @click="openWhatsapp"
                    >
                      <i class="bi bi-whatsapp mr-2"></i>
                      WhatsApp
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      @click="openPhone"
                    >
                      <i class="bi bi-telephone mr-2"></i>
                      Ara
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="portfoyler" class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 class="text-2xl font-bold text-slate-900">Portföyler</h3>
                <p class="mt-1 text-sm text-slate-500">Aktif ilan vitrinim</p>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="rounded-lg px-3 py-2 text-xs font-semibold transition"
                  :class="portfolioFilter === 'Tümü' ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'"
                  @click="portfolioFilter = 'Tümü'"
                >
                  Tümünü Görüntüle
                </button>
                <button
                  type="button"
                  class="rounded-lg px-3 py-2 text-xs font-semibold transition"
                  :class="portfolioFilter === 'Kiralık' ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'"
                  @click="portfolioFilter = 'Kiralık'"
                >
                  Kiralık
                </button>
                <button
                  type="button"
                  class="rounded-lg px-3 py-2 text-xs font-semibold transition"
                  :class="portfolioFilter === 'Satılık' ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'"
                  @click="portfolioFilter = 'Satılık'"
                >
                  Satılık
                </button>
              </div>
            </div>

            <div v-if="filteredProperties.length === 0" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              Uygun portföy bulunmuyor.
            </div>

            <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <button
                v-for="item in filteredProperties"
                :key="item.id"
                type="button"
                class="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                @click="openPropertyDetail(item)"
              >
                <div class="relative h-52 bg-slate-100">
                  <img
                    v-if="item.photos && item.photos[0]"
                    :src="item.photos[0]"
                    alt="İlan"
                    class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                  />
                  <div v-else class="flex h-full items-center justify-center text-slate-300">
                    <i class="bi bi-image text-5xl"></i>
                  </div>

                  <div
                    class="absolute left-3 top-3 rounded px-3 py-1 text-xs font-semibold"
                    :class="String(item.listingType || '').toLowerCase().includes('kira')
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-800 text-white'"
                  >
                    {{ item.listingType || 'Portföy' }}
                  </div>

                  <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/55 to-transparent p-3">
                    <div class="flex items-end justify-between gap-3">
                      <div>
                        <h4 class="line-clamp-1 text-xl font-bold text-white">{{ item.propertyType || item.title }}</h4>
                        <p class="mt-1 text-sm text-white/90">{{ formatPrice(item.price, item.currency) }}</p>
                      </div>
                      <div class="text-right text-xs text-white/85">
                        {{ formatArea(item.squareMeters || item.netArea) }}
                      </div>
                    </div>

                    <div class="mt-2 flex items-center justify-between gap-3 text-xs text-white/80">
                      <span class="line-clamp-1">{{ item.city }}</span>
                      <span class="line-clamp-1">{{ item.district }}</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </section>

          <section
            id="portfoy-detay"
            v-if="selectedProperty"
            class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div class="mb-6 flex items-center justify-between gap-3">
              <div>
                <h3 class="text-2xl font-bold text-slate-900">Portföy Detayı</h3>
                <p class="mt-1 text-sm text-slate-500">Profesyonel ilan sunumu</p>
              </div>

              <button
                type="button"
                class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="closePropertyDetail"
              >
                Kapat
              </button>
            </div>

            <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div class="space-y-4">
                <div class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                  <img
                    v-if="currentMainPhoto"
                    :src="currentMainPhoto"
                    alt="Detay"
                    class="h-[420px] w-full object-cover"
                  />
                  <div v-else class="flex h-[420px] items-center justify-center text-slate-300">
                    <i class="bi bi-image text-6xl"></i>
                  </div>
                </div>

                <div v-if="selectedPropertyPhotos.length > 1" class="grid grid-cols-3 gap-3 md:grid-cols-5">
                  <button
                    v-for="(photo, index) in selectedPropertyPhotos"
                    :key="index"
                    type="button"
                    class="overflow-hidden rounded-2xl border bg-slate-50"
                    :class="activePhotoIndex === index ? 'border-slate-900 ring-2 ring-slate-200' : 'border-slate-200'"
                    @click="selectDetailPhoto(index)"
                  >
                    <img :src="photo" alt="Galeri" class="aspect-square w-full object-cover" />
                  </button>
                </div>
              </div>

              <div class="space-y-4">
                <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <h4 class="text-2xl font-bold text-slate-900">{{ selectedProperty.title }}</h4>
                  <p class="mt-2 text-sm text-slate-500">{{ selectedProperty.listingType }} · {{ selectedProperty.propertyType }}</p>
                  <p class="mt-1 text-sm text-slate-500">{{ selectedProperty.city }} / {{ selectedProperty.district }}</p>
                  <p class="mt-5 text-3xl font-bold text-slate-900">{{ formatPrice(selectedProperty.price, selectedProperty.currency) }}</p>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                  <div
                    v-for="feature in propertyFeatures"
                    :key="feature.label"
                    class="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <p class="text-sm font-medium text-slate-500">{{ feature.label }}</p>
                    <p class="mt-2 font-semibold text-slate-900">{{ feature.value }}</p>
                  </div>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p class="text-sm font-medium text-slate-500">Açıklama</p>
                  <p class="mt-2 leading-7 text-slate-700">
                    {{ selectedProperty.description || selectedProperty.notes || 'Detay açıklaması eklenmedi.' }}
                  </p>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p class="mb-3 text-sm font-medium text-slate-500">Video</p>

                  <div v-if="selectedPropertyVideo">
                    <iframe
                      v-if="videoEmbedUrl(selectedPropertyVideo).includes('youtube.com/embed')"
                      :src="videoEmbedUrl(selectedPropertyVideo)"
                      class="h-64 w-full rounded-2xl"
                      frameborder="0"
                      allowfullscreen
                    ></iframe>

                    <button
                      v-else
                      type="button"
                      class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      @click="openLink(selectedPropertyVideo)"
                    >
                      <i class="bi bi-play-circle mr-2"></i>
                      Videoyu Aç
                    </button>
                  </div>

                  <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-slate-400">
                    Video eklenmedi.
                  </div>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-white p-5">
                  <h5 class="text-lg font-bold text-slate-900">Bu İlan İçin Bilgi Al</h5>

                  <div class="mt-4 grid gap-3">
                    <UiInput v-model="propertyInquiryForm.name" variant="outline" placeholder="Ad Soyad" />

                    <UiInput v-model="propertyInquiryForm.phone" variant="outline" placeholder="Telefon" />

                    <UiTextarea v-model="propertyInquiryForm.message" :rows="4" variant="outline" placeholder="Mesaj" />

                    <UiButton variant="primary" shape="rounded" @click="sendPropertyInquiry">İlan Hakkında Mesaj Gönder</UiButton>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="similarProperties.length" class="mt-8 border-t border-slate-200 pt-8">
              <div class="mb-5">
                <h4 class="text-xl font-bold text-slate-900">Benzer Portföyler</h4>
                <p class="mt-1 text-sm text-slate-500">Aynı bölgede veya benzer türde ilanlar</p>
              </div>

              <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <button
                  v-for="item in similarProperties"
                  :key="item.id"
                  type="button"
                  class="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  @click="openPropertyDetail(item)"
                >
                  <div class="h-44 bg-slate-100">
                    <img
                      v-if="item.photos && item.photos[0]"
                      :src="item.photos[0]"
                      alt="Benzer ilan"
                      class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                    <div v-else class="flex h-full items-center justify-center text-slate-300">
                      <i class="bi bi-image text-4xl"></i>
                    </div>
                  </div>

                  <div class="p-4">
                    <h5 class="line-clamp-2 text-base font-bold text-slate-900">{{ item.title }}</h5>
                    <p class="mt-2 text-sm text-slate-500">{{ formatPrice(item.price, item.currency) }}</p>
                    <p class="mt-1 text-xs text-slate-500">{{ item.city }} / {{ item.district }}</p>
                  </div>
                </button>
              </div>
            </div>
          </section>

          <section class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div class="space-y-4">
              <section id="uzmanlik" class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 class="text-2xl font-bold text-slate-900">Uzmanlık</h3>
                <p class="mt-1 text-sm text-slate-500">Çalıştığım alanlar ve bölgeler</p>

                <div class="mt-6 grid gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Uzmanlık Alanları</h4>
                    <div class="flex flex-wrap gap-3">
                      <span
                        v-for="(item, index) in profile.expertiseAreas"
                        :key="index"
                        class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Uzmanlık Bölgeleri</h4>
                    <div class="flex flex-wrap gap-3">
                      <span
                        v-for="(item, index) in profile.expertiseRegions"
                        :key="index"
                        class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section id="hakkimda" class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 class="text-2xl font-bold text-slate-900">Hakkımda</h3>
                <p class="mt-4 leading-8 text-slate-700">
                  {{ profile.shortBio || '-' }}
                </p>
              </section>
            </div>

            <section id="iletisim-form" class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 class="text-2xl font-bold text-slate-900">İletişim</h3>
              <p class="mt-1 text-sm text-slate-500">Benimle hızlıca iletişime geçin</p>

              <div class="mt-6 overflow-hidden rounded-3xl border border-slate-200">
                <iframe
                  :src="mapUrl"
                  class="h-64 w-full"
                  style="border:0;"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div class="mt-6 grid gap-4">
                <UiInput v-model="contactForm.name" variant="outline" placeholder="Ad Soyad..." />

                <UiInput v-model="contactForm.email" type="email" variant="outline" placeholder="E-posta Adresi..." />

                <UiInput v-model="contactForm.subject" variant="outline" placeholder="Konu..." />

                <UiTextarea v-model="contactForm.message" :rows="5" variant="outline" placeholder="Mesaj..." />

                <UiButton variant="primary" shape="rounded" @click="sendFormToWhatsapp">Mesaj Gönder</UiButton>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>

    <div v-else class="flex min-h-screen items-center justify-center px-4">
      <div class="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 class="text-2xl font-bold text-slate-900">Profil bulunamadı</h1>
        <p class="mt-3 text-slate-500">Paylaşım bağlantısı geçersiz veya profil henüz hazır değil.</p>
      </div>
    </div>
  </div>
</template>

