/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box, Card, CardBody, CardHeader, Flex, Heading, Tag, TagLabel, TagLeftIcon, Text } from '@chakra-ui/react'
import { WebContainer } from '../WebContainer'
import { useParams } from 'react-router-dom'
import { LoadingProfile } from '../../components/icons/LoadingProfile'
import { useHobbies } from '../../hooks/useHobbies'
import { DocumentData } from 'firebase/firestore'
import { Verified } from '../../components/icons/Verified'
import { WorldMap } from '../../components/WorldMap'
import { useProfile } from '../../hooks/useProfile'
import { useEffect, useState } from 'react'
import { NotFound } from '../common/NotFound'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '../../store/userStore'

export const Profile = () => {
  const { t } = useTranslation()
  const { uid } = useParams()
  const user = useUserStore((state) => ({
    selectedLanguage: state.selectedLanguage
  }))
  const selectedLanguage = user.selectedLanguage
  const { getProfileByUID } = useProfile()
  const { hobbies } = useHobbies()
  const [ currentProfile, setCurrentProfile ] = useState<{ [x: string]: any } | null>(null)
  const [ currentProfileState, setCurrentProfileState ] = useState<string>('loading')

  useEffect(() => {
    if (uid) {
      setCurrentProfileState('loading')
      const fetchProfile = async () => {
        const { success, profile, errorMessage } = await getProfileByUID(uid)
        if (success && profile){
          setCurrentProfile(profile)
          setCurrentProfileState('success')
        } else {
          setCurrentProfileState(errorMessage || 'error')
        }
      }
      fetchProfile()
    } else {
      setCurrentProfileState('error')
    }
  }, [])

  if (currentProfileState === 'loading') return <LoadingProfile />
  if (currentProfileState !== 'success') return currentProfileState !== 'error' ? <NotFound errorMessage={currentProfileState} /> : <NotFound />
  if (currentProfile)
    return (
      <WebContainer>
        <Flex flexDirection='column' rowGap='5'>
          <Card>
            <CardHeader>
              <Heading variant='h2' as='h2' fontSize='xl'>{t('profileOf')} @{currentProfile.username}{t('sProfile')}</Heading>
            </CardHeader>
            <CardBody>
              <Flex columnGap='5'>
                <Avatar
                  name={currentProfile.username}
                  src={currentProfile.avatar}
                  size='2xl'
                />
                <Flex flexDirection='column' justifyContent='center'>
                  <Flex columnGap='1'>
                    <Text fontSize='xl' as='b'>@{currentProfile.username}</Text>
                    {currentProfile.verified && <Verified />}
                  </Flex>
                  <p>{currentProfile.name +' '+ currentProfile.surname}</p>
                  <p>{currentProfile.public_email}</p>
                </Flex>
              </Flex>

              <Flex flexDirection='column' rowGap='5' mt='10'>
                <Box>
                  <Heading as='h3' size='xs' textTransform='uppercase' mb={3}>
                  {t('bio')}
                  </Heading>
                  <Text>
                    {currentProfile.bio}
                  </Text>
                </Box>
                <Box>
                  <Heading as='h3' size='xs' textTransform='uppercase' mb={3}>
                  {t('hobbies')}
                  </Heading>
                  <Flex gap={4} wrap='wrap'>
                    {(hobbies && currentProfile.hobbies !== undefined) &&
                      (currentProfile.hobbies).map((hobby: string) => {
                        const matchingHobby = hobbies.find((h: DocumentData) => h.id === hobby )
                        return matchingHobby && (
                          <Tag key={hobby} size='lg' colorScheme='gray' padding='3' variant='subtle'>
                            <TagLeftIcon as={matchingHobby.icon} />
                            <TagLabel pl={2}>{matchingHobby[selectedLanguage]}</TagLabel>
                          </Tag>
                        )
                      }
                    )}
                  </Flex>
                </Box>
                <Box>
                  <Heading as='h3' size='xs' textTransform='uppercase' mb={3}>
                  {t('countriesVisited')}
                  </Heading>
                  <WorldMap countriesVisited={currentProfile.countries} />
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </Flex>
      </WebContainer>
    )
}