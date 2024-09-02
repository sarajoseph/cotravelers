import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { authFirebase } from '../firebase/client'
import { UserProps } from '../global/types'
import { useUserStore } from '../store/userStore'

export const useUser = (): UserProps & {userIsLogin: boolean} => {
  const user = useUserStore((state) => ({
    username: state.username,
    email: state.email,
    userIsLogin: state.userIsLogin
  }))
  const setUsername = useUserStore((state) => state.setUsername)
  const setEmail = useUserStore((state) => state.setEmail)
  const setUserIsLogin = useUserStore((state) => state.setUserIsLogin)
  const resetUser = useUserStore((state) => state.resetUser)
  useEffect(() => {
    onAuthStateChanged(authFirebase, (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        const firebaseUserDisplayName = firebaseUser.displayName || ''
        const firebaseUserEmail = firebaseUser.email || ''
        setUsername(firebaseUserDisplayName)
        setEmail(firebaseUserEmail)
        setUserIsLogin(true)
      } else {
        // User no logueado
        resetUser()
      }
    })
  }, [])

  return {
    username: user.username,
    email: user.email,
    userIsLogin: user.userIsLogin
  }
}