const defaultProperties = [
  {
    id: 1,
    title: 'İzmir Bornova Satılık Dükkan',
    portfolioNo: 'PRT-1001',
    category: 'Ticari',
    listingType: 'Satılık',
    propertyType: 'Dükkan',
    status: 'Aktif',
    price: 12500000,
    currency: 'TL',
    grossArea: 220,
    netArea: 185,
    roomCount: '1+1',
    buildingAge: '10',
    floor: 'Zemin',
    heating: 'Klima',
    furnished: 'Hayır',
    deedStatus: 'Kat Mülkiyeti',
    usageStatus: 'Boş',
    inSite: 'Hayır',
    swapEligible: 'Hayır',

    city: 'İzmir',
    district: 'Bornova',
    neighborhood: 'Kazımdirik',
    address: 'Bornova / İzmir',
    mapLocation: '',

    ownerName: 'Mehmet Demir',
    ownerPhone: '0532 000 00 00',
    ownerEmail: 'mehmet@example.com',

    description: 'Cadde üstü, yüksek yaya trafiğine sahip ticari portföy.',
    notes: 'Malik fiyat konusunda sınırlı pazarlığa açık.',

    reportFrequency: '20',
    lastReportDate: '',
    nextReportDate: '',

    writtenAuthorityStart: '',
    writtenAuthorityEnd: '',
    authorityType: 'Tek Yetkili',
    eidsStart: '',
    eidsEnd: '',

    rentStartDate: '',
    currentRent: '',
    rentIncreaseDate: '',
    rentIncreaseType: 'TÜFE',
    contractDuration: '',
    deposit: '',
    evacuationDate: '',

    marketingPhoneCalls: 0,
    marketingWhatsapp: 0,
    marketingShowings: 0,
    marketingOffers: 0,

    photos: [],
    documents: [],
    videoUrl: '',

    createdAt: new Date().toISOString(),
  },
]

let watchStarted = false

const syncPropertiesToStorage = (list) => {
  if (import.meta.client) {
    localStorage.setItem('properties', JSON.stringify(list))
  }
}

export const useProperties = () => {
  const properties = useState('properties', () => [...defaultProperties])

  if (import.meta.client) {
    const saved = localStorage.getItem('properties')

    if (saved) {
      try {
        properties.value = JSON.parse(saved)
      } catch (error) {
        properties.value = [...defaultProperties]
        syncPropertiesToStorage(properties.value)
      }
    } else {
      syncPropertiesToStorage(properties.value)
    }

    if (!watchStarted) {
      watch(
        properties,
        (newValue) => {
          syncPropertiesToStorage(newValue)
        },
        { deep: true }
      )
      watchStarted = true
    }
  }

  return properties
}

export const createProperty = (propertyData) => {
  const properties = useProperties()

  const newProperty = {
    id: Date.now(),
    ...propertyData,
    photos: Array.isArray(propertyData.photos) ? propertyData.photos : [],
    documents: Array.isArray(propertyData.documents) ? propertyData.documents : [],
    createdAt: new Date().toISOString(),
  }

  properties.value.unshift(newProperty)
  syncPropertiesToStorage(properties.value)

  return newProperty
}

export const getPropertyById = (id) => {
  const properties = useProperties()
  return properties.value.find((item) => String(item.id) === String(id))
}

export const updateProperty = (id, updatedData) => {
  const properties = useProperties()
  const index = properties.value.findIndex((item) => String(item.id) === String(id))

  if (index === -1) return null

  const currentProperty = properties.value[index]

  properties.value[index] = {
    ...currentProperty,
    ...updatedData,
    id: currentProperty.id,
    createdAt: currentProperty.createdAt,
    photos: Array.isArray(updatedData.photos) ? updatedData.photos : currentProperty.photos || [],
    documents: Array.isArray(updatedData.documents) ? updatedData.documents : currentProperty.documents || [],
  }

  syncPropertiesToStorage(properties.value)

  return properties.value[index]
}

export const deleteProperty = (id) => {
  const properties = useProperties()
  properties.value = properties.value.filter((item) => String(item.id) !== String(id))
  syncPropertiesToStorage(properties.value)
}


