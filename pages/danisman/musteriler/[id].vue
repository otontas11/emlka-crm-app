<script setup>
definePageMeta({
  layout: 'danisman',
  middleware: 'auth'
})

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const musteriId = route.params.id

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

onMounted(() => {
  // Simüle edilmiş veri çekme - gerçek uygulamada API'den gelecek
  formData.value = {
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    tcKimlikNo: '12345678901',
    birthDate: '1985-05-15',
    gender: 'male',
    email: 'ahmet.yilmaz@email.com',
    phone: '0532 123 4567',
    address: 'Kadıköy, İstanbul',
    memleket: 'Ankara',
    mainProfession: 'Mühendis',
    secondaryProfessions: ['Danışman'],
    previousProfessions: [],
    companies: ['ABC Şirketi'],
    facebook: 'ahmetyilmaz',
    instagram: '@ahmetyilmaz',
    linkedin: 'ahmet-yilmaz',
    youtube: '',
    twitter: '@ahmetyilmaz',
    spouseName: 'Ayşe Yılmaz',
    childrenNames: 'Ali, Elif',
    motherName: 'Fatma',
    fatherName: 'Mehmet',
    marriageDate: '2010-06-20',
    propertyType: 'ev',
    propertyOwnership: 'owner',
    rentalStatus: 'none',
    propertyAddress: 'Kadıköy, İstanbul',
    hobbies: ['Futbol', 'Kitap Okuma'],
    favoriteTeam: 'Beşiktaş',
    fanaticismLevel: 'high',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Corolla',
    vehicleYear: '2020',
    vehicleFanaticism: 'medium',
    boatBrand: '',
    boatModel: '',
    boatYear: '',
    pets: [
      { type: 'dog', name: 'Karabaş', age: '5', notes: 'Çok sevimli' }
    ],
    notes: 'Kadıköy bölgesinde 3+1 daire arıyor. Bütçesi 2.5M - 3.5M TL arası.'
  }
})

