import { Checkbox, CheckboxGroup, FormControl, FormLabel, Input, Image, Card, CardBody, CardHeader, Heading, Tag, Flex, InputGroup, InputRightElement, FormErrorMessage, useToast, TagLabel, TagLeftIcon, Button } from '@chakra-ui/react'
import { Loading } from '../../components/icons/Loading'
import { useProfile } from '../../hooks/useProfile'
import { useCallback, useEffect, useState } from 'react'
import { CheckIcon, WarningIcon } from '@chakra-ui/icons'
import { FieldError, useForm } from 'react-hook-form'
import { FormProfileInputs } from '../../global/types/common'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { useHobbies } from '../../hooks/useHobbies'
import { WorldMap } from '../../components/WorldMap'
import { WebContainer } from '../WebContainer'
import { useUserStore } from '../../store/userStore'
import { useUser } from '../../hooks/useUser'
import { SelectFileBtn } from '../../components/SelectFileBtn'
import { NotFound } from '../common/NotFound'
import { useTranslation } from 'react-i18next'
import { DocumentData } from 'firebase/firestore'
import { TextEditor } from '../../components/forms/TextEditor'
import { RiSave3Fill } from 'react-icons/ri'

export const EditProfile = () => {
  const { t } = useTranslation()
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
    selectedLanguage: state.selectedLanguage
  }))
  const selectedLanguage = user.selectedLanguage
  const { hobbies } = useHobbies()
  const { saveUserData } = useUser()
  const { handleUploadImage, uploadingAvatar, resizeAvatar, validateBirthday } = useProfile()
  const { register, setValue, formState: { errors }, trigger } = useForm<FormProfileInputs>({
    mode: 'onChange' // Habilita las validaciones en tiempo real
  })
  const [ editProfileState, setEditProfileState ] = useState<string>('loading')
  const [ nameState, setNameState ] = useState<string>()
  const [ surnameState, setSurnameState ] = useState<string>()
  const [ birthdayState, setBirthdayState ] = useState<string>()
  const [ bioState, setBioState ] = useState<string>()
  const [ bioValue, setBioValue ] = useState<string>('')
  const [ hobbiesState, setHobbiesState ] = useState<string>()
  const [ countriesState, setCountriesState ] = useState<string>()
  const [ errorUploadingAvatar, setErrorUploadingAvatar ] = useState<string | false>(false)
  const [ selectedHobbies, setSelectedHobbies ] = useState<string[]>()
  const [ countriesVisited, setCountriesVisited ] = useState<string[]>(user.countries || [])

  useEffect(() => {
    if (user) {
      setEditProfileState('success')
      // Set the value in react-hook-form
      setValue('name', user.name || '')
      setValue('surname', user.surname || '')
      setValue('birthday', user.birthday || '')
      setBioValue(user.bio)
      setSelectedHobbies(user.hobbies)
      setCountriesVisited(user.countries || [])
    } else {
      setEditProfileState('error')
    }
  }, [])

  const handleAvatarOnChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const imageFile: File = files[0]

      resizeAvatar(imageFile, async (resizedFile: File) => {
        const { success, errorMessage } = await handleUploadImage(resizedFile)
        if (!success) {
          setErrorUploadingAvatar(errorMessage ? errorMessage : t('errorUploadingAvatar'))
        } else {
          setErrorUploadingAvatar(false)
          toast({
            title: 'Awesome!',
            description: t('imageUpdatedSuccesfully'),
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        }
      })

    } else {
      setErrorUploadingAvatar(t('noFileWasSelected'))
    }
  }, [toast])

  const handleFieldChange = async (field: keyof FormProfileInputs, value: string) => {
    const resultIsValid = await trigger(field)
    if (resultIsValid) {
      const { success } = await saveUserData({dataField: field, dataValue: value})
      return success ? 'success' : 'error'
    } else {
      return 'error'
    }
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
      const { success } = await saveUserData({dataField: 'countries', dataValue: selectedCountries, userUpdated})

      if (success) {
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

  const renderStatusIcon = (status: string, errorValue?: FieldError) => {
    if (status === 'loading') return <Loading size='sm' height='auto' />
    if (status === 'error' || errorValue) return <WarningIcon color='red.500' />
    if (status === 'success') return <CheckIcon color='green.500' />
  }

  if (editProfileState === 'loading') return <LoadingProfile />
  if (editProfileState === 'error') return <NotFound />
  if (editProfileState)
  return (
    <WebContainer>
      <Flex flexDirection='column' rowGap='5'>
        <Card>
          <CardHeader>
            <Heading variant='h2' as='h2' fontSize='xl'>{t('editProfile')}</Heading>
          </CardHeader>
          <CardBody>
            <Flex direction={{ base: 'column', md: 'row'}} columnGap='4' rowGap='4' mb='8'>
              <FormControl>
                <FormLabel variant='profile'>{t('username')}</FormLabel>
                <Input size='md' type='text' value={user.username} readOnly />
              </FormControl>
              <FormControl>
                <FormLabel variant='profile'>{t('email')}</FormLabel>
                <Input size='md' type='text' value={user.public_email} readOnly />
              </FormControl>
            </Flex>
            <FormControl mb='8' isInvalid={!!errorUploadingAvatar}>
              <FormLabel variant='profile'>{t('profileImage')}</FormLabel>
              <Flex direction={{ base: 'column', md: 'row'}} alignItems={{ base: 'flex-start', md: 'center'}} gap='5'>
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
                <FormLabel variant='profile'>{t('name')}</FormLabel>
                <InputGroup>
                  <Input
                    placeholder={t('yourName')}
                    size='md'
                    type='text'
                    {...register('name', {
                      pattern: {
                        value: /^[A-Za-zÁ-ÿá-ÿÑñ\s]+$/,
                        message: t('nameMustContainOnlyLetters')
                      }
                    })}
                    onChange={async (e) => {
                      setNameState('loading')
                      const nameValue = e.target.value
                      setValue('name', nameValue)
                      const response = await handleFieldChange('name', nameValue)
                      setNameState(response)
                    }}
                  />
                  <InputRightElement>
                    {nameState && renderStatusIcon(nameState, errors.name)}
                  </InputRightElement>
                </InputGroup>
                {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={!!errors.surname}>
                <FormLabel variant='profile'>{t('surname')}</FormLabel>
                <InputGroup>
                  <Input
                    placeholder={t('yourSurname')}
                    size='md'
                    type='text'
                    {...register('surname', {
                      pattern: {
                        value: /^[A-Za-zÁ-ÿá-ÿÑñ\s]+$/,
                        message: t('surnameMustContainOnlyLetters')
                      }
                    })}
                    onChange={async (e) => {
                      setSurnameState('loading')
                      const surnameValue = e.target.value
                      setValue('surname', surnameValue)
                      const response = await handleFieldChange('surname', surnameValue)
                      setSurnameState(response)
                    }}
                  />
                  <InputRightElement>
                    {surnameState && renderStatusIcon(surnameState, errors.surname)}
                  </InputRightElement>
                </InputGroup>
                {errors.surname && <FormErrorMessage>{errors.surname.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={!!errors.birthday}>
                <FormLabel variant='profile'>{t('birthday')}</FormLabel>
                <InputGroup>
                  <Input
                    placeholder={t('selectDate')}
                    size='md'
                    type='date'
                    {...register('birthday', {
                      valueAsDate: true,
                      validate: validateBirthday
                    })}
                    onChange={async (e) => {
                      setBirthdayState('loading')
                      const birthdayValue = e.target.value
                      setValue('birthday', birthdayValue)
                      const response = await handleFieldChange('birthday', birthdayValue)
                      setBirthdayState(response)
                    }}
                  />
                  <InputRightElement>
                    {birthdayState && renderStatusIcon(birthdayState, errors.birthday)}
                  </InputRightElement>
                </InputGroup>
                {errors.birthday && <FormErrorMessage>{errors.birthday.message}</FormErrorMessage>}
              </FormControl>
            </Flex>
            <FormControl mb='8'>
              <Flex alignItems='center'>
                <FormLabel variant='profile'>{t('bio')}</FormLabel>
                {bioState && renderStatusIcon(bioState)}
              </Flex>
              <TextEditor
                placeholder={t('describeYourselfHere...')}
                value={bioValue}
                onChange={(content: string) => {
                  if (content !== bioValue) {
                    setBioValue(content)
                  }
                }}
              />
              <Flex justify={{ base: 'center', md: 'start' }} mt='2'>
                <Button
                  type='submit'
                  colorScheme='gray'
                  width={{ base: '100%', md: 'auto' }}
                  minW='150px'
                  gap="2"
                  onClick={ async() => {
                    setBioState('loading')
                    const { success } = await saveUserData({dataField: 'bio', dataValue: bioValue})
                    setBioState(success ? 'success' : 'error')
                  }}
                  isLoading={bioState === 'loading' ? true : false}
                >
                  <RiSave3Fill size='20' />
                  {t('saveBio')}
                </Button>
              </Flex>
            </FormControl>
            <FormControl mb='8'>
              <Flex alignItems='center' mb='2'>
                <FormLabel variant='profile'>{t('hobbies')}</FormLabel>
                {hobbiesState && renderStatusIcon(hobbiesState)}
              </Flex>
              <CheckboxGroup
                value={selectedHobbies}
                colorScheme='green'
                onChange={async (selectedValues: string[]) => {
                  setHobbiesState('loading')
                  const { success } = await saveUserData({dataField: 'hobbies', dataValue: selectedValues})
                  setHobbiesState(success ? 'success' : 'error')
                  if (success) setSelectedHobbies(selectedValues)
                }}>
                <Flex gap='4' direction='row' wrap='wrap'>
                  {hobbies &&
                    hobbies.map((hobbie: DocumentData) => {
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
                            <TagLabel pl={2}>{hobbie[selectedLanguage]}</TagLabel>
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
                <FormLabel variant='profile'>{t('countriesVisited')}</FormLabel>
                {countriesState && renderStatusIcon(countriesState)}
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