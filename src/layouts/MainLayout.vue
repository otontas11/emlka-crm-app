<template>
  <div class="d-flex">
    <aside
      class="bg-dark text-white p-3"
      style="width: 260px; min-height: 100vh"
    >
      <h4 class="mb-4">Emlak CRM</h4>

      <ul class="nav flex-column gap-2">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link text-white">
            <i class="bi bi-speedometer2 me-2"></i> Dashboard
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/contacts" class="nav-link text-white">
            <i class="bi bi-people me-2"></i> Müşteriler
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/properties" class="nav-link text-white">
            <i class="bi bi-house-door me-2"></i> Portföyler
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/tasks" class="nav-link text-white">
            <i class="bi bi-check2-square me-2"></i> Görevler
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/finance" class="nav-link text-white">
            <i class="bi bi-cash-stack me-2"></i> Finans
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/profile-site" class="nav-link text-white">
            <i class="bi bi-person-badge me-2"></i> Profil Sayfam
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/office" class="nav-link text-white">
            <i class="bi bi-building me-2"></i> Ofis Paneli
          </RouterLink>
        </li>
      </ul>
    </aside>

    <div class="flex-grow-1">
      <header class="border-bottom bg-white p-3">
        <h5 class="mb-0">Gayrimenkul CRM Yönetim Paneli</h5>
      </header>

      <main class="p-4 bg-light" style="min-height: calc(100vh - 70px)">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
}
</style>


