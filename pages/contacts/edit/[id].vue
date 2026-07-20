<script setup>
import { getCustomerById, updateCustomer } from '~/composables/useCustomers'

const route = useRoute()

const createEmptyForm = () => ({
  fullName: '',
  phone: '',
  whatsapp: '',
  email: '',
  profession: '',
  oldProfession: '',
  birthDate: '',
  customerType: 'Alıcı',
  customerStatus: 'Aktif',
  nextFollowUpDate: '',
  city: '',
  hometown: '',

  spouseName: '',
  spouseProfession: '',
  spouseBirthDate: '',
  weddingAnniversary: '',

  children: [
    {
      name: '',
      birthDate: '',
      schoolOrProfession: '',
    }
  ],

  motherName: '',
  motherProfession: '',
  motherBirthDate: '',
  motherDeathDate: '',

  fatherName: '',
  fatherProfession: '',
  fatherBirthDate: '',
  fatherDeathDate: '',

  favoriteTeam: '',
  fandomLevel: 'Düşük',
  politicalView: '',
  hobbies: '',
  petInfo: '',

  instagram: '',
  facebook: '',
  linkedin: '',
  twitter: '',

  notes: '',
})

const form = ref(createEmptyForm())
const isLoading = ref(true)
const customerId = computed(() => String(route.params.id))

const loadCustomer = () => {
  const customer = getCustomerById(customerId.value)

  if (!customer) {
    isLoading.value = false
    return
  }

  form.value = {
    fullName: customer.fullName || '',
    phone: customer.phone || '',
    whatsapp: customer.whatsapp || '',
    email: customer.email || '',
    profession: customer.profession || '',
    oldProfession: customer.oldProfession || '',
    birthDate: customer.birthDate || '',
    customerType: customer.customerType || 'Alıcı',
    customerStatus: customer.customerStatus || 'Aktif',
    nextFollowUpDate: customer.nextFollowUpDate || '',
    city: customer.city || '',
    hometown: customer.hometown || '',

    spouseName: customer.spouseName || '',
    spouseProfession: customer.spouseProfession || '',
    spouseBirthDate: customer.spouseBirthDate || '',
    weddingAnniversary: customer.weddingAnniversary || '',

    children: Array.isArray(customer.children) && customer.children.length
      ? customer.children.map(child => ({
          name: child.name || '',
          birthDate: child.birthDate || '',
          schoolOrProfession: child.schoolOrProfession || '',
        }))
      : [
          {
            name: '',
            birthDate: '',
            schoolOrProfession: '',
          }
        ],

    motherName: customer.motherName || '',
    motherProfession: customer.motherProfession || '',
    motherBirthDate: customer.motherBirthDate || '',
    motherDeathDate: customer.motherDeathDate || '',

    fatherName: customer.fatherName || '',
    fatherProfession: customer.fatherProfession || '',
    fatherBirthDate: customer.fatherBirthDate || '',
    fatherDeathDate: customer.fatherDeathDate || '',

    favoriteTeam: customer.favoriteTeam || '',
    fandomLevel: customer.fandomLevel || 'Düşük',
    politicalView: customer.politicalView || '',
    hobbies: customer.hobbies || '',
    petInfo: customer.petInfo || '',

    instagram: customer.instagram || '',
    facebook: customer.facebook || '',
    linkedin: customer.linkedin || '',
    twitter: customer.twitter || '',

    notes: customer.notes || '',
  }

  isLoading.value = false
}

const addChild = () => {
  form.value.children.push({
    name: '',
    birthDate: '',
    schoolOrProfession: '',
  })
}

const removeChild = (index) => {
  if (form.value.children.length > 1) {
    form.value.children.splice(index, 1)
  }
}

const saveCustomer = () => {
  const updated = updateCustomer(customerId.value, { ...form.value })

  if (!updated) {
    alert('Müşteri bulunamadı.')
    return
  }

  window.location.href = '/contacts/' + customerId.value
}

onMounted(() => {
  loadCustomer()
})
</script>

