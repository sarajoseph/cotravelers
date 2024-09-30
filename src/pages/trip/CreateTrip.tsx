import { WebContainer } from '../WebContainer'
import { Card, CardBody, CardHeader, Flex, Heading } from '@chakra-ui/react'
import { TripForm } from '../../components/forms/TripForm'
import { useTranslation } from 'react-i18next'

export const CreateTrip = () => {
  const { t } = useTranslation()
  return (
    <WebContainer>
      <Flex flexDirection='column' rowGap='5'>
        <Card>
          <CardHeader>
            <Heading variant='h2' as='h2' fontSize='xl'>{t('createTrip')}</Heading>
          </CardHeader>
          <CardBody>
            <TripForm />
          </CardBody>
        </Card>
      </Flex>
    </WebContainer>
  )
}