import { useRef } from 'react'
import { useResetPassword } from '../../hooks/useResetPassword'
import { EmailField } from '../forms/FormFields'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  AlertIcon,
  Alert,
  Heading
} from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { handleCloseAndOpenModal, handleCloseModal } from '../../global/logic'
import { useTranslation } from 'react-i18next'

export const ResetPassword = ({isOpen, onClose, openLoginModal, openSignupModal}: {isOpen: boolean, onClose: () => void, openLoginModal: () => void, openSignupModal: () => void}) => {
  const { t } = useTranslation()
  const { resetPassword, isSuccess, isLoading, isError, errorMessage, initializeStates } = useResetPassword()
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const closeModal = () => {
    handleCloseModal(onClose, initializeStates)
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={closeModal}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as='h2' fontSize='2xl' pb='1'>{t('welcomeToCotravelers')}</Heading>
          <Heading as='h3' fontSize='sm'>{t('resetPasswordBelow')}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={(e) => resetPassword(e)} className='flex flex-col gap-5'>
            <EmailField initialRef={initialRef} />
            {isError &&
            <Alert status='error'>
              <AlertIcon />
              {errorMessage}
            </Alert>
            }
            {isSuccess &&
            <Alert status='success'>
              <AlertIcon />
              {t('resetPasswordSuccess')}
            </Alert>
            }
            <Button
              type='submit'
              colorScheme='teal'
              size='md'
              rightIcon={<ArrowForwardIcon />}
              isLoading={isLoading}
              ref={finalRef}
            >{t('send')}</Button>
          </form>
        </ModalBody>
        <ModalFooter className='flex flex-col gap-2 !items-start'>
          <p>{t('knowYourPassword?')} <Button onClick={() => handleCloseAndOpenModal(closeModal, openLoginModal)} variant='link'>{t('login')}</Button></p>
          <p>{t('dontHaveAnAccount?')} <Button onClick={() => handleCloseAndOpenModal(closeModal, openSignupModal)} variant='link'>{t('registerHere?')}</Button></p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}