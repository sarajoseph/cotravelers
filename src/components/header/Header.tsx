import { Link } from 'react-router-dom'
import { UserMenu } from './UserMenu'
import { Flex, Heading, Icon } from '@chakra-ui/react'
import { FaRegPaperPlane } from 'react-icons/fa'
import { BiWorld } from 'react-icons/bi'

export const Header = () => {
  return (
    <header>
      <Flex direction='row' justify='space-between' py='4'>
        <Link to='/' dir='row'>
          <Flex direction='row'>
            <Heading variant='h1' as='h1' pr='2'>Cotravelers</Heading>
            <FaRegPaperPlane />
            <Icon as={BiWorld} fontSize={{base: '35px', lg: '45px'}} />
          </Flex>
        </Link>
        <UserMenu />
      </Flex>
    </header>
  )
}