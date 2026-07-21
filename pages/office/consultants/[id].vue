<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeDocuments } from '~/composables/useOfficeDocuments'
import { useOfficeOrientation } from '~/composables/useOfficeOrientation'
import { useOfficeTraining } from '~/composables/useOfficeTraining'
import { useOfficeDuties } from '~/composables/useOfficeDuties'
import { useOfficeCommissions } from '~/composables/useOfficeCommissions'

const route = useRoute()

const { consultants, pipelines, regionAssignments } = useOffice()

const {
  ensureDocumentsForConsultants,
  getDocumentsByConsultant,
  completionPercent: documentCompletionPercent,
  missingCount: documentMissingCount,
} = useOfficeDocuments()

const {
  ensureOrientationForConsultants,
  getStepsByConsultant,
  completionPercent: orientationCompletionPercent,
  waitingCount: orientationWaitingCount,
} = useOfficeOrientation()

const {
  getAssignmentsByConsultant,
  completionPercent: trainingCompletionPercent,
  waitingCount: trainingWaitingCount,
} = useOfficeTraining()

const {
  getDutiesByConsultant,
} = useOfficeDuties()

const {
  commissions,
  hydrateCommissions,
  getRecommendedShare,
  formatPrice,
} = useOfficeCommissions()

ensureDocumentsForConsultants()
ensureOrientationForConsultants()
hydrateCommissions()

const activeTab = ref('ozet')
const successMessage = ref('')

const tabs = [
  { key: 'ozet', label: 'Özet', icon: 'bi-grid' },
  { key: 'komisyon', label: 'Komisyon Ayarları', icon: 'bi-percent' },
  { key: 'evrak', label: 'Evraklar', icon: 'bi-folder2-open' },
  { key: 'oryantasyon', label: 'Oryantasyon', icon: 'bi-list-check' },
  { key: 'egitim', label: 'Eğitimler', icon: 'bi-mortarboard' },
  { key: 'nobet', label: 'Nöbetler', icon: 'bi-calendar-check' },
  { key: 'pipeline', label: 'Süreçler', icon: 'bi-diagram-3' },
]

const consultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(route.params.id))
})

const commissionForm = reactive({
  commissionSeniorityMode: 'Ofis Başlangıcına Göre',
  previousOfficeExperienceYears: 0,
  recognizedExperienceYears: 0,
  manualCommissionStartPercent: 0,
})

const commissionSeniorityOptions = [
  'Ofis Başlangıcına Göre',
  'Toplam Sektör Tecrübesine Göre',
  'Broker Tarafından Tanımlanan Tecrübe',
]

watch(
  consultant,
  (value) => {
    if (!value) return

    commissionForm.commissionSeniorityMode = value.commissionSeniorityMode || 'Ofis Başlangıcına Göre'
    commissionForm.previousOfficeExperienceYears = Number(value.previousOfficeExperienceYears ?? 0)
    commissionForm.recognizedExperienceYears = Number(value.recognizedExperienceYears ?? 0)
    commissionForm.manualCommissionStartPercent = Number(value.manualCommissionStartPercent ?? 0)
  },
  { immediate: true }
)

const today = computed(() => {
  return new Date().toISOString().slice(0, 10)
})

const documents = computed(() => {
  if (!consultant.value) return []
  return getDocumentsByConsultant(consultant.value.id)
})

const orientationSteps = computed(() => {
  if (!consultant.value) return []
  return getStepsByConsultant(consultant.value.id)
})

const trainings = computed(() => {
  if (!consultant.value) return []
  return getAssignmentsByConsultant(consultant.value.id)
})

const duties = computed(() => {
  if (!consultant.value) return []
  return getDutiesByConsultant(consultant.value.id)
})

const consultantCommissions = computed(() => {
  if (!consultant.value) return []
  return commissions.value.filter(item => String(item.consultantId) === String(consultant.value.id))
})

const consultantPipelines = computed(() => {
  if (!consultant.value) return []
  return pipelines.value.filter(item => String(item.consultantId) === String(consultant.value.id))
})

const consultantRegions = computed(() => {
  if (!consultant.value) return []
  return regionAssignments.value.filter(item => String(item.consultantId) === String(consultant.value.id))
})

const docPercent = computed(() => {
  if (!consultant.value) return 0
  return documentCompletionPercent(consultant.value.id)
})

const authorityCompleted = computed(() => {
  return documents.value.some(doc => {
    const title = String(doc.title || '').toLocaleLowerCase('tr-TR')

    const isAuthorityDoc =
      title.includes('yetki') ||
      title.includes('myk') ||
      title.includes('sertifika') ||
      title.includes('seviye')

    return isAuthorityDoc && doc.fileName && doc.status !== 'Geçersiz'
  })
})

