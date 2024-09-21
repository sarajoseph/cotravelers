import { Flex, Heading, Text } from '@chakra-ui/react'
import { WebContainer } from '../WebContainer'
import { FaRegSadCry } from 'react-icons/fa';


export const NotFound = ({errorMessage = 'Page not found'}: {errorMessage?: string}) => {
  return (
    <WebContainer>
      <Flex direction='column' alignItems='center' justifyContent='center' rowGap={2} h='80vh'>
        <FaRegSadCry size={70} />
        <Heading as='h1' fontSize='4xl'>Error 404</Heading>
        <Text>{errorMessage}</Text>
      </Flex>
    </WebContainer>
  )
}