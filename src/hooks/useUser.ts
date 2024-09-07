/* eslint-disable react-hooks/exhaustive-deps */
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { authFirebase, db } from '../firebase/client'
import { UserProps } from '../global/types'
import { useUserStore } from '../store/userStore'
import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

type UseUserProps = UserProps & {
  userIsLogin: boolean,
  firebaseIsLoading: boolean,
  userData: DocumentData | null,
  saveUserData: ({ photoURL, dataField, dataValue }: {
      photoURL?: string
      dataField?: string
      dataValue?: string | string[]
    }) => Promise<{
      saveUserDataSuccess: boolean
      saveUserDataErrorMessage?: undefined
    } | {
      saveUserDataSuccess: boolean
      saveUserDataErrorMessage: string
    }>
  saveErrorMessage: string | false
}

type authUserDataProps = {
  id: string | null
  username: string | null
  email: string | null
  phoneNumber: string | null
  photoURL: string | null
}

export const useUser = (): UseUserProps => {
  const [ firebaseIsLoading, setFirebaseIsLoading ] = useState<boolean>(true)
  const user = useUserStore((state) => ({
    username: state.username,
    email: state.email,
    userIsLogin: state.userIsLogin,
    avatar: state.avatar
  }))
  const setUsername = useUserStore((state) => state.setUsername)
  const setEmail = useUserStore((state) => state.setEmail)
  const setUserIsLogin = useUserStore((state) => state.setUserIsLogin)
  const resetUser = useUserStore((state) => state.resetUser)
  const setAvatar = useUserStore((state) => state.setAvatar)
  const [ userData, setUserData ] = useState<DocumentData | null>(null)

  useEffect(() => {
    const authStateChanged = onAuthStateChanged(authFirebase, async (firebaseUser) => {
      setFirebaseIsLoading(true)
      if (firebaseUser && firebaseUser.emailVerified) {
        const firebaseUserDisplayName = firebaseUser.displayName || ''
        const firebaseUserEmail = firebaseUser.email || ''
        const firebaseUserAvatar = firebaseUser.photoURL || ''

        // Update user state
        setUsername(firebaseUserDisplayName)
        setEmail(firebaseUserEmail)
        setUserIsLogin(true)
        setAvatar(firebaseUserAvatar)

        // Fetch user data from Firestore
        const data = await getUserData()
        setUserData(data)

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
    const authUserData: authUserDataProps = {
      id: currentUser.displayName,
      username: currentUser.displayName,
      email: currentUser.email,
      phoneNumber: currentUser.phoneNumber,
      photoURL: currentUser.photoURL
    }

    try {
      const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
      if (docSnap.exists()) {
        const userFullData = {
          ...authUserData,
          ...docSnap.data()
        }
        return userFullData

      } else {
        console.log('Not found')
        return authUserData
      }

    } catch (error) {
      const firebaseError = error as FirebaseError
      console.log(firebaseError)
      return null
    }
  }

  const [ saveErrorMessage, setSaveErrorMessage ] = useState<string | false>(false)

  const saveUserData = async ({photoURL, dataField, dataValue}: {photoURL?: string, dataField?: string, dataValue?: string | string[]}) => {
    if (authFirebase.currentUser && userData !== undefined) {
      try {
        if (photoURL) {
          await updateProfile(authFirebase.currentUser, {photoURL})
          setAvatar(photoURL)
        }
        const profileUserData = {
          type: userData?.type,
          verified: userData?.verified,
          name: dataField === 'name' ? dataValue : userData?.name,
          surname: dataField === 'surname' ? dataValue : userData?.surname,
          birthday: dataField === 'birthday' ? dataValue : userData?.birthday,
          bio: dataField === 'bio' ? dataValue : userData?.bio,
          hobbies: dataField === 'hobbies' ? dataValue : userData?.hobbies,
          countries: dataField === 'countries' ? dataValue : userData?.countries,
        }
        await setDoc(doc(db, 'users', authFirebase.currentUser.uid), profileUserData)
        const data = await getUserData()
        setUserData(data)

        return { saveUserDataSuccess: true }

      } catch (error) {
        const firebaseError = error as FirebaseError
        console.error(firebaseError)
        setSaveErrorMessage(firebaseError.message)
        return {
          saveUserDataSuccess: false,
          saveUserDataErrorMessage: firebaseError.message
        }
      }

    } else {
      const errorMessage = 'No user with login'
      console.error(errorMessage)
      setSaveErrorMessage(errorMessage)
      return {
        saveUserDataSuccess: false,
        saveUserDataErrorMessage: errorMessage
      }
    }
  }

  return {
    username: user.username,
    email: user.email,
    userIsLogin: user.userIsLogin,
    avatar: user.avatar,
    firebaseIsLoading,
    userData,
    saveUserData,
    saveErrorMessage
  }
}