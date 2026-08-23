/**
 * Ofis pipeline görünümü — kendi store'u YOK, useDeals üzerinden çalışır.
 * Public API eskisiyle aynı bırakıldı ki ofis-pipeline ekranı değişmeden çalışsın.
 */
export const useOfficePipeline = () => {
  const { deals, createDeal, updateDeal, deleteDeal, dealStats, formatPrice } = useDeals()

  const processes = computed(() => deals.value)

  /** Geriye dönük uyumluluk: hydrate/persist artık useDeals'in işi. */
  const hydrateProcesses = () => {}
  const persistProcesses = () => {}

  const createProcess = (payload = {}) => createDeal({
    ...payload,
    ownerConsultantId: payload.consultantId || payload.ownerConsultantId,
    grossCommission: payload.commissionPotential ?? payload.grossCommission,
    participants: payload.consultantId
      ? [{ consultantId: payload.consultantId, role: 'Closer', sharePercent: 100 }]
      : [],
  })

  const updateProcess = (id, field, value) => {
    const NUMERIC = ['budget', 'offerAmount', 'probability', 'commissionPotential', 'grossCommission']
    const key = field === 'commissionPotential' ? 'grossCommission' : field
    return updateDeal(id, key, NUMERIC.includes(field) ? Number(value || 0) : value)
  }

  const deleteProcess = id => deleteDeal(id)

  const pipelineStats = dealStats

  return {
    processes,
    hydrateProcesses,
    persistProcesses,
    createProcess,
    updateProcess,
    deleteProcess,
    pipelineStats,
    formatPrice,
  }
}
