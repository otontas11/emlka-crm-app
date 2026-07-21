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

        <UiButton variant="dark-ghost" icon="bi-arrow-left" @click="goToProfile">
          Profile Dön
        </UiButton>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">Temel Bilgiler</h2>
      </div>

      <div class="grid gap-5 p-6 md:grid-cols-12">
        <UiInput v-model="form.fullName" label="Ad Soyad" type="text" variant="default" shadow class="md:col-span-4" />

        <UiInput v-model="form.title" label="Unvan" type="text" variant="default" shadow class="md:col-span-4" />

        <UiInput v-model="form.slogan" label="Slogan" type="text" variant="default" shadow class="md:col-span-4" />

        <UiTextarea v-model="form.shortBio" label="Kısa Özgeçmiş" :rows="5" variant="default" shadow class="md:col-span-12" />
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

                <UiButton variant="danger" size="sm" @click="removeProfilePhoto">
                  Fotoğrafı Kaldır
                </UiButton>
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
          <UiInput v-model="form.introVideo" label="Tanıtım Videosu URL" type="text" variant="default" shadow />
          <p class="mt-2 text-xs text-slate-500">YouTube linki ekleyebilirsiniz.</p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">İletişim ve Sosyal Medya</h2>
      </div>

      <div class="grid gap-5 p-6 md:grid-cols-12">
        <UiInput v-model="form.phone" label="Telefon" type="text" variant="default" shadow class="md:col-span-4" />

        <UiInput v-model="form.whatsapp" label="WhatsApp" type="text" variant="default" shadow class="md:col-span-4" />

        <UiInput v-model="form.email" label="E-posta" type="email" variant="default" shadow class="md:col-span-4" />

        <UiInput v-model="form.officeAddress" label="Ofis Adresi / Harita Konumu" type="text" variant="default" shadow class="md:col-span-12" />

        <UiInput v-model="form.instagram" label="Instagram" type="text" variant="default" shadow class="md:col-span-3" />

        <UiInput v-model="form.facebook" label="Facebook" type="text" variant="default" shadow class="md:col-span-3" />

        <UiInput v-model="form.linkedin" label="LinkedIn" type="text" variant="default" shadow class="md:col-span-3" />

        <UiInput v-model="form.youtube" label="YouTube" type="text" variant="default" shadow class="md:col-span-3" />
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">Uzmanlık Alanları</h2>
        <UiButton variant="primary" size="sm" @click="addExpertiseArea">
          Ekle
        </UiButton>
      </div>

      <div class="space-y-4 p-6">
        <div v-if="form.expertiseAreas.length === 0" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-slate-500">
          Henüz uzmanlık alanı eklenmedi.
        </div>

        <div v-for="(item, index) in form.expertiseAreas" :key="index" class="flex gap-3">
          <UiInput v-model="form.expertiseAreas[index]" type="text" variant="default" shadow class="flex-1" />
          <UiButton variant="danger" shape="rounded" @click="removeExpertiseArea(index)">
            Sil
          </UiButton>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">Uzmanlık Bölgeleri</h2>
        <UiButton variant="primary" size="sm" @click="addExpertiseRegion">
          Ekle
        </UiButton>
      </div>

      <div class="space-y-4 p-6">
        <div v-if="form.expertiseRegions.length === 0" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-slate-500">
          Henüz uzmanlık bölgesi eklenmedi.
        </div>

        <div v-for="(item, index) in form.expertiseRegions" :key="index" class="flex gap-3">
          <UiInput v-model="form.expertiseRegions[index]" type="text" variant="default" shadow class="flex-1" />
          <UiButton variant="danger" shape="rounded" @click="removeExpertiseRegion(index)">
            Sil
          </UiButton>
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
              <UiButton variant="danger" size="sm" shape="rounded" block @click="removeGalleryPhoto(index)">
                Sil
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="flex flex-wrap gap-3">
      <UiButton variant="primary" icon="bi-check2-circle" @click="saveProfile">
        Profili Kaydet
      </UiButton>

      <UiButton variant="secondary" @click="goToProfile">
        Vazgeç
      </UiButton>
    </div>
  </div>
</template>


