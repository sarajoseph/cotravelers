// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import firebaseConfig from './config.json'

// Initialize Firebase
export const appFirebase = initializeApp(firebaseConfig)
export const authFirebase = getAuth(appFirebase)
export const db = getFirestore(appFirebase)
const storageFirebase = getStorage(appFirebase)

export const uploadFileFirebase = async (file: Blob, userID: string) => {
  try {
    const storageRef = ref(storageFirebase, '/avatar/'+userID)
    await uploadBytes(storageRef, file)
    const imageUrl = await getDownloadURL(storageRef)
    return { success: true, imageUrl}

  } catch (error) {
    const firebaseError = error as FirebaseError
    console.log(firebaseError.message)
    return { success: false, uploadFileFirebaseErrorMessage: firebaseError.message}
  }

}