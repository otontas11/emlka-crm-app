<script setup>
// LocalStorage'dan cookie'ye migration (tek seferlik)
if (process.client) {
  const authCookie = useCookie('auth', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  })

  const storedAuth = localStorage.getItem('auth')
  if (storedAuth && !authCookie.value) {
    try {
      authCookie.value = JSON.parse(storedAuth)
      localStorage.removeItem('auth')
    } catch (e) {
      console.error('Auth migration failed:', e)
    }
  }
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
