export type FormRegisterInputs = {
  username: string
  email: string
  password: string
}
export type UserProps = {
  avatar: string,
  bio: string,
  birthday: string,
  countries: string[],
  email: string,
  hobbies: string[],
  name: string,
  public_email: string,
  surname: string,
  type: string,
  uid: string,
  userIsLogin: boolean,
  username: string,
  verified: string,
}
export type UserStore = UserProps & {
  setAvatar: (avatar: UserProps['avatar']) => void
  setUserIsLogin: (userIsLogin: UserProps['userIsLogin']) => void
  setUserData: (data: any) => void
  resetUser: () => void
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

export type CommonResponse = {
  success: boolean
  errorMessage?: string
}