/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { UserStore } from '../global/types'

const initialUser = {
  avatar: '',
  bio: '',
  birthday: '',
  countries: [],
  email: '',
  hobbies: [],
  name: '',
  public_email: '',
  selectedLanguage: 'es' as 'es' | 'en',
  surname: '',
  type: '',
  uid: '',
  userIsLogin: false,
  username: '',
  verified: '',
}

export const useUserStore = create<UserStore>((set) => ({
  ...initialUser,
  setAvatar: (avatar: string) => set(() => ({ avatar: avatar })),
  setSelectedLanguage: (selectedLanguage: 'es' | 'en') => set(() => ({ selectedLanguage })),
  setUserIsLogin: (userIsLogin: boolean) => set(() => ({ userIsLogin: userIsLogin })),
  setUserData: (data: any) => set(() => (data)),
  resetUser: () => set(() => (initialUser))
}))