const handleSubmit = async () => {
  isLoading.value = true

  // Simüle edilmiş güncelleme işlemi
  setTimeout(() => {
    isLoading.value = false
    // Başarılı güncelleme sonrası müşteri listesine dön
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
    <div class="page-header-edit">
      <NuxtLink to="/danisman/musteriler" class="back-btn-new">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Geri</span>
      </NuxtLink>
      <div>
        <h1>Müşteri Düzenle</h1>
        <p>Müşteri bilgilerini güncelleyin</p>
      </div>
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
            <div class="form-field">
              <label>Ad <span class="required">*</span></label>
              <input type="text" v-model="formData.firstName" required placeholder="Ad" />
            </div>
            <div class="form-field">
              <label>Soyad <span class="required">*</span></label>
              <input type="text" v-model="formData.lastName" required placeholder="Soyad" />
            </div>
            <div class="form-field">
              <label>T.C. Kimlik No</label>
              <input type="text" v-model="formData.tcKimlikNo" maxlength="11" placeholder="11 haneli T.C. Kimlik No" />
            </div>
            <div class="form-field">
              <label>Doğum Tarihi</label>
              <input type="date" v-model="formData.birthDate" />
            </div>
            <div class="form-field">
              <label>Cinsiyet</label>
              <select v-model="formData.gender">
                <option value="">Seçiniz</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
                <option value="other">Diğer</option>
              </select>
            </div>
            <div class="form-field">
              <label>E-posta</label>
              <input type="email" v-model="formData.email" placeholder="ornek@email.com" />
            </div>
            <div class="form-field">
              <label>Telefon <span class="required">*</span></label>
              <input type="tel" v-model="formData.phone" required placeholder="+90 5XX XXX XX XX" />
            </div>
            <div class="form-field">
              <label>Memleket</label>
              <input type="text" v-model="formData.memleket" placeholder="Memleket" />
            </div>
            <div class="form-field full-width">
              <label>Adres</label>
              <textarea v-model="formData.address" rows="3" placeholder="Tam adres bilgisi"></textarea>
            </div>
          </div>
        </div>

        <!-- Meslek Bilgileri -->
        <div v-show="activeTab === 'profession'" class="form-section">
          <h2 class="section-title">Meslek Bilgileri</h2>
          <div class="form-grid">
            <div class="form-field">
              <label>Ana Meslek</label>
              <input type="text" v-model="formData.mainProfession" placeholder="Ana meslek" />
            </div>
            <div class="form-field full-width">
              <label>Yan Meslekler</label>
              <input type="text" v-model="formData.secondaryProfessions" placeholder="Yan meslekler (virgülle ayırın)" />
            </div>
            <div class="form-field full-width">
              <label>Eski Meslekler</label>
              <input type="text" v-model="formData.previousProfessions" placeholder="Eski meslekler (virgülle ayırın)" />
            </div>
            <div class="form-field full-width">
              <label>Kurumlar</label>
              <input type="text" v-model="formData.companies" placeholder="Çalışılan kurumlar (virgülle ayırın)" />
            </div>
          </div>
        </div>

        <!-- Sosyal Medya -->
        <div v-show="activeTab === 'social'" class="form-section">
          <h2 class="section-title">Sosyal Medya Hesapları</h2>
          <div class="form-grid">
            <div class="form-field">
              <label>Facebook</label>
              <input type="text" v-model="formData.facebook" placeholder="Facebook kullanıcı adı veya URL" />
            </div>
            <div class="form-field">
              <label>Instagram</label>
              <input type="text" v-model="formData.instagram" placeholder="Instagram kullanıcı adı" />
            </div>
            <div class="form-field">
              <label>LinkedIn</label>
              <input type="text" v-model="formData.linkedin" placeholder="LinkedIn profil URL" />
            </div>
            <div class="form-field">
              <label>YouTube</label>
              <input type="text" v-model="formData.youtube" placeholder="YouTube kanal adı veya URL" />
            </div>
            <div class="form-field">
              <label>Twitter</label>
              <input type="text" v-model="formData.twitter" placeholder="Twitter kullanıcı adı" />
            </div>
          </div>
        </div>

        <!-- Aile Bilgileri -->
        <div v-show="activeTab === 'family'" class="form-section">
          <h2 class="section-title">Aile Bilgileri</h2>
          <div class="form-grid">
            <div class="form-field">
              <label>Eş Adı</label>
              <input type="text" v-model="formData.spouseName" placeholder="Eş adı" />
            </div>
            <div class="form-field">
              <label>Evlilik Tarihi</label>
              <input type="date" v-model="formData.marriageDate" />
            </div>
            <div class="form-field full-width">
              <label>Çocuk(lar) Adı</label>
              <input type="text" v-model="formData.childrenNames" placeholder="Çocuk isimleri (virgülle ayırın)" />
            </div>
            <div class="form-field">
              <label>Anne Adı</label>
              <input type="text" v-model="formData.motherName" placeholder="Anne adı" />
            </div>
            <div class="form-field">
              <label>Baba Adı</label>
              <input type="text" v-model="formData.fatherName" placeholder="Baba adı" />
            </div>
          </div>
        </div>

        <!-- Mülk Bilgileri -->
        <div v-show="activeTab === 'property'" class="form-section">
          <h2 class="section-title">Mülk Bilgileri</h2>
          <div class="form-grid">
            <div class="form-field">
              <label>Mülk Türü</label>
              <select v-model="formData.propertyType">
                <option value="">Seçiniz</option>
                <option value="ev">Ev</option>
                <option value="dukkan">Dükkan</option>
                <option value="arsa">Arsa</option>
                <option value="villa">Villa</option>
                <option value="apartman">Apartman</option>
              </select>
            </div>
            <div class="form-field">
              <label>Sahiplik Durumu</label>
              <select v-model="formData.propertyOwnership">
                <option value="">Seçiniz</option>
                <option value="owner">Sahip</option>
                <option value="tenant">Kiracı</option>
                <option value="none">Yok</option>
              </select>
            </div>
            <div class="form-field">
              <label>Kira Durumu</label>
              <select v-model="formData.rentalStatus">
                <option value="">Seçiniz</option>
                <option value="renting">Kiralıyor</option>
                <option value="rented">Kiraya Veriyor</option>
                <option value="none">Yok</option>
              </select>
            </div>
            <div class="form-field full-width">
              <label>Mülk Adresi</label>
              <textarea v-model="formData.propertyAddress" rows="3" placeholder="Mülk adresi"></textarea>
            </div>
          </div>
        </div>

        <!-- Hobiler ve Takımlar -->
        <div v-show="activeTab === 'hobbies'" class="form-section">
          <h2 class="section-title">Hobiler ve Takımlar</h2>
          <div class="form-grid">
            <div class="form-field full-width">
              <label>Hobiler</label>
              <div v-for="(hobby, index) in formData.hobbies" :key="index" class="array-item">
                <input type="text" v-model="formData.hobbies[index]" :placeholder="`Hobi ${index + 1}`" />
                <button type="button" class="remove-btn" @click="removeHobby(index)">×</button>
              </div>
              <button type="button" class="add-btn" @click="addHobby">+ Hobi Ekle</button>
            </div>
            <div class="form-field">
              <label>Tuttuğu Takım</label>
              <input type="text" v-model="formData.favoriteTeam" placeholder="Takım adı" />
            </div>
            <div class="form-field">
              <label>Fanatiklik Seviyesi</label>
              <select v-model="formData.fanaticismLevel">
                <option value="">Seçiniz</option>
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
                <option value="very-high">Çok Yüksek</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Araç ve Tekne -->
        <div v-show="activeTab === 'vehicles'" class="form-section">
          <h2 class="section-title">Araç ve Tekne Bilgileri</h2>
          <div class="form-grid">
            <h3 class="subsection-title">Araç</h3>
            <div class="form-field">
              <label>Marka</label>
              <input type="text" v-model="formData.vehicleBrand" placeholder="Araç markası" />
            </div>
            <div class="form-field">
              <label>Model</label>
              <input type="text" v-model="formData.vehicleModel" placeholder="Araç modeli" />
            </div>
            <div class="form-field">
              <label>Yıl</label>
              <input type="number" v-model="formData.vehicleYear" placeholder="Üretim yılı" min="1900" :max="new Date().getFullYear()" />
            </div>
            <div class="form-field">
              <label>Fanatiklik Seviyesi</label>
              <select v-model="formData.vehicleFanaticism">
                <option value="">Seçiniz</option>
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>
            <h3 class="subsection-title">Tekne</h3>
            <div class="form-field">
              <label>Marka</label>
              <input type="text" v-model="formData.boatBrand" placeholder="Tekne markası" />
            </div>
            <div class="form-field">
              <label>Model</label>
              <input type="text" v-model="formData.boatModel" placeholder="Tekne modeli" />
            </div>
            <div class="form-field">
              <label>Yıl</label>
              <input type="number" v-model="formData.boatYear" placeholder="Üretim yılı" min="1900" :max="new Date().getFullYear()" />
            </div>
          </div>
        </div>

        <!-- Evcil Hayvan -->
        <div v-show="activeTab === 'pets'" class="form-section">
          <h2 class="section-title">Evcil Hayvan Bilgileri</h2>
          <div class="form-grid">
            <div v-for="(pet, index) in formData.pets" :key="index" class="pet-item">
              <h3 class="pet-title">Evcil Hayvan {{ index + 1 }}</h3>
              <div class="form-grid">
                <div class="form-field">
                  <label>Tür</label>
                  <select v-model="pet.type">
                    <option value="">Seçiniz</option>
                    <option value="dog">Köpek</option>
                    <option value="cat">Kedi</option>
                    <option value="bird">Kuş</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                <div class="form-field">
                  <label>İsim</label>
                  <input type="text" v-model="pet.name" placeholder="Hayvan ismi" />
                </div>
                <div class="form-field">
                  <label>Yaş</label>
                  <input type="number" v-model="pet.age" placeholder="Yaş" min="0" />
                </div>
                <div class="form-field full-width">
                  <label>Notlar</label>
                  <textarea v-model="pet.notes" rows="2" placeholder="Evcil hayvan hakkında notlar"></textarea>
                </div>
              </div>
              <button type="button" class="remove-btn" @click="removePet(index)">Evcil Hayvanı Kaldır</button>
            </div>
            <button type="button" class="add-btn" @click="addPet">+ Evcil Hayvan Ekle</button>
          </div>
        </div>

        <!-- Notlar -->
        <div v-show="activeTab === 'notes'" class="form-section">
          <h2 class="section-title">Ek Notlar</h2>
          <div class="form-grid">
            <div class="form-field full-width">
              <label>Notlar</label>
              <textarea v-model="formData.notes" rows="8" placeholder="Müşteri hakkında ek notlar ve açıklamalar"></textarea>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="router.push('/danisman/musteriler')">
            İptal
          </button>
          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.person-add-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

@media (min-width: 640px) {
  .person-add-page {
    padding: 2rem 1.5rem;
  }
}

.page-header-edit {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .page-header-edit {
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
}

.back-btn-new {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 0.75rem;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  font-size: 0.875rem;
  min-height: 44px;
}

@media (min-width: 640px) {
  .back-btn-new {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
  }
}

.back-btn-new:hover {
  background: #e5e7eb;
}

.page-header-edit h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

@media (min-width: 640px) {
  .page-header-edit h1 {
    font-size: 2rem;
  }
}

.page-header-edit p {
  color: #6b7280;
  font-size: 0.875rem;
}

@media (min-width: 640px) {
  .page-header-edit p {
    font-size: 1rem;
  }
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
  padding: 0.75rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (min-width: 640px) {
  .tabs-nav {
    padding: 1rem;
  }
}

.tab-button {
  padding: 0.625rem 1rem;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  min-height: 40px;
}

@media (min-width: 640px) {
  .tab-button {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }
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
  padding: 1.5rem;
}

@media (min-width: 640px) {
  .person-form {
    padding: 2rem;
  }
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
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

@media (min-width: 640px) {
  .section-title {
    font-size: 1.5rem;
  }
}

.subsection-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 1.5rem 0 1rem;
  grid-column: 1 / -1;
}

@media (min-width: 640px) {
  .subsection-title {
    font-size: 1.25rem;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-field input,
.form-field select,
.form-field textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
  -webkit-appearance: none;
  min-height: 44px;
}

.form-field textarea {
  min-height: auto;
  resize: vertical;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.array-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.array-item input {
  flex: 1;
}

.remove-btn {
  padding: 0.75rem 1rem;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: 700;
  transition: background-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  min-width: 44px;
}

.remove-btn:hover {
  background: #dc2626;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  margin-top: 0.5rem;
  min-height: 44px;
}

.add-btn:hover {
  background: #059669;
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
  flex-direction: column-reverse;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

@media (min-width: 640px) {
  .form-actions {
    flex-direction: row;
    justify-content: flex-end;
    gap: 1rem;
  }
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  min-height: 48px;
  width: 100%;
}

@media (min-width: 640px) {
  .btn-primary,
  .btn-secondary {
    width: auto;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}
</style>
