export const useOfficeMeetings = () => {
  const storageKey = 'emlak-crm-office-meetings'

  const defaultMeetings = [
    {
      id: 1,
      title: 'Haftalık Ofis Toplantısı',
      meetingType: 'Haftalık Toplantı',
      date: '2026-06-22',
      startTime: '10:00',
      endTime: '11:30',
      location: 'Ofis Toplantı Salonu',
      status: 'Planlandı',
      agenda: 'Haftalık hedefler, portföy çalışmaları, yetkili portföy takibi ve pipeline değerlendirmesi.',
      note: 'Tüm aktif danışmanların katılımı bekleniyor.',
      attendees: [
        { consultantId: 1, consultantName: 'Sinan Tontaş', status: 'Bekliyor', note: '' },
        { consultantId: 2, consultantName: 'Şems Bahar Çetin', status: 'Bekliyor', note: '' },
        { consultantId: 3, consultantName: 'Ali Rızahan Ülger', status: 'Bekliyor', note: '' },
      ],
      createdAt: '2026-06-20',
    },
  ]

  const meetings = useState('office-meetings', () => defaultMeetings)

  const hydrateMeetings = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        meetings.value = JSON.parse(saved)
      } catch (error) {
        meetings.value = defaultMeetings
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(meetings.value))
    }
  }

  const persistMeetings = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(meetings.value))
  }

  const createMeeting = (payload) => {
    const newMeeting = {
      id: Date.now(),
      title: payload.title,
      meetingType: payload.meetingType || 'Haftalık Toplantı',
      date: payload.date || new Date().toISOString().slice(0, 10),
      startTime: payload.startTime || '10:00',
      endTime: payload.endTime || '11:00',
      location: payload.location || 'Ofis',
      status: payload.status || 'Planlandı',
      agenda: payload.agenda || '',
      note: payload.note || '',
      attendees: payload.attendees || [],
      createdAt: new Date().toISOString().slice(0, 10),
    }

    meetings.value.unshift(newMeeting)
    persistMeetings()

    return newMeeting
  }

  const updateMeeting = (meetingId, field, value) => {
    const meeting = meetings.value.find(item => String(item.id) === String(meetingId))
    if (!meeting) return

    meeting[field] = value
    persistMeetings()
  }

  const updateAttendance = (meetingId, consultantId, field, value) => {
    const meeting = meetings.value.find(item => String(item.id) === String(meetingId))
    if (!meeting) return

    const attendee = meeting.attendees.find(item => String(item.consultantId) === String(consultantId))
    if (!attendee) return

    attendee[field] = value
    persistMeetings()
  }

  const deleteMeeting = (meetingId) => {
    meetings.value = meetings.value.filter(item => String(item.id) !== String(meetingId))
    persistMeetings()
  }

  const completeMeeting = (meetingId) => {
    const meeting = meetings.value.find(item => String(item.id) === String(meetingId))
    if (!meeting) return

    meeting.status = 'Tamamlandı'
    persistMeetings()
  }

  const meetingStats = computed(() => {
    const total = meetings.value.length
    const planned = meetings.value.filter(item => item.status === 'Planlandı').length
    const completed = meetings.value.filter(item => item.status === 'Tamamlandı').length

    const allAttendees = meetings.value.flatMap(item => item.attendees || [])
    const attended = allAttendees.filter(item => item.status === 'Katıldı').length
    const absent = allAttendees.filter(item => item.status === 'Katılmadı').length
    const excused = allAttendees.filter(item => item.status === 'Mazeretli').length
    const waiting = allAttendees.filter(item => item.status === 'Bekliyor').length

    return {
      total,
      planned,
      completed,
      attended,
      absent,
      excused,
      waiting,
    }
  })

  const getConsultantAttendanceSummary = (consultantId) => {
    const records = meetings.value.flatMap(meeting => {
      return (meeting.attendees || [])
        .filter(attendee => String(attendee.consultantId) === String(consultantId))
        .map(attendee => ({
          meetingId: meeting.id,
          meetingTitle: meeting.title,
          date: meeting.date,
          status: attendee.status,
          note: attendee.note,
        }))
    })

    const total = records.length
    const attended = records.filter(item => item.status === 'Katıldı').length
    const absent = records.filter(item => item.status === 'Katılmadı').length
    const excused = records.filter(item => item.status === 'Mazeretli').length

    const rate = total > 0
      ? Math.round((attended / total) * 100)
      : 0

    return {
      total,
      attended,
      absent,
      excused,
      rate,
      records,
    }
  }

  return {
    meetings,
    hydrateMeetings,
    persistMeetings,
    createMeeting,
    updateMeeting,
    updateAttendance,
    deleteMeeting,
    completeMeeting,
    meetingStats,
    getConsultantAttendanceSummary,
  }
}
