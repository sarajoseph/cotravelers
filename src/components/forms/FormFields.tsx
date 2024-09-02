import { UseFormRegister } from 'react-hook-form'
import { UsernameIcon, EmailIcon, PasswordIcon } from '../icons/UserFieldsIcons'
import { FormRegisterInputs } from '../../global/types'
import { Alert, AlertIcon, Button, FormControl, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import React, { useState } from 'react'

export const EmailField = ({register, initialRef}: {register?: UseFormRegister<FormRegisterInputs>, initialRef?: React.MutableRefObject<null>}) => {
  return (
    <FormControl isRequired>
      <FormLabel>Email</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <EmailIcon />
        </InputLeftElement>
        { !register ? <Input id='emailLogin' type='text' ref={initialRef} /> :
          <Input id='emailRegister' type='text'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                message: 'Please enter a valid email',
              }
            })}
          />
        }
      </InputGroup>
    </FormControl>
  )
}

export const PasswordField = ({register}: {register?: UseFormRegister<FormRegisterInputs>}) => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  return (
    <FormControl isRequired>
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <PasswordIcon />
        </InputLeftElement>
        { !register ? <Input id='passwordLogin' type={show ? 'text' : 'password'} /> :
          <Input id='passwordRegister' type={show ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 7,
                message: 'Password must be at least 7 characters'
              }
            })}
          />
        }
        <InputRightElement width='4.5rem'>
        <Button size='xs' onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
      </InputGroup>
    </FormControl>
  )
}

export const UsernameField = ({register, initialRef}: {register?: UseFormRegister<FormRegisterInputs>, initialRef?: React.MutableRefObject<HTMLInputElement | null>}) => {
  return (
    <FormControl isRequired>
      <FormLabel>Username</FormLabel>
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
                message: 'Username must be at least 3 characters'
              },
              maxLength: {
                value: 10,
                message: 'Username must be at most 10 characters'
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

export const ErrorFieldMessage = ({message}: {message: string | undefined }) => (
  <Alert status='warning'><AlertIcon />{message ?? 'Error'}</Alert>
)
