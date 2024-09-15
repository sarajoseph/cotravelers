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

export const ResetPassword = ({isOpen, onClose, openLoginModal, openSignupModal}: {isOpen: boolean, onClose: () => void, openLoginModal: () => void, openSignupModal: () => void}) => {
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
          <Heading as='h2' fontSize='2xl' pb='1'>Welcome to Cotravelers</Heading>
          <Heading as='h3' fontSize='sm'>We will send you an email with a link to reset your password</Heading>
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
              The link has been submitted to your inbox successfully
            </Alert>
            }
            <Button
              type='submit'
              colorScheme='teal'
              size='md'
              rightIcon={<ArrowForwardIcon />}
              isLoading={isLoading}
              ref={finalRef}
            >Send</Button>
          </form>
        </ModalBody>
        <ModalFooter className='flex flex-col gap-2 !items-start'>
          <p>You know your password? <Button onClick={() => handleCloseAndOpenModal(closeModal, openLoginModal)} variant='link'>Login</Button></p>
          <p>Don't have an account? <Button onClick={() => handleCloseAndOpenModal(closeModal, openSignupModal)} variant='link'>Register here</Button></p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}