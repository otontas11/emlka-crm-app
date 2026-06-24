<script setup>
import { useCustomers } from '~/composables/useCustomers'

const route = useRoute()
const router = useRouter()

const {
  emptyCustomer,
  hydrateCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  shareCustomerWithOffice,
  unshareCustomerFromOffice,
} = useCustomers()

hydrateCustomers()

const customerId = computed(() => {
  return Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
})

const customer = computed(() => {
  return getCustomerById(customerId.value)
})

const successMessage = ref('')

const form = reactive(JSON.parse(JSON.stringify(emptyCustomer)))

watch(
  customer,
  (value) => {
    if (!value) return

    const copy = JSON.parse(JSON.stringify({
      ...emptyCustomer,
      ...value,
      children: Array.isArray(value.children) ? value.children : [],
    }))

    Object.keys(copy).forEach((key) => {
      form[key] = copy[key]
    })
  },
  { immediate: true }
)

const saveCustomer = () => {
  if (!customer.value) return

  updateCustomer(customer.value.id, {
    ...form,
    name: form.fullName,
    city: form.livingCity,
    profession: form.mainProfession,
    type: form.customerType,
    notes: form.note,
  })

  successMessage.value = 'Müşteri bilgileri güncellendi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const toggleOfficeShare = () => {
  if (!customer.value) return

  if (customer.value.officeShared) {
    unshareCustomerFromOffice(customer.value.id)
    successMessage.value = 'Müşteri kişisel olarak işaretlendi. Broker artık bu kaydı göremez.'
  } else {
    shareCustomerWithOffice(customer.value.id)
    successMessage.value = 'Müşteri ofisle paylaşıldı. Broker artık bu kaydı görebilir.'
  }

  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

const removeCustomer = () => {
  if (!customer.value) return

  const label = customer.value.fullName || customer.value.name || customer.value.phone || 'Bu müşteri'

  if (confirm(`${label} kaydını silmek istiyor musunuz?`)) {
    deleteCustomer(customer.value.id)
    router.push('/contacts')
  }
}

const backToCustomers = () => {
  router.push('/contacts')
}

const visibilityClass = computed(() => {
  if (!customer.value) return 'bg-slate-100 text-slate-600'

  return customer.value.officeShared
    ? 'bg-slate-900 text-white'
    : 'bg-slate-100 text-slate-700'
})
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Müşteri Detayı
          </p>

          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {{ customer?.fullName || customer?.name || 'Müşteri Detayı' }}
          </h1>

          <div v-if="customer" class="mt-3 flex flex-wrap gap-2">
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="visibilityClass"
            >
              {{ customer.officeShared ? 'Ofisle Paylaşıldı' : 'Kişisel' }}
            </span>

            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {{ customer.customerType || customer.type || 'Aday Müşteri' }}
            </span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="backToCustomers"
          >
            Müşterilere Dön
          </button>

          <button
            v-if="customer"
            type="button"
            class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="toggleOfficeShare"
          >
            {{ customer.officeShared ? 'Ofis Paylaşımını Kapat' : 'Müşteriyi Ofisle Paylaş' }}
          </button>

          <button
            v-if="customer"
            type="button"
            class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            @click="saveCustomer"
          >
            Kaydet
          </button>

          <button
            v-if="customer"
            type="button"
            class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="removeCustomer"
          >
            Sil
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-info-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <section
      v-if="!customer"
      class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"
    >
      <h2 class="text-xl font-bold text-slate-900">
        Müşteri bulunamadı
      </h2>

      <button
        type="button"
        class="mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        @click="backToCustomers"
      >
        Müşterilere Dön
      </button>
    </section>

    <template v-else>
      <CustomerAdvancedFields :model="form" />

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            @click="saveCustomer"
          >
            Bilgileri Kaydet
          </button>

          <button
            type="button"
            class="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="removeCustomer"
          >
            Müşteriyi Sil
          </button>
        </div>
      </section>
    </template>
  </div>
</template>
