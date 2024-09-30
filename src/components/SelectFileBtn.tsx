import { Flex } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineUpload } from 'react-icons/ai'

export const SelectFileBtn = ({ children }: {children: ReactNode}) => {
  const { t } = useTranslation()
  return (
    <label>
      <Flex direction='row' columnGap='2' alignItems='center' w='fit-content' py='2' px='4' cursor='pointer' border='1px solid #e2e8f0' color='' borderRadius='5' bgColor='white' _hover={{ borderColor: 'teal', color: 'teal'  }}>
        <AiOutlineUpload size='20' />
        {t('updateAvatar')}
        {children}
      </Flex>
    </label>
  )
}