/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebContainer } from '../WebContainer'
import { Avatar, Box, Card, CardBody, CardHeader, Flex, Heading, Text, Link as ChakraLink, AvatarGroup, Button, Image, useToast, Tag, TagLabel, TagLeftIcon, useDisclosure } from '@chakra-ui/react'
import { useParams, Link as ReactRouterLink } from 'react-router-dom'
import { useTrip } from '../../hooks/useTrip'
import { useEffect, useRef, useState } from 'react'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { NotFound } from '../common/NotFound'
import { Verified } from '../../components/icons/Verified'
import { MdErrorOutline, MdPlace } from 'react-icons/md'
import { IoTime } from 'react-icons/io5'
import { IoIosPeople, IoMdPricetag } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { FaRegCalendarDays } from 'react-icons/fa6'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { urlProfile, urlEditTrip } from '../../store/constantsStore'
import { formatDate } from '../../global/logic'
import { useUserStore } from '../../store/userStore'
import { CancelTripModal } from '../../components/modals/CancelTripModal'

export const Trip = () => {
  const { tripID } = useParams()
  const { getTrip, joinTrip, leaveTrip } = useTrip()
  const navigate = useNavigate()
  const toast = useToast()
  const user = useUserStore((state) => ({uid: state.uid}))
  const userID = user.uid
  const iconColor = '#52c3cf'
  const [ currentTrip, setCurrentTrip ] = useState<{ [x: string]: any } | null>(null)
  const [ currentTripState, setCurrentTripState ] = useState<string>('loading')
  const [ userJoinTrip, setUserJoinTrip ] = useState<boolean>(false)
  const [ joinIsLoading, setJoinIsLoading ] = useState<boolean>(false)

  useEffect(() => {
    if (tripID) {
      const fetchTrip = async () => {
        const { success, trip, errorMessage } = await getTrip(tripID)
        if (success && trip){
          setCurrentTrip(trip)
          setCurrentTripState('success')
          const travellerFound = trip.travelers.find((traveler: {username: string, avatar: string, uid: string}) => traveler.uid === userID)
          setUserJoinTrip(travellerFound !== undefined)
        } else {
          setCurrentTripState(errorMessage || 'error')
        }
      }
      fetchTrip()
    } else {
      setCurrentTripState('error')
    }

  }, [])

  const calcTripDays = (iniDateStr: string, endDateStr: string) => {
    const iniDate = new Date(iniDateStr)
    const endDate = new Date(endDateStr)

    // Calcular la diferencia en milisegundos
    const diffMs = endDate.getTime() - iniDate.getTime()

    // Convertir la diferencia a días (1 día = 86400000 ms)
    const days = diffMs / (1000 * 60 * 60 * 24)

    return days
  }

  const handleEditTrip = () => {
    navigate(urlEditTrip+tripID)
  }

  const handleJoinTrip = async () => {
    if (!tripID) return
    setJoinIsLoading(true)
    const { success, errorMessage } = await joinTrip(tripID)
    if (success) {
      navigate(0)
    } else {
      toast({
        title: 'Ooops!',
        description: errorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    setJoinIsLoading(false)
  }

  const handleLeaveTrip = async () => {
    if (!tripID) return
    setJoinIsLoading(true)
    const { success, errorMessage } = await leaveTrip(tripID)
    if (success) {
      navigate(0)
    } else {
      toast({
        title: 'Ooops!',
        description: errorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    setJoinIsLoading(false)
  }

  const modalCancelTrip = useDisclosure()
  const cancelRef = useRef()

  if (currentTripState === 'loading') return <LoadingProfile />
  if (currentTripState !== 'success') return currentTripState !== 'error' ? <NotFound errorMessage={currentTripState} /> : <NotFound />
  if (currentTrip && tripID)
    return (
      <WebContainer>
        <Flex flexDirection='column' rowGap='5'>
          <Card>
            <CardHeader pb='0'>
              <Image
                src={currentTrip.image}
                alt={currentTrip.country}
                objectFit='cover'
                objectPosition='bottom'
                w='100%'
                h={{base: '200px', md: '400px'}}
                mb='4'
                borderRadius='10'
              ></Image>
              <Heading variant='h2' as='h2' fontSize='xl'>{currentTrip.title}</Heading>
            </CardHeader>
            <CardBody>
              <Flex direction={{ base: 'column', md: 'row'}} justifyContent={{ base: 'start', md: 'space-between'}}  rowGap='4'>
                <Flex direction={{ base: 'column', md: 'row'}} columnGap='2' rowGap='2' alignItems={{ base: 'starts', md:'center'}}>
                  <Text>Created by </Text>
                  <Flex columnGap='2' alignItems='center'>
                    <Avatar
                      name={currentTrip.author_username}
                      src={currentTrip.author_avatar}
                      size='md'
                    />
                    <Flex columnGap='1'>
                      <ChakraLink
                        as={ReactRouterLink}
                        to={urlProfile+currentTrip.author_uid}
                        fontSize='md'
                        fontWeight='bold'
                      >@{currentTrip.author_username}</ChakraLink>
                      {currentTrip.author_verified && <Verified />}
                    </Flex>
                  </Flex>
                </Flex>
                <Flex columnGap='4' rowGap='2' direction={{base: 'column', md: 'row'}}>
                  {currentTrip.travelers.length >= currentTrip.spots && !currentTrip.cancelled &&
                  <Tag size='lg' colorScheme='pink'>
                    <TagLeftIcon fontSize='20' as={MdErrorOutline} />
                    <TagLabel>No spots available</TagLabel>
                  </Tag>
                  }
                  {currentTrip.cancelled &&
                  <Tag size='lg' colorScheme='gray'>
                    <TagLeftIcon fontSize='20' as={MdErrorOutline} />
                    <TagLabel>Trip cancelled</TagLabel>
                  </Tag>
                  }
                  {userID !== currentTrip.author_uid && !currentTrip.cancelled && currentTrip.travelers.length < currentTrip.spots && !userJoinTrip &&
                  <Button onClick={handleJoinTrip} colorScheme='teal' w={{ base: '100%', md: 'auto'}} h={{base: '10', md: '100%'}} isLoading={joinIsLoading}>Join trip</Button>
                  }
                  {userID !== currentTrip.author_uid && !currentTrip.cancelled && userJoinTrip &&
                  <Button onClick={handleLeaveTrip} colorScheme='teal' w={{ base: '100%', md: 'auto'}} h={{base: '10', md: '100%'}} isLoading={joinIsLoading}>Leave trip</Button>
                  }
                  {userID === currentTrip.author_uid && !currentTrip.cancelled &&
                  <>
                  <Button onClick={handleEditTrip} colorScheme='teal' w={{ base: '100%', md: 'auto'}} h={{base: '10', md: '100%'}}>Edit trip</Button>
                  <Button onClick={modalCancelTrip.onOpen} colorScheme='red' w={{ base: '100%', md: 'auto'}} h={{base: '10', md: '100%'}}>Cancel trip</Button>
                  </>}
                </Flex>
              </Flex>
              <Flex
                direction={{ base: 'column', md: 'row'}}
                wrap='wrap'
                columnGap='8'
                rowGap='4'
                alignItems={{ base: 'start', md: 'center'}}
                mt={{base: '10', md: '4'}}
                fontSize='18'
              >
                <Flex columnGap='1' alignItems='center'>
                  <MdPlace size='25' color={iconColor} />
                  {currentTrip.country}
                </Flex>
                <Flex columnGap='1' alignItems='center'>
                  <IoTime size='25' color={iconColor} />
                  { calcTripDays(currentTrip.date_from, currentTrip.date_to) } days
                </Flex>
                <Flex columnGap='1' alignItems='center'>
                  <IoIosPeople size='30' color={iconColor} />
                  { currentTrip.spots } spots
                </Flex>
                <Flex columnGap='1' alignItems='center'>
                  <IoMdPricetag size='25' color={iconColor} />
                  { currentTrip.budget } €
                </Flex>
              </Flex>
              <Flex flexDirection='column' rowGap='5' mt='7'>
                <Flex alignItems='center' columnGap='2'>
                  <FaRegCalendarDays size='25' />
                  <Text textTransform='uppercase'>{formatDate(currentTrip.date_from)}</Text>
                  <FaLongArrowAltRight size='15' />
                  <Text textTransform='uppercase'>{formatDate(currentTrip.date_to)}</Text>
                </Flex>
              </Flex>
              <Flex flexDirection='column' rowGap='5' mt='10'>
                <Box>
                  <Heading as='h3' size='xs' textTransform='uppercase' mb={3}>
                    Description
                  </Heading>
                  <Text>
                    {currentTrip.description}
                  </Text>
                </Box>
              </Flex>
              <Flex flexDirection='column' rowGap='5' mt='10'>
                <Box>
                  <Heading as='h3' size='xs' textTransform='uppercase' mb={3}>
                    Cotravelers
                  </Heading>
                  <AvatarGroup size='md' max={2}>
                    {currentTrip.travelers.map((traveler: any) => {
                      return (
                        <Avatar
                          key={traveler.uid}
                          name={traveler.username}
                          src={traveler.avatar}
                          onClick={() => {
                            navigate(urlProfile+traveler.uid)
                          }}
                          cursor='pointer'
                        />
                      )
                    })}
                  </AvatarGroup>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </Flex>
        <CancelTripModal
          tripID={tripID}
          isOpen={modalCancelTrip.isOpen}
          cancelRef={cancelRef}
          onClose={modalCancelTrip.onClose}
         />
      </WebContainer>
    )
}