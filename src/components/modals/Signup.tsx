import { useForm } from 'react-hook-form'
import { useSignup } from '../../hooks/useSignup'
import { UsernameField, ErrorFieldMessage, EmailField, PasswordField } from '../forms/FormFields'
import { FormRegisterInputs } from '../../global/types'
import { useRef } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { handleCloseAndOpenModal, handleCloseModal } from '../../global/logic'

export const Signup = ({isOpen, onClose, openLoginModal}: {isOpen: boolean, onClose: () => void, openLoginModal: () => void}) => {
  const { signup, isSuccess, isLoading, isError, errorMessage, initializeStates } = useSignup()
  const initialRef = useRef(null)
  const finalRef = useRef(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormRegisterInputs>()

  const closeModal = () => {
    handleCloseModal(onClose, initializeStates, reset)
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
          <h3 className='text-lg'>Sign up below to start</h3>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(signup)} className='flex flex-col gap-5'>
            <UsernameField register={register} initialRef={initialRef} />
            {errors.username &&
              <ErrorFieldMessage message={errors.username.message} />
            }
            <EmailField register={register} />
            {errors.email &&
              <ErrorFieldMessage message={errors.email.message} />
            }
            <PasswordField register={register} />
            {errors.password &&
              <ErrorFieldMessage message={errors.password.message} />
            }
            {isError && !isLoading &&
              <Alert status='error'>
                <AlertIcon />
                {errorMessage}
              </Alert>
            }
            {isSuccess &&
            <Alert status='success'>
              <AlertIcon />
              Registration has been completed successfully and an email of verification has been sent to your inbox
            </Alert>
            }
            <Button
              type='submit'
              colorScheme='teal'
              size='md'
              rightIcon={<ArrowForwardIcon />}
              isLoading={isLoading}
              ref={finalRef}
            >Sign up</Button>
          </form>
        </ModalBody>
        <ModalFooter className='flex flex-col !items-start'>
          <p>Already have an account? <Button onClick={() => handleCloseAndOpenModal(closeModal, openLoginModal)} variant='link'>Go to Login</Button></p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}