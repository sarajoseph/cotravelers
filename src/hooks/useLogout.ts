/* eslint-disable @typescript-eslint/no-explicit-any */
import { signOut } from 'firebase/auth'
import { authFirebase } from '../firebase/client'

export const useLogout = async () => {
  try {
    await signOut(authFirebase)
    console.log('Logout successful')
  } catch (error: any) {
    console.log(error)
    console.log(error.code)
    console.log(error.message)
  }
}