const recommendedShare = computed(() => {
  if (!consultant.value) {
    return {
      percent: 0,
      reason: '',
      periodProduction: 0,
      previousPeriodProduction: 0,
      periodRange: null,
      previousPeriodRange: null,
      serviceYears: 0,
    }
  }

  const previewConsultant = {
    ...consultant.value,
    commissionSeniorityMode: commissionForm.commissionSeniorityMode,
    previousOfficeExperienceYears: Number(commissionForm.previousOfficeExperienceYears || 0),
    recognizedExperienceYears: Number(commissionForm.recognizedExperienceYears || 0),
    manualCommissionStartPercent: Number(commissionForm.manualCommissionStartPercent || 0),
  }

  return getRecommendedShare({
    consultant: previewConsultant,
    date: today.value,
    documentCompletionPercent: docPercent.value,
    authorityCompleted: authorityCompleted.value,
    extraProductionAmount: 0,
  })
})

const consultantCommissionTotals = computed(() => {
  return consultantCommissions.value.reduce((totals, item) => {
    totals.gross += Number(item.grossCommission || 0)
    totals.consultantShare += Number(item.consultantShareAmount || 0)
    totals.officeShare += Number(item.officeShareAmount || 0)
    return totals
  }, {
    gross: 0,
    consultantShare: 0,
    officeShare: 0,
  })
})

const saveCommissionSettings = () => {
  if (!consultant.value) return

  consultant.value.commissionSeniorityMode = commissionForm.commissionSeniorityMode
  consultant.value.previousOfficeExperienceYears = Number(commissionForm.previousOfficeExperienceYears || 0)
  consultant.value.recognizedExperienceYears = Number(commissionForm.recognizedExperienceYears || 0)
  consultant.value.manualCommissionStartPercent = Number(commissionForm.manualCommissionStartPercent || 0)

  successMessage.value = 'Danışman komisyon başlangıç ayarları güncellendi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const statusClass = (status) => {
  if (['Aktif', 'Tamamlandı', 'Ödendi', 'Tahsil Edildi', 'Danışman Onayladı'].includes(status)) {
    return 'bg-slate-900 text-white'
  }

  if (['Devam Ediyor', 'Kontrol Bekliyor', 'Kısmi Tahsil Edildi', 'Kısmi Ödendi', 'Aksiyon Bekliyor'].includes(status)) {
    return 'bg-slate-200 text-slate-800'
  }

  return 'bg-white text-slate-700 border border-slate-200'
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('tr-TR').format(Number(value || 0))
}
</script>

