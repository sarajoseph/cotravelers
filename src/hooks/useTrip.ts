/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/client'
import { useErrorHandle } from './useErrorHandle'
import { useProfile } from './useProfile'
import { CommonResponse } from '../global/types/common'
import { useUserStore } from '../store/userStore'
import { removeAccents } from '../global/logic'
import { UseTripProps, TripDataProps, CreateTripResponse, EditTripDataProps, GetAllTripsResponse, GetTripResponse, GetTripsByUserIDResponse } from '../global/types/trips'

export const useTrip = (): UseTripProps => {
  const { handleFirebaseError, handleNotFoundError } = useErrorHandle()
  const { getProfileByUID } = useProfile()
  const user: DocumentData = useUserStore((state) => ({ uid: state.uid }))
  const userID = user.uid

  const cancelTrip = async (tripID: string) => {
    try {
      await updateDoc(doc(db, 'trips', tripID), {
        cancelled: true
      })

      return {
        success: true
      }

    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  const createTrip = async (tripData: TripDataProps): Promise<CreateTripResponse> => {
    try {
      const data = {
        country: tripData.selectedCountry,
        date_from: tripData.fromDate,
        date_to: tripData.toDate,
        spots: tripData.spots,
        budget: tripData.budgetValue,
        title: tripData.title,
        description: tripData.description,
        user_host_id: userID,
        travelers: [userID],
        cancel: false,
        date_created: new Date(Date.now())
      }
      const docRef = await addDoc(collection(db, 'trips'), data)
      const tripID = docRef.id
      await updateDoc(doc(db, 'users', userID), {
        trips: arrayUnion(tripID)
      })

      return {
        success: true,
        tripID
      }

    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  const deleteTrip = async (tripID: string): Promise<CommonResponse> => {
    try {
      await deleteDoc(doc(db, 'trips', tripID))
      const querySnapshot = await getDocs(query(collection(db, 'users')))
      querySnapshot.forEach(async (userDoc) => {
        const userTrips = userDoc.data().trips

        if (Array.isArray(userTrips) && userTrips.includes(tripID)) {
          const userDocRef = userDoc.ref
          await updateDoc(userDocRef, {
            trips: arrayRemove(tripID)
          })
          console.log('Trip removed from user '+userDoc.id)
        }
      })
      return {
        success: true
      }
    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  const editTrip = async (tripData: EditTripDataProps): Promise<CommonResponse> => {
    try {
      const data = {
        country: tripData.selectedCountry,
        date_created: tripData.createdDate,
        date_from: tripData.fromDate,
        date_to: tripData.toDate,
        spots: tripData.spots,
        budget: tripData.budgetValue,
        title: tripData.title,
        description: tripData.description,
        user_host_id: tripData.userHostID,
        travelers: tripData.travelers
      }
      await setDoc(doc(db, 'trips', tripData.tripID), data)
      return {
        success: true
      }

    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  const getAllTrips = async (): Promise<GetAllTripsResponse> => {
    try {
      const tripsCollection = await getDocs(collection(db, 'trips'))
      const trips = await Promise.all(tripsCollection.docs.map(async (doc) => {
        const countryImage = await getCountryImage(doc.data().country)
        return ({
          id: doc.id,
          image: countryImage,
          ...doc.data()
        })
      }))

      if (trips) {
        return {
          success: true,
          trips
        }

      } else {
        return handleNotFoundError('Trips not found')
      }

    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  const getCountryImage = async (country: string): Promise<string | null> => {
    const apiKey = 'ZuVcL956xfdWNMZ2v732y70ZSq3FPc_Jm9jo_6yUd3Y'
    const response = await fetch('https://api.unsplash.com/search/photos?query='+country+'&client_id='+apiKey)
    const data = await response.json()
    return data.results.length > 0 ? data.results[0].urls.regular : null
  }

  const getTrip = async (tripID: string, edit: boolean = false): Promise<GetTripResponse> => {
    try {
      const docSnap = await getDoc(doc(db, 'trips', tripID))
      if (docSnap.exists()) {
        const tripData = {
          ...docSnap.data()
        }
        const countryImage = await getCountryImage(tripData.country)
        tripData.image = countryImage

        const { success, profile } = await getProfileByUID(tripData.user_host_id)
        if (success && profile) {
          tripData.author_username = profile.username
          tripData.author_avatar = profile.avatar
          tripData.author_verified = profile.verified
          tripData.author_uid = profile.uid
        }

        if (!edit) {
          const travelersProfiles = await Promise.all(
            (tripData.travelers).map(async (traveler: string) => {
              const { success, profile } = await getProfileByUID(traveler)
              if (success && profile) {
                return {
                  username: profile.username,
                  avatar: profile.avatar,
                  uid: profile.uid
                }

              }
              return null
            })
          )
          tripData.travelers = travelersProfiles.filter(profile => profile !== null)
        }

        return {
          success: true,
          trip: tripData
        }

      } else {
        return handleNotFoundError('Trip not found')
      }

    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  const getTripsByDateAndLocation = async (toDate: string, location: string): Promise<GetAllTripsResponse> => {
    try {
      const {success, trips, errorMessage } = await getAllTrips()
      if (success && trips) {
        const month = toDate.length > 0 && (new Date(toDate).getMonth()+1).toString().padStart(2, '0')
        const year = toDate.length > 0 && new Date(toDate).getFullYear()
        const fromDate = toDate.length > 0 && year+'-'+month+'-01'

        const filteredTrips = trips.filter((trip: any) => {
          const matchesLocation = location.length > 0
            ? removeAccents(trip.title.toLowerCase()).includes(removeAccents(location.toLowerCase()))
            : false

          const matchesDate = toDate.length > 0
            ? ((trip.date_from >= fromDate) && (trip.date_from <= toDate))
            : false

          if (location.length > 0 && toDate.length > 0) return matchesLocation && matchesDate
          if (location.length > 0 || toDate.length > 0) return matchesLocation || matchesDate
          return true
        })

        return {
          success: true,
          trips: filteredTrips
        }

      }else {
        return handleNotFoundError(errorMessage || 'Error')
      }

    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  const getTripsByUserID = async(user_id: string): Promise<GetTripsByUserIDResponse> => {
    try {
      const { success, profile, errorMessage } = await getProfileByUID(user_id)

      if (!success || !profile) return handleNotFoundError(errorMessage || 'No trips found for this user')

      const userTrips = profile.trips && profile.trips.length > 0 ? await Promise.all(
        profile.trips.map(async (tripID: string) => {
          const { success, trip } = await getTrip(tripID)
          if (success && trip) {
            trip.id = tripID
            return trip
          }
        })
      ) : null

      return {
        success: true,
        userTrips
      }

    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  const joinTrip = async (tripID: string): Promise<CommonResponse> => {
    // Se ha de añadir tripID al campo trips de la tabla users y userID al campo travelers de la tabla trips
    try {
      const { trip } = await getTrip(tripID)
      if (trip?.travelers.length >= trip?.spots) {
        return {
          success: false,
          errorMessage: 'No spots available for this trip'
        }
      }
      await updateDoc(doc(db, 'trips', tripID), {
        travelers: arrayUnion(userID)
      })
      await updateDoc(doc(db, 'users', userID), {
        trips: arrayUnion(tripID)
      })
      return {
        success: true
      }

    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  const leaveTrip = async (tripID: string): Promise<CommonResponse> => {
    // Se ha de añadir tripID al campo trips de la tabla users y userID al campo travelers de la tabla trips
    try {
      await updateDoc(doc(db, 'trips', tripID), {
        travelers: arrayRemove(userID)
      })
      await updateDoc(doc(db, 'users', userID), {
        trips: arrayRemove(tripID)
      })
      return {
        success: true
      }

    } catch (error) {
      return handleFirebaseError(error)
    }
  }

  return {
    cancelTrip,
    createTrip,
    deleteTrip,
    editTrip,
    getAllTrips,
    getTrip,
    getTripsByDateAndLocation,
    getTripsByUserID,
    joinTrip,
    leaveTrip
  }
}
