export type FormRegisterInputs = {
  username: string
  email: string
  password: string
}
export type LoadingProps = {
  type?: 'loading-spinner' | 'loading-dots' | 'loading-ring' | 'loading-ball' | 'loading-bars' | 'loading-infinity'
  size?: 'loading-xs' | 'loading-sm' | 'loading-md' | 'loading-lg'
}
export type UserProps = {
  username: string,
  email: string
}
export type UserStore = UserProps & {
  userIsLogin: boolean
  setUsername: (username: UserProps['username']) => void
  setEmail: (email: UserProps['email']) => void
  setUserIsLogin: (userIsLogin: UserStore['userIsLogin']) => void
  resetUser: () => void
}