<template>
  <div v-if="consultant" class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex items-start gap-4">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-slate-900 text-xl font-bold text-white">
            {{ consultant.avatarText || consultant.fullName?.charAt(0) }}
          </div>

          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Danışman Detay
            </p>
            <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {{ consultant.fullName }}
            </h1>
            <p class="mt-2 text-sm leading-6 text-slate-500">
              {{ consultant.code }} · {{ consultant.workType }} · {{ consultant.status }} · {{ consultant.expertiseRegion }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/office/consultants"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Danışman Listesine Dön
          </NuxtLink>

          <NuxtLink
            to="/office/modules/komisyon-sistemi"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Komisyon Sistemi
          </NuxtLink>
        </div>
      </div>
    </section>

    <div
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-check2-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div class="flex gap-2 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition"
          :class="activeTab === tab.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="activeTab = tab.key"
        >
          <i class="bi" :class="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>
    </section>

    <section v-if="activeTab === 'ozet'" class="space-y-6">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Aktif Portföy</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ consultant.activeListings || 0 }}</p>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Toplam Ciro</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(consultant.revenue) }}</p>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">İşlem</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ consultant.dealCount || 0 }}</p>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Evrak Tamamlanma</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">%{{ docPercent }}</p>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Otomatik Komisyon</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">%{{ recommendedShare.percent }}</p>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-2">
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-bold text-slate-900">Danışman Bilgileri</h2>

          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="text-xs text-slate-400">Telefon</p>
              <p class="mt-1 font-semibold text-slate-900">{{ consultant.phone || '-' }}</p>
            </div>

            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="text-xs text-slate-400">E-posta</p>
              <p class="mt-1 font-semibold text-slate-900">{{ consultant.email || '-' }}</p>
            </div>

            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="text-xs text-slate-400">Ofise Başlangıç</p>
              <p class="mt-1 font-semibold text-slate-900">{{ consultant.startDate || '-' }}</p>
            </div>

            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="text-xs text-slate-400">Sektör Tecrübesi</p>
              <p class="mt-1 font-semibold text-slate-900">{{ consultant.experienceYear || 0 }} yıl</p>
            </div>

            <div class="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p class="text-xs text-slate-400">Broker Notu</p>
              <p class="mt-1 text-sm leading-6 text-slate-700">{{ consultant.networkNote || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-bold text-slate-900">Komisyon Özeti</h2>

          <div class="mt-5 space-y-3">
            <div class="flex justify-between gap-3 rounded-2xl bg-slate-50 p-4">
              <span class="text-sm text-slate-500">Brüt Komisyon</span>
              <span class="font-bold text-slate-900">{{ formatPrice(consultantCommissionTotals.gross) }}</span>
            </div>

            <div class="flex justify-between gap-3 rounded-2xl bg-slate-50 p-4">
              <span class="text-sm text-slate-500">Danışman Payı</span>
              <span class="font-bold text-slate-900">{{ formatPrice(consultantCommissionTotals.consultantShare) }}</span>
            </div>

            <div class="flex justify-between gap-3 rounded-2xl bg-slate-50 p-4">
              <span class="text-sm text-slate-500">Ofis Payı</span>
              <span class="font-bold text-slate-900">{{ formatPrice(consultantCommissionTotals.officeShare) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'komisyon'" class="space-y-6">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-900">
              Danışman Komisyon Başlangıç Ayarları
            </h2>
            <p class="mt-1 max-w-4xl text-sm leading-6 text-slate-500">
              Danışman başka ofisten geldiyse veya sektör tecrübesi varsa broker burada tanımlar. Sistem sonraki işlemlerde komisyon oranını otomatik hesaplar.
            </p>
          </div>

          <button
            type="button"
            class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            @click="saveCommissionSettings"
          >
            Ayarları Kaydet
          </button>
        </div>

        <div class="mt-6 grid gap-4 xl:grid-cols-4">
          <UiSelect
            v-model="commissionForm.commissionSeniorityMode"
            label="Komisyon Kıdem Hesabı"
            variant="outline"
            size="sm"
            class="xl:col-span-2"
          >
            <option
              v-for="item in commissionSeniorityOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </UiSelect>

          <UiInput
            v-model="commissionForm.previousOfficeExperienceYears"
            label="Önceki Tecrübe Yılı"
            type="number"
            min="0"
            variant="outline"
            size="sm"
          />

          <UiInput
            v-model="commissionForm.recognizedExperienceYears"
            label="Kabul Edilen Tecrübe"
            type="number"
            min="0"
            variant="outline"
            size="sm"
          />

          <UiInput
            v-model="commissionForm.manualCommissionStartPercent"
            label="Manuel Başlangıç Oranı %"
            type="number"
            min="0"
            max="100"
            placeholder="0 ise otomatik"
            variant="outline"
            size="sm"
          />

          <div class="xl:col-span-3 rounded-3xl bg-slate-50 p-5">
            <p class="text-sm font-bold text-slate-900">
              Bugünkü önerilen danışman payı: %{{ recommendedShare.percent }}
            </p>
            <p class="mt-2 text-sm leading-6 text-slate-500">
              {{ recommendedShare.reason }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Evrak Tamamlanma</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">%{{ docPercent }}</p>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Yetki / Belge Durumu</p>
          <p class="mt-3 text-lg font-bold text-slate-900">
            {{ authorityCompleted ? 'Tamamlandı' : 'Bekliyor' }}
          </p>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Bu Dönem Üretim</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(recommendedShare.periodProduction) }}</p>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Önceki Dönem Üretim</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(recommendedShare.previousPeriodProduction) }}</p>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">
            Danışmanın Komisyon Kayıtları
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ consultantCommissions.length }} komisyon kaydı
          </p>
        </div>

        <div v-if="!consultantCommissions.length" class="p-8 text-center text-sm text-slate-500">
          Bu danışmana ait komisyon kaydı yok.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[900px] text-left text-sm">
            <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-6 py-4">İşlem</th>
                <th class="px-6 py-4">Brüt</th>
                <th class="px-6 py-4">Oran</th>
                <th class="px-6 py-4">Danışman Payı</th>
                <th class="px-6 py-4">Ofis Payı</th>
                <th class="px-6 py-4">Durum</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="item in consultantCommissions"
                :key="item.id"
              >
                <td class="px-6 py-4">
                  <p class="font-semibold text-slate-900">{{ item.propertyTitle }}</p>
                  <p class="mt-1 text-xs text-slate-500">{{ item.customerName }} · {{ item.closeDate }}</p>
                </td>
                <td class="px-6 py-4 font-semibold text-slate-900">{{ formatPrice(item.grossCommission) }}</td>
                <td class="px-6 py-4 font-bold text-slate-900">%{{ item.consultantSharePercent }}</td>
                <td class="px-6 py-4 font-semibold text-slate-900">{{ formatPrice(item.consultantShareAmount) }}</td>
                <td class="px-6 py-4 font-semibold text-slate-900">{{ formatPrice(item.officeShareAmount) }}</td>
                <td class="px-6 py-4">
                  <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(item.paymentStatus)">
                    {{ item.paymentStatus }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'evrak'" class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">Evraklar</h2>
        <p class="mt-1 text-sm text-slate-500">
          %{{ docPercent }} tamamlandı · {{ documentMissingCount(consultant.id) }} eksik evrak
        </p>
      </div>

      <div class="grid gap-4 p-6 xl:grid-cols-2">
        <div
          v-for="item in documents"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ item.group }}</p>
              <h3 class="mt-2 font-bold text-slate-900">{{ item.title }}</h3>
              <p v-if="item.fileName" class="mt-2 text-sm text-slate-500">
                <i class="bi bi-paperclip mr-1"></i>
                {{ item.fileName }}
              </p>
            </div>

            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(item.status)">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'oryantasyon'" class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">Oryantasyon</h2>
        <p class="mt-1 text-sm text-slate-500">
          %{{ orientationCompletionPercent(consultant.id) }} tamamlandı · {{ orientationWaitingCount(consultant.id) }} bekleyen adım
        </p>
      </div>

      <div class="grid gap-4 p-6 xl:grid-cols-2">
        <div
          v-for="item in orientationSteps"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ item.category }}</p>
              <h3 class="mt-2 font-bold text-slate-900">{{ item.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-500">{{ item.description }}</p>
            </div>

            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(item.status)">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'egitim'" class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">Eğitimler</h2>
        <p class="mt-1 text-sm text-slate-500">
          %{{ trainingCompletionPercent(consultant.id) }} tamamlandı · {{ trainingWaitingCount(consultant.id) }} bekleyen eğitim
        </p>
      </div>

      <div class="grid gap-4 p-6 xl:grid-cols-2">
        <div
          v-for="item in trainings"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ item.category }} · {{ item.format }}</p>
              <h3 class="mt-2 font-bold text-slate-900">{{ item.trainingTitle }}</h3>
            </div>

            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(item.status)">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'nobet'" class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">Nöbetler</h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ duties.length }} nöbet kaydı
        </p>
      </div>

      <div class="grid gap-4 p-6 xl:grid-cols-2">
        <div
          v-for="item in duties"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ item.shiftType }} · {{ item.location }}</p>
              <h3 class="mt-2 font-bold text-slate-900">{{ item.date }} · {{ item.dayName }}</h3>
              <p class="mt-2 text-sm text-slate-500">{{ item.startTime }} - {{ item.endTime }}</p>
            </div>

            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(item.status)">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'pipeline'" class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">Süreçler ve Bölge Atamaları</h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ consultantPipelines.length }} aktif süreç · {{ consultantRegions.length }} bölge ataması
        </p>
      </div>

      <div class="grid gap-6 p-6 xl:grid-cols-2">
        <div>
          <h3 class="mb-4 font-bold text-slate-900">Pipeline Süreçleri</h3>

          <div v-if="!consultantPipelines.length" class="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">
            Aktif süreç bulunamadı.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="item in consultantPipelines"
              :key="item.id"
              class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <p class="font-bold text-slate-900">{{ item.customerName }}</p>
              <p class="mt-1 text-sm text-slate-500">{{ item.propertyTitle }}</p>
              <p class="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {{ item.stage }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="mb-4 font-bold text-slate-900">Bölge Atamaları</h3>

          <div v-if="!consultantRegions.length" class="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">
            Bölge ataması bulunamadı.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="item in consultantRegions"
              :key="item.id"
              class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <p class="font-bold text-slate-900">{{ item.region }}</p>
              <p class="mt-1 text-sm text-slate-500">{{ item.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
    <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
      <i class="bi bi-person-x"></i>
    </div>

    <h1 class="mt-4 text-xl font-bold text-slate-900">
      Danışman bulunamadı
    </h1>

    <p class="mt-2 text-sm text-slate-500">
      Danışman silinmiş veya hatalı bağlantı kullanılmış olabilir.
    </p>

    <NuxtLink
      to="/office/consultants"
      class="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
    >
      Danışman Listesine Dön
    </NuxtLink>
  </div>
</template>
