import { ProfileData } from '../components/profile/ProfileData'
import { EditProfileData } from '../components/profile/EditProfileData'
import { useProfile } from '../hooks/useProfile'
import { Button, Flex } from '@chakra-ui/react'
import { WebContainer } from './WebContainer'

export const Profile = () => {
  const { isEditProfile, toggleEditProfile } = useProfile()

  return (
    <WebContainer>
      <Flex flexDirection='column' rowGap='5'>
        <Flex justifyContent='flex-end'>
          <Button onClick={toggleEditProfile} >{isEditProfile ? 'Show profile' : 'Edit profile'}</Button>
        </Flex>
        {isEditProfile ? <EditProfileData /> : <ProfileData />}
      </Flex>
    </WebContainer>
  )
}