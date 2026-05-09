<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-content">
        <h1>Admin Panel</h1>
        <nav class="admin-nav">
          <NuxtLink to="/admin">Dashboard</NuxtLink>
          <NuxtLink to="/admin/properties">Gayrimenkuller</NuxtLink>
          <NuxtLink to="/admin/users">Kullanıcılar</NuxtLink>
          <NuxtLink to="/admin/settings">Ayarlar</NuxtLink>
          <NuxtLink to="/" class="exit-admin">Kullanıcı Paneline Dön</NuxtLink>
        </nav>
      </div>
    </header>

    <div class="admin-container">
      <aside class="admin-sidebar">
        <div class="sidebar-content">
          <h3>Menü</h3>
          <ul>
            <li><NuxtLink to="/admin">📊 Dashboard</NuxtLink></li>
            <li><NuxtLink to="/admin/properties">🏢 Gayrimenkuller</NuxtLink></li>
            <li><NuxtLink to="/admin/customers">👥 Müşteriler</NuxtLink></li>
            <li><NuxtLink to="/admin/leads">📋 Potansiyel Müşteriler</NuxtLink></li>
            <li><NuxtLink to="/admin/users">👤 Kullanıcılar</NuxtLink></li>
            <li><NuxtLink to="/admin/reports">📈 Raporlar</NuxtLink></li>
            <li><NuxtLink to="/admin/settings">⚙️ Ayarlar</NuxtLink></li>
          </ul>
        </div>
      </aside>

      <main class="admin-main">
        <slot />
      </main>
    </div>

    <footer class="admin-footer">
      <p>&copy; 2025 Emlak CRM - Admin Panel</p>
    </footer>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.admin-header {
  background: #1a1a2e;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content h1 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.admin-nav {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.admin-nav a {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.admin-nav a:hover,
.admin-nav a.router-link-active {
  background: rgba(255,255,255,0.1);
}

.admin-nav .exit-admin {
  margin-left: auto;
  background: #e74c3c;
}

.admin-nav .exit-admin:hover {
  background: #c0392b;
}

.admin-container {
  display: flex;
  flex: 1;
  gap: 1.5rem;
  padding: 1.5rem;
}

.admin-sidebar {
  width: 250px;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: fit-content;
}

.sidebar-content h3 {
  margin: 0 0 1rem 0;
  color: #1a1a2e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.sidebar-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-content li {
  margin: 0.5rem 0;
}

.sidebar-content a {
  display: block;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
}

.sidebar-content a:hover,
.sidebar-content a.router-link-active {
  background: #3498db;
  color: white;
}

.admin-main {
  flex: 1;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.admin-footer {
  background: #1a1a2e;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

.admin-footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
  }

  .admin-nav {
    flex-direction: column;
  }
}
</style>
