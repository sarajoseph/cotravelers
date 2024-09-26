/* eslint-disable @typescript-eslint/no-explicit-any */
import { SwiperSlide } from 'swiper/react'
import { SwiperCarousel } from '../../components/SwiperCarousel'
import { WebContainer } from '../WebContainer'
import { useTrip } from '../../hooks/useTrip'
import { useEffect, useState } from 'react'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { NotFound } from './NotFound'
import { TripSlide } from '../../components/TripSlide'
import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import { Loading } from '../../components/icons/Loading'
import { Link } from 'react-router-dom'
import { urlTrips } from '../../store/constantsStore'
import { ArrowForwardIcon } from '@chakra-ui/icons'

export const Home = () => {
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
        setAllTrips(trips)
        setAllTripsState('success')
        const nextTrips = [...trips]
        nextTrips.sort((a: any, b: any) => new Date(a.date_from).getTime() - new Date(b.date_from).getTime())
        setNextTrips(nextTrips.slice(0, 9))
        setNextTripsState('success')
        const lastTrips = [...trips]
        lastTrips.sort((a: any, b: any) => a.date_from - b.date_from)
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
        {nextTripsState === 'loading' && <Loading /> }
        {nextTrips &&
        <Box mb='16'>
          <Heading fontSize='3xl' mb='4'>Next trips</Heading>
          <SwiperCarousel>
            {nextTrips.map((trip: any) => {
              return (
              <SwiperSlide key={trip.id}>
                <TripSlide trip={trip} />
              </SwiperSlide>
              )
            })}
          </SwiperCarousel>
          <Flex alignItems='center' justifyContent='center' pt='6'>
            <Button as={Link} to={urlTrips} size='lg' colorScheme='teal' variant='outline' rightIcon={<ArrowForwardIcon />}>See all trips</Button>
          </Flex>
        </Box>
        }
        {lastTripsState === 'loading' && <Loading /> }
        {lastTrips &&
        <Box mb='16'>
          <Heading fontSize='3xl' mb='4'>Latest published trips</Heading>
          <SwiperCarousel>
            {lastTrips.map((trip: any) => {
              return (
              <SwiperSlide key={trip.id}>
                <TripSlide trip={trip} />
              </SwiperSlide>
              )
            })}
          </SwiperCarousel>
          <Flex alignItems='center' justifyContent='center' pt='6'>
            <Button as={Link} to={urlTrips} size='lg' colorScheme='teal' variant='outline' rightIcon={<ArrowForwardIcon />}>See all trips</Button>
          </Flex>
        </Box>
        }
      </WebContainer>
    )
  }
}