import { UseFormRegister } from 'react-hook-form'
import { UsernameIcon, EmailIcon, PasswordIcon } from '../icons/UserFieldsIcons'
import { FormRegisterInputs } from '../../global/types'
import { Alert, AlertIcon, Button, FormControl, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const EmailField = ({register, initialRef}: {register?: UseFormRegister<FormRegisterInputs>, initialRef?: React.MutableRefObject<null>}) => {
  const { t } = useTranslation()
  return (
    <FormControl isRequired>
      <FormLabel>{t('email')}</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <EmailIcon />
        </InputLeftElement>
        { !register ? <Input id='emailLogin' type='text' ref={initialRef} /> :
          <Input id='emailRegister' type='text'
            {...register('email', {
              required: t('emailIsRequired'),
              pattern: {
                value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                message: t('pleaseEnterValidEmail'),
              }
            })}
          />
        }
      </InputGroup>
    </FormControl>
  )
}

export const PasswordField = ({register}: {register?: UseFormRegister<FormRegisterInputs>}) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  return (
    <FormControl isRequired>
      <FormLabel>{t('password')}</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <PasswordIcon />
        </InputLeftElement>
        { !register ? <Input id='passwordLogin' type={show ? 'text' : 'password'} /> :
          <Input id='passwordRegister' type={show ? 'text' : 'password'}
            {...register('password', {
              required: t('passwordIsRequired'),
              minLength: {
                value: 7,
                message: t('passwordChars')
              }
            })}
          />
        }
        <InputRightElement width='4.5rem'>
        <Button size='xs' onClick={handleClick}>
          {show ? t('hide') : t('show')}
        </Button>
      </InputRightElement>
      </InputGroup>
    </FormControl>
  )
}

export const UsernameField = ({register, initialRef}: {register?: UseFormRegister<FormRegisterInputs>, initialRef?: React.MutableRefObject<HTMLInputElement | null>}) => {
  const { t } = useTranslation()
  return (
    <FormControl isRequired>
      <FormLabel>{t('username')}</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <UsernameIcon />
        </InputLeftElement>
        { register &&
          <Input id='username' type='text' minLength={3} maxLength={10}
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: t('usernameAtLeast3Chars')
              },
              maxLength: {
                value: 10,
                message: t('usernameAtMost10Chars')
              }
            })}
            ref={(e) => {
              register('username').ref(e)
              if (initialRef) {
                initialRef.current = e
              }
            }}
          />
        }
      </InputGroup>
    </FormControl>
  )
}

export const ErrorFieldMessage = ({message, status='warning'}: {message: string | undefined, status?: 'warning' | 'info' | 'success' | 'error' | 'loading' | undefined}) => (
  <Alert status={status}><AlertIcon />{message ?? 'Error'}</Alert>
)
