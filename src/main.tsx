import { createRoot } from 'react-dom/client'
import { App } from './pages/App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import '@fontsource/source-sans-pro/400.css'
import '@fontsource/open-sans/700.css'
import { theme } from './assets/theme'

createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
)
