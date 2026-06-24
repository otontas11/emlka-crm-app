<script setup>
import { useProfile, updateProfile } from '~/composables/useProfile'

const profile = useProfile()

const MAX_GALLERY_PHOTOS = 20

const createForm = () => ({
  fullName: profile.value.fullName || '',
  title: profile.value.title || '',
  slogan: profile.value.slogan || '',
  shortBio: profile.value.shortBio || '',
  expertiseAreas: Array.isArray(profile.value.expertiseAreas) ? [...profile.value.expertiseAreas] : [],
  expertiseRegions: Array.isArray(profile.value.expertiseRegions) ? [...profile.value.expertiseRegions] : [],
  phone: profile.value.phone || '',
  whatsapp: profile.value.whatsapp || '',
  email: profile.value.email || '',
  website: profile.value.website || '',
  officeAddress: profile.value.officeAddress || '',
  instagram: profile.value.instagram || '',
  facebook: profile.value.facebook || '',
  linkedin: profile.value.linkedin || '',
  youtube: profile.value.youtube || '',
  profilePhoto: profile.value.profilePhoto || '',
  galleryPhotos: Array.isArray(profile.value.galleryPhotos) ? [...profile.value.galleryPhotos] : [],
  introVideo: profile.value.introVideo || '',
})

const form = ref(createForm())

const addExpertiseArea = () => form.value.expertiseAreas.push('')
const removeExpertiseArea = (index) => form.value.expertiseAreas.splice(index, 1)

const addExpertiseRegion = () => form.value.expertiseRegions.push('')
const removeExpertiseRegion = (index) => form.value.expertiseRegions.splice(index, 1)

const removeGalleryPhoto = (index) => form.value.galleryPhotos.splice(index, 1)

const readFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const handleProfilePhotoChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const dataUrl = await readFileAsDataUrl(file)
    form.value.profilePhoto = dataUrl
  } catch (error) {
    alert('Profil fotoğrafı yüklenirken bir hata oluştu.')
  }

  event.target.value = ''
}

const handleGalleryPhotosChange = async (event) => {
  const files = Array.from(event.target.files || [])
  if (!files.length) return

  const remaining = MAX_GALLERY_PHOTOS - form.value.galleryPhotos.length

  if (remaining <= 0) {
    alert('En fazla 20 fotoğraf yükleyebilirsiniz.')
    event.target.value = ''
    return
  }

  const filesToUse = files.slice(0, remaining)

  try {
    const results = await Promise.all(filesToUse.map(file => readFileAsDataUrl(file)))
    form.value.galleryPhotos.push(...results)

    if (files.length > remaining) {
      alert('Maksimum 20 fotoğraf yüklenebilir. Fazla seçilen fotoğraflar eklenmedi.')
    }
  } catch (error) {
    alert('Galeri fotoğrafları yüklenirken bir hata oluştu.')
  }

  event.target.value = ''
}

const removeProfilePhoto = () => {
  form.value.profilePhoto = ''
}

const saveProfile = () => {
  updateProfile({
    ...form.value,
    expertiseAreas: form.value.expertiseAreas.filter(item => String(item || '').trim()),
    expertiseRegions: form.value.expertiseRegions.filter(item => String(item || '').trim()),
    galleryPhotos: form.value.galleryPhotos.filter(item => String(item || '').trim()).slice(0, MAX_GALLERY_PHOTOS),
  })

  window.location.href = '/profile'
}

const goToProfile = () => {
  window.location.href = '/profile'
}
</script>

