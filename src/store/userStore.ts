import { create } from 'zustand'
import { UserStore } from '../global/types'

const initialUser = {
  username: '',
  email: '',
  userIsLogin: false
}

export const useUserStore = create<UserStore>((set) => ({
  ...initialUser,
  setUsername: (username: string) => set(() => ({ username: username })),
  setEmail: (email: string) => set(() => ({ email: email })),
  setUserIsLogin: (userIsLogin: boolean) => set(() => ({ userIsLogin: userIsLogin })),
  resetUser: () => set(() => (initialUser))
}))