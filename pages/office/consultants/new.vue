<script setup>
import { useOffice } from '~/composables/useOffice'

const { consultants } = useOffice()

const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  workType: 'Bağ-Kur’lu Danışman',
  status: 'Aday',
  startDate: new Date().toISOString().slice(0, 10),
  expertiseArea: '',
  expertiseRegion: '',
  fixedDutyDay: '',
  experienceYear: 0,
  activeListings: 0,
  revenue: 0,
  dealCount: 0,
  targetRevenue: 0,
  meetingAttendance: 0,
  orientationProgress: 0,
  missingDocuments: 0,
  openProcesses: 0,
  networkNote: '',

  commissionSeniorityMode: 'Ofis Başlangıcına Göre',
  previousOfficeExperienceYears: 0,
  recognizedExperienceYears: 0,
  manualCommissionStartPercent: 0,
})

const successMessage = ref('')
const errorMessage = ref('')

const workTypeOptions = [
  'SGK’lı Danışman',
  'Bağ-Kur’lu Danışman',
  'Aday Danışman',
  'Bireysel Bağlı Danışman',
]

const statusOptions = [
  'Aday',
  'Aktif',
  'Pasif',
  'Ayrıldı',
]

const dutyDayOptions = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
]

const commissionSeniorityOptions = [
  'Ofis Başlangıcına Göre',
  'Toplam Sektör Tecrübesine Göre',
  'Broker Tarafından Tanımlanan Tecrübe',
]

const calculatedStartInfo = computed(() => {
  if (Number(form.manualCommissionStartPercent || 0) > 0) {
    return {
      title: `%${form.manualCommissionStartPercent} manuel başlangıç oranı`,
      text: 'Broker bu danışman için özel başlangıç oranı tanımladı. Sistem komisyon hesabında bu oranı dikkate alır.',
    }
  }

  if (form.commissionSeniorityMode === 'Toplam Sektör Tecrübesine Göre') {
    return {
      title: `${form.previousOfficeExperienceYears || 0} yıl sektör tecrübesi dikkate alınacak`,
      text: 'Danışmanın önceki ofis veya sektör tecrübesi komisyon kıdem hesabına dahil edilir.',
    }
  }

  if (form.commissionSeniorityMode === 'Broker Tarafından Tanımlanan Tecrübe') {
    return {
      title: `${form.recognizedExperienceYears || 0} yıl broker tarafından kabul edilen tecrübe`,
      text: 'Brokerin kabul ettiği tecrübe yılı komisyon kıdem hesabında kullanılacaktır.',
    }
  }

  return {
    title: 'Ofis başlangıcına göre hesaplanacak',
    text: 'Danışmanın komisyon kıdemi bu ofiste başladığı tarihe göre hesaplanacaktır.',
  }
})

const createCode = () => {
  const nextNumber = consultants.value.length + 1
  return `D-${String(nextNumber).padStart(3, '0')}`
}

const createAvatarText = (name) => {
  return String(name || 'D')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(item => item.charAt(0))
    .join('')
    .toUpperCase()
}

