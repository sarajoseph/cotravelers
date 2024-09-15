import { Checkbox, CheckboxGroup, FormControl, FormLabel, Input, Textarea, Image, Card, CardBody, CardHeader, Heading, Tag, Flex, InputGroup, InputRightElement, FormErrorMessage, useToast, TagLabel, TagLeftIcon } from '@chakra-ui/react'
import { Loading } from '../components/icons/Loading'
import { useProfile } from '../hooks/useProfile'
import { useEffect, useState } from 'react'
import { CheckIcon, WarningIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { FormProfileInputs } from '../global/types'
import { LoadingProfile } from '../components/icons/LoadingProfile'
import { useHobbies } from '../hooks/useHobbies'
import { WorldMap } from '../components/WorldMap'
import { WebContainer } from './WebContainer'
import { useUserStore } from '../store/userStore'
import { useUser } from '../hooks/useUser'
import { SelectFileBtn } from '../components/SelectFileBtn'

export const EditProfile = () => {
  const toast = useToast()
  const user = useUserStore((state) => ({
    avatar: state.avatar,
    bio: state.bio,
    birthday: state.birthday,
    countries: state.countries,
    email: state.email,
    hobbies: state.hobbies,
    name: state.name,
    public_email: state.public_email,
    surname: state.surname,
    type: state.type,
    uid: state.uid,
    userIsLogin: state.userIsLogin,
    username: state.username,
    verified: state.verified,
  }))
  const { hobbies } = useHobbies()
  const { saveUserData } = useUser()
  const { handleUploadImage, uploadingAvatar, validateBirthday } = useProfile()
  const { register, setValue, formState: { errors }, trigger } = useForm<FormProfileInputs>({
    mode: 'onChange' // Habilita las validaciones en tiempo real
  })
  const [ nameState, setNameState ] = useState<string>()
  const [ surnameState, setSurnameState ] = useState<string>()
  const [ birthdayState, setBirthdayState ] = useState<string>()
  const [ bioState, setBioState ] = useState<string>()
  const [ hobbiesState, setHobbiesState ] = useState<string>()
  const [ countriesState, setCountriesState ] = useState<string>()
  const [ errorUploadingAvatar, setErrorUploadingAvatar ] = useState<string | false>(false)
  const [ selectedHobbies, setSelectedHobbies ] = useState<string[]>()
  const [ countriesVisited, setCountriesVisited ] = useState<string[]>(user.countries || [])

  useEffect(() => {
    // Set the value in react-hook-form
    setValue('name', user.name || '')
    setValue('surname', user.surname || '')
    setValue('birthday', user.birthday || '')
    setSelectedHobbies(user.hobbies)
    setCountriesVisited(user.countries || [])
  }, [])

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
      const nameIsSaved = await saveUserData({dataField: 'name', dataValue: nameValue})
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
      const surnameIsSaved = await saveUserData({dataField: 'surname', dataValue: surnameValue})
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
      const birthdayIsSaved = await saveUserData({dataField: 'birthday', dataValue: birthdayValue})
      setBirthdayState(birthdayIsSaved ? 'success' : 'error')
    } else {
      setBirthdayState('error')
    }
  }

  const handleBioOnChange = async (bioValue: string) => {
    setBioState('loading')
    const bioIsSaved = await saveUserData({dataField: 'bio', dataValue: bioValue})
    setBioState(bioIsSaved ? 'success' : 'error')
  }

  const handleSelectedHobbies = async (selectedValues: string[]) => {
    setHobbiesState('loading')
    const hobbiesAreSaved = await saveUserData({dataField: 'hobbies', dataValue: selectedValues})
    setHobbiesState(hobbiesAreSaved ? 'success' : 'error')
    if (hobbiesAreSaved) setSelectedHobbies(selectedValues)
  }

  const handleClickCountry = async (countryName: string) => {
    /*
      Uso de useUserStore.getState(): Se utiliza este método para obtener el valor más reciente de los datos del usuario en el store de Zustand.
      El problema: Leaflet no estaba accediendo al estado más reciente debido a la asincronía entre las actualizaciones de React/Zustand y
      el ciclo de eventos de Leaflet.
      La solución: Utilizar useUserStore.getState() te garantiza el acceso al estado más reciente en el momento en que ocurre el clic,
      evitando que Leaflet siga usando versiones anteriores del estado.
    */
    setCountriesState('loading')

    const { avatar, bio, birthday, countries, email, hobbies, name, public_email, surname, type, uid, userIsLogin, username, verified } = useUserStore.getState()
    const userUpdated = { avatar, bio, birthday, countries, email, hobbies, name, public_email, surname, type, uid, userIsLogin, username, verified }
    const newCountriesVisited = (prevCountriesVisited: string[]) => {
      return prevCountriesVisited.includes(countryName)
        ? prevCountriesVisited.filter((name: string) => name !== countryName)
        : [...prevCountriesVisited, countryName]
    }

    const selectedCountries = newCountriesVisited(userUpdated.countries)

    try {
      const countriesAreSaved = await saveUserData({dataField: 'countries', dataValue: selectedCountries, userUpdated})

      if (countriesAreSaved) {
        setCountriesVisited(selectedCountries)
        setCountriesState('success')
      } else {
        console.log('Error al guardar los países')
        setCountriesState('error')
      }
    } catch (error) {
      console.log('Error en la operación de guardado:', error)
      setCountriesState('error')
    }

  }

  if (user === null) return <LoadingProfile />

  return (
    <WebContainer>
      <Flex flexDirection='column' rowGap='5'>
        <Card>
          <CardHeader>
            <Heading variant='h2' as='h2' fontSize='xl'>Edit profile</Heading>
          </CardHeader>
          <CardBody>
            <Flex direction={{ base: 'column', md: 'row'}} columnGap='4' rowGap='4' mb='8'>
              <FormControl>
                <FormLabel variant='profile'>Username</FormLabel>
                <Input size='md' type='text' value={user.username} readOnly />
              </FormControl>
              <FormControl>
                <FormLabel variant='profile'>Email</FormLabel>
                <Input size='md' type='text' value={user.public_email} readOnly />
              </FormControl>
            </Flex>
            <FormControl mb='8' isInvalid={!!errorUploadingAvatar}>
              <FormLabel variant='profile'>Profile image</FormLabel>
              <Flex direction={{ base: 'column', md: 'row'}} alignItems={{ base: 'flex-start', md: 'center'}} columnGap='5'>
                <Image
                  id='editprofileImage'
                  borderRadius='full'
                  boxSize='150'
                  src={user.avatar}
                  fallbackSrc='https://via.placeholder.com/150'
                  fit='cover'
                  alt='avatar'
                />
                { uploadingAvatar
                  ? <Loading height='10' size='md' justify='flex-start' />
                  : <Flex flexDirection='column'>
                      <SelectFileBtn>
                        <Input
                          type='file'
                          accept='.png,.jpg,.gif'
                          w='1'
                          variant='unstyled'
                          colorScheme='teal'
                          onChange={(e) => handleAvatarOnChange(e)}
                        />
                      </SelectFileBtn>
                      {errorUploadingAvatar && <FormErrorMessage>{errorUploadingAvatar}</FormErrorMessage>}
                    </Flex>
                }
              </Flex>
            </FormControl>
            <Flex direction={{ base: 'column', md: 'row'}} columnGap='4' rowGap='4' mb='8'>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel variant='profile'>Name</FormLabel>
                <InputGroup>
                  <Input
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
                <FormLabel variant='profile'>Surname</FormLabel>
                <InputGroup>
                  <Input
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
                <FormLabel variant='profile'>Birthday</FormLabel>
                <InputGroup>
                  <Input
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
            </Flex>
            <FormControl mb='8'>
              <Flex alignItems='center'>
                <FormLabel variant='profile'>Bio</FormLabel>
                {
                  <>
                    {bioState === 'loading' && <Loading size='sm' height='auto' />}
                    {(bioState === 'error') && <WarningIcon color='red.500' />}
                    {bioState === 'success' && <CheckIcon color='green.500' />}
                  </>
                }
              </Flex>
              <Textarea
                placeholder='Describe yourself here...'
                defaultValue={user.bio}
                onChange={(e) => handleBioOnChange(e.target.value)}
              />
            </FormControl>
            <FormControl mb='8'>
              <Flex alignItems='center' mb='2'>
                <FormLabel variant='profile'>Hobbies</FormLabel>
                {
                  <>
                    {hobbiesState === 'loading' && <Loading size='sm' height='auto' />}
                    {(hobbiesState === 'error') && <WarningIcon color='red.500' />}
                    {hobbiesState === 'success' && <CheckIcon color='green.500' />}
                  </>
                }
              </Flex>
              <CheckboxGroup value={selectedHobbies} onChange={handleSelectedHobbies} colorScheme='green'>
                <Flex gap='4' direction='row' wrap='wrap'>
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
                </Flex>
              </CheckboxGroup>
            </FormControl>
            <FormControl mb='8'>
              <Flex alignItems='center' mb='2'>
                <FormLabel variant='profile'>Countries visited</FormLabel>
                {
                  <>
                    {countriesState === 'loading' && <Loading size='sm' height='auto' />}
                    {(countriesState === 'error') && <WarningIcon color='red.500' />}
                    {countriesState === 'success' && <CheckIcon color='green.500' />}
                  </>
                }
              </Flex>
              <WorldMap
                countriesVisited={countriesVisited}
                handleClickCountry={handleClickCountry}
              />
            </FormControl>
          </CardBody>
        </Card>
      </Flex>
    </WebContainer>
  )
}