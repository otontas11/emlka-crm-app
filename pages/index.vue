<script setup>
import { useCustomers } from '~/composables/useCustomers'
import { useProperties } from '~/composables/useProperties'
import { useTasks } from '~/composables/useTasks'

const customers = useCustomers()
const properties = useProperties()
const tasks = useTasks()

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('tr-TR').format(date)
}

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

const todayTasks = computed(() => {
  return tasks.value
    .filter(task => task.status === 'Bugün' || task.status === 'Gecikmiş')
    .slice(0, 6)
})

const recentCustomers = computed(() => {
  return [...customers.value]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
})

const recentProperties = computed(() => {
  return [...properties.value]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
})

const activeCustomersCount = computed(() =>
  customers.value.filter(c => c.customerStatus === 'Aktif').length
)

const activePropertiesCount = computed(() =>
  properties.value.filter(p => p.status === 'Aktif').length
)

const completedTasksCount = computed(() =>
  tasks.value.filter(t => t.status === 'Tamamlandı').length
)

const lateTasksCount = computed(() =>
  tasks.value.filter(t => t.status === 'Gecikmiş').length
)

const goToCustomers = () => {
  window.location.href = '/contacts'
}

const goToProperties = () => {
  window.location.href = '/properties'
}

const goToTasks = () => {
  window.location.href = '/tasks'
}

const goToCustomerDetail = (id) => {
  window.location.href = '/contacts/' + String(id)
}

const goToPropertyDetail = (id) => {
  window.location.href = '/properties/' + String(id)
}

const goToTaskDetail = (id) => {
  window.location.href = '/tasks/' + String(id)
}
</script>

