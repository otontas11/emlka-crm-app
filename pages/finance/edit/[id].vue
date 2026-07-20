<script setup>
import { getFinanceRecordById, updateFinanceRecord } from '~/composables/useFinance'

const route = useRoute()
const recordId = computed(() => String(route.params.id))
const isLoading = ref(true)

const subtypeOptionsMap = {
  Gelir: [
    'Satış Komisyonu',
    'Kiralama Komisyonu',
    'Danışman Katkı Payı',
    'Ek Hizmet Geliri',
    'Diğer Gelirler',
  ],
  Gider: [
    'Ofis Kirası',
    'Elektrik',
    'Su',
    'Doğalgaz',
    'İnternet',
    'Telefon',
    'Personel Gideri',
    'SGK Ödemeleri',
    'Vergi Ödemeleri',
    'Reklam Gideri',
    'İlan Gideri',
    'Yakıt Gideri',
    'Yemek/İkram Gideri',
    'Yazılım Gideri',
    'Kırtasiye',
    'Diğer Giderler',
  ],
  Fatura: [
    'Elektrik',
    'Su',
    'Doğalgaz',
    'İnternet',
    'Telefon',
    'Yazılım',
    'Reklam',
    'Diğer Fatura',
  ],
  Ödeme: [
    'Tahsilat',
    'Tedarikçi Ödemesi',
    'Danışman Katkı Payı',
    'Personel Ödemesi',
    'Vergi/SGK Ödemesi',
    'Diğer Ödeme',
  ],
}

const defaultStatusMap = {
  Gelir: 'Bekliyor',
  Gider: 'Ödenecek',
  Fatura: 'Ödenecek',
  Ödeme: 'Bekliyor',
}

const defaultMethodMap = {
  Gelir: 'Havale',
  Gider: 'Banka',
  Fatura: 'Banka',
  Ödeme: 'Havale',
}

const defaultRelatedModuleMap = {
  Gelir: 'Portföy',
  Gider: 'Genel',
  Fatura: 'Genel',
  Ödeme: 'Genel',
}

const form = ref({
  type: 'Gelir',
  subType: '',
  title: '',
  partyName: '',
  relatedModule: 'Genel',
  relatedName: '',
  amount: '',
  currency: 'TL',
  status: 'Bekliyor',
  paymentMethod: 'Havale',
  issueDate: '',
  dueDate: '',
  paymentDate: '',
  invoiceNo: '',
  invoiceTracked: 'Hayır',
  categoryGroup: '',
  notes: '',
  packageLevel: 'Basic',
})

const subtypeOptions = computed(() => {
  return subtypeOptionsMap[form.value.type] || []
})

const isInvoiceType = computed(() => form.value.type === 'Fatura')
const isExpenseType = computed(() => form.value.type === 'Gider')
const isIncomeType = computed(() => form.value.type === 'Gelir')
const isPaymentType = computed(() => form.value.type === 'Ödeme')

const typeHelpText = computed(() => {
  if (form.value.type === 'Gelir') {
    return 'Satış komisyonu, kiralama komisyonu, danışman katkı payı ve benzeri gelir kayıtları için kullanılır.'
  }

  if (form.value.type === 'Gider') {
    return 'Ofis giderleri, reklam, ilan, yazılım, vergi ve benzeri gider kayıtları için kullanılır.'
  }

  if (form.value.type === 'Fatura') {
    return 'Elektrik, su, internet, telefon ve diğer fatura takip kayıtları için kullanılır.'
  }

  return 'Tahsilat ve ödeme hareketlerini ayrı bir finans kaydı olarak takip etmek için kullanılır.'
})

const loadRecord = () => {
  const record = getFinanceRecordById(recordId.value)

  if (!record) {
    isLoading.value = false
    return
  }

  form.value = {
    type: record.type || 'Gelir',
    subType: record.subType || '',
    title: record.title || '',
    partyName: record.partyName || '',
    relatedModule: record.relatedModule || 'Genel',
    relatedName: record.relatedName || '',
    amount: record.amount || '',
    currency: record.currency || 'TL',
    status: record.status || 'Bekliyor',
    paymentMethod: record.paymentMethod || 'Havale',
    issueDate: record.issueDate || '',
    dueDate: record.dueDate || '',
    paymentDate: record.paymentDate || '',
    invoiceNo: record.invoiceNo || '',
    invoiceTracked: record.invoiceTracked || 'Hayır',
    categoryGroup: record.categoryGroup || record.type || '',
    notes: record.notes || '',
    packageLevel: record.packageLevel || 'Basic',
  }

  isLoading.value = false
}

watch(
  () => form.value.type,
  (newType, oldType) => {
    if (!newType) return

    const options = subtypeOptionsMap[newType] || []

    form.value.categoryGroup = newType

    if (newType !== oldType) {
      form.value.status = defaultStatusMap[newType] || 'Bekliyor'
      form.value.paymentMethod = defaultMethodMap[newType] || 'Havale'
      form.value.relatedModule = defaultRelatedModuleMap[newType] || 'Genel'
      form.value.subType = options[0] || ''
      form.value.invoiceTracked = newType === 'Fatura' ? 'Evet' : 'Hayır'
      form.value.invoiceNo = newType === 'Fatura' ? form.value.invoiceNo : ''
    }

    if (form.value.subType && !options.includes(form.value.subType)) {
      form.value.subType = options[0] || ''
    }
  }
)

