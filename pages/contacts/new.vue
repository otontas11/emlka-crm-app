<script setup>
import { useCustomers } from '~/composables/useCustomers'
import { useOffice } from '~/composables/useOffice'

const router = useRouter()

const {
  emptyCustomer,
  hydrateCustomers,
  createCustomer,
} = useCustomers()

const { consultants } = useOffice()

hydrateCustomers()

const successMessage = ref('')

const currentConsultant = computed(() => {
  return consultants.value.find(item => item.status !== 'Ayrıldı') || consultants.value[0] || {
    id: 1,
    fullName: 'Danışman',
  }
})

const createEmptyForm = () => {
  return JSON.parse(JSON.stringify({
    ...emptyCustomer,
    id: Date.now(),
    customerType: 'Aday Müşteri',
    type: 'Aday Müşteri',
    status: 'Aktif',
    visibility: 'Kişisel',
    source: 'Manuel Kayıt',
    dataOwner: 'Danışman',
    officeShared: false,
    isFromPhonebook: false,
    children: [],
  }))
}

const form = reactive(createEmptyForm())

const saveCustomer = () => {
  if (!form.fullName && !form.phone) {
    successMessage.value = 'İsim soyisim veya telefon alanı zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  const customer = createCustomer({
    ...form,
    name: form.fullName,
    city: form.livingCity,
    profession: form.mainProfession,
    type: form.customerType,
    consultantId: currentConsultant.value.id,
    consultantName: currentConsultant.value.fullName,
    notes: form.note,
    createdAt: new Date().toISOString().slice(0, 10),
  })

  router.push(`/contacts/${customer.id}`)
}

const cancel = () => {
  router.push('/contacts')
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Müşteri Yönetimi
          </p>

          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Yeni Müşteri Ekle
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Müşteri bilgilerini, aile detaylarını, özel günleri, ilgi alanlarını ve ilişki notlarını tek kartta oluşturun.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="cancel"
          >
            Müşterilere Dön
          </button>

          <button
            type="button"
            class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            @click="saveCustomer"
          >
            Müşteriyi Kaydet
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

    <CustomerAdvancedFields :model="form" />

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="saveCustomer"
        >
          Müşteriyi Kaydet
        </button>

        <button
          type="button"
          class="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          @click="cancel"
        >
          Vazgeç
        </button>
      </div>
    </section>
  </div>
</template>
