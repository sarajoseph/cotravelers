/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, updateProfile } from 'firebase/auth'
import { useState } from 'react'
import { authFirebase, db } from '../firebase/client'
import { FieldValues } from 'react-hook-form'
import { FirebaseError } from 'firebase/app'
import { getFirebaseErrorMessage } from '../global/logic'
import { errorMessageInitialValue } from '../global/constants'
import { doc, setDoc } from 'firebase/firestore'


export const useSignup = () => {
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

  const handleSignUpSuccess = async (displayName: string) => {
    if (authFirebase.currentUser) {
      try {
          await updateProfile(authFirebase.currentUser, { displayName })
          if (authFirebase.currentUser) {
            await sendEmailVerification(authFirebase.currentUser)
            await setDoc(doc(db, 'users', authFirebase.currentUser.uid), {
              type: 'common',
              verified: false,
              name: '',
              surname: '',
              birthday: '',
              bio: '',
              hobbies: '',
              countries: '',
            })
          }
          await signOut(authFirebase)
          setIsLoading(false)
          setIsSuccess(true)
          setIsError(false)

      } catch (error) {
        const firebaseError = error as FirebaseError
        console.log(firebaseError)
        const errorMessage = getFirebaseErrorMessage(firebaseError.code, firebaseError.message)
        setErrorMessage(errorMessage)
        setIsLoading(false)
        setIsSuccess(false)
        setIsError(true)
      }

    } else {
      setIsLoading(false)
      setIsSuccess(false)
      setIsError(true)
    }
  }

  const signup = async (data: FieldValues) => {
    const displayName: string = data.username
    const email: string = data.email
    const password: string = data.password
    setIsLoading(true)

    try {
      await createUserWithEmailAndPassword(authFirebase, email, password)
      await handleSignUpSuccess(displayName)

    } catch (error) {
      const firebaseError = error as FirebaseError
      console.log(firebaseError)
      const errorMessage = getFirebaseErrorMessage(firebaseError.code, firebaseError.message)
      setErrorMessage(errorMessage)
      setIsLoading(false)
      setIsSuccess(false)
      setIsError(true)
    }
  }

  return {
    signup,
    isSuccess,
    isLoading,
    isError,
    errorMessage,
    initializeStates
  }
}