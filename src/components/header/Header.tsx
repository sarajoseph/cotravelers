import { Link } from 'react-router-dom'
import { UserMenu } from './UserMenu'
import { Flex, Heading, Img } from '@chakra-ui/react'

export const Header = () => {
  const logoUrl = '/images/icon.png'
  return (
    <header>
      <Flex direction='row' justify='space-between' py='4'>
        <Link to='/' dir='row'>
          <Flex direction='row' alignItems='center'>
            <Img
              src={logoUrl}
              borderRadius='full'
              boxSize='80px'
              alt='Cotravelers'
              >
            </Img>
            <Heading variant='h1' as='h1' pr='2'>Cotravelers</Heading>
          </Flex>
        </Link>
        <UserMenu />
      </Flex>
    </header>
  )
}