import { WebContainer } from '../WebContainer'
import { Card, CardBody, CardHeader, Flex, Heading } from '@chakra-ui/react'
import { TripForm } from '../../components/forms/TripForm'

export const CreateTrip = () => {
  return (
    <WebContainer>
      <Flex flexDirection='column' rowGap='5'>
        <Card>
          <CardHeader>
            <Heading variant='h2' as='h2' fontSize='xl'>Create trip</Heading>
          </CardHeader>
          <CardBody>
            <TripForm />
          </CardBody>
        </Card>
      </Flex>
    </WebContainer>
  )
}