<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl">
      <div class="p-5 lg:p-6">
        <div class="grid gap-5 lg:grid-cols-3 lg:items-stretch">
          <div class="lg:col-span-2">
            <p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Emlak CRM Dashboard
            </p>

            <h1 class="mb-3 text-2xl font-bold tracking-tight text-white lg:text-4xl">
              Hoş geldin Sinan
            </h1>

            <p class="max-w-3xl text-sm leading-6 text-slate-300">
              Müşteri, portföy ve görev akışını tek ekrandan takip et.
              Gün içindeki öncelikli işleri hızlıca gör ve operasyonunu daha düzenli yönet.
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                @click="goToCustomers"
              >
                <i class="bi bi-people mr-2"></i>
                Müşteriler
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                @click="goToProperties"
              >
                <i class="bi bi-buildings mr-2"></i>
                Portföyler
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                @click="goToTasks"
              >
                <i class="bi bi-check2-square mr-2"></i>
                Görevler
              </button>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p class="text-[11px] font-medium uppercase tracking-wide text-slate-400">Bugünkü Görev</p>
              <p class="mt-2 text-2xl font-bold text-white">
                {{ tasks.filter(t => t.status === 'Bugün').length }}
              </p>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p class="text-[11px] font-medium uppercase tracking-wide text-slate-400">Gecikmiş Görev</p>
              <p class="mt-2 text-2xl font-bold text-white">{{ lateTasksCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <div class="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <i class="bi bi-people text-xl"></i>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Müşteri
          </span>
        </div>
        <p class="text-sm font-medium text-slate-500">Toplam Müşteri</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">{{ customers.length }}</h2>
        <p class="mt-2 text-sm text-slate-500">Aktif müşteri: {{ activeCustomersCount }}</p>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <div class="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
            <i class="bi bi-buildings text-xl"></i>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Portföy
          </span>
        </div>
        <p class="text-sm font-medium text-slate-500">Toplam Portföy</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">{{ properties.length }}</h2>
        <p class="mt-2 text-sm text-slate-500">Aktif portföy: {{ activePropertiesCount }}</p>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <div class="rounded-2xl bg-amber-50 p-3 text-amber-600">
            <i class="bi bi-check2-square text-xl"></i>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Görev
          </span>
        </div>
        <p class="text-sm font-medium text-slate-500">Toplam Görev</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">{{ tasks.length }}</h2>
        <p class="mt-2 text-sm text-slate-500">Tamamlanan: {{ completedTasksCount }}</p>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <div class="rounded-2xl bg-red-50 p-3 text-red-600">
            <i class="bi bi-exclamation-circle text-xl"></i>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Uyarı
          </span>
        </div>
        <p class="text-sm font-medium text-slate-500">Gecikmiş Görev</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">{{ lateTasksCount }}</h2>
        <p class="mt-2 text-sm text-slate-500">Takip edilmesi gereken görevler</p>
      </article>
    </section>

    <section class="grid gap-6 xl:grid-cols-3">
      <div class="flex min-h-[560px] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-1">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Bugün Yapılacaklar</h2>
            <p class="mt-1 text-sm text-slate-500">Öncelikli görevler</p>
          </div>
          <button
            type="button"
            class="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
            @click="goToTasks"
          >
            Tümünü Gör
          </button>
        </div>

        <div class="flex-1 p-6">
          <div v-if="todayTasks.length === 0" class="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
            Bugün için görev görünmüyor.
          </div>

          <div v-else class="space-y-4">
            <button
              v-for="task in todayTasks"
              :key="task.id"
              type="button"
              class="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
              @click="goToTaskDetail(task.id)"
            >
              <div class="mb-2 flex items-start justify-between gap-3">
                <h3 class="font-semibold text-slate-900">{{ task.title }}</h3>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="task.status === 'Gecikmiş'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'"
                >
                  {{ task.status }}
                </span>
              </div>

              <p class="mb-3 line-clamp-2 text-sm text-slate-500">{{ task.description }}</p>

              <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span><i class="bi bi-calendar-event mr-1"></i>{{ formatDate(task.dueDate) }}</span>
                <span><i class="bi bi-clock mr-1"></i>{{ task.dueTime || '-' }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="flex min-h-[560px] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-1">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Son Müşteriler</h2>
            <p class="mt-1 text-sm text-slate-500">En son eklenen kayıtlar</p>
          </div>
          <button
            type="button"
            class="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
            @click="goToCustomers"
          >
            Tümünü Gör
          </button>
        </div>

        <div class="flex-1 p-6">
          <div v-if="recentCustomers.length === 0" class="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
            Müşteri kaydı bulunmuyor.
          </div>

          <div v-else class="space-y-4">
            <button
              v-for="customer in recentCustomers"
              :key="customer.id"
              type="button"
              class="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
              @click="goToCustomerDetail(customer.id)"
            >
              <div class="mb-2 flex items-start justify-between gap-3">
                <h3 class="font-semibold text-slate-900">{{ customer.fullName }}</h3>
                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ customer.customerStatus || '-' }}
                </span>
              </div>

              <div class="space-y-1 text-sm text-slate-500">
                <p>{{ enumLabel('CustomerType', customer.customerType) || '-' }}</p>
                <p>{{ customer.phone || '-' }}</p>
                <p>{{ customer.livingCity || '-' }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="flex min-h-[560px] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-1">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Son Portföyler</h2>
            <p class="mt-1 text-sm text-slate-500">En son eklenen portföyler</p>
          </div>
          <button
            type="button"
            class="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
            @click="goToProperties"
          >
            Tümünü Gör
          </button>
        </div>

        <div class="flex-1 p-6">
          <div v-if="recentProperties.length === 0" class="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
            Portföy kaydı bulunmuyor.
          </div>

          <div v-else class="space-y-4">
            <button
              v-for="property in recentProperties"
              :key="property.id"
              type="button"
              class="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
              @click="goToPropertyDetail(property.id)"
            >
              <div class="mb-2 flex items-start justify-between gap-3">
                <h3 class="font-semibold text-slate-900">{{ property.title }}</h3>
                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ property.status || '-' }}
                </span>
              </div>

              <div class="space-y-1 text-sm text-slate-500">
                <p>{{ property.listingType || '-' }} · {{ property.propertyType || '-' }}</p>
                <p>{{ property.city || '-' }} / {{ property.district || '-' }}</p>
                <p class="font-medium text-slate-700">{{ formatPrice(property.price, property.currency) }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


