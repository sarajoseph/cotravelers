import { ReactNode } from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/header/Header'
import { Box, Container } from '@chakra-ui/react'

export const WebContainer = ({ children }: {children: ReactNode}) => {
  return (
    <Box bgColor='#efefef'>
      <Header />
      <Container maxW='container.lg' my='10'>
        <main className='min-h-screen'>
          {children}
        </main>
      </Container>
      <Footer />
    </Box>
  )
}