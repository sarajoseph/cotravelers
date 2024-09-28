import { Button, Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa'
import { MdPlace } from 'react-icons/md'
import { useTrip } from '../hooks/useTrip'

export const TripFinder = () => {
  const { getTripsByDateAndLocation } = useTrip()

  const handleFindTrip = async () => {
    const location = (document.getElementById('findLocation') as HTMLInputElement).value || ''
    const toDate = (document.getElementById('findDate') as HTMLInputElement).value || ''

    const { success, trips, errorMessage } = await getTripsByDateAndLocation(toDate, location)
    if (success) {
      console.log(trips)
    } else {
      console.log(errorMessage)
    }
  }
  return (
    <Flex bgColor='white' py='10' px='10' columnGap='5' rowGap='4' direction={{base: 'column', md: 'row'}}>
      <InputGroup size='lg' flex={{base: 'inherit', md: '2'}}>
        <InputLeftElement pointerEvents='none'>
          <MdPlace size='25' color='#cbcbcb' />
        </InputLeftElement>
        <Input placeholder='Anywhere' id='findLocation' />
      </InputGroup>
      <InputGroup size='lg' flex={{base: 'inherit', md: '2'}}>
        <InputLeftElement pointerEvents='none'>
          <FaCalendarAlt size='20' color='#cbcbcb' />
        </InputLeftElement>
        <Input placeholder='Anytime' id='findDate' />
      </InputGroup>
      <Button
        colorScheme='teal'
        flex={{base: 'inherit', md: '1'}}
        rightIcon={<FaArrowRight />}
        size='lg'
        onClick={handleFindTrip}
      >Find your trip</Button>
    </Flex>
  )
}