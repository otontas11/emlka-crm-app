<script setup>
import { useOffice } from '~/composables/useOffice'

const {
  consultants,
  officeCalendar,
  officeTasks,
  payments,
  announcements,
  pipelines,
  regionAssignments,
  stats,
  revenueLeaders,
  dealLeaders,
  behindTargetConsultants,
} = useOffice()

const { label: enumLbl } = useEnums()

const consultantName = (consultantId) =>
  consultants.value.find(item => String(item.id) === String(consultantId))?.fullName || '-'

const selectedPeriod = ref('Aylık')

const periods = [
  'Aylık',
  '1. Çeyrek',
  '2. Çeyrek',
  '3. Çeyrek',
  '4. Çeyrek',
  'Yıllık',
]

const formatMoney = (value) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

const percent = (value, target) => {
  const current = Number(value || 0)
  const max = Number(target || 0)

  if (!max) return 0

  return Math.min(Math.round((current / max) * 100), 100)
}

const statusClass = (status) => {
  if (status === 'Aktif') return 'bg-slate-900 text-white'
  if (status === 'Aday') return 'bg-slate-100 text-slate-700'
  if (status === 'Pasif') return 'bg-slate-200 text-slate-700'
  if (status === 'Ayrılmış') return 'bg-slate-300 text-slate-700'
  return 'bg-slate-100 text-slate-600'
}

const taskStatusClass = (status) => {
  if (status === 'Gecikti') return 'bg-rose-50 text-rose-700 border-rose-100'
  if (status === 'Devam Ediyor') return 'bg-blue-50 text-blue-700 border-blue-100'
  if (status === 'Bekliyor') return 'bg-amber-50 text-amber-700 border-amber-100'
  return 'bg-slate-50 text-slate-700 border-slate-200'
}

const paymentStatusClass = (status) => {
  if (status === 'Gecikti') return 'bg-rose-50 text-rose-700'
  if (status === 'Yaklaşıyor') return 'bg-amber-50 text-amber-700'
  if (status === 'Bekliyor') return 'bg-slate-100 text-slate-700'
  return 'bg-slate-50 text-slate-600'
}

const priorityClass = (priority) => {
  if (priority === 'Yüksek') return 'bg-slate-900 text-white'
  return 'bg-slate-100 text-slate-700'
}

const kpiCards = computed(() => [
  {
    title: 'Aktif Danışman',
    value: stats.value.activeConsultants,
    sub: `${stats.value.newConsultants} aday danışman`,
    icon: 'bi-people',
  },
  {
    title: 'Aktif İlan',
    value: stats.value.activeListings,
    sub: 'Danışman bazlı portföy',
    icon: 'bi-buildings',
  },
  {
    title: 'Eksik Evrak',
    value: stats.value.missingDocuments,
    sub: 'Tamamlanması gereken belge',
    icon: 'bi-folder-x',
  },
  {
    title: 'Bugünkü Nöbet',
    value: stats.value.todayDuties,
    sub: 'Onay bekleyen nöbet',
    icon: 'bi-calendar-check',
  },
  {
    title: 'Malik Raporu',
    value: stats.value.todayOwnerReports,
    sub: 'Bugün verilmesi gereken',
    icon: 'bi-file-earmark-text',
  },
  {
    title: 'Geciken İş',
    value: stats.value.overdueTasks,
    sub: 'Takip edilmesi gereken',
    icon: 'bi-exclamation-circle',
  },
  {
    title: 'Yaklaşan Yetki',
    value: stats.value.expiringAuthorities,
    sub: 'EİDS / yazılı yetki',
    icon: 'bi-shield-check',
  },
  {
    title: 'Finans Özeti',
    value: formatMoney(stats.value.monthlyRevenue),
    sub: `${stats.value.pendingPayments} bekleyen ödeme`,
    icon: 'bi-cash-stack',
  },
])

