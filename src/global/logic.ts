import { UseFormReset } from 'react-hook-form'
import { FormRegisterInputs } from './types'

export const handleCloseAndOpenModal = (closeModal: () => void, openModal: () => void) => {
  closeModal()
  openModal()
}

export const handleCloseModal = (onClose: () => void, initializeStates: () => void, reset?: UseFormReset<FormRegisterInputs>) => {
  if (reset) reset()
  initializeStates()
  onClose()
}

export const getFirebaseErrorMessage = (code: string, message: string) => {
  let errorMessage = message
  switch(code) {
    case 'auth/invalid-email':
      errorMessage = 'Email is incorrect'
      break
    case 'auth/user-not-found':
      errorMessage = 'There is no user with these email registered.'
      break
    case 'auth/wrong-password':
      errorMessage = 'Password is incorrect.'
      break
    case 'auth/invalid-credential':
      errorMessage = 'Invalid credentials.'
      break
    case 'auth/invalid-password':
      errorMessage = 'Password must be a string with at least seven characters.'
      break
    case 'auth/missing-password':
      errorMessage = 'Password is missing'
      break
    case 'auth/email-already-in-use':
      errorMessage = 'There is already a user registered with this email'
      break
  }
  return errorMessage
}