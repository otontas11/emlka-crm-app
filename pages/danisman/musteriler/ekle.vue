<script setup>
definePageMeta({
  layout: 'danisman',
  middleware: 'auth'
})

import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const activeTab = ref('personal')

// Form verileri
const formData = ref({
  // Kişisel Bilgiler
  firstName: '',
  lastName: '',
  tcKimlikNo: '',
  birthDate: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  memleket: '',

  // Meslek Bilgileri
  mainProfession: '',
  secondaryProfessions: [],
  previousProfessions: [],
  companies: [],

  // Sosyal Medya
  facebook: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  twitter: '',

  // Aile Bilgileri
  spouseName: '',
  childrenNames: '',
  motherName: '',
  fatherName: '',
  marriageDate: '',

  // Mülk Bilgileri
  propertyType: '',
  propertyOwnership: '',
  rentalStatus: '',
  propertyAddress: '',

  // Hobiler ve Takımlar
  hobbies: [],
  favoriteTeam: '',
  fanaticismLevel: '',

  // Araç ve Tekne
  vehicleBrand: '',
  vehicleModel: '',
  vehicleYear: '',
  vehicleFanaticism: '',
  boatBrand: '',
  boatModel: '',
  boatYear: '',

  // Evcil Hayvan
  pets: [],

  // Notlar
  notes: ''
})

const tabs = [
  { id: 'personal', label: 'Kişisel Bilgiler', icon: 'user' },
  { id: 'profession', label: 'Meslek', icon: 'briefcase' },
  { id: 'social', label: 'Sosyal Medya', icon: 'share' },
  { id: 'family', label: 'Aile', icon: 'users' },
  { id: 'property', label: 'Mülk', icon: 'home' },
  { id: 'hobbies', label: 'Hobiler', icon: 'heart' },
  { id: 'vehicles', label: 'Araç/Tekne', icon: 'car' },
  { id: 'pets', label: 'Evcil Hayvan', icon: 'paw' },
  { id: 'notes', label: 'Notlar', icon: 'note' }
]

const handleSubmit = async () => {
  isLoading.value = true

  // Simüle edilmiş kayıt işlemi
  setTimeout(() => {
    isLoading.value = false
    // Başarılı kayıt sonrası müşteri listesine yönlendir
    router.push('/danisman/musteriler')
  }, 1000)
}

const addPet = () => {
  formData.value.pets.push({
    type: '',
    name: '',
    age: '',
    notes: ''
  })
}

const removePet = (index) => {
  formData.value.pets.splice(index, 1)
}

const addHobby = () => {
  formData.value.hobbies.push('')
}

const removeHobby = (index) => {
  formData.value.hobbies.splice(index, 1)
}
</script>

