import { useProfile } from '~/composables/useProfile'

const slugify = (text) => {
  return String(text || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const usePublicProfile = () => {
  const profile = useProfile()

  const publicSlug = computed(() => {
    return slugify(profile.value.fullName || 'profil')
  })

  const publicProfileUrl = computed(() => {
    return '/u/' + publicSlug.value
  })

  return {
    publicSlug,
    publicProfileUrl,
  }
}


