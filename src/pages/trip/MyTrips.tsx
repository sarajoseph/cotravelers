/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { WebContainer } from '../WebContainer'
import { Box, Divider, Flex, Heading, Text, Link as ChakraLink } from '@chakra-ui/react'
import { useTrip } from '../../hooks/useTrip'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { NotFound } from '../common/NotFound'
import { TripsList } from '../../components/TripsList'
import { Link as RouterLink } from 'react-router-dom'
import { urlTrips } from '../../store/constantsStore'

export const MyTrips = () => {
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
        if (success && userTrips){
          setMyTrips(userTrips)
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
  if (myTrips) {
    const authorTrips = myTrips.filter((trip: any) => trip.author_uid === userID)
    const otherTrips = myTrips.filter((trip: any) => trip.author_uid !== userID)
    const authorTripsExist = (authorTrips && authorTrips.length > 0) ? true : false
    const otherTripsExist = (otherTrips && otherTrips.length > 0) ? true : false

    return (
      <WebContainer>
        <Heading mb='8'>My trips</Heading>
        {myTrips.length === 0 &&
        <Text fontSize='lg' textAlign='center'>
          You don't have trips yet<br/>
          Go to <ChakraLink as={RouterLink} to={urlTrips} color='cyan.600'> trips page</ChakraLink>
        </Text>
        }

        {authorTripsExist &&
        <Box>
          {otherTripsExist && authorTripsExist &&
          <Heading as='h3' fontSize='3xl' mb='8'>Trips you have created</Heading>}
          <Flex direction={{ base: 'column', lg: 'row' }} columnGap='8' rowGap='8' wrap='wrap'>
          {authorTrips.map((trip: any) => {
            return <TripsList key={trip.id} trip={trip} />
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
          <Heading as='h3' fontSize='3xl' mb='8'>Your trips created by others</Heading>}
          <Flex direction={{ base: 'column', lg: 'row' }} columnGap='8' rowGap='8' wrap='wrap'>
          {otherTrips.map((trip: any) => {
            return <TripsList key={trip.id} trip={trip} />
          })}
          </Flex>
        </Box>
        }
      </WebContainer>
    )
  }
}