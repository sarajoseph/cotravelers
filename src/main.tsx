import { createRoot } from 'react-dom/client'
import { App } from './pages/App.tsx'
import { ChakraProvider } from '@chakra-ui/react'

createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
)
