import { useState } from 'react'
import { useUser } from './useUser'
import { db, uploadFileFirebase } from '../firebase/client'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '../store/userStore'
import { useErrorHandle } from './useErrorHandle'
import { CommonResponse } from '../global/types/common'
import { UseProfileProps, ProfileByUIDResponse } from '../global/types/profile'

export const useProfile = (): UseProfileProps => {
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

  const handleUploadImage = async (imageFile: File): Promise<CommonResponse> => {
    if (imageFile === null) return handleNotFoundError('Error no file selected')

    const { success, errorMessage } = validateAvatar(imageFile)

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

  const validateAvatar = (imageFile: File): CommonResponse => {
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

  const resizeAvatar = (imageFile: File, callback: (resizedFile: File) => void) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const MAX_WIDTH = 300
    const MAX_HEIGHT = 300

    img.onload = () => {
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }

      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], imageFile.name, { type: imageFile.type })
          callback(resizedFile)  // Pasamos la imagen redimensionada al callback
        } else {
          console.error('Error creating Blob')
        }
      }, imageFile.type, 1)
    }

    img.src = URL.createObjectURL(imageFile)
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

  return {
    handleUploadImage,
    uploadingAvatar,
    validateBirthday,
    getProfileByUID,
    resizeAvatar
  }
}