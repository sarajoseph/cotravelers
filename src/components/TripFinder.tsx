import { Box, Button, Divider, Flex, Input, InputGroup, InputLeftElement, Popover, PopoverBody, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa'
import { MdPlace } from 'react-icons/md'
import { useTripFinder } from '../hooks/useTripFinder'
import { useState } from 'react'
import { getMonthLastDay } from '../global/logic'
import { useTranslation } from 'react-i18next'

export const TripFinder = () => {
  const { t } = useTranslation()
  const { setDepartureMonths, handleFindTrip, handleClickDepartureMonth } = useTripFinder()
  const departureMonths = setDepartureMonths()
  const [ toDate, setToDate ] = useState<string>('')
  const [popoverIsOpen, setPopoverIsOpen] = useState(false)

  return (
    <Flex bgColor='white' py={{base: '4', md: '10'}} px={{base: '4', md: '10'}} columnGap='5' rowGap='4' direction={{base: 'column', md: 'row'}}>
      <InputGroup size='lg' flex={{base: 'inherit', md: '2'}}>
        <InputLeftElement pointerEvents='none'>
          <MdPlace size='25' color='#cbcbcb' />
        </InputLeftElement>
        <Input placeholder={t('anywhere')} id='findLocation' />
      </InputGroup>

      <Popover isOpen={popoverIsOpen} onClose={() => setPopoverIsOpen(false)} placement='bottom'>
        <PopoverTrigger>
          <InputGroup size='lg' flex={{base: 'inherit', md: '2'}} onClick={() => setPopoverIsOpen(true)}>
            <InputLeftElement pointerEvents='none'>
              <FaCalendarAlt size='20' color='#cbcbcb' />
            </InputLeftElement>
            <Input placeholder={t('anywhere')} id='findDate' isReadOnly />
          </InputGroup>
        </PopoverTrigger>
        <PopoverContent width={{base: 'xs', sm: 'md'}} px='4' py='4' bgColor='#fbfbfb' maxW='90%'>
          <PopoverBody>
            <Box>
              <Text textTransform='uppercase' fontWeight='bold' color='#939393'>{t('departureMonth')}</Text>
              <Divider mt='2' mb='4' />
              <Flex direction='row' gap='4' wrap='wrap'>
                {departureMonths.map((month: {monthNumber: number, monthName: string, year: number}) =>
                  <Flex
                    key={month.monthName+month.year}
                    onClick={() => {
                      handleClickDepartureMonth(month.monthName, month.year)
                      setToDate(month.year+'-'+month.monthNumber+'-'+getMonthLastDay(month.monthNumber, month.year))
                      setPopoverIsOpen(false)
                    }}
                    bgColor='white'
                    border='1px solid #dedede'
                    borderRadius='4'
                    padding='4'
                    direction='column'
                    width={{base: '100%', sm: '30%'}}
                    flex={{base: '1', sm: 'inherit'}}
                    cursor='pointer'
                    _hover={{border: '1px solid teal', color: 'teal'}}
                  >
                    <Text fontSize='sm' fontWeight='bold'>{month.monthName}</Text>
                    <Text fontSize='md'>{month.year}</Text>
                  </Flex>
                )}
              </Flex>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <Button
        colorScheme='teal'
        flex={{base: 'inherit', md: '1'}}
        rightIcon={<FaArrowRight />}
        size='lg'
        onClick={() => handleFindTrip(toDate)}
      >{t('findYourTrip')}</Button>
    </Flex>
  )
}