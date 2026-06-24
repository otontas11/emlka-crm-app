export const useCurrentUser = () => {
  return useState('currentUser', () => ({
    id: 1,
    name: 'Sinan',
    role: 'broker',
    packageType: 'office'
  }))
}

export const setSoloUser = () => {
  const currentUser = useCurrentUser()

  currentUser.value = {
    id: 1,
    name: 'Sinan',
    role: 'consultant',
    packageType: 'solo'
  }
}

export const setOfficeUser = () => {
  const currentUser = useCurrentUser()

  currentUser.value = {
    id: 1,
    name: 'Sinan',
    role: 'broker',
    packageType: 'office'
  }
}


