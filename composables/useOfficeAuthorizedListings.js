/**
 * Yetkili portföyler — artık kendi store'u YOK.
 *
 * useProperties tek kaynaktır; bu composable onun üzerinde "yazılı yetkisi olan
 * portföyler" görünümünü sunar. Public API bilinçli olarak eskisiyle aynı bırakıldı,
 * böylece pages/office/modules/yetkili-portfoyler.vue değişmeden çalışır.
 */
export const useOfficeAuthorizedListings = () => {
  const properties = useProperties()
  const { consultants } = useOffice()

  const consultantNameOf = (consultantId) =>
    consultants.value.find(item => String(item.id) === String(consultantId))?.fullName || ''

  /** Portföyü, ekranın beklediği "listing" şekline yansıtır. */
  const toListing = (property) => ({
    id: property.id,
    consultantId: property.consultantId,
    consultantName: consultantNameOf(property.consultantId),
    title: property.title,
    propertyType: property.propertyType,
    location: propertyLocation(property),
    ownerName: property.ownerName,
    ownerPhone: property.ownerPhone,
    authorizationType: property.authorityType,
    startDate: property.writtenAuthorityStart,
    endDate: property.writtenAuthorityEnd,
    eidsStart: property.eidsStart,
    eidsEnd: property.eidsEnd,
    price: property.price,
    status: property.status,
    stage: property.listingStage,
    source: property.source,
    brokerNote: property.brokerNote,
    createdAt: property.createdAt,
  })

  /** Yazılı yetkisi tanımlı portföyler. */
  const listings = computed(() =>
    properties.value
      .filter(item => item.writtenAuthorityEnd || item.authorityType)
      .map(toListing)
  )

  /** Geriye dönük uyumluluk: veri artık useProperties tarafından hydrate ediliyor. */
  const hydrateListings = () => {}
  const persistListings = () => {}

  const createAuthorizedListing = (payload = {}) => {
    const property = createProperty({
      title: payload.title,
      propertyType: payload.propertyType,
      ownerName: payload.ownerName,
      ownerPhone: payload.ownerPhone,
      price: payload.price,
      consultantId: payload.consultantId,
      authorityType: payload.authorizationType,
      writtenAuthorityStart: payload.startDate,
      writtenAuthorityEnd: payload.endDate,
      status: payload.status,
      listingStage: payload.stage,
      source: payload.source,
      brokerNote: payload.brokerNote,
      location: payload.location,
      ownershipType: 'Office',
      visibility: 'Office',
    })

    return toListing(property)
  }

  /** Listing alan adını portföy alan adına çevirir. */
  const FIELD_MAP = {
    authorizationType: 'authorityType',
    startDate: 'writtenAuthorityStart',
    endDate: 'writtenAuthorityEnd',
    stage: 'listingStage',
  }

  const updateAuthorizedListing = (id, field, value) => {
    updatePropertyField(id, FIELD_MAP[field] || field, field === 'price' ? Number(value || 0) : value)
  }

  const deleteAuthorizedListing = (id) => deleteProperty(id)

  const today = () => new Date().toISOString().slice(0, 10)

  const daysUntilEnd = (endDate) => {
    if (!endDate) return null
    return Math.ceil((new Date(endDate) - new Date(today())) / (1000 * 60 * 60 * 24))
  }

  const listingStats = computed(() => ({
    total: listings.value.length,
    active: listings.value.filter(item => item.status === 'Active').length,
    inProcess: listings.value.filter(item =>
      item.status === 'OfferStage' || item.stage === 'RequestMatched').length,
    singleAuthority: listings.value.filter(item => item.authorizationType === 'Exclusive').length,
    expiringSoon: listings.value.filter(item => {
      const days = daysUntilEnd(item.endDate)
      return days !== null && days <= 15 && days >= 0
    }).length,
  }))

  const formatPrice = value =>
    `${new Intl.NumberFormat('tr-TR').format(Number(value || 0))} ₺`

  return {
    listings,
    hydrateListings,
    persistListings,
    createAuthorizedListing,
    updateAuthorizedListing,
    deleteAuthorizedListing,
    daysUntilEnd,
    listingStats,
    formatPrice,
  }
}
