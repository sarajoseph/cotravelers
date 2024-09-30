import { Link } from 'react-router-dom'
import { UserMenu } from './UserMenu'
import { Container, Flex, Heading, Img } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const Header = () => {
  const { t } = useTranslation()
  const logoUrl = '/images/icon.png'
  return (
    <header className='bg-white'>
      <Container maxW='container.lg'>
        <Flex direction='row' justify='space-between' py='4' alignItems='center'>
          <Link to='/' dir='row'>
            <Flex direction='row' alignItems='center'>
              <Img
                src={logoUrl}
                borderRadius='full'
                boxSize='80px'
                alt={t('cotravelers')}
                >
              </Img>
              <Heading variant='h1' as='h1' pr='2'>{t('cotravelers')}</Heading>
            </Flex>
          </Link>
          <UserMenu />
        </Flex>
      </Container>
    </header>
  )
}