const saveRecord = () => {
  const updated = updateFinanceRecord(recordId.value, {
    ...form.value,
    amount: Number(form.value.amount || 0),
  })

  if (!updated) {
    alert('Finans kaydı bulunamadı.')
    return
  }

  window.location.href = '/finance/' + recordId.value
}

const goToDetail = () => {
  window.location.href = '/finance/' + recordId.value
}

onMounted(() => {
  loadRecord()
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"></div>
      <h4 class="text-xl font-bold text-slate-900">Finans kaydı yükleniyor</h4>
    </div>

    <template v-else>
      <section class="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl">
        <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Finans Düzenle
            </p>
            <h1 class="mb-3 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              {{ form.title || 'Finans Kaydı Düzenle' }}
            </h1>
          </div>

          <UiButton variant="dark-ghost" icon="bi-arrow-left" @click="goToDetail">Detaya Dön</UiButton>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <h2 class="text-lg font-semibold text-slate-900">Kayıt Bilgileri</h2>
          <p class="mt-1 text-sm text-slate-500">{{ typeHelpText }}</p>
        </div>

        <div class="p-6">
          <div class="grid gap-5 md:grid-cols-12">
            <UiSelect v-model="form.type" label="Tür" class="md:col-span-3">
              <option>Gelir</option>
              <option>Gider</option>
              <option>Fatura</option>
              <option>Ödeme</option>
            </UiSelect>

            <UiSelect v-model="form.subType" label="Alt Tür" class="md:col-span-3">
              <option v-for="option in subtypeOptions" :key="option" :value="option">{{ option }}</option>
            </UiSelect>

            <UiInput v-model="form.title" label="Başlık" class="md:col-span-6" />

            <UiInput v-model="form.partyName" label="Kişi / Kurum" class="md:col-span-4" />

            <UiSelect v-model="form.relatedModule" label="Bağlı Modül" class="md:col-span-4">
              <option>Genel</option>
              <option>Portföy</option>
              <option>Müşteri</option>
              <option>Danışman</option>
              <option>Ofis</option>
            </UiSelect>

            <UiInput v-model="form.relatedName" label="Bağlı Kayıt" class="md:col-span-4" />

            <UiInput v-model="form.amount" label="Tutar" type="number" class="md:col-span-3" />

            <UiSelect v-model="form.currency" label="Para Birimi" class="md:col-span-2">
              <option>TL</option>
              <option>USD</option>
              <option>EUR</option>
            </UiSelect>

            <UiSelect v-model="form.status" label="Durum" class="md:col-span-3">
              <option>Tahsil Edildi</option>
              <option>Ödendi</option>
              <option>Bekliyor</option>
              <option>Ödenecek</option>
              <option>Gecikmiş</option>
              <option>Kısmi Ödendi</option>
            </UiSelect>

            <UiSelect v-model="form.paymentMethod" label="Ödeme Yöntemi" class="md:col-span-4">
              <option>Havale</option>
              <option>Banka</option>
              <option>Nakit</option>
              <option>Kredi Kartı</option>
              <option>EFT</option>
            </UiSelect>

            <UiInput v-model="form.issueDate" label="Kayıt Tarihi" type="date" class="md:col-span-3" />

            <UiInput v-model="form.dueDate" label="Vade Tarihi" type="date" class="md:col-span-3" />

            <UiInput v-model="form.paymentDate" label="Ödeme Tarihi" type="date" class="md:col-span-3" />

            <UiInput v-if="isInvoiceType" v-model="form.invoiceNo" label="Fatura No" class="md:col-span-3" />

            <UiSelect v-if="isInvoiceType" v-model="form.invoiceTracked" label="Fatura Takibi" class="md:col-span-3">
              <option>Evet</option>
              <option>Hayır</option>
            </UiSelect>

            <UiSelect v-if="!isInvoiceType" v-model="form.invoiceTracked" label="Fatura Takibi" class="md:col-span-3">
              <option>Evet</option>
              <option>Hayır</option>
            </UiSelect>

            <UiSelect v-model="form.packageLevel" label="Paket Seviyesi" class="md:col-span-3">
              <option>Basic</option>
              <option>Plus</option>
              <option>Pro</option>
            </UiSelect>

            <div class="md:col-span-12">
              <div
                class="rounded-2xl border px-4 py-4 text-sm"
                :class="[
                  isIncomeType ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : '',
                  isExpenseType ? 'border-red-200 bg-red-50 text-red-700' : '',
                  isInvoiceType ? 'border-amber-200 bg-amber-50 text-amber-700' : '',
                  isPaymentType ? 'border-blue-200 bg-blue-50 text-blue-700' : ''
                ]"
              >
                <strong>Bilgi:</strong>
                <span v-if="isIncomeType">Bu kayıt gelir tarafında raporlanacaktır.</span>
                <span v-else-if="isExpenseType">Bu kayıt gider tarafında raporlanacaktır.</span>
                <span v-else-if="isInvoiceType">Bu kayıt fatura takibinde öne çıkacaktır.</span>
                <span v-else>Bu kayıt ödeme / tahsilat hareketi olarak izlenecektir.</span>
              </div>
            </div>

            <UiTextarea v-model="form.notes" label="Notlar" :rows="4" class="md:col-span-12" />

            <div class="md:col-span-12">
              <UiButton icon="bi-check2-circle" @click="saveRecord">Güncelle</UiButton>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

