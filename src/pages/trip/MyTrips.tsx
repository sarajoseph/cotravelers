/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { WebContainer } from '../WebContainer'
import { Box, Divider, Flex, Heading, Text, Link as ChakraLink } from '@chakra-ui/react'
import { useTrip } from '../../hooks/useTrip'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { NotFound } from '../common/NotFound'
import { TripCard } from '../../components/TripCard'
import { Link as RouterLink } from 'react-router-dom'
import { urlTrips } from '../../store/constantsStore'
import { sortByDateFrom } from '../../global/logic'
import { useTranslation } from 'react-i18next'

export const MyTrips = () => {
  const { t } = useTranslation()
  const user = useUserStore((state) => ({uid: state.uid}))
  const userID = user.uid
  const { getTripsByUserID } = useTrip()
  const [ myTrips, setMyTrips ] = useState<{ [x: string]: any } | null>(null)
  const [ myTripsState, setMyTripsState ] = useState<string>('loading')

  useEffect(() => {
    if (userID) {
      setMyTripsState('loading')
      const fetchProfile = async () => {
        const { success, userTrips, errorMessage } = await getTripsByUserID(userID)
        if (success){
          setMyTrips(userTrips || null)
          setMyTripsState('success')
        } else {
          setMyTripsState(errorMessage || 'error')
        }
      }
      fetchProfile()
    } else {
      setMyTripsState('error')
    }
  }, [])

  if (myTripsState === 'loading') return <LoadingProfile />
  if (myTripsState !== 'success') return myTripsState !== 'error' ? <NotFound errorMessage={myTripsState} /> : <NotFound />
  const authorTrips = !myTrips ? null : myTrips.filter((trip: any) => (trip.author_uid === userID) && new Date(trip.date_from) >= new Date() && !trip.cancelled).sort((a: any, b: any) => sortByDateFrom(a.date_from, b.date_from))
  const otherTrips = !myTrips ? null : myTrips.filter((trip: any) => (trip.author_uid !== userID) && new Date(trip.date_from) >= new Date() && !trip.cancelled).sort((a: any, b: any) => sortByDateFrom(a.date_from, b.date_from))
  const myPastTrips = !myTrips ? null : myTrips.filter((trip: any) => new Date(trip.date_from) < new Date() && !trip.cancelled).sort((a: any, b: any) => sortByDateFrom(a.date_from, b.date_from))
  const authorTripsExist = (authorTrips && authorTrips.length > 0) ? true : false
  const otherTripsExist = (otherTrips && otherTrips.length > 0) ? true : false
  const myPastTripsExist = (myPastTrips && myPastTrips.length > 0) ? true : false

  return (
    <WebContainer>
      <Heading mb='8'>{t('myTrips')}</Heading>
      {!myTrips &&
      <Text fontSize='lg' textAlign='center'>
        {t('youDontHaveTripsYet')}<br/>
        {t('goTo')} <ChakraLink as={RouterLink} to={urlTrips} color='cyan.600'> {t('tripsPage')}</ChakraLink>
      </Text>
      }

      {authorTripsExist &&
      <Box>
        {otherTripsExist && authorTripsExist &&
        <Heading as='h3' fontSize='3xl' mb='8'>{t('tripsYouHaveCreated')}</Heading>}
        <Flex direction={{ base: 'column', lg: 'row' }} columnGap='8' rowGap='8' wrap='wrap'>
        {authorTrips.map((trip: any) => {
          return <TripCard key={trip.id} trip={trip} />
        })}
        </Flex>
      </Box>
      }

      {otherTripsExist && authorTripsExist &&
        <Divider p='8' />
      }

      {otherTripsExist &&
      <Box>
        {otherTripsExist && authorTripsExist &&
        <Heading as='h3' fontSize='3xl' mb='8'>{t('yourTripsCreatedByOthers')}</Heading>}
        <Flex direction={{ base: 'column', lg: 'row' }} columnGap='8' rowGap='8' wrap='wrap'>
        {otherTrips.map((trip: any) => {
          return <TripCard key={trip.id} trip={trip} />
        })}
        </Flex>
      </Box>
      }

      {myPastTripsExist && (otherTripsExist || authorTripsExist) &&
        <Divider p='8' />
      }

      {myPastTripsExist &&
      <Box>
        <Heading as='h3' fontSize='3xl' mb='8'>{t('yourTripsFromThePast')}</Heading>
        <Flex direction={{ base: 'column', lg: 'row' }} columnGap='8' rowGap='8' wrap='wrap'>
        {myPastTrips.map((trip: any) => {
          return <TripCard key={trip.id} trip={trip} />
        })}
        </Flex>
      </Box>
      }
    </WebContainer>
  )

}