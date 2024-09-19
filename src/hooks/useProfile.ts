/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useUser } from './useUser'
import { db, uploadFileFirebase } from '../firebase/client'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '../store/userStore'
import { useErrorHandle } from './useErrorHandle'
import { CommonResponse } from '../global/types'

type ProfileByUIDResponse = {
  success: boolean;
  profile?: {[x: string]: any};
  errorMessage?: string;
}

export const useProfile = () => {
  const [ uploadingAvatar, setUploadingAvatar ] = useState<boolean>(false)
  const { saveUserData } = useUser()
  const { handleFirebaseError, handleNotFoundError } = useErrorHandle()
  const user = useUserStore((state) => ({
    uid: state.uid
  }))

  const getProfileByUID = async (uid: string): Promise<ProfileByUIDResponse> => {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid))
      if (docSnap.exists()) {
        const userFullData = {
          ...docSnap.data()
        }
        return {
          success: true,
          profile: userFullData
        }

      } else {
        return handleNotFoundError('Profile not found')
      }

    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>): Promise<CommonResponse> => {
    if (e.target.files === null) return handleNotFoundError('Error no file selected')

    const imageFile = e.target.files[0]
    const { success, errorMessage } = validateAvatar(e)

    if (!success && errorMessage) {
      return handleNotFoundError(errorMessage)
    }

    setUploadingAvatar(true)
    // Save image in firebase storage
    const { imageUrl, uploadFileFirebaseErrorMessage } = await uploadFileFirebase(imageFile, user.uid)
    if (imageUrl) {
      // Save image in firestore database collection
      const { success, errorMessage } = await saveUserData({photoURL: imageUrl})
      setUploadingAvatar(false)
      if (success) {
        const oImage = (document.getElementById('editprofileImage') as HTMLImageElement)
        oImage.src = imageUrl || ''
        return {
          success: true
        }
      }
      if (errorMessage) {
        return handleNotFoundError(errorMessage)
      }
    }
    return handleFirebaseError(uploadFileFirebaseErrorMessage)
  }

  const validateBirthday = (value: string): true | string => {
    const today = new Date()
    const selectedDate = new Date(value)
    let age = today.getFullYear() - selectedDate.getFullYear()
    const monthDiff = today.getMonth() - selectedDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      age--
    }

    return age >= 18 || 'You must be at least 18 years old'
  }

  const validateAvatar = (e: React.ChangeEvent<HTMLInputElement>): CommonResponse => {
    if (e.target.files === null) {
      return handleNotFoundError('Error no file selected')
    }

    const imageFile = e.target.files[0]
    const allowedFormats = ['image/png', 'image/jpeg', 'image/gif']

    if (!allowedFormats.includes(imageFile.type)) {
      return handleNotFoundError('Only .png, .jpg and .gif formats are allowed')
    }

    const maxSizeInMB = 2
    const fileSizeInMB = imageFile.size / 1024 / 1024 // Convertir a MB
    if (fileSizeInMB > maxSizeInMB) {
      return handleNotFoundError('File must be smaller than '+maxSizeInMB+'MB')
    }
    return {
      success: true
    }
  }

  return {
    handleUploadImage,
    uploadingAvatar,
    validateBirthday,
    getProfileByUID
  }
}