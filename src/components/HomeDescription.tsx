import { Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const HomeDescription = () => {
  const { t } = useTranslation()
  return (
    <Flex py='12'>
      <Text fontSize='xl'>
      {t('homeDescription')}
      </Text>
    </Flex>
  )
}