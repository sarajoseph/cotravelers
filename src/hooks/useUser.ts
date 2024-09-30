/* eslint-disable react-hooks/exhaustive-deps */
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { authFirebase, db } from '../firebase/client'
import { useUserStore } from '../store/userStore'
import { arrayRemove, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { useErrorHandle } from './useErrorHandle'
import { CommonResponse } from '../global/types/common'
import { UseUserProps, SaveUserDataProps } from '../global/types/user'

export const useUser = (): UseUserProps => {
  const { handleFirebaseError, handleNotFoundError } = useErrorHandle()
  const [ firebaseIsLoading, setFirebaseIsLoading ] = useState<boolean>(true)
  const user: DocumentData = useUserStore((state) => ({
    avatar: state.avatar,
    bio: state.bio,
    birthday: state.birthday,
    countries: state.countries,
    email: state.email,
    hobbies: state.hobbies,
    name: state.name,
    public_email: state.public_email,
    surname: state.surname,
    type: state.type,
    uid: state.uid,
    userIsLogin: state.userIsLogin,
    username: state.username,
    verified: state.verified,
  }))
  const setAvatar = useUserStore((state) => state.setAvatar)
  const setUserIsLogin = useUserStore((state) => state.setUserIsLogin)
  const setUserDataStore = useUserStore((state) => state.setUserData)
  const resetUser = useUserStore((state) => state.resetUser)

  useEffect(() => {
    const authStateChanged = onAuthStateChanged(authFirebase, async (firebaseUser) => {
      setFirebaseIsLoading(true)
      if (firebaseUser && firebaseUser.emailVerified) {
        setUserIsLogin(true)

        // Fetch user data from Firestore
        const data = await getUserData()
        setUserDataStore(data)

      } else {
        resetUser()
      }

      setFirebaseIsLoading(false)
    })

    return () => authStateChanged()
  }, [])

  const getUserData = async () => {
    const currentUser: User | null = authFirebase.currentUser
    if (!currentUser){
      console.log('No user with login')
      return null
    }

    try {
      const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
      if (docSnap.exists()) {
        const userFullData = {
          ...docSnap.data()
        }
        return userFullData

      } else {
        console.log('Not found')
        return null
      }

    } catch (error) {
      const firebaseError = error as FirebaseError
      console.log(firebaseError)
      return null
    }
  }

  const [ saveErrorMessage, setSaveErrorMessage ] = useState<string | false>(false)

  const saveUserData = async ( {photoURL, dataField, dataValue, userUpdated}: SaveUserDataProps ): Promise<CommonResponse> => {
    const userData = userUpdated || user
    if (authFirebase.currentUser && userData !== undefined) {
      try {
        if (photoURL) {
          await updateProfile(authFirebase.currentUser, {photoURL})
          setAvatar(photoURL)
        }
        const profileUserData = {
          ...userData,
          avatar: photoURL ? photoURL : userData.avatar,
          ...(dataField && { [dataField]: dataValue })
        }
        await setDoc(doc(db, 'users', authFirebase.currentUser.uid), profileUserData)
        const data = await getUserData()
        setUserDataStore(data)

        return { success: true }

      } catch (error) {
        const firebaseError = error as FirebaseError
        setSaveErrorMessage(firebaseError.message)
        return handleFirebaseError(error)
      }

    } else {
      const errorMessage = 'No user with login'
      setSaveErrorMessage(errorMessage)
      return handleNotFoundError(errorMessage)
    }
  }

  const deleteUser = async (userID: string): Promise<CommonResponse> => {
    try {
      await deleteDoc(doc(db, 'users', userID))
      const querySnapshot = await getDocs(query(collection(db, 'trips')))
      querySnapshot.forEach(async (userDoc) => {
        const tripTravelers = userDoc.data().travelers

        if (tripTravelers.includes(userID)) {
          const userDocRef = userDoc.ref
          await updateDoc(userDocRef, {
            trips: arrayRemove(userID)
          })
          console.log('User removed from trip '+userDoc.id)
        }
      })
      return {
        success: true
      }
    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  return {
    user,
    firebaseIsLoading,
    deleteUser,
    saveUserData,
    saveErrorMessage
  }
}