const officeModules = [
  {
    title: 'Üye Ekleme',
    description: 'Danışman ekleme ve ofise bağlama',
    icon: 'bi-person-plus',
    route: '/office/consultants/new',
  },
  {
    title: 'Danışman Kayıt',
    description: 'Çalışma türü, durum, uzmanlık ve notlar',
    icon: 'bi-person-vcard',
    route: '/office/consultants',
  },
  {
    title: 'Evrak Takibi',
    description: 'Sözleşme, KVKK, SGK ve dijital dosyalar',
    icon: 'bi-folder2-open',
    route: '/office/modules/evrak-takibi',
  },
  {
    title: 'Oryantasyon',
    description: 'Yeni başlayan danışman adımları',
    icon: 'bi-list-check',
    route: '/office/modules/oryantasyon',
  },
  {
    title: 'Eğitimler',
    description: 'Ofis rehberi, saha çalışması ve FSBO',
    icon: 'bi-mortarboard',
    route: '/office/modules/egitimler',
  },
  {
    title: 'Nöbet Yönetimi',
    description: 'Günlük, haftalık ve aylık nöbet listesi',
    icon: 'bi-calendar-week',
    route: '/office/modules/nobet-yonetimi',
  },
  {
    title: 'Toplantı Yoklama',
    description: 'Katıldı, katılmadı ve mazeret raporu',
    icon: 'bi-clipboard-check',
    route: '/office/modules/toplanti-yoklama',
  },
  {
    title: 'Yetkili Portföyler',
    description: 'EİDS, yazılı yetki ve sorumlu danışman',
    icon: 'bi-shield-lock',
    route: '/office/modules/yetkili-portfoyler',
  },
  {
    title: 'Ofis Pipeline',
    description: 'Satış, kiralama, kapora, sözleşme ve tapu',
    icon: 'bi-diagram-3',
    route: '/office/modules/ofis-pipeline',
  },
  {
    title: 'Komisyon Sistemi',
    description: 'Ofis payı, danışman payı ve ortak işlem',
    icon: 'bi-percent',
    route: '/office/modules/komisyon-sistemi',
  },
  {
    title: 'Liderlik Tabloları',
    description: 'Ciro ve işlem liderlik sıralamaları',
    icon: 'bi-trophy',
    route: '/office/modules/liderlik-tablolari',
  },
  {
    title: 'Bölge Ataması',
    description: 'İl, ilçe, mahalle ve danışman sorumluluğu',
    icon: 'bi-geo-alt',
    route: '/office/modules/bolge-atamasi',
  },
  {
    title: 'Ayrılan Personel',
    description: 'Ayrılış, veri devri ve portföy devri',
    icon: 'bi-person-dash',
    route: '/office/modules/ayrilan-personel',
  },
]
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Çoklu Danışmanlı Ofis Paketi
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Ofis Yönetimi
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Broker için danışman, nöbet, toplantı, evrak, portföy, işlem, komisyon, hedef ve finans süreçlerini tek ekrandan takip etme alanı.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink to="/office/consultants/new" class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"><i class="bi bi-person-plus mr-2"></i>Üye Ekle</NuxtLink>

          <NuxtLink to="/office/announcements" class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><i class="bi bi-megaphone mr-2"></i>Duyuru Oluştur</NuxtLink>

          <NuxtLink
            to="/office/notifications"
            class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <i class="bi bi-bell mr-2"></i>
            Bildirim Merkezi
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="card in kpiCards"
        :key="card.title"
        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-slate-500">{{ card.title }}</p>
            <p class="mt-3 text-2xl font-bold text-slate-900">{{ card.value }}</p>
            <p class="mt-2 text-xs text-slate-400">{{ card.sub }}</p>
          </div>

          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-700">
            <i class="bi" :class="card.icon"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">Ofis Operasyon Akışı</h2>
          <p class="mt-1 text-sm text-slate-500">
            Toplantı, randevu, nöbet, eğitim ve kritik günler
          </p>
        </div>

        <div class="divide-y divide-slate-100">
          <div
            v-for="event in officeCalendar"
            :key="event.id"
            class="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between"
          >
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <i
                  class="bi"
                  :class="event.type === 'Toplantı'
                    ? 'bi-people'
                    : event.type === 'Nöbet'
                      ? 'bi-calendar-check'
                      : event.type === 'Eğitim'
                        ? 'bi-mortarboard'
                        : 'bi-file-earmark-check'"
                ></i>
              </div>

              <div>
                <p class="font-semibold text-slate-900">{{ event.title }}</p>
                <p class="mt-1 text-sm text-slate-500">
                  {{ event.owner }} · {{ event.date }} · {{ event.time }}
                </p>
              </div>
            </div>

            <span
              class="inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold"
              :class="priorityClass(event.priority)"
            >
              {{ event.priority }}
            </span>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">Yapılacaklar Listesi</h2>
          <p class="mt-1 text-sm text-slate-500">
            Ofis, müşteri, belge, sosyal medya ve malik rapor işleri
          </p>
        </div>

        <div class="space-y-3 p-6">
          <div
            v-for="task in officeTasks"
            :key="task.id"
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {{ task.category }}
              </span>

              <span
                class="rounded-full border px-3 py-1 text-xs font-semibold"
                :class="taskStatusClass(task.status)"
              >
                {{ task.status }}
              </span>
            </div>

            <p class="mt-3 font-semibold text-slate-900">
              {{ task.title }}
            </p>

            <p class="mt-2 text-sm text-slate-500">
              {{ task.owner }} · {{ task.due }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">Ödeme / SGK / Gider Takibi</h2>
          <p class="mt-1 text-sm text-slate-500">
            Ofis içi ödemeler, SGK, maaş ve ek giderler
          </p>
        </div>

        <div class="divide-y divide-slate-100">
          <div
            v-for="payment in payments"
            :key="payment.id"
            class="px-6 py-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {{ payment.type }}
                </p>
                <p class="mt-2 font-semibold text-slate-900">
                  {{ payment.title }}
                </p>
                <p class="mt-1 text-sm text-slate-500">
                  {{ payment.dueDate }}
                </p>
              </div>

              <div class="text-right">
                <p class="font-bold text-slate-900">{{ formatMoney(payment.amount) }}</p>
                <span
                  class="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  :class="paymentStatusClass(payment.status)"
                >
                  {{ payment.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Liderlik ve Derecelendirme</h2>
            <p class="mt-1 text-sm text-slate-500">
              Sadece çoklu danışmanlı ofis paketinde aktif
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="period in periods"
              :key="period"
              type="button"
              class="rounded-xl px-3 py-2 text-xs font-semibold transition"
              :class="selectedPeriod === period ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'"
              @click="selectedPeriod = period"
            >
              {{ period }}
            </button>
          </div>
        </div>

        <div class="grid gap-6 p-6 lg:grid-cols-2">
          <div>
            <h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
              Ciro Liderliği
            </h3>

            <div class="space-y-3">
              <div
                v-for="(item, index) in revenueLeaders"
                :key="item.id"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-900">
                      {{ index + 1 }}
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900">{{ item.fullName }}</p>
                      <p class="text-xs text-slate-500">{{ item.expertiseRegion }}</p>
                    </div>
                  </div>

                  <p class="font-bold text-slate-900">{{ formatMoney(item.revenue) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
              İşlem Liderliği
            </h3>

            <div class="space-y-3">
              <div
                v-for="(item, index) in dealLeaders"
                :key="item.id"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-900">
                      {{ index + 1 }}
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900">{{ item.fullName }}</p>
                      <p class="text-xs text-slate-500">{{ item.expertiseArea }}</p>
                    </div>
                  </div>

                  <p class="font-bold text-slate-900">{{ item.dealCount }} işlem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">Danışman Kayıt ve İlan Sorumluluğu</h2>
        <p class="mt-1 text-sm text-slate-500">
          Çalışma türü, durum, portföy sayısı, işlem ve hedef takibi
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Danışman</th>
              <th class="px-6 py-4">Çalışma Türü</th>
              <th class="px-6 py-4">Durum</th>
              <th class="px-6 py-4">Uzmanlık</th>
              <th class="px-6 py-4">Aktif İlan</th>
              <th class="px-6 py-4">Satılık</th>
              <th class="px-6 py-4">Kiralık</th>
              <th class="px-6 py-4">İşlem</th>
              <th class="px-6 py-4">Ciro Hedefi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 bg-white">
            <tr
              v-for="item in consultants"
              :key="item.id"
              class="transition hover:bg-slate-50"
            >
              <td class="px-6 py-4">
                <div>
                  <p class="font-semibold text-slate-900">{{ item.fullName }}</p>
                  <p class="text-xs text-slate-500">{{ item.code }}</p>
                </div>
              </td>

              <td class="px-6 py-4 text-slate-600">
                {{ item.workType }}
              </td>

              <td class="px-6 py-4">
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(item.status)">
                  {{ item.status }}
                </span>
              </td>

              <td class="px-6 py-4">
                <p class="text-slate-700">{{ item.expertiseArea }}</p>
                <p class="text-xs text-slate-500">{{ item.expertiseRegion }}</p>
              </td>

              <td class="px-6 py-4 font-semibold text-slate-900">{{ item.activeListings }}</td>
              <td class="px-6 py-4 text-slate-600">{{ item.saleListings }}</td>
              <td class="px-6 py-4 text-slate-600">{{ item.rentListings }}</td>
              <td class="px-6 py-4 text-slate-600">{{ item.dealCount }}</td>

              <td class="px-6 py-4">
                <div class="w-44">
                  <div class="flex items-center justify-between text-xs text-slate-500">
                    <span>{{ formatMoney(item.revenue) }}</span>
                    <span>%{{ percent(item.revenue, item.revenueTarget) }}</span>
                  </div>
                  <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      class="h-full rounded-full bg-slate-900"
                      :style="{ width: percent(item.revenue, item.revenueTarget) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">İşlem Kayıt ve Ofis Pipeline</h2>
          <p class="mt-1 text-sm text-slate-500">
            Satış, kiralama, komisyon, ofis payı ve danışman payı
          </p>
        </div>

        <div class="space-y-4 p-6">
          <div
            v-for="item in pipelines"
            :key="item.id"
            class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    {{ enumLbl('DealType', item.transactionType) }}
                  </span>
                  <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {{ item.stage }}
                  </span>
                </div>

                <h3 class="mt-3 font-bold text-slate-900">{{ item.property }}</h3>
                <p class="mt-1 text-sm text-slate-500">
                  {{ consultantName(item.consultantId) }}<template v-if="item.partnerConsultantId"> · Ortak: {{ consultantName(item.partnerConsultantId) }}</template> · {{ item.customer }}
                </p>
              </div>

              <div class="text-left lg:text-right">
                <p class="font-bold text-slate-900">{{ formatMoney(item.amount) }}</p>
                <p class="mt-1 text-xs text-slate-500">Komisyon: {{ formatMoney(item.commission) }}</p>
              </div>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Ofis Payı</p>
                <p class="mt-2 font-bold text-slate-900">{{ formatMoney(item.officeShare) }}</p>
              </div>

              <div class="rounded-2xl bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Danışman Payı</p>
                <p class="mt-2 font-bold text-slate-900">{{ formatMoney(item.consultantShare) }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">Hedefte Geride Kalanlar</h2>
          <p class="mt-1 text-sm text-slate-500">
            Broker takip ekranı
          </p>
        </div>

        <div class="space-y-4 p-6">
          <div
            v-for="item in behindTargetConsultants"
            :key="item.id"
            class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-bold text-slate-900">{{ item.fullName }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ item.expertiseArea }} · {{ item.expertiseRegion }}</p>
              </div>

              <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                %{{ percent(item.revenue, item.revenueTarget) }}
              </span>
            </div>

            <div class="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div
                class="h-full rounded-full bg-slate-900"
                :style="{ width: percent(item.revenue, item.revenueTarget) + '%' }"
              ></div>
            </div>

            <div class="mt-3 flex justify-between text-xs text-slate-500">
              <span>{{ formatMoney(item.revenue) }}</span>
              <span>{{ formatMoney(item.revenueTarget) }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">Ofis İçi Duyurular</h2>
          <p class="mt-1 text-sm text-slate-500">
            Toplantı, eğitim, nöbet, başarı ve kural duyuruları
          </p>
        </div>

        <div class="space-y-3 p-6">
          <div
            v-for="item in announcements"
            :key="item.id"
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {{ item.type }}
              </span>
              <span class="text-xs text-slate-400">{{ item.date }}</span>
            </div>

            <p class="mt-3 font-semibold text-slate-900">
              {{ item.title }}
            </p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 class="text-xl font-bold text-slate-900">Bölge / Mahalle Bazlı Danışman Ataması</h2>
          <p class="mt-1 text-sm text-slate-500">
            Birincil ve yedek danışman sorumluluğu
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-sm">
            <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-6 py-4">Bölge</th>
                <th class="px-6 py-4">Uzmanlık</th>
                <th class="px-6 py-4">Birincil Danışman</th>
                <th class="px-6 py-4">Yedek Danışman</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 bg-white">
              <tr
                v-for="item in regionAssignments"
                :key="item.id"
                class="transition hover:bg-slate-50"
              >
                <td class="px-6 py-4">
                  <p class="font-semibold text-slate-900">{{ item.city }} / {{ item.district }}</p>
                  <p class="text-xs text-slate-500">{{ item.neighborhood }}</p>
                </td>
                <td class="px-6 py-4 text-slate-600">{{ item.expertiseArea }}</td>
                <td class="px-6 py-4 text-slate-600">{{ item.primaryConsultant }}</td>
                <td class="px-6 py-4 text-slate-600">{{ item.backupConsultant }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">Ofis Modülleri</h2>
        <p class="mt-1 text-sm text-slate-500">
          Çoklu danışmanlı ofis paketinde açılacak ana ekranlar
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in officeModules"
          :key="item.title"
          class="cursor-pointer rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm" @click="navigateTo(item.route)"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-slate-800">
            <i class="bi" :class="item.icon"></i>
          </div>

          <h3 class="mt-4 font-bold text-slate-900">{{ item.title }}</h3>
          <p class="mt-2 text-sm leading-6 text-slate-500">{{ item.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>





