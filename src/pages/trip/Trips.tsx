/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useTrip } from '../../hooks/useTrip'
import { WebContainer } from '../WebContainer'
import { Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Text, Image } from '@chakra-ui/react'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { NotFound } from '../common/NotFound'
import { urlTrip } from '../../store/constantsStore'
import { Link } from 'react-router-dom'
import { MdPlace } from 'react-icons/md'
import { IoMdPricetag } from 'react-icons/io'
import { FaRegCalendarDays } from 'react-icons/fa6'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { formatDate } from '../../global/logic'

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
        <Flex direction={{ base: 'column', lg: 'row' }} columnGap='8' rowGap='8' wrap='wrap'>
        {trips.map((trip: any) => {
          return (
          <Card key={trip.id} direction='column' w='100%' justifyContent='space-between' maxW={{base: '100%', lg: '30%'}}>
            <CardHeader>
              <Image
                src={trip.image}
                alt={trip.country}
                objectFit='cover'
                w='100%'
                h='200px'
                borderRadius='5'
              ></Image>
            </CardHeader>
            <CardBody py='0'>
              <Heading size='md'><Link to={urlTrip+trip.id}>{trip.title}</Link></Heading>
            </CardBody>
            <CardFooter>
              <Flex direction='column' rowGap='4' w='100%'>
                <Flex direction='row' columnGap='4' wrap='wrap'>
                  <Flex columnGap='1' alignItems='center'>
                    <MdPlace size='25' />{trip.country}
                  </Flex>
                  <Flex columnGap='1' alignItems='center'>
                  <IoMdPricetag size='25' />{trip.budget} €
                  </Flex>
                </Flex>
                <Flex alignItems='center' columnGap='2'>
                  <FaRegCalendarDays size='25' />
                  <Text textTransform='uppercase'>{formatDate(trip.date_from)}</Text>
                  <FaLongArrowAltRight size='15' />
                  <Text textTransform='uppercase'>{formatDate(trip.date_to)}</Text>
                </Flex>
                <Flex>
                  <Button as={Link} to={urlTrip+trip.id} w='100%' colorScheme='teal'>
                    See more
                  </Button>
                </Flex>
              </Flex>
            </CardFooter>
          </Card>
          )
        })}
        </Flex>
      </WebContainer>
    )
  }
}