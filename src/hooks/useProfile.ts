import { useState } from 'react'
import { useUser } from './useUser'
import { uploadFileFirebase } from '../firebase/client'

export const useProfile = () => {
  const [ isEditProfile, setIsEditProfile ] = useState<boolean>(false)
  const [ uploadingAvatar, setUploadingAvatar ] = useState<boolean>(false)
  const { userData, saveUserData } = useUser()

  const toggleEditProfile = () => {
    setIsEditProfile((prev) => !prev)
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return { success: false, errorMessage: 'Error no file selected'}

    const imageFile = e.target.files[0]
    const { validateAvatarSuccess, validateAvatarErrorMessage } = validateAvatar(e)

    if (!validateAvatarSuccess) {
      return {
        handleUploadImageSuccess: false,
        handleUploadImageErrorMessage: validateAvatarErrorMessage
      }
    }

    setUploadingAvatar(true)
    // Save image in firebase storage
    const { imageUrl, uploadFileFirebaseErrorMessage } = await uploadFileFirebase(imageFile, userData?.id)
    if (imageUrl) {
      // Save image in firestore database collection
      const { saveUserDataSuccess, saveUserDataErrorMessage } = await saveUserData({photoURL: imageUrl})
      setUploadingAvatar(false)
      if (saveUserDataSuccess) {
        const oImage = (document.getElementById('editprofileImage') as HTMLImageElement)
        oImage.src = imageUrl || ''
        return {
          handleUploadImageSuccess: true
        }
      }
      return {
        handleUploadImageSuccess: false,
        handleUploadImageErrorMessage: saveUserDataErrorMessage
      }
    }
    return {
      handleUploadImageSuccess: false,
      handleUploadImageErrorMessage: uploadFileFirebaseErrorMessage
    }
  }

  const handleSaveData = async (dataField: string, dataValue: string | string[]) => {
    const { saveUserDataSuccess } = await saveUserData({dataField, dataValue})
    return saveUserDataSuccess
  }

  const validateBirthday = (value: string) => {
    const today = new Date()
    const selectedDate = new Date(value)
    let age = today.getFullYear() - selectedDate.getFullYear()
    const monthDiff = today.getMonth() - selectedDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      age--
    }

    return age >= 18 || 'You must be at least 18 years old'
  }

  const validateAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return {
        validateAvatarSuccess: false,
        validateAvatarErrorMessage: 'Error no file selected'
      }
    }

    const imageFile = e.target.files[0]
    const allowedFormats = ['image/png', 'image/jpeg', 'image/gif']

    if (!allowedFormats.includes(imageFile.type)) {
      return {
        validateAvatarSuccess: false,
        validateAvatarErrorMessage: 'Only .png, .jpg and .gif formats are allowed'
      }
    }

    const maxSizeInMB = 2
    const fileSizeInMB = imageFile.size / 1024 / 1024 // Convertir a MB
    if (fileSizeInMB > maxSizeInMB) {
      return {
        validateAvatarSuccess: false,
        validateAvatarErrorMessage: 'File must be smaller than '+maxSizeInMB+'MB'
      }
    }
    return {
      validateAvatarSuccess: true
    }
  }

  return {
    isEditProfile,
    toggleEditProfile,
    handleSaveData,
    handleUploadImage,
    uploadingAvatar,
    validateBirthday
  }
}