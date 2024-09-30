import { Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { urlContact, urlFacebook, urlFaq, urlGuides, urlHowitworks, urlInstagram, urlLegal, urlPrivacy, urlTrips } from '../store/constantsStore'
import { FaInstagram, FaFacebook } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'


export const Footer = () => {
  const { t } = useTranslation()
  return (
    <footer>
      <Flex direction={{ base: 'column', md: 'row'}} columnGap='20' rowGap='3' bgColor='#373a49' color='white' p='8'>
        <Flex direction='column' textTransform='uppercase' gap='3' basis='25%' shrink='2'>
          <Link to={urlTrips}>{t('trips')}</Link>
          <Link to={urlGuides}>{t('guides')}</Link>
          <Link to={urlHowitworks}>{t('howItWorks')}</Link>
        </Flex>
        <Flex direction='column' textTransform='uppercase' gap='3' basis='25%' shrink='1'>
          <Link to={urlContact}>{t('contact')}</Link>
          <Link to={urlFaq}>{t('faq')}</Link>
        </Flex>
        <Flex direction='column' textTransform='uppercase' gap='3' basis='25%' shrink='1'>
          <Link to={urlPrivacy}>{t('privacity')}</Link>
          <Link to={urlLegal}>{t('termsAndConditions')}</Link>
        </Flex>
        <Flex direction='row' justify={{ base: 'start', md: 'end'}} gap='3' basis='25%' shrink='1'>
          <Link to={urlInstagram}><FaInstagram size='25'/></Link>
          <Link to={urlFacebook}><FaFacebook size='25'/></Link>
        </Flex>
      </Flex>
      <Flex justifyContent='center' py='2' px='8' bgGradient='linear(to-r, #566cd5, #009688)'/*  bgGradient='linear(to-r, #373a49, #ffd2ba)' */>
        <Text color='#d3efed'>© {t('cotravelers')} {new Date().getFullYear()}</Text>
      </Flex>
    </footer>
  )
}