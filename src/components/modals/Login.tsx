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
} from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useConfirmationEmail } from '../../hooks/useConfirmationEmail'
import { handleCloseAndOpenModal, handleCloseModal } from '../../global/logic'

export const Login = ({isOpen, onClose, openSignupModal, openResetPasswordModal}: {isOpen: boolean, onClose: () => void, openSignupModal: () => void, openResetPasswordModal: () => void}) => {
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
          <h2 className='text-2xl'>Welcome to Cotravelers</h2>
          <h3 className='text-lg'>Login below</h3>
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
                  <p>Send a new <Button onClick={(e) => handleSendEmailVerification(e)} variant='link'>verification email</Button></p>
                }
              </Flex>
            </Alert>
            }
            {isSuccess &&
            <Alert status='success'>
              <AlertIcon />
              Login has been completed successfully
            </Alert>
            }
            <Button
              type='submit'
              colorScheme='teal'
              size='md'
              rightIcon={<ArrowForwardIcon />}
              isLoading={isLoading}
              ref={finalRef}
            >Login</Button>
          </form>
        </ModalBody>
        <ModalFooter className='flex flex-col gap-2 !items-start'>
          <p>Forgot password? <Button onClick={() => handleCloseAndOpenModal(closeModal, openResetPasswordModal)} variant='link'>Reset</Button></p>
          <p>Don't have an account? <Button onClick={() => handleCloseAndOpenModal(closeModal, openSignupModal)} variant='link'>Register here</Button></p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}