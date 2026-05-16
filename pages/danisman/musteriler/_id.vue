<script setup>
definePageMeta({
  layout: 'danisman',
  middleware: 'auth'
})

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const personId = route.params.id

const isLoading = ref(false)
const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: ''
})

onMounted(() => {
  // Simüle edilmiş veri çekme
  formData.value = {
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    phone: '+90 532 123 45 67',
    email: 'ahmet@example.com'
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    // Başarılı güncelleme sonrası müşteri listesine dön
    router.push('/danisman/musteriler')
  }, 1000)
}
</script>

<template>
  <div class="person-edit-page">
    <div class="page-header">
      <button class="back-btn" @click="router.push('/danisman/musteriler')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Geri
      </button>
      <div>
        <h1>Müşteri Düzenle</h1>
        <p>Müşteri bilgilerini güncelleyin</p>
      </div>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="edit-form">
        <div class="form-section">
          <h2 class="section-title">Temel Bilgiler</h2>
          <div class="form-grid">
            <div class="form-field">
              <label>Ad <span class="required">*</span></label>
              <input type="text" v-model="formData.firstName" required />
            </div>
            <div class="form-field">
              <label>Soyad <span class="required">*</span></label>
              <input type="text" v-model="formData.lastName" required />
            </div>
            <div class="form-field">
              <label>Telefon <span class="required">*</span></label>
              <input type="tel" v-model="formData.phone" required />
            </div>
            <div class="form-field">
              <label>E-posta</label>
              <input type="email" v-model="formData.email" />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="router.push('/danisman/musteriler')">
            İptal
          </button>
          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.person-edit-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #f3f4f6;
  border: none;
  border-radius: 0.75rem;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.back-btn:hover {
  background: #e5e7eb;
}

.back-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.page-header p {
  color: #6b7280;
}

.form-container {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-field input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-height: 44px;
}

.form-field input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
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

@media (max-width: 768px) {
  .person-edit-page {
    padding: 1.5rem 1rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>

