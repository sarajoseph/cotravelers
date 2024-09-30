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
  AlertIcon,
  Heading
} from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { handleCloseAndOpenModal, handleCloseModal } from '../../global/logic'
import { useTranslation } from 'react-i18next'

export const Signup = ({isOpen, onClose, openLoginModal}: {isOpen: boolean, onClose: () => void, openLoginModal: () => void}) => {
  const { t } = useTranslation()
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
          <Heading as='h2' fontSize='2xl' pb='1'>{t('welcomeToCotravelers')}</Heading>
          <Heading as='h3' fontSize='md'>{t('registerBelow')}</Heading>
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
              {t('resgisterSuccess')}
            </Alert>
            }
            <Button
              type='submit'
              colorScheme='teal'
              size='md'
              rightIcon={<ArrowForwardIcon />}
              isLoading={isLoading}
              ref={finalRef}
            >{t('signup')}</Button>
          </form>
        </ModalBody>
        <ModalFooter className='flex flex-col !items-start'>
          <p>{t('alreadyHaveAnAccount?')} <Button onClick={() => handleCloseAndOpenModal(closeModal, openLoginModal)} variant='link'>{t('goToLogin')}</Button></p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}