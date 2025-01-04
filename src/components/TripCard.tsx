/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardHeader, CardBody, Heading, CardFooter, Flex, Button, Image, Text, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { FaRegCalendarDays } from 'react-icons/fa6'
import { IoMdPricetag } from 'react-icons/io'
import { MdBolt, MdPlace } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { formatDate } from '../global/logic'
import { urlTrip } from '../store/constantsStore'
import { useTranslation } from 'react-i18next'

export const TripCard = ({trip, isSlide = false}: {trip: any, isSlide?: boolean}) => {
  const { t } = useTranslation()
  const isPastTrip = new Date(trip.date_from) < new Date() ? true : false
  const areSpotsTrip = trip.travelers.length < trip.spots ? true : false
  const totalAvailableSpots = trip.spots - trip.travelers.length
  const almostFull = totalAvailableSpots > 1 && totalAvailableSpots < 6
  return (
    <Card
      as={Link}
      to={urlTrip + trip.id}
      key={trip.id}
      direction='column'
      w='100%'
      justifyContent='space-between'
      maxW={isSlide ? '100%' : {base: '100%', lg: '30%'}}
      cursor='pointer'
    >
      <CardHeader position='relative' overflow='hidden'>
        {
          !isPastTrip && !areSpotsTrip &&
          <Flex position='absolute' top='0' right='0'>
            <Tag
              size='lg'
              color='white'
              background='linear-gradient(90deg, #ffcbb3, #e50015)'
              borderRadius='none'
              borderBottomLeftRadius='10'
              borderTopRightRadius='5'
            >
              <TagLeftIcon fontSize='20' as={MdBolt} />
              <TagLabel fontWeight='bold' textTransform='uppercase'>{t('full')}</TagLabel>
            </Tag>
          </Flex>
        }
        {
          !isPastTrip && totalAvailableSpots === 1 &&
          <Flex position='absolute' top='0' right='0'>
            <Tag
              size='lg'
              color='white'
              background='linear-gradient(90deg, #8b4dcf, #ff685d)'
              borderRadius='none'
              borderBottomLeftRadius='10'
              borderTopRightRadius='5'
            >
              <TagLeftIcon fontSize='20' as={MdBolt} />
              <TagLabel fontWeight='bold' textTransform='uppercase'>1 {t('spotLeft')}</TagLabel>
            </Tag>
          </Flex>
        }
        {
          !isPastTrip && almostFull &&
          <Flex position='absolute' top='0' right='0'>
            <Tag
              size='lg'
              color='white'
              background='linear-gradient(90deg, #8b4dcf, #6ab3dd)'
              borderRadius='none'
              borderBottomLeftRadius='10'
              borderTopRightRadius='5'
            >
              <TagLeftIcon fontSize='20' as={MdBolt} />
              <TagLabel fontWeight='bold' textTransform='uppercase'>{t('almostFull')}</TagLabel>
            </Tag>
          </Flex>
        }
        <Image
          src={trip.image}
          alt={trip.country}
          objectFit='cover'
          w='100%'
          h='200px'
          borderRadius='5'
          filter={isPastTrip ? 'grayscale(100%)' : 'none'}
        ></Image>
      </CardHeader>
      <CardBody py='0'>
        <Heading size='md' _hover={{ color: 'teal.600', cursor: 'pointer' }}>
          {!isSlide && trip.title}
          {isSlide && <Text isTruncated noOfLines={1} maxW='100%' display='block'>{trip.title}</Text>}
        </Heading>
      </CardBody>
      <CardFooter>
        <Flex direction='column' rowGap='4' w='100%'>
          <Flex direction='row' columnGap='4' wrap='wrap'>
            <Flex columnGap='1' alignItems='center'>
              <MdPlace size='25' />{trip.country}
            </Flex>
            {!isSlide &&
            <Flex columnGap='1' alignItems='center'>
              <IoMdPricetag size='25' />{trip.budget} €
            </Flex>
            }
          </Flex>
          <Flex alignItems='center' columnGap='2'>
            <FaRegCalendarDays size='25' />
            <Text textTransform='uppercase'>{formatDate(trip.date_from)}</Text>
            <FaLongArrowAltRight size='15' />
            <Text textTransform='uppercase'>{formatDate(trip.date_to)}</Text>
          </Flex>
          {!isPastTrip &&
          <Flex>
            <Button as={Link} to={urlTrip+trip.id} w='100%' colorScheme='teal'>
            {t('seeMore')}
            </Button>
          </Flex>
          }
        </Flex>
      </CardFooter>
    </Card>
  )
}