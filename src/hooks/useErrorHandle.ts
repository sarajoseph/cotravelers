import { FirebaseError } from 'firebase/app'

export const useErrorHandle = () => {
  const handleFirebaseError = (error: unknown) => {
    const firebaseError = error as FirebaseError
    console.log(firebaseError)
    return {
      success: false,
      errorMessage: firebaseError.message
    }
  }

  const handleNotFoundError = (errorMessage: string) => {
    console.log(errorMessage)
    return {
      success: false,
      errorMessage: errorMessage
    }
  }

  return {
    handleFirebaseError,
    handleNotFoundError
  }
}