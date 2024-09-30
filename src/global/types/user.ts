import { DocumentData } from 'firebase/firestore'
import { CommonResponse } from './common'

export type UseUserProps = {
  user: DocumentData,
  firebaseIsLoading: boolean,
  deleteUser: (userID: string) => Promise<CommonResponse>
  saveUserData: ({photoURL, dataField, dataValue}: SaveUserDataProps) => Promise<CommonResponse>
  saveErrorMessage: string | false
}

export type SaveUserDataProps = {
  photoURL?: string,
  dataField?: string,
  dataValue?: string | string[]
  userUpdated?: DocumentData
}