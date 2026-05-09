<template>
  <div class="user-layout">
    <header class="user-header">
      <div class="header-content">
        <div class="logo">
          <h1>Emlak CRM</h1>
        </div>
        <nav class="user-nav">
          <NuxtLink to="/">Ana Sayfa</NuxtLink>
          <NuxtLink to="/app/properties">Gayrimenkuller</NuxtLink>
          <NuxtLink to="/app/favorites">Favorilerim</NuxtLink>
          <NuxtLink to="/app/profile">Profilim</NuxtLink>
          <NuxtLink to="/admin" class="admin-link">Admin Panel</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="user-main">
      <slot />
    </main>

    <footer class="user-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Hakkımızda</h3>
          <p>Emlak CRM ile gayrimenkul yönetimini kolaylaştırın.</p>
        </div>
        <div class="footer-section">
          <h3>İletişim</h3>
          <p>Email: info@emlakcrm.com</p>
          <p>Tel: +90 (212) 123 45 67</p>
        </div>
        <div class="footer-section">
          <h3>Hızlı Linkler</h3>
          <ul>
            <li><NuxtLink to="/">Ana Sayfa</NuxtLink></li>
            <li><NuxtLink to="/app/properties">Gayrimenkuller</NuxtLink></li>
            <li><NuxtLink to="/app/contact">İletişim</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 Emlak CRM. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.user-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.user-nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.user-nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-nav a:hover,
.user-nav a.router-link-active {
  background: rgba(255,255,255,0.2);
}

.user-nav .admin-link {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
}

.user-nav .admin-link:hover {
  background: rgba(255,255,255,0.25);
}

.user-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.user-footer {
  background: #2c3e50;
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  margin: 0 0 1rem 0;
  color: #3498db;
}

.footer-section p {
  margin: 0.5rem 0;
  color: #ecf0f1;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin: 0.5rem 0;
}

.footer-section a {
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #3498db;
}

.footer-bottom {
  background: #1a252f;
  text-align: center;
  padding: 1rem;
}

.footer-bottom p {
  margin: 0;
  color: #95a5a6;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .user-nav {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
