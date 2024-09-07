export type FormRegisterInputs = {
  username: string
  email: string
  password: string
}
export type UserProps = {
  username: string,
  email: string,
  avatar: string
}
export type UserStore = UserProps & {
  userIsLogin: boolean
  setUsername: (username: UserProps['username']) => void
  setEmail: (email: UserProps['email']) => void
  setUserIsLogin: (userIsLogin: UserStore['userIsLogin']) => void
  resetUser: () => void
  setAvatar: (avatar: UserProps['avatar']) => void
}
export type FormProfileInputs = {
  username: string
  email: string
  avatar: string
  name: string
  surname: string
  birthday: string
  bio: string
  hobbies: string[]
  countries: string[]
}