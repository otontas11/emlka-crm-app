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
                  <label class="form-label fw-semibold">Ad Soyad</label>
                  <input v-model="form.fullName" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Telefon</label>
                  <input v-model="form.phone" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">WhatsApp</label>
                  <input v-model="form.whatsapp" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">E-posta</label>
                  <input v-model="form.email" type="email" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Meslek</label>
                  <input v-model="form.profession" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Eski Meslek</label>
                  <input v-model="form.oldProfession" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Doğum Tarihi</label>
                  <input v-model="form.birthDate" type="date" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Müşteri Tipi</label>
                  <select v-model="form.customerType" class="form-select form-select-lg rounded-3">
                    <option>Alıcı</option>
                    <option>Satıcı</option>
                    <option>Kiracı</option>
                    <option>Mal Sahibi</option>
                    <option>Yatırımcı</option>
                    <option>Referans</option>
                  </select>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Müşteri Durumu</label>
                  <select v-model="form.customerStatus" class="form-select form-select-lg rounded-3">
                    <option>Aktif</option>
                    <option>Takipte</option>
                    <option>Pasif</option>
                  </select>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Bir Sonraki Takip Tarihi</label>
                  <input v-model="form.nextFollowUpDate" type="date" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Yaşadığı Şehir</label>
                  <input v-model="form.city" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Memleket</label>
                  <input v-model="form.hometown" type="text" class="form-control form-control-lg rounded-3" />
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
                  <label class="form-label fw-semibold">Eş Adı Soyadı</label>
                  <input v-model="form.spouseName" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-3">
                  <label class="form-label fw-semibold">Eş Mesleği</label>
                  <input v-model="form.spouseProfession" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-3">
                  <label class="form-label fw-semibold">Eş Doğum Tarihi</label>
                  <input v-model="form.spouseBirthDate" type="date" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-3">
                  <label class="form-label fw-semibold">Evlilik Yıl Dönümü</label>
                  <input v-model="form.weddingAnniversary" type="date" class="form-control form-control-lg rounded-3" />
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

                <button type="button" class="btn btn-outline-primary rounded-pill px-3" @click="addChild">
                  <i class="bi bi-plus-lg me-2"></i>Çocuk Ekle
                </button>
              </div>

              <div v-for="(child, index) in form.children" :key="index" class="border rounded-4 p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <strong>{{ index + 1 }}. Çocuk</strong>

                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger rounded-pill"
                    @click="removeChild(index)"
                    v-if="form.children.length > 1"
                  >
                    Sil
                  </button>
                </div>

                <div class="row g-4">
                  <div class="col-md-4">
                    <label class="form-label fw-semibold">Çocuk Adı</label>
                    <input v-model="child.name" type="text" class="form-control form-control-lg rounded-3" />
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-semibold">Çocuk Doğum Tarihi</label>
                    <input v-model="child.birthDate" type="date" class="form-control form-control-lg rounded-3" />
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-semibold">Çocuk Mesleği / Okulu</label>
                    <input v-model="child.schoolOrProfession" type="text" class="form-control form-control-lg rounded-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-primary rounded-pill px-4" @click="saveCustomer">
              <i class="bi bi-check2-circle me-2"></i>Güncelle
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

