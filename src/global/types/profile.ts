/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonResponse } from './common'

export type UseProfileProps = {
  handleUploadImage: (imageFile: File) => Promise<CommonResponse>
  uploadingAvatar: boolean
  validateBirthday: (value: string) => true | string
  getProfileByUID: (uid: string) => Promise<ProfileByUIDResponse>
  resizeAvatar: (imageFile: File, callback: (resizedFile: File) => void) => void
}

export type ProfileByUIDResponse = {
  success: boolean
  profile?: {[x: string]: any}
  errorMessage?: string
}