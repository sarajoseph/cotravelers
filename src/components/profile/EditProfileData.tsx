import { Checkbox, CheckboxGroup, FormControl, FormLabel, Input, Stack, Textarea, Image, Card, CardBody, CardHeader, Heading, Tag, Flex, InputGroup, InputRightElement, FormErrorMessage, useToast, TagLabel, TagLeftIcon } from '@chakra-ui/react'
import { Loading } from '../icons/Loading'
import { useProfile } from '../../hooks/useProfile'
import { useUser } from '../../hooks/useUser'
import { useEffect, useState } from 'react'
import { CheckIcon, WarningIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { FormProfileInputs } from '../../global/types'
import { LoadingProfile } from '../icons/LoadingProfile'
import { useHobbies } from '../../hooks/useHobbies'

export const EditProfileData = () => {
  const toast = useToast()
  const { userData } = useUser()
  const { hobbies } = useHobbies()
  const { handleUploadImage, uploadingAvatar, handleSaveData, validateBirthday } = useProfile()
  const { register, setValue, formState: { errors }, trigger } = useForm<FormProfileInputs>({
    mode: 'onChange' // Habilita las validaciones en tiempo real
  })
  const [ nameState, setNameState ] = useState<string>()
  const [ surnameState, setSurnameState ] = useState<string>()
  const [ birthdayState, setBirthdayState ] = useState<string>()
  const [ hobbiesState, setHobbiesState ] = useState<string>()
  const [ errorUploadingAvatar, setErrorUploadingAvatar ] = useState<string | false>(false)
  const [ selectedHobbies, setSelectedHobbies ] = useState<string[]>()

  useEffect(() => {
    // Set the value in react-hook-form
    setValue('name', userData?.name || '')
    setValue('surname', userData?.surname || '')
    setValue('birthday', userData?.birthday || '')
    setSelectedHobbies(userData?.hobbies)
  }, [userData, setValue])

  const handleAvatarOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { handleUploadImageSuccess, handleUploadImageErrorMessage } = await handleUploadImage(e)
    if (!handleUploadImageSuccess) {
      setErrorUploadingAvatar(handleUploadImageErrorMessage ? handleUploadImageErrorMessage : 'Error uploading avatar')
    } else {
      setErrorUploadingAvatar(false)
      toast({
        title: 'Awesome!',
        description: 'Image updated succesfully',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const handleNameOnChange = async (nameValue: string) => {
    setNameState('loading')
    setValue('name', nameValue)
    const resultIsValid = await trigger('name')
    if (resultIsValid) {
      const nameIsSaved = await handleSaveData('name', nameValue)
      setNameState(nameIsSaved ? 'success' : 'error')
    } else {
      setNameState('error')
    }
  }

  const handleSurnameOnChange = async (surnameValue: string) => {
    setSurnameState('loading')
    setValue('surname', surnameValue)
    const resultIsValid = await trigger('surname')
    if (resultIsValid) {
      const surnameIsSaved = await handleSaveData('surname', surnameValue)
      setSurnameState(surnameIsSaved ? 'success' : 'error')
    } else {
      setSurnameState('error')
    }
  }

  const handleBirthdayOnChange = async (birthdayValue: string) => {
    setBirthdayState('loading')
    setValue('birthday', birthdayValue)
    const resultIsValid = await trigger('birthday')
    if (resultIsValid) {
      const birthdayIsSaved = await handleSaveData('birthday', birthdayValue)
      setBirthdayState(birthdayIsSaved ? 'success' : 'error')
    } else {
      setBirthdayState('error')
    }
  }

  const handleSelectedHobbies = async (selectedValues: string[]) => {
    setHobbiesState('loading')
    const hobbiesAreSaved = await handleSaveData('hobbies', selectedValues)
    setHobbiesState(hobbiesAreSaved ? 'success' : 'error')
    if (hobbiesAreSaved) setSelectedHobbies(selectedValues)
  }

  if (userData === null) return <LoadingProfile />

  return (
    <Card>
      <CardHeader>
        <Heading size='md'>Edit profile</Heading>
      </CardHeader>
      <CardBody>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input id='editprofileUsername' size='md' type='text' value={userData?.username} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input id='editprofileEmail' size='md' type='text' value={userData?.email} readOnly />
        </FormControl>
        <FormControl isInvalid={!!errorUploadingAvatar}>
          <FormLabel>Profile image</FormLabel>
          <Flex alignItems='center' columnGap='5'>
            <Image
              id='editprofileImage'
              borderRadius='full'
              boxSize='150'
              src={userData?.photoURL}
              fallbackSrc='https://via.placeholder.com/150'
              fit='cover'
              alt='avatar'
            />
            { uploadingAvatar
              ? <Loading height='10' size='md' justify='flex-start' />
              : <Flex flexDirection='column'>
                  <Input
                    type='file'
                    accept='.png,.jpg,.gif'
                    w='fit-content'
                    maxW='50%'
                    onChange={(e) => handleAvatarOnChange(e)}
                  />
                  {errorUploadingAvatar && <FormErrorMessage>{errorUploadingAvatar}</FormErrorMessage>}
                </Flex>
            }
          </Flex>
        </FormControl>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <InputGroup>
            <Input
              id='editprofileName'
              placeholder='Your name'
              size='md'
              type='text'
              {...register('name', {
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: 'Name must contain only letters'
                }
              })}
              onChange={(e) => handleNameOnChange(e.target.value)}
            />
            <InputRightElement>
              {nameState === 'loading' && <Loading size='sm' height='auto' />}
              {(nameState === 'error' || errors.name) && <WarningIcon color='red.500' />}
              {nameState === 'success' && <CheckIcon color='green.500' />}
            </InputRightElement>
          </InputGroup>
          {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.surname}>
          <FormLabel>Surname</FormLabel>
          <InputGroup>
            <Input
              id='editprofileSurname'
              placeholder='Your surname'
              size='md'
              type='text'
              {...register('surname', {
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: 'Surname must contain only letters'
                }
              })}
              onChange={(e) => handleSurnameOnChange(e.target.value)}
            />
            <InputRightElement>
              {surnameState === 'loading' && <Loading size='sm' height='auto' />}
              {(surnameState === 'error' || errors.surname) && <WarningIcon color='red.500' />}
              {surnameState === 'success' && <CheckIcon color='green.500' />}
            </InputRightElement>
          </InputGroup>
          {errors.surname && <FormErrorMessage>{errors.surname.message}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.birthday}>
          <FormLabel>Birthday</FormLabel>
          <InputGroup>
            <Input
              id='editprofileBirthday'
              placeholder='Select date'
              size='md'
              type='date'
              {...register('birthday', {
                valueAsDate: true,
                validate: validateBirthday
              })}
              onChange={(e) => handleBirthdayOnChange(e.target.value)}
            />
            <InputRightElement>
              {birthdayState === 'loading' && <Loading size='sm' height='auto' />}
              {(birthdayState === 'error' || errors.birthday) && <WarningIcon color='red.500' />}
              {birthdayState === 'success' && <CheckIcon color='green.500' />}
            </InputRightElement>
          </InputGroup>
          {errors.birthday && <FormErrorMessage>{errors.birthday.message}</FormErrorMessage>}
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Textarea id='editprofileBio' placeholder='Describe yourself here...' defaultValue={userData?.bio} />
        </FormControl>
        <FormControl>
          <Flex alignItems='center' mb='5'>
            <FormLabel mb='0'>Hobbies</FormLabel>
            {
              <>
                {hobbiesState === 'loading' && <Loading size='sm' height='auto' />}
                {(hobbiesState === 'error' || errors.surname) && <WarningIcon color='red.500' />}
                {hobbiesState === 'success' && <CheckIcon color='green.500' />}
              </>
            }
          </Flex>
          <CheckboxGroup value={selectedHobbies} onChange={handleSelectedHobbies} colorScheme='green'>
            <Stack spacing={[1, 5]} direction={['column', 'row']} wrap='wrap'>
              {hobbies &&
                hobbies.map((hobbie: {id: string, name: string, icon: () => JSX.Element}) => {
                  const isChecked = selectedHobbies ? selectedHobbies.includes(hobbie.id) : false
                  return (
                    <Checkbox key={hobbie.id} id={hobbie.id} value={hobbie.id} display='flex'
                      css={{
                        '& span.chakra-checkbox__control': {
                          display: 'none'
                        }
                      }}
                    >
                      <Tag size='lg' colorScheme={isChecked ? 'blue' : 'gray'} padding='3' variant='subtle'>
                        <TagLeftIcon as={hobbie.icon}/>
                        <TagLabel pl={2}>{hobbie.name}</TagLabel>
                      </Tag>
                    </Checkbox>
                  )
                }
              )}
            </Stack>
          </CheckboxGroup>
        </FormControl>
      </CardBody>
    </Card>
  )
}