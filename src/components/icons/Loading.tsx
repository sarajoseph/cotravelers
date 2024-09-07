import { Flex, Spinner } from '@chakra-ui/react'

export const Loading = ({ height='100vh', size='xl', align='center', justify='center' }: { height?: string, size?: string, align?: string, justify?: string }) => {
  return (
    <Flex h={height} alignItems={align} justifyContent={justify}>
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='teal.500'
        size={size}
      />
    </Flex>
  )
}