/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useTrip } from '../../hooks/useTrip'
import { WebContainer } from '../WebContainer'
import { Flex, Heading } from '@chakra-ui/react'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { NotFound } from '../common/NotFound'
import { TripsList } from '../../components/TripsList'

export const Trips = () => {
  const { getAllTrips } = useTrip()
  const [ trips, setTrips ] = useState<{ [x: string]: any } | null>(null)
  const [ tripsState, setTripsState ] = useState<string>('loading')

  useEffect(() => {
    const fetchTrips = async () => {
      const { success, trips, errorMessage} = await getAllTrips()
      if (success && trips){
        setTrips(trips)
        setTripsState('success')
      } else {
        setTripsState(errorMessage || 'error')
      }
    }
    fetchTrips()
  }, [])

  if (tripsState === 'loading') return <LoadingProfile />
  if (tripsState !== 'success') return tripsState !== 'error' ? <NotFound errorMessage={tripsState} /> : <NotFound />
  if (trips) {
    return (
      <WebContainer>
        <Heading mb='8'>Trips</Heading>
        <Flex direction={{ base: 'column', lg: 'row' }} columnGap='8' rowGap='8' wrap='wrap'>
        {trips.map((trip: any) => {
          return (
          <TripsList key={trip.id} trip={trip} />
          )
        })}
        </Flex>
      </WebContainer>
    )
  }
}