import { sendPasswordResetEmail } from 'firebase/auth'
import { authFirebase } from '../firebase/client'
import { FirebaseError } from 'firebase/app'
import { useState } from 'react'
import { getFirebaseErrorMessage } from '../global/logic'
import { errorMessageInitialValue } from '../global/constants'

export const useResetPassword = () => {
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

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email: string = (document.getElementById('emailLogin') as HTMLInputElement).value
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(authFirebase, email)
      setIsLoading(false)
      setIsSuccess(true)
      setIsError(false)
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
    resetPassword,
    isSuccess,
    isLoading,
    isError,
    errorMessage,
    initializeStates
  }
}