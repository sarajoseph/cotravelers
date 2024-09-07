import { Footer } from '../components/Footer'
import { Header } from '../components/header/Header'
import { ProfileData } from '../components/profile/ProfileData'
import { EditProfileData } from '../components/profile/EditProfileData'
import { useProfile } from '../hooks/useProfile'
import { Button, Flex } from '@chakra-ui/react'

export const Profile = () => {
  const { isEditProfile, toggleEditProfile } = useProfile()

  return (
    <>
    <Header />
    <main>
      <Flex flexDirection='column' rowGap='5'>
        <Flex justifyContent='flex-end'>
          <Button onClick={toggleEditProfile} >{isEditProfile ? 'Show profile' : 'Edit profile'}</Button>
        </Flex>
        {isEditProfile ? <EditProfileData /> : <ProfileData />}
      </Flex>
    </main>
    <Footer />
    </>
  )
}