const defaultProfile = {
  fullName: 'Sinan Tontaş',
  title: 'Ticari Gayrimenkul Danışmanı',
  slogan: 'Emlak’ta Sinan, Çözüme İnan!',
  shortBio:
    'İzmir ağırlıklı ticari ve sanayi gayrimenkul alanında çalışan, portföy yönetimi, yatırım analizi ve satış-kiralama süreçlerinde danışmanlık veren profesyonel gayrimenkul danışmanı.',
  expertiseAreas: [
    'Ticari Gayrimenkul',
    'Sanayi Gayrimenkulü',
    'Satılık Portföy Yönetimi',
    'Kiralık Portföy Yönetimi',
    'Yatırım Danışmanlığı',
  ],
  expertiseRegions: [
    'İzmir Gıda Çarşısı',
    'Yenişehir',
    'Bornova',
    'Bayraklı',
    'Alsancak',
    'Konak',
    'Kemalpaşa',
  ],
  phone: '0545 441 41 18',
  whatsapp: '0545 441 41 18',
  email: 'sinan.tontas@hotmail.com',
  website: 'www.sinantontas.com',
  officeAddress: 'İzmir',
  instagram: 'https://instagram.com/sinan_tontas',
  facebook: '',
  linkedin: '',
  youtube: '',
  profilePhoto: '',
  galleryPhotos: [],
  introVideo: '',
  activeListingIds: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

let watchStarted = false

const syncProfileToStorage = (profile) => {
  if (import.meta.client) {
    localStorage.setItem('profileData', JSON.stringify(profile))
  }
}

export const useProfile = () => {
  const profile = useState('profileData', () => ({ ...defaultProfile }))

  if (import.meta.client) {
    const saved = localStorage.getItem('profileData')

    if (saved) {
      try {
        profile.value = JSON.parse(saved)
      } catch (error) {
        profile.value = { ...defaultProfile }
        syncProfileToStorage(profile.value)
      }
    } else {
      syncProfileToStorage(profile.value)
    }

    if (!watchStarted) {
      watch(
        profile,
        (newValue) => {
          syncProfileToStorage(newValue)
        },
        { deep: true }
      )
      watchStarted = true
    }
  }

  return profile
}

export const updateProfile = (updatedData) => {
  const profile = useProfile()

  profile.value = {
    ...profile.value,
    ...updatedData,
    updatedAt: new Date().toISOString(),
  }

  syncProfileToStorage(profile.value)
  return profile.value
}

export const resetProfile = () => {
  const profile = useProfile()
  profile.value = {
    ...defaultProfile,
    updatedAt: new Date().toISOString(),
  }
  syncProfileToStorage(profile.value)
  return profile.value
}


