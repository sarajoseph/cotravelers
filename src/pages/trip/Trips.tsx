/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useTrip } from '../../hooks/useTrip'
import { WebContainer } from '../WebContainer'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { NotFound } from '../common/NotFound'
import { TripCard } from '../../components/TripCard'
import { SwiperSlide } from 'swiper/react'
import { SwiperCarousel } from '../../components/SwiperCarousel'
import { sortByDateCreated, sortByDateFrom } from '../../global/logic'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const Trips = () => {
  const { t } = useTranslation()
  const [ searchParams ] = useSearchParams()
  const location = searchParams.get('location') || ''
  const toDate = searchParams.get('date') || ''
  const { getAllTrips, getTripsByDateAndLocation } = useTrip()
  const [ trips, setTrips ] = useState<{ [x: string]: any } | null>(null)
  const [ tripsState, setTripsState ] = useState<string>('loading')

  useEffect(() => {
    const fetchTrips = async () => {
      const { success, trips, errorMessage} = (location.length > 0 || toDate.length > 0)
        ? await getTripsByDateAndLocation(toDate, location)
        : await getAllTrips()
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
    const currentTrips = trips.filter((trip: any) => new Date(trip.date_from) >= new Date() && !trip.cancelled).sort((a: any, b: any) => sortByDateCreated(a.date_created, b.date_created))
    const pastTrips = trips.filter((trip: any) => new Date(trip.date_from) < new Date() && !trip.cancelled).sort((a: any, b: any) => sortByDateFrom(a.date_from, b.date_from))
    return (
      <WebContainer>
        <Box>
          <Heading mb='8'>{t('trips')}</Heading>
          {currentTrips.length > 0 &&
          <Flex direction={{ base: 'column', lg: 'row' }} columnGap='8' rowGap='8' wrap='wrap'>
            {currentTrips.map((trip: any) => {
            return (
            <TripCard key={trip.id} trip={trip} />
            )
            })}
          </Flex>
          }
          {currentTrips.length === 0 &&
          <Text fontSize='lg' textAlign='center'>{t('noTripsFound')}</Text>
          }
        </Box>
        {pastTrips.length > 0 &&
        <Box mt='12'>
          <Heading fontSize='2xl' mb='4'>{t('pastTrips')}</Heading>
          <SwiperCarousel>
            {pastTrips.map((trip: any) => {
            return (
            <SwiperSlide key={trip.id}>
              <TripCard trip={trip} isSlide={true} />
            </SwiperSlide>
            )
            })}
          </SwiperCarousel>
        </Box>
        }
      </WebContainer>
    )
  }
}