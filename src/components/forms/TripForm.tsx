/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Textarea, useToast } from '@chakra-ui/react'
import countriesJson from '../../assets/countries.geo.json'
import { useState } from 'react'
import { currentCoin, urlTrip } from '../../store/constantsStore'
import { useNavigate } from 'react-router-dom'
import { useTrip } from '../../hooks/useTrip'

export const TripForm = ({oTrip}: {oTrip?: {[x: string]: any}}) => {
  const { createTrip, editTrip } = useTrip()
  const navigate = useNavigate()
  const toast = useToast()
  const countries = countriesJson.features.map(feature => feature.properties.name)
  const [ selectedCountry, setSelectedCountry ] = useState<string>(oTrip?.country || '')
  const [ fromDate, setFromDate ] = useState<string>(oTrip?.date_from || '')
  const [ toDate, setToDate ] = useState<string>(oTrip?.date_to || '')
  const [ spots, setSpots ] = useState<number>(oTrip?.spots || 0)
  const initBudget = oTrip?.budget || '0.00'
  const [ budgetValue, setBudgetValue ] = useState<string>(initBudget)
  const [ title, setTitle ] = useState<string>(oTrip?.title || '')
  const [ description, setDescription ] = useState<string>(oTrip?.description || '')
  const [ userHostID ] = useState<string>(oTrip?.user_host_id || '')
  const [ travelers ] = useState<string>(oTrip?.travelers || '')
  const [ tripID ] = useState<string>(oTrip?.tripID || '')
  const [ isFocus, setIsFocus ] = useState<boolean>(false)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  // If "From date" is previous than "To date" is incorrect
  const areInvalidDates: boolean = (fromDate && toDate && new Date(fromDate) > new Date(toDate)) ? true : false

  // Dates cannot be previous than today
  const today = new Date().toISOString().split('T')[0]
  const isFromDatePreviousToday: boolean = (fromDate && new Date(fromDate) < new Date(today)) ? true : false
  const isToDatePreviousToday: boolean = (toDate && new Date(toDate) < new Date(today)) ? true : false

  // When input loses focus
  const handleBlur = (value: string) => {
    setIsFocus(false)
    setTimeout(() => {
      const numberValue = parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      setBudgetValue(numberValue === 'NaN' ? initBudget : numberValue)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (areInvalidDates || isFromDatePreviousToday || isToDatePreviousToday) return
    setIsLoading(true)

    if (oTrip) {
      const tripData = {
        selectedCountry,
        fromDate,
        toDate,
        budgetValue,
        spots,
        title,
        description,
        tripID,
        userHostID,
        travelers
      }

      const { success, errorMessage} = await editTrip(tripData)
      if (success){
        navigate(urlTrip+tripID)

      } else {
        toast({
          title: 'Ooops!',
          description: errorMessage,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }

    } else {

      const tripData = {
        selectedCountry,
        fromDate,
        toDate,
        budgetValue,
        spots,
        title,
        description
      }

      const { success, tripID, errorMessage} = await createTrip(tripData)
      if (success){
        navigate(urlTrip+tripID)

      } else {
        toast({
          title: 'Ooops!',
          description: errorMessage,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
    }


    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction={{ base: 'column', md: 'row'}} wrap='wrap' columnGap='4' rowGap='4' mb='4'>
        <FormControl w={{ base: '100%', md: 'auto'}} isRequired>
          <FormLabel variant='profile'>Country</FormLabel>
          <Select
            size='md'
            placeholder='Select the country'
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
          </Select>
        </FormControl>
        <FormControl w={{ base: '100%', md: 'auto'}} isRequired isInvalid={areInvalidDates || isFromDatePreviousToday}>
          <FormLabel variant='profile'>From</FormLabel>
          <Input
            size='md'
            type='date'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            min={today}
          />
          {areInvalidDates && (
            <FormErrorMessage>"From" date cannot be later than "To" date.</FormErrorMessage>
          )}
          {isFromDatePreviousToday && (
            <FormErrorMessage>"From" date cannot be previous than today.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl w={{ base: '100%', md: 'auto'}} isRequired isInvalid={areInvalidDates || isToDatePreviousToday}>
          <FormLabel variant='profile'>To</FormLabel>
          <Input
            size='md'
            type='date'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || today}
          />
          {areInvalidDates && (
            <FormErrorMessage>"To" date cannot be previous than "From" date.</FormErrorMessage>
          )}
          {isToDatePreviousToday && (
            <FormErrorMessage>"To" date cannot be previous than today.</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
      <Flex direction={{ base: 'column', md: 'row'}} wrap='wrap' columnGap='4' rowGap='4' mb='8'>
        <FormControl w={{ base: '100%', md: 'auto'}} maxW={{ base: '100%', md: '10%'}} isRequired>
          <FormLabel variant='profile'>Spots</FormLabel>
          <NumberInput
            size='md'
            max={100}
            step={1}
            precision={0}
            value={spots}
            onChange={(valueAsString) => setSpots(Number(valueAsString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl w={{ base: '100%', md: 'auto'}} maxW={{ base: '100%', md: '15%'}} isRequired>
          <FormLabel variant='profile'>Budget</FormLabel>
          <InputGroup>
            <NumberInput
              size='md'
              value={budgetValue}
              onChange={(valueAsString) => isFocus && setBudgetValue(valueAsString)}
              onBlur={(e) => handleBlur(e.target.value)}
              onFocus={() => setIsFocus(true)}
              max={5000}
              min={0}
              precision={2}
            >
              <NumberInputField />
            </NumberInput>
            <InputRightElement pointerEvents='none' borderLeft='1px solid #e2e8f0'>
              {currentCoin}
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Flex>
      <FormControl mb='8' isRequired>
        <FormLabel variant='profile'>Title</FormLabel>
        <Input
          size='md'
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormControl>
      <FormControl mb='8' isRequired>
        <Flex alignItems='center'>
          <FormLabel variant='profile'>Description</FormLabel>
        </Flex>
        <Textarea
          placeholder='Description of the trip here...'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>
      <Flex justify={{ base: 'center', md: 'end' }}>
        <Button
          type='submit'
          colorScheme='teal'
          width={{ base: '100%', md: 'auto' }}
          minW='150px'
          isLoading={isLoading}
        >{oTrip ? 'Save' : 'Post'}</Button>
      </Flex>
    </form>
  )
}