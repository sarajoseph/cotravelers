import { ReactNode } from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/header/Header'
import { Box, Container } from '@chakra-ui/react'
import { ScrollToTop } from '../components/ScrollToTop'
import { useUserStore } from '../store/userStore'
import { AdminPanel } from '../components/AdminPanel'

export const WebContainer = ({ children }: {children: ReactNode}) => {
  const user = useUserStore((state) => ({
    username: state.username,
    type: state.type,
  }))
  return (
    <Box bgColor='#efefef'>
      <ScrollToTop />
      <Header />
      <Container maxW='container.lg' my='10'>
        <main className='min-h-screen'>
          {children}
        </main>
      </Container>
      <Footer />
      {user.type === 'admin' &&
        <AdminPanel />
      }
    </Box>
  )
}