<template>
  <div class="person-add-page">
    <div class="page-header">
      <h1>Yeni Müşteri Ekle</h1>
      <p>Müşteri bilgilerini eksiksiz doldurun</p>
    </div>

    <div class="form-container">
      <!-- Tab Navigation -->
      <div class="tabs-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="person-form">
        <!-- Kişisel Bilgiler -->
        <div v-show="activeTab === 'personal'" class="form-section">
          <h2 class="section-title">Kişisel Bilgiler</h2>
          <div class="form-grid">
            <UiInput label="Ad" required variant="outline" type="text" v-model="formData.firstName" placeholder="Ad" />
            <UiInput label="Soyad" required variant="outline" type="text" v-model="formData.lastName" placeholder="Soyad" />
            <UiInput label="T.C. Kimlik No" variant="outline" type="text" v-model="formData.tcKimlikNo" maxlength="11" placeholder="11 haneli T.C. Kimlik No" />
            <UiInput label="Doğum Tarihi" variant="outline" type="date" v-model="formData.birthDate" />
            <UiSelect label="Cinsiyet" variant="outline" v-model="formData.gender">
              <option value="">Seçiniz</option>
              <option value="male">Erkek</option>
              <option value="female">Kadın</option>
              <option value="other">Diğer</option>
            </UiSelect>
            <UiInput label="E-posta" variant="outline" type="email" v-model="formData.email" placeholder="ornek@email.com" />
            <UiInput label="Telefon" required variant="outline" type="tel" v-model="formData.phone" placeholder="+90 5XX XXX XX XX" />
            <UiInput label="Memleket" variant="outline" type="text" v-model="formData.memleket" placeholder="Memleket" />
            <UiTextarea label="Adres" variant="outline" class="col-span-full" :rows="3" v-model="formData.address" placeholder="Tam adres bilgisi" />
          </div>
        </div>

        <!-- Meslek Bilgileri -->
        <div v-show="activeTab === 'profession'" class="form-section">
          <h2 class="section-title">Meslek Bilgileri</h2>
          <div class="form-grid">
            <UiInput label="Ana Meslek" variant="outline" type="text" v-model="formData.mainProfession" placeholder="Ana meslek" />
            <UiInput label="Yan Meslekler" variant="outline" class="col-span-full" type="text" v-model="formData.secondaryProfessions" placeholder="Yan meslekler (virgülle ayırın)" />
            <UiInput label="Eski Meslekler" variant="outline" class="col-span-full" type="text" v-model="formData.previousProfessions" placeholder="Eski meslekler (virgülle ayırın)" />
            <UiInput label="Kurumlar" variant="outline" class="col-span-full" type="text" v-model="formData.companies" placeholder="Çalışılan kurumlar (virgülle ayırın)" />
          </div>
        </div>

        <!-- Sosyal Medya -->
        <div v-show="activeTab === 'social'" class="form-section">
          <h2 class="section-title">Sosyal Medya Hesapları</h2>
          <div class="form-grid">
            <UiInput label="Facebook" variant="outline" type="text" v-model="formData.facebook" placeholder="Facebook kullanıcı adı veya URL" />
            <UiInput label="Instagram" variant="outline" type="text" v-model="formData.instagram" placeholder="Instagram kullanıcı adı" />
            <UiInput label="LinkedIn" variant="outline" type="text" v-model="formData.linkedin" placeholder="LinkedIn profil URL" />
            <UiInput label="YouTube" variant="outline" type="text" v-model="formData.youtube" placeholder="YouTube kanal adı veya URL" />
            <UiInput label="Twitter" variant="outline" type="text" v-model="formData.twitter" placeholder="Twitter kullanıcı adı" />
          </div>
        </div>

        <!-- Aile Bilgileri -->
        <div v-show="activeTab === 'family'" class="form-section">
          <h2 class="section-title">Aile Bilgileri</h2>
          <div class="form-grid">
            <UiInput label="Eş Adı" variant="outline" type="text" v-model="formData.spouseName" placeholder="Eş adı" />
            <UiInput label="Evlilik Tarihi" variant="outline" type="date" v-model="formData.marriageDate" />
            <UiInput label="Çocuk(lar) Adı" variant="outline" class="col-span-full" type="text" v-model="formData.childrenNames" placeholder="Çocuk isimleri (virgülle ayırın)" />
            <UiInput label="Anne Adı" variant="outline" type="text" v-model="formData.motherName" placeholder="Anne adı" />
            <UiInput label="Baba Adı" variant="outline" type="text" v-model="formData.fatherName" placeholder="Baba adı" />
          </div>
        </div>

        <!-- Mülk Bilgileri -->
        <div v-show="activeTab === 'property'" class="form-section">
          <h2 class="section-title">Mülk Bilgileri</h2>
          <div class="form-grid">
            <UiSelect label="Mülk Türü" variant="outline" v-model="formData.propertyType">
              <option value="">Seçiniz</option>
              <option value="ev">Ev</option>
              <option value="dukkan">Dükkan</option>
              <option value="arsa">Arsa</option>
              <option value="villa">Villa</option>
              <option value="apartman">Apartman</option>
            </UiSelect>
            <UiSelect label="Sahiplik Durumu" variant="outline" v-model="formData.propertyOwnership">
              <option value="">Seçiniz</option>
              <option value="owner">Sahip</option>
              <option value="tenant">Kiracı</option>
              <option value="none">Yok</option>
            </UiSelect>
            <UiSelect label="Kira Durumu" variant="outline" v-model="formData.rentalStatus">
              <option value="">Seçiniz</option>
              <option value="renting">Kiralıyor</option>
              <option value="rented">Kiraya Veriyor</option>
              <option value="none">Yok</option>
            </UiSelect>
            <UiTextarea label="Mülk Adresi" variant="outline" class="col-span-full" :rows="3" v-model="formData.propertyAddress" placeholder="Mülk adresi" />
          </div>
        </div>

        <!-- Hobiler ve Takımlar -->
        <div v-show="activeTab === 'hobbies'" class="form-section">
          <h2 class="section-title">Hobiler ve Takımlar</h2>
          <div class="form-grid">
            <div class="col-span-full">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Hobiler</label>
              <div v-for="(hobby, index) in formData.hobbies" :key="index" class="array-item">
                <UiInput variant="outline" class="flex-1" type="text" v-model="formData.hobbies[index]" :placeholder="`Hobi ${index + 1}`" />
                <UiButton variant="danger" type="button" @click="removeHobby(index)">×</UiButton>
              </div>
              <UiButton variant="secondary" type="button" class="mt-2" @click="addHobby">+ Hobi Ekle</UiButton>
            </div>
            <UiInput label="Tuttuğu Takım" variant="outline" type="text" v-model="formData.favoriteTeam" placeholder="Takım adı" />
            <UiSelect label="Fanatiklik Seviyesi" variant="outline" v-model="formData.fanaticismLevel">
              <option value="">Seçiniz</option>
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
              <option value="very-high">Çok Yüksek</option>
            </UiSelect>
          </div>
        </div>

        <!-- Araç ve Tekne -->
        <div v-show="activeTab === 'vehicles'" class="form-section">
          <h2 class="section-title">Araç ve Tekne Bilgileri</h2>
          <div class="form-grid">
            <h3 class="subsection-title">Araç</h3>
            <UiInput label="Marka" variant="outline" type="text" v-model="formData.vehicleBrand" placeholder="Araç markası" />
            <UiInput label="Model" variant="outline" type="text" v-model="formData.vehicleModel" placeholder="Araç modeli" />
            <UiInput label="Yıl" variant="outline" type="number" v-model="formData.vehicleYear" placeholder="Üretim yılı" min="1900" :max="new Date().getFullYear()" />
            <UiSelect label="Fanatiklik Seviyesi" variant="outline" v-model="formData.vehicleFanaticism">
              <option value="">Seçiniz</option>
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </UiSelect>
            <h3 class="subsection-title">Tekne</h3>
            <UiInput label="Marka" variant="outline" type="text" v-model="formData.boatBrand" placeholder="Tekne markası" />
            <UiInput label="Model" variant="outline" type="text" v-model="formData.boatModel" placeholder="Tekne modeli" />
            <UiInput label="Yıl" variant="outline" type="number" v-model="formData.boatYear" placeholder="Üretim yılı" min="1900" :max="new Date().getFullYear()" />
          </div>
        </div>

        <!-- Evcil Hayvan -->
        <div v-show="activeTab === 'pets'" class="form-section">
          <h2 class="section-title">Evcil Hayvan Bilgileri</h2>
          <div class="form-grid">
            <div v-for="(pet, index) in formData.pets" :key="index" class="pet-item">
              <h3 class="pet-title">Evcil Hayvan {{ index + 1 }}</h3>
              <div class="form-grid">
                <UiSelect label="Tür" variant="outline" v-model="pet.type">
                  <option value="">Seçiniz</option>
                  <option value="dog">Köpek</option>
                  <option value="cat">Kedi</option>
                  <option value="bird">Kuş</option>
                  <option value="other">Diğer</option>
                </UiSelect>
                <UiInput label="İsim" variant="outline" type="text" v-model="pet.name" placeholder="Hayvan ismi" />
                <UiInput label="Yaş" variant="outline" type="number" v-model="pet.age" placeholder="Yaş" min="0" />
                <UiTextarea label="Notlar" variant="outline" class="col-span-full" :rows="2" v-model="pet.notes" placeholder="Evcil hayvan hakkında notlar" />
              </div>
              <UiButton variant="danger" type="button" @click="removePet(index)">Evcil Hayvanı Kaldır</UiButton>
            </div>
            <UiButton variant="secondary" type="button" class="mt-2" @click="addPet">+ Evcil Hayvan Ekle</UiButton>
          </div>
        </div>

        <!-- Notlar -->
        <div v-show="activeTab === 'notes'" class="form-section">
          <h2 class="section-title">Ek Notlar</h2>
          <div class="form-grid">
            <UiTextarea label="Notlar" variant="outline" class="col-span-full" :rows="8" v-model="formData.notes" placeholder="Kişi hakkında ek notlar ve açıklamalar" />
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <UiButton variant="secondary" type="button" class="w-full md:w-auto" @click="router.push('/danisman/musteriler')">
            İptal
          </UiButton>
          <UiButton variant="primary" type="submit" :disabled="isLoading" class="w-full md:w-auto">
            {{ isLoading ? 'Kaydediliyor...' : 'Müşteriyi Kaydet' }}
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.person-add-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #6b7280;
  font-size: 1rem;
}

.form-container {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs-nav {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-button {
  padding: 0.75rem 1.25rem;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.tab-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.tab-button.active {
  background: #2563eb;
  color: #fff;
}

.person-form {
  padding: 2rem;
}

.form-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.subsection-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 1.5rem 0 1rem;
  grid-column: 1 / -1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.array-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.pet-item {
  grid-column: 1 / -1;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.pet-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .person-add-page {
    padding: 1.5rem 1rem;
  }

  .tabs-nav {
    padding: 0.75rem;
  }

  .tab-button {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }

  .person-form {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>