<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl">
      <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Profil Düzenle
          </p>
          <h1 class="mb-3 text-3xl font-bold tracking-tight text-white lg:text-4xl">
            {{ form.fullName || 'Profil Sayfam' }}
          </h1>
          <p class="max-w-3xl text-sm leading-7 text-slate-300">
            Public profil sayfasında görünecek alanları buradan düzenleyin.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          @click="goToProfile"
        >
          <i class="bi bi-arrow-left mr-2"></i>
          Profile Dön
        </button>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">Temel Bilgiler</h2>
      </div>

      <div class="grid gap-5 p-6 md:grid-cols-12">
        <div class="md:col-span-4">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Ad Soyad</label>
          <input v-model="form.fullName" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>

        <div class="md:col-span-4">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Unvan</label>
          <input v-model="form.title" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>

        <div class="md:col-span-4">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Slogan</label>
          <input v-model="form.slogan" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>

        <div class="md:col-span-12">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kısa Özgeçmiş</label>
          <textarea v-model="form.shortBio" rows="5" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"></textarea>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">Profil Fotoğrafı ve Video</h2>
      </div>

      <div class="grid gap-6 p-6 md:grid-cols-12">
        <div class="md:col-span-6">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Profil Fotoğrafı</label>

          <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div v-if="form.profilePhoto" class="space-y-4">
              <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <img :src="form.profilePhoto" alt="Profil Fotoğrafı" class="h-64 w-full object-cover" />
              </div>

              <div class="flex flex-wrap gap-3">
                <label class="cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  <i class="bi bi-upload mr-2"></i>
                  Fotoğrafı Değiştir
                  <input type="file" accept="image/*" class="hidden" @change="handleProfilePhotoChange" />
                </label>

                <button
                  type="button"
                  class="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                  @click="removeProfilePhoto"
                >
                  Fotoğrafı Kaldır
                </button>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                Profil fotoğrafı eklenmedi.
              </div>

              <label class="inline-flex cursor-pointer items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                <i class="bi bi-upload mr-2"></i>
                Fotoğraf Ekle
                <input type="file" accept="image/*" class="hidden" @change="handleProfilePhotoChange" />
              </label>
            </div>
          </div>
        </div>

        <div class="md:col-span-6">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Tanıtım Videosu URL</label>
          <input v-model="form.introVideo" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
          <p class="mt-2 text-xs text-slate-500">YouTube linki ekleyebilirsiniz.</p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">İletişim ve Sosyal Medya</h2>
      </div>

      <div class="grid gap-5 p-6 md:grid-cols-12">
        <div class="md:col-span-4">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Telefon</label>
          <input v-model="form.phone" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>

        <div class="md:col-span-4">
          <label class="mb-2 block text-sm font-semibold text-slate-700">WhatsApp</label>
          <input v-model="form.whatsapp" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>

        <div class="md:col-span-4">
          <label class="mb-2 block text-sm font-semibold text-slate-700">E-posta</label>
          <input v-model="form.email" type="email" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>

        <div class="md:col-span-12">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Ofis Adresi / Harita Konumu</label>
          <input v-model="form.officeAddress" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>

        <div class="md:col-span-3">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Instagram</label>
          <input v-model="form.instagram" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>

        <div class="md:col-span-3">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Facebook</label>
          <input v-model="form.facebook" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>

        <div class="md:col-span-3">
          <label class="mb-2 block text-sm font-semibold text-slate-700">LinkedIn</label>
          <input v-model="form.linkedin" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>

        <div class="md:col-span-3">
          <label class="mb-2 block text-sm font-semibold text-slate-700">YouTube</label>
          <input v-model="form.youtube" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">Uzmanlık Alanları</h2>
        <button type="button" class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white" @click="addExpertiseArea">
          Ekle
        </button>
      </div>

      <div class="space-y-4 p-6">
        <div v-if="form.expertiseAreas.length === 0" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-slate-500">
          Henüz uzmanlık alanı eklenmedi.
        </div>

        <div v-for="(item, index) in form.expertiseAreas" :key="index" class="flex gap-3">
          <input v-model="form.expertiseAreas[index]" type="text" class="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
          <button type="button" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700" @click="removeExpertiseArea(index)">
            Sil
          </button>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">Uzmanlık Bölgeleri</h2>
        <button type="button" class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white" @click="addExpertiseRegion">
          Ekle
        </button>
      </div>

      <div class="space-y-4 p-6">
        <div v-if="form.expertiseRegions.length === 0" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-slate-500">
          Henüz uzmanlık bölgesi eklenmedi.
        </div>

        <div v-for="(item, index) in form.expertiseRegions" :key="index" class="flex gap-3">
          <input v-model="form.expertiseRegions[index]" type="text" class="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" />
          <button type="button" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700" @click="removeExpertiseRegion(index)">
            Sil
          </button>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
        <div>
          <h2 class="text-lg font-semibold text-slate-900">Galeri Fotoğrafları</h2>
          <p class="mt-1 text-sm text-slate-500">{{ form.galleryPhotos.length }} / 20 fotoğraf</p>
        </div>

        <label class="cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Ekle
          <input type="file" accept="image/*" multiple class="hidden" @change="handleGalleryPhotosChange" />
        </label>
      </div>

      <div class="p-6">
        <div v-if="form.galleryPhotos.length === 0" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-slate-500">
          Henüz galeri fotoğrafı eklenmedi.
        </div>

        <div v-else class="grid grid-cols-2 gap-4">
          <div
            v-for="(item, index) in form.galleryPhotos"
            :key="index"
            class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <img :src="item" alt="Galeri Fotoğrafı" class="aspect-square w-full object-cover" />
            <div class="p-3">
              <button
                type="button"
                class="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                @click="removeGalleryPhoto(index)"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="flex flex-wrap gap-3">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        @click="saveProfile"
      >
        <i class="bi bi-check2-circle mr-2"></i>
        Profili Kaydet
      </button>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        @click="goToProfile"
      >
        Vazgeç
      </button>
    </div>
  </div>
</template>


