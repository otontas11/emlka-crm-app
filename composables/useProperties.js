/**
 * Portföy deposu — TEK kaynak.
 *
 * Önceden portföy verisi iki ayrı store'da tutuluyordu: `properties` ve
 * `office-authorized-listings`. Aynı taşınmazı temsil ettikleri için
 * useRequests.getPropertyPool() beş farklı localStorage anahtarını okuyup
 * `title-city-district-price` anahtarıyla dedupe etmek zorunda kalıyordu.
 *
 * Artık yetki bilgisi portföyün kendi alanlarında (authorityType,
 * writtenAuthorityStart/End, eids*) durur; useOfficeAuthorizedListings bu
 * store'un türetilmiş bir görünümüdür.
 */
const STORAGE_KEY = 'properties'

const emptyProperty = {
  id: '',
  portfolioNo: '',
  title: '',
  description: '',

  category: 'Commercial',
  listingType: 'Sale',
  propertyType: 'Shop',
  status: 'Active',

  price: 0,
  currency: 'TRY',
  grossArea: '',
  netArea: '',
  roomCount: '',
  buildingAge: '',
  floor: '',
  heating: '',
  furnished: '',
  deedStatus: '',
  usageStatus: '',
  inSite: '',
  swapEligible: '',

  city: '',
  district: '',
  neighborhood: '',
  address: '',
  mapLocation: '',

  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',

  // sahiplik / görünürlük (plan §11.3)
  ownershipType: 'Office',
  visibility: 'Office',
  consultantId: '',

  // ofis pazarlama takibi (eski authorized-listings alanları)
  listingStage: 'PortfolioAcquired',
  source: 'OfficeRecord',
  brokerNote: '',

  // malik raporu periyodu
  reportFrequency: '',
  lastReportDate: '',
  nextReportDate: '',

  // yazılı yetki + EİDS
  authorityType: 'Exclusive',
  writtenAuthorityStart: '',
  writtenAuthorityEnd: '',
  eidsStart: '',
  eidsEnd: '',

  // kira
  rentStartDate: '',
  currentRent: '',
  rentIncreaseDate: '',
  rentIncreaseType: 'Tufe',
  contractDuration: '',
  deposit: '',
  evacuationDate: '',

  // pazarlama sayaçları
  marketingPhoneCalls: 0,
  marketingWhatsapp: 0,
  marketingShowings: 0,
  marketingOffers: 0,

  photos: [],
  documents: [],
  videoUrl: '',

  notes: '',
  createdAt: '',
}

/** Türkçe etiketten enum değerine (eski kayıtlar için). */
const fromLabel = (map, value, fallback) => {
  if (!value) return fallback
  if (map[value]) return value
  const hit = Object.entries(map).find(([, label]) => label === value)
  return hit ? hit[0] : fallback
}

const newId = () =>
  import.meta.client && crypto?.randomUUID ? crypto.randomUUID() : `tmp-${Date.now()}`

export const normalizeProperty = (raw = {}) => {
  const normalized = {}
  for (const key of Object.keys(emptyProperty)) {
    normalized[key] = raw[key] !== undefined ? raw[key] : emptyProperty[key]
  }

  normalized.id = raw.id || newId()
  normalized.title = raw.title || raw.name || raw.propertyTitle || raw.listingTitle || ''

  normalized.category = fromLabel(PropertyCategory, raw.category, 'Commercial')
  normalized.listingType = fromLabel(ListingType, raw.listingType || raw.transactionType || raw.saleType, 'Sale')
  normalized.propertyType = fromLabel(PropertyType, raw.propertyType, 'Shop')
  normalized.status = fromLabel(PropertyStatus, raw.status, 'Active')
  normalized.authorityType = fromLabel(AuthorityType, raw.authorityType || raw.authorizationType, 'Exclusive')
  normalized.listingStage = fromLabel(ListingStage, raw.listingStage || raw.stage, 'PortfolioAcquired')
  normalized.source = fromLabel(DealSource, raw.source, 'OfficeRecord')
  normalized.ownershipType = fromLabel(OwnershipType, raw.ownershipType, 'Office')
  normalized.rentIncreaseType = fromLabel(RentIncreaseType, raw.rentIncreaseType, 'Tufe')

  // eski authorized-listing kayıtlarında yetki tarihleri startDate/endDate adındaydı
  normalized.writtenAuthorityStart = raw.writtenAuthorityStart || raw.startDate || ''
  normalized.writtenAuthorityEnd = raw.writtenAuthorityEnd || raw.endDate || ''

  normalized.price = Number(raw.price || raw.amount || 0)
  normalized.photos = Array.isArray(raw.photos) ? raw.photos : []
  normalized.documents = Array.isArray(raw.documents) ? raw.documents : []
  normalized.createdAt = raw.createdAt || new Date().toISOString()

  // "İzmir / Konak / Yenişehir" biçimindeki tek parça konumu böl
  if (!normalized.city && typeof raw.location === 'string' && raw.location.includes('/')) {
    const [city = '', district = '', neighborhood = ''] = raw.location.split('/').map(p => p.trim())
    normalized.city = city
    normalized.district = district
    normalized.neighborhood = neighborhood
  }

  return normalized
}

/** Ekranlarda tek satır konum göstermek için. */
export const propertyLocation = (property = {}) =>
  [property.city, property.district, property.neighborhood].filter(Boolean).join(' / ')

let watchStarted = false

const syncToStorage = (list) => {
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }
}

export const useProperties = () => {
  const properties = useState('properties', () => [])

  if (import.meta.client) {
    if (!properties.value.length) {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        properties.value = Array.isArray(saved) ? saved.map(normalizeProperty) : []
      } catch {
        properties.value = []
      }
    }

    if (!watchStarted) {
      watch(properties, value => syncToStorage(value), { deep: true })
      watchStarted = true
    }
  }

  return properties
}

export const createProperty = (payload) => {
  const properties = useProperties()
  const property = normalizeProperty({ ...payload, id: payload?.id || newId() })

  properties.value.unshift(property)
  syncToStorage(properties.value)
  return property
}

export const getPropertyById = (id) => {
  const properties = useProperties()
  return properties.value.find(item => String(item.id) === String(id)) || null
}

export const updateProperty = (id, updatedData) => {
  const properties = useProperties()
  const index = properties.value.findIndex(item => String(item.id) === String(id))
  if (index === -1) return null

  const current = properties.value[index]
  properties.value[index] = normalizeProperty({
    ...current,
    ...updatedData,
    id: current.id,
    createdAt: current.createdAt,
  })

  syncToStorage(properties.value)
  return properties.value[index]
}

/** Tek alan güncelleme (yetkili portföy ekranı bu şekilde çalışıyor). */
export const updatePropertyField = (id, field, value) =>
  updateProperty(id, { [field]: value })

export const deleteProperty = (id) => {
  const properties = useProperties()
  properties.value = properties.value.filter(item => String(item.id) !== String(id))
  syncToStorage(properties.value)
}

export { emptyProperty }
