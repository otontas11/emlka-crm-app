<script setup>
definePageMeta({
  layout: false,
  middleware: 'guest'
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const users = {
  'admin@emlakcrm.com': { password: 'admin123', role: 'admin', name: 'Ahmet Yılmaz' },
  'danisman@emlakcrm.com': { password: 'danisman123', role: 'danisman', name: 'Mehmet Demir' }
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    if (!email.value || !password.value) {
      error.value = 'Email ve şifre gerekli'
      loading.value = false
      return
    }

    const user = users[email.value.toLowerCase()]
    if (!user || user.password !== password.value) {
      error.value = 'Hatalı email veya şifre'
      loading.value = false
      return
    }

    localStorage.setItem('auth', JSON.stringify({ email: email.value, name: user.name, role: user.role }))

    // Rolüne göre yönlendir
    if (user.role === 'admin') {
      await navigateTo('/admin')
    } else {
      await navigateTo('/danisman')
    }
  } catch (err) {
    error.value = 'Bir hata oluştu'
    loading.value = false
  }
}

const showDemo = ref(false)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-secondary-600 to-purple-700 p-6">
    <div class="absolute inset-0 bg-pattern opacity-10"></div>
    <div class="relative w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-hard mb-4">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">E</div>
        </div>
        <h1 class="text-4xl font-display font-bold text-white mb-2">Emlak CRM</h1>
        <p class="text-lg text-primary-100">Gayrimenkul Yönetim Sistemi</p>
      </div>

      <div class="card bg-white shadow-hard">
        <h2 class="text-2xl font-bold text-dark-900 mb-6 text-center">Giriş Yapın</h2>

        <div v-if="error" class="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p class="text-sm text-danger-700 flex items-center gap-2">
            <span>⚠️</span><span>{{ error }}</span>
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Adresi</label>
            <input v-model="email" type="email" placeholder="ornek@emlakcrm.com" class="input" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
            <input v-model="password" type="password" placeholder="••••••••" class="input" required />
          </div>

          <button type="submit" :disabled="loading" class="btn btn-primary w-full btn-lg">
            <span v-if="!loading">🚀</span><span v-else>⏳</span>
            <span>{{ loading ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}</span>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <button @click="showDemo = !showDemo" class="btn btn-ghost btn-sm w-full">
            <span>ℹ️</span>
            <span>{{ showDemo ? 'Demo Bilgilerini Gizle' : 'Demo Bilgilerini Göster' }}</span>
          </button>

          <div v-if="showDemo" class="mt-4 space-y-3">
            <div class="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xl">👨‍💼</span>
                <h4 class="font-semibold text-dark-900">Admin & Danışman</h4>
              </div>
              <div class="text-sm space-y-1 text-gray-700">
                <p><strong>Email:</strong> admin@emlakcrm.com</p>
                <p><strong>Şifre:</strong> admin123</p>
                <p class="text-xs text-gray-600 mt-2">✅ Hem danışman hem admin sayfalarına erişebilir</p>
              </div>
            </div>

            <div class="p-4 bg-gradient-to-br from-success-50 to-teal-50 rounded-lg border border-success-200">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xl">👤</span>
                <h4 class="font-semibold text-dark-900">Sadece Danışman</h4>
              </div>
              <div class="text-sm space-y-1 text-gray-700">
                <p><strong>Email:</strong> danisman@emlakcrm.com</p>
                <p><strong>Şifre:</strong> danisman123</p>
                <p class="text-xs text-gray-600 mt-2">✅ Sadece danışman sayfalarına erişebilir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
