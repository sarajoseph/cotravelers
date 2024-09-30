import { useRef } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { EmailField, PasswordField } from '../forms/FormFields'
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
  Flex,
  Heading,
} from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useConfirmationEmail } from '../../hooks/useConfirmationEmail'
import { handleCloseAndOpenModal, handleCloseModal } from '../../global/logic'
import { useTranslation } from 'react-i18next'

export const Login = ({isOpen, onClose, openSignupModal, openResetPasswordModal}: {isOpen: boolean, onClose: () => void, openSignupModal: () => void, openResetPasswordModal: () => void}) => {
  const { t } = useTranslation()
  const { login, isSuccess, isLoading, isError, errorMessage, initializeStates } = useLogin()
  const { handleSendEmailVerification } = useConfirmationEmail()
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
          <Heading as='h3' fontSize='md'>{t('loginBelow')}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={(e) => login(e, closeModal)} className='flex flex-col gap-5'>
            <EmailField initialRef={initialRef} />
            <PasswordField />
            {isError && !isLoading &&
            <Alert status='error'>
              <AlertIcon />
              <Flex flexDirection='column'>
                <p>{errorMessage}</p>
                {errorMessage === 'You must verify your email' &&
                  <p>{t('sendNewVerificationEmail1')} <Button onClick={(e) => handleSendEmailVerification(e)} variant='link'>{t('sendNewVerificationEmail2')}</Button></p>
                }
              </Flex>
            </Alert>
            }
            {isSuccess &&
            <Alert status='success'>
              <AlertIcon />
              {t('loginSuccess')}
            </Alert>
            }
            <Button
              type='submit'
              colorScheme='teal'
              size='md'
              rightIcon={<ArrowForwardIcon />}
              isLoading={isLoading}
              ref={finalRef}
            >{t('login')}</Button>
          </form>
        </ModalBody>
        <ModalFooter className='flex flex-col gap-2 !items-start'>
          <p>{t('forgotPassword?')} <Button onClick={() => handleCloseAndOpenModal(closeModal, openResetPasswordModal)} variant='link'>{t('reset')}</Button></p>
          <p>{t('dontHaveAnAccount?')} <Button onClick={() => handleCloseAndOpenModal(closeModal, openSignupModal)} variant='link'>{t('registerHere')}</Button></p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}