<template>
  <div class="container-fluid">
    <div v-if="isLoading" class="card border-0 shadow-sm rounded-4">
      <div class="card-body p-5 text-center">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <h4 class="fw-bold mb-2">Müşteri bilgileri yükleniyor</h4>
      </div>
    </div>

    <template v-else>
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 class="fw-bold mb-1">Müşteri Düzenle</h2>
          <p class="text-muted mb-0">Kayıtlı müşteri bilgilerini güncelleyin.</p>
        </div>

        <NuxtLink :to="'/contacts/' + customerId" class="btn btn-outline-secondary rounded-pill px-4">
          <i class="bi bi-arrow-left me-2"></i>Detaya Dön
        </NuxtLink>
      </div>

      <div class="row g-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Temel Bilgiler</h5>

              <div class="row g-4">
                <div class="col-md-6">
                  <UiInput v-model="form.fullName" label="Ad Soyad" type="text" variant="ring" />
                </div>

                <div class="col-md-6">
                  <UiInput v-model="form.phone" label="Telefon" type="text" variant="ring" />
                </div>

                <div class="col-md-6">
                  <UiInput v-model="form.whatsapp" label="WhatsApp" type="text" variant="ring" />
                </div>

                <div class="col-md-6">
                  <UiInput v-model="form.email" label="E-posta" type="email" variant="ring" />
                </div>

                <div class="col-md-4">
                  <UiInput v-model="form.profession" label="Meslek" type="text" variant="ring" />
                </div>

                <div class="col-md-4">
                  <UiInput v-model="form.oldProfession" label="Eski Meslek" type="text" variant="ring" />
                </div>

                <div class="col-md-4">
                  <UiInput v-model="form.birthDate" label="Doğum Tarihi" type="date" variant="ring" />
                </div>

                <div class="col-md-4">
                  <UiSelect v-model="form.customerType" label="Müşteri Tipi" variant="ring">
                    <option>Alıcı</option>
                    <option>Satıcı</option>
                    <option>Kiracı</option>
                    <option>Mal Sahibi</option>
                    <option>Yatırımcı</option>
                    <option>Referans</option>
                  </UiSelect>
                </div>

                <div class="col-md-4">
                  <UiSelect v-model="form.customerStatus" label="Müşteri Durumu" variant="ring">
                    <option>Aktif</option>
                    <option>Takipte</option>
                    <option>Pasif</option>
                  </UiSelect>
                </div>

                <div class="col-md-4">
                  <UiInput v-model="form.nextFollowUpDate" label="Bir Sonraki Takip Tarihi" type="date" variant="ring" />
                </div>

                <div class="col-md-6">
                  <UiInput v-model="form.city" label="Yaşadığı Şehir" type="text" variant="ring" />
                </div>

                <div class="col-md-6">
                  <UiInput v-model="form.hometown" label="Memleket" type="text" variant="ring" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Eş Bilgileri</h5>

              <div class="row g-4">
                <div class="col-md-3">
                  <UiInput v-model="form.spouseName" label="Eş Adı Soyadı" type="text" variant="ring" />
                </div>

                <div class="col-md-3">
                  <UiInput v-model="form.spouseProfession" label="Eş Mesleği" type="text" variant="ring" />
                </div>

                <div class="col-md-3">
                  <UiInput v-model="form.spouseBirthDate" label="Eş Doğum Tarihi" type="date" variant="ring" />
                </div>

                <div class="col-md-3">
                  <UiInput v-model="form.weddingAnniversary" label="Evlilik Yıl Dönümü" type="date" variant="ring" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0">Çocuk Bilgileri</h5>

                <UiButton variant="secondary" icon="bi-plus-lg" type="button" @click="addChild">Çocuk Ekle</UiButton>
              </div>

              <div v-for="(child, index) in form.children" :key="index" class="border rounded-4 p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <strong>{{ index + 1 }}. Çocuk</strong>

                  <UiButton
                    variant="danger"
                    type="button"
                    @click="removeChild(index)"
                    v-if="form.children.length > 1"
                  >Sil</UiButton>
                </div>

                <div class="row g-4">
                  <div class="col-md-4">
                    <UiInput v-model="child.name" label="Çocuk Adı" type="text" variant="ring" />
                  </div>

                  <div class="col-md-4">
                    <UiInput v-model="child.birthDate" label="Çocuk Doğum Tarihi" type="date" variant="ring" />
                  </div>

                  <div class="col-md-4">
                    <UiInput v-model="child.schoolOrProfession" label="Çocuk Mesleği / Okulu" type="text" variant="ring" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="d-flex gap-2">
            <UiButton variant="primary" icon="bi-check2-circle" type="button" @click="saveCustomer">Güncelle</UiButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

