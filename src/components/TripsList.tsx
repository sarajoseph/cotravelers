/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardHeader, CardBody, Heading, CardFooter, Flex, Button, Image, Text } from '@chakra-ui/react'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { FaRegCalendarDays } from 'react-icons/fa6'
import { IoMdPricetag } from 'react-icons/io'
import { MdPlace } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { formatDate } from '../global/logic'
import { urlTrip } from '../store/constantsStore'

export const TripsList = ({trip}: {trip: any}) => {
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
}