<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <span class="text-xl font-display font-bold text-dark-900">Emlak CRM</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <NuxtLink to="/" class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-all duration-200 font-medium" active-class="bg-primary-100 text-primary-700">
              Ana Sayfa
            </NuxtLink>
            <NuxtLink to="/app/properties" class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-all duration-200 font-medium" active-class="bg-primary-100 text-primary-700">
              Gayrimenkuller
            </NuxtLink>
            <NuxtLink to="/hakkimizda" class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-all duration-200 font-medium" active-class="bg-primary-100 text-primary-700">
              Hakkımızda
            </NuxtLink>
            <NuxtLink to="/iletisim" class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-all duration-200 font-medium" active-class="bg-primary-100 text-primary-700">
              İletişim
            </NuxtLink>
          </nav>

          <!-- CTA -->
          <div class="flex items-center gap-3">
            <NuxtLink to="/danisman" class="btn btn-outline btn-sm">
              Danışman Girişi
            </NuxtLink>
            <NuxtLink to="/admin" class="btn btn-primary btn-sm">
              Broker Girişi
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-dark-900 text-white mt-auto">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                E
              </div>
              <span class="text-xl font-display font-bold">Emlak CRM</span>
            </div>
            <p class="text-gray-400 text-sm">
              Gayrimenkul sektöründe çalışan danışmanlar ve ofisler için profesyonel CRM sistemi.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-bold text-lg mb-4">Hızlı Linkler</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/" class="text-gray-400 hover:text-primary-400 transition-colors duration-200">Ana Sayfa</NuxtLink></li>
              <li><NuxtLink to="/app/properties" class="text-gray-400 hover:text-primary-400 transition-colors duration-200">Gayrimenkuller</NuxtLink></li>
              <li><NuxtLink to="/hakkimizda" class="text-gray-400 hover:text-primary-400 transition-colors duration-200">Hakkımızda</NuxtLink></li>
              <li><NuxtLink to="/iletisim" class="text-gray-400 hover:text-primary-400 transition-colors duration-200">İletişim</NuxtLink></li>
            </ul>
          </div>

          <!-- Services -->
          <div>
            <h3 class="font-bold text-lg mb-4">Hizmetler</h3>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>Müşteri Yönetimi</li>
              <li>Portföy Takibi</li>
              <li>Hatırlatma Sistemi</li>
              <li>Ofis Yönetimi</li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="font-bold text-lg mb-4">İletişim</h3>
            <ul class="space-y-3 text-gray-400 text-sm">
              <li class="flex items-center gap-2">
                <span>📧</span>
                <span>info@emlakcrm.com</span>
              </li>
              <li class="flex items-center gap-2">
                <span>📱</span>
                <span>+90 (212) 123 45 67</span>
              </li>
              <li class="flex items-center gap-2">
                <span>📍</span>
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom -->
        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-gray-400 text-sm">
            &copy; 2025 Emlak CRM. Tüm hakları saklıdır.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors duration-200">
              <span class="text-xl">📘</span>
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors duration-200">
              <span class="text-xl">📷</span>
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors duration-200">
              <span class="text-xl">💼</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
