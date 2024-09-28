/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  //const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return day + ' ' + month + ' ' + year
}

export const sortByDateFrom = (dateA: any, dateB: any, ascending: boolean = true) => {
  return ascending ? new Date(dateA).getTime() - new Date(dateB).getTime() : new Date(dateA).getTime() - new Date(dateB).getTime()
}

export const sortByDateCreated = (dateA: any, dateB: any, ascending: boolean = false) => {
  const aTimestamp = dateA.seconds * 1000 + dateA.nanoseconds / 1000000
  const bTimestamp = dateB.seconds * 1000 + dateB.nanoseconds / 1000000
  return ascending ? aTimestamp - bTimestamp : bTimestamp - aTimestamp
}

export const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')