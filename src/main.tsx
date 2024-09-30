import { createRoot } from 'react-dom/client'
import { App } from './pages/App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import '@fontsource/source-sans-pro/400.css'
import '@fontsource/open-sans/700.css'
import { theme } from './assets/theme'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from '../public/locales/en/translation.json'
import translationES from '../public/locales/es/translation.json'

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    es: { translation: translationES }
  },
  lng: 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false
  }
})

createRoot(document.getElementById('root') as HTMLElement).render(
  <I18nextProvider i18n={i18next}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </I18nextProvider>
)
