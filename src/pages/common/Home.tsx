/* eslint-disable @typescript-eslint/no-explicit-any */
import { SwiperSlide } from 'swiper/react'
import { SwiperCarousel } from '../../components/SwiperCarousel'
import { WebContainer } from '../WebContainer'
import { useTrip } from '../../hooks/useTrip'
import { useEffect, useState } from 'react'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { NotFound } from './NotFound'
import { TripCard } from '../../components/TripCard'
import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import { Loading } from '../../components/icons/Loading'
import { Link } from 'react-router-dom'
import { urlTrips } from '../../store/constantsStore'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { HomeDescription } from '../../components/HomeDescription'
import { sortByDateCreated, sortByDateFrom } from '../../global/logic'
import { TripFinder } from '../../components/TripFinder'
import { useTranslation } from 'react-i18next'

export const Home = () => {
  const { t } = useTranslation()
  const { getAllTrips } = useTrip()
  const [ allTrips, setAllTrips ] = useState<{ [x: string]: any } | null>(null)
  const [ nextTrips, setNextTrips ] = useState<{ [x: string]: any } | null>(null)
  const [ lastTrips, setLastTrips ] = useState<{ [x: string]: any } | null>(null)
  const [ allTripsState, setAllTripsState ] = useState<string>('loading')
  const [ nextTripsState, setNextTripsState ] = useState<string>('loading')
  const [ lastTripsState, setLastTripsState ] = useState<string>('loading')

  useEffect(() => {
    const fetchTrips = async () => {
      const { success, trips, errorMessage} = await getAllTrips()
      if (success && Array.isArray(trips)){
        // currentTrips => Get trips with "date_from" from today or future and not cancelled
        const currentTrips = trips.filter((trip: any) => new Date(trip.date_from) >= new Date() && !trip.cancelled)
        setAllTrips(currentTrips)
        setAllTripsState('success')
        // nextTrips => Trips sorted by "date_from" departure date from nearest to farthest
        const nextTrips = [...currentTrips]
        nextTrips.sort((a: any, b: any) => sortByDateFrom(a.date_from, b.date_from))
        setNextTrips(nextTrips.slice(0, 9))
        setNextTripsState('success')
        // lastTrips => Trips sorted by "date_created" from the most recently created trips to the oldest ones
        const lastTrips = [...currentTrips]
        lastTrips.sort((a: any, b: any) => sortByDateCreated(a.date_created, b.date_created))
        setLastTrips(lastTrips.slice(0, 9))
        setLastTripsState('success')
      } else {
        setAllTripsState(errorMessage || 'error')
      }
    }
    fetchTrips()
  }, [])

  if (allTripsState === 'loading') return <LoadingProfile />
  if (allTripsState !== 'success') return allTripsState !== 'error' ? <NotFound errorMessage={allTripsState} /> : <NotFound />
  if (allTrips) {
    return (
      <WebContainer>
        <TripFinder />
        <HomeDescription />
        {nextTripsState === 'loading' && <Loading /> }
        {nextTrips && nextTrips.length > 0 &&
        <Box mb='16'>
          <Heading fontSize='3xl' mb='4'>{t('nextTrips')}</Heading>
          <SwiperCarousel>
            {nextTrips.map((trip: any) => {
              return (
              <SwiperSlide key={trip.id}>
                <TripCard trip={trip} isSlide={true} />
              </SwiperSlide>
              )
            })}
          </SwiperCarousel>
          <Flex alignItems='center' justifyContent='center' pt='6'>
            <Button as={Link} to={urlTrips} size='lg' colorScheme='teal' variant='outline' rightIcon={<ArrowForwardIcon />}>{t('seeAllTrips')}</Button>
          </Flex>
        </Box>
        }
        {lastTripsState === 'loading' && <Loading /> }
        {lastTrips && lastTrips.length > 0 &&
        <Box mb='16'>
          <Heading fontSize='3xl' mb='4'>{t('latestPublishedTrips')}</Heading>
          <SwiperCarousel>
            {lastTrips.map((trip: any) => {
              return (
              <SwiperSlide key={trip.id}>
                <TripCard trip={trip} isSlide={true} />
              </SwiperSlide>
              )
            })}
          </SwiperCarousel>
          <Flex alignItems='center' justifyContent='center' pt='6'>
            <Button as={Link} to={urlTrips} size='lg' colorScheme='teal' variant='outline' rightIcon={<ArrowForwardIcon />}>{t('seeAllTrips')}</Button>
          </Flex>
        </Box>
        }
      </WebContainer>
    )
  }
}