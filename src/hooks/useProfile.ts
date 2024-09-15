import { useState } from 'react'
import { useUser } from './useUser'
import { db, uploadFileFirebase } from '../firebase/client'
import { doc, getDoc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { useUserStore } from '../store/userStore'

export const useProfile = () => {
  const [ uploadingAvatar, setUploadingAvatar ] = useState<boolean>(false)
  const { saveUserData } = useUser()
  const user = useUserStore((state) => ({
    uid: state.uid
  }))

  const getProfileByUID = async (uid: string) => {
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
        console.log('Not found')
        return {
          success: false,
          errorMessage: 'Not found'
        }
      }

    } catch (error) {
      const firebaseError = error as FirebaseError
      console.log(firebaseError)
      return {
        success: false,
        errorMessage: firebaseError
      }
    }
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
    const { imageUrl, uploadFileFirebaseErrorMessage } = await uploadFileFirebase(imageFile, user.uid)
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
    handleUploadImage,
    uploadingAvatar,
    validateBirthday,
    getProfileByUID
  }
}