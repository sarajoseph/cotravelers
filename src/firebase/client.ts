// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBzxLQx2B8DljChIq7NNh-TwyZUzoE3JGM',
  authDomain: 'cotravelers-sarajoseph.firebaseapp.com',
  projectId: 'cotravelers-sarajoseph',
  storageBucket: 'cotravelers-sarajoseph.appspot.com',
  messagingSenderId: '223786652722',
  appId: '1:223786652722:web:db3bf62d29a2aee393d82b',
  measurementId: 'G-CQ9QHD29RR'
}

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
    return { uploadFileFirebaseSuccess: true, imageUrl}

  } catch (error) {
    const firebaseError = error as FirebaseError
    console.log(firebaseError.message)
    return { uploadFileFirebaseSuccess: false, uploadFileFirebaseErrorMessage: firebaseError.message}
  }

}