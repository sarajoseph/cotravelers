/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonResponse } from './common'

export type TripDataProps = {
  selectedCountry: string
  fromDate: string
  toDate: string
  budgetValue: string
  spots: number
  title: string
  description: string
}

export type EditTripDataProps = TripDataProps & {
  tripID: string
  userHostID: string
  travelers: string
  createdDate: string
}

export type CreateTripResponse = CommonResponse & {
  tripID?: string
}

export type GetTripResponse = CommonResponse & {
  trip?: {[x: string]: any}
}

export type GetAllTripsResponse = CommonResponse & {
  trips?: {[x: string]: any}
}

export type GetTripsByUserIDResponse = CommonResponse & {
  userTrips?: {[x: string]: any} | null
}

export type UseTripProps = {
  cancelTrip: (tripID: string) => Promise<CommonResponse>
  createTrip: (tripData: TripDataProps) => Promise<CreateTripResponse>
  deleteTrip: (tripID: string) => Promise<CommonResponse>
  editTrip: (tripData: EditTripDataProps) => Promise<CommonResponse>
  getAllTrips: () => Promise<GetAllTripsResponse>
  getTrip: (tripID: string, edit?: boolean) => Promise<GetTripResponse>
  getTripsByDateAndLocation: (toDate: string, location: string) => Promise<GetAllTripsResponse>
  getTripsByUserID: (user_id: string) => Promise<GetTripsByUserIDResponse>
  joinTrip: (tripID: string) => Promise<CommonResponse>
  leaveTrip: (tripID: string) => Promise<CommonResponse>
}