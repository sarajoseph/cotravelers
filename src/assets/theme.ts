import { extendTheme } from '@chakra-ui/react'
import '@fontsource/open-sans'
import '@fontsource/source-sans-pro'
import '@fontsource-variable/lexend'

export const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Source Sans Pro', sans-serif`,
  },
  components: {
    Heading: {
      variants: {
        h1: {
          fontFamily: `'Lexend Variable', sans-serif`,
          fontWeight: '300',
          fontSize: {
            base: 'sm',
            lg: '4xl'
          }
        },
        h2: {
          textTransform: 'uppercase'
        },

      },
    },
    FormLabel: {
      variants: {
        profile: {
          fontFamily: `'Open Sans', sans-serif`,
          fontWeight: '700',
          fontSize: {
            base: 'sm',
          },
          textTransform: 'uppercase'
        }

      }
    }
  },
})