const saveConsultant = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.fullName || !form.phone) {
    errorMessage.value = 'Danışman adı ve telefon bilgisi zorunludur.'
    return
  }

  const newConsultant = {
    id: Date.now(),
    code: createCode(),
    fullName: form.fullName,
    phone: form.phone,
    email: form.email,
    registerDate: new Date().toISOString().slice(0, 10),
    startDate: form.startDate,
    workType: form.workType,
    status: form.status,
    expertiseArea: form.expertiseArea,
    expertiseRegion: form.expertiseRegion,
    fixedDutyDay: form.fixedDutyDay,
    experienceYear: Number(form.experienceYear || 0),
    activeListings: Number(form.activeListings || 0),
    revenue: Number(form.revenue || 0),
    dealCount: Number(form.dealCount || 0),
    targetRevenue: Number(form.targetRevenue || 0),
    meetingAttendance: Number(form.meetingAttendance || 0),
    orientationProgress: Number(form.orientationProgress || 0),
    missingDocuments: Number(form.missingDocuments || 0),
    openProcesses: Number(form.openProcesses || 0),
    networkNote: form.networkNote,
    avatarText: createAvatarText(form.fullName),

    commissionSeniorityMode: form.commissionSeniorityMode,
    previousOfficeExperienceYears: Number(form.previousOfficeExperienceYears || 0),
    recognizedExperienceYears: Number(form.recognizedExperienceYears || 0),
    manualCommissionStartPercent: Number(form.manualCommissionStartPercent || 0),
  }

  consultants.value.unshift(newConsultant)

  successMessage.value = 'Danışman kaydı başarıyla oluşturuldu.'

  setTimeout(async () => {
    await navigateTo('/office/consultants')
  }, 700)
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Ofis Yönetimi
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Yeni Danışman Ekle
          </h1>
          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Danışmanın temel bilgilerini, çalışma türünü, uzmanlık alanını ve komisyon başlangıç kurallarını tanımlayın.
          </p>
        </div>

        <NuxtLink
          to="/office/consultants"
          class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Danışman Listesine Dön
        </NuxtLink>
      </div>
    </section>

    <div
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-check2-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <div
      v-if="errorMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-exclamation-circle mr-2"></i>
      {{ errorMessage }}
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">
          Temel Bilgiler
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Danışmanın kimlik, iletişim ve ofise başlangıç bilgileri.
        </p>
      </div>

      <div class="grid gap-4 xl:grid-cols-4">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Ad Soyad
          </label>
          <input
            v-model="form.fullName"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Danışman adı soyadı"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Telefon
          </label>
          <input
            v-model="form.phone"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="05xx xxx xx xx"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            E-posta
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="mail@ornek.com"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Ofise Başlangıç Tarihi
          </label>
          <input
            v-model="form.startDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Çalışma Türü
          </label>
          <select
            v-model="form.workType"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in workTypeOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Durum
          </label>
          <select
            v-model="form.status"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in statusOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Uzmanlık Alanı
          </label>
          <input
            v-model="form.expertiseArea"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Ticari, konut, arsa..."
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Uzmanlık Bölgesi
          </label>
          <input
            v-model="form.expertiseRegion"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="İzmir / Konak / Yenişehir"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Sabit Nöbet Günü
          </label>
          <select
            v-model="form.fixedDutyDay"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option value="">Seçilmedi</option>
            <option
              v-for="item in dutyDayOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">
          Komisyon Başlangıç Ayarları
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Danışman başka ofisten geldiyse veya sektör tecrübesi varsa broker bu bilgiyi burada tanımlar. Sistem sonraki komisyonları otomatik hesaplar.
        </p>
      </div>

      <div class="grid gap-4 xl:grid-cols-4">
        <div class="xl:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Komisyon Kıdem Hesabı
          </label>
          <select
            v-model="form.commissionSeniorityMode"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in commissionSeniorityOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Önceki Tecrübe Yılı
          </label>
          <input
            v-model="form.previousOfficeExperienceYears"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Kabul Edilen Tecrübe
          </label>
          <input
            v-model="form.recognizedExperienceYears"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Manuel Başlangıç Oranı %
          </label>
          <input
            v-model="form.manualCommissionStartPercent"
            type="number"
            min="0"
            max="100"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Boşsa otomatik"
          />
        </div>

        <div class="xl:col-span-3 rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-bold text-slate-900">
            {{ calculatedStartInfo.title }}
          </p>
          <p class="mt-2 text-sm leading-6 text-slate-500">
            {{ calculatedStartInfo.text }}
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">
          Hedef ve Performans Başlangıcı
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Bu alanlar ilk kayıt için başlangıç değeridir. Danışman çalıştıkça sistem otomatik güncelleyecek.
        </p>
      </div>

      <div class="grid gap-4 xl:grid-cols-4">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Sektör Tecrübesi
          </label>
          <input
            v-model="form.experienceYear"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Aktif Portföy
          </label>
          <input
            v-model="form.activeListings"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Hedef Ciro
          </label>
          <input
            v-model="form.targetRevenue"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Eksik Evrak
          </label>
          <input
            v-model="form.missingDocuments"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>
      </div>

      <div class="mt-4">
        <label class="mb-2 block text-sm font-semibold text-slate-700">
          Broker Notu
        </label>
        <textarea
          v-model="form.networkNote"
          rows="4"
          class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          placeholder="Danışmanın tecrübesi, bölgesi, güçlü yönleri, başlangıç planı..."
        ></textarea>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="saveConsultant"
        >
          Danışmanı Kaydet
        </button>

        <NuxtLink
          to="/office/consultants"
          class="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Vazgeç
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
