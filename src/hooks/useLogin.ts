import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useState } from 'react'
import { authFirebase } from '../firebase/client'
import { FirebaseError } from 'firebase/app'
import { getFirebaseErrorMessage } from '../global/logic'
import { errorMessageInitialValue } from '../global/constants'

export const useLogin = () => {
  const [ isSuccess, setIsSuccess ] = useState<boolean>(false)
  const [ isLoading, setIsLoading] = useState<boolean>(false)
  const [ isError, setIsError ] = useState<boolean>(false)
  const [ errorMessage, setErrorMessage ] = useState<string>(errorMessageInitialValue)

  const initializeStates = () => {
    setIsSuccess(false)
    setIsLoading(false)
    setIsError(false)
    setErrorMessage(errorMessageInitialValue)
  }

  const login = async (e: React.FormEvent<HTMLFormElement>, onClose: () => void) => {
    e.preventDefault()
    const email = (document.getElementById('emailLogin') as HTMLInputElement).value
    const password = (document.getElementById('passwordLogin') as HTMLInputElement).value
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(authFirebase, email, password)
      setIsLoading(false)
      if (authFirebase.currentUser?.emailVerified) {
        setIsSuccess(true)
        setIsError(false)
        onClose()

      } else {
        await signOut(authFirebase)
        setErrorMessage('You must verify your email')
        setIsSuccess(false)
        setIsError(true)
      }

    } catch (error) {
      const firebaseError = error as FirebaseError
      const errorMessage = getFirebaseErrorMessage(firebaseError.code, firebaseError.message)
      setErrorMessage(errorMessage)
      setIsLoading(false)
      setIsSuccess(false)
      setIsError(true)
    }
  }

  return {
    login,
    isSuccess,
    isLoading,
    isError,
    errorMessage,
    initializeStates
  }
}