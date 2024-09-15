import { ReactNode } from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/header/Header'
import { Container } from '@chakra-ui/react'

export const WebContainer = ({ children }: {children: ReactNode}) => {
  return (
    <Container maxW='container.lg'>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </Container>
  )
}