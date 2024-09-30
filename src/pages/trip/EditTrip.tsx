/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'react-router-dom'
import { WebContainer } from '../WebContainer'
import { Card, CardBody, CardHeader, Flex, Heading } from '@chakra-ui/react'
import { useTrip } from '../../hooks/useTrip'
import { useEffect, useState } from 'react'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { NotFound } from '../common/NotFound'
import { TripForm } from '../../components/forms/TripForm'
import { useTranslation } from 'react-i18next'

export const EditTrip = () => {
  const { t } = useTranslation()
  const { tripID } = useParams()
  const { getTrip } = useTrip()
  const [ currentTrip, setCurrentTrip ] = useState<{ [x: string]: any } | null>(null)
  const [ currentTripState, setCurrentTripState ] = useState<string>('loading')

  useEffect(() => {
    if (tripID) {
      const fetchTrip = async () => {
        const { success, trip, errorMessage } = await getTrip(tripID)
        if (success && trip){
          setCurrentTrip(trip)
          setCurrentTripState('success')
        } else {
          setCurrentTripState(errorMessage || 'error')
        }
      }
      fetchTrip()
    } else {
      setCurrentTripState('error')
    }

  }, [])
  if (currentTripState === 'loading') return <LoadingProfile />
  if (currentTripState !== 'success') return currentTripState !== 'error' ? <NotFound errorMessage={currentTripState} /> : <NotFound />
  if (currentTrip)
  return (
    <WebContainer>
      <Flex flexDirection='column' rowGap='5'>
        <Card>
          <CardHeader>
            <Heading variant='h2' as='h2' fontSize='xl'>{t('editTrip')}</Heading>
          </CardHeader>
          <CardBody>
            <TripForm oTrip={{...currentTrip, tripID}} />
          </CardBody>
        </Card>
      </Flex>
    </WebContainer>
  )
}