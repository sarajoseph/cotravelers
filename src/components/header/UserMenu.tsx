import { Button, Center, Divider, Stack, useDisclosure } from '@chakra-ui/react'
import { Login } from '../modals/Login'
import { Signup } from '../modals/Signup'
import { useUser } from '../../hooks/useUser'
import { LogoutIcon } from '../icons/LogoutIcon'
import { useLogout } from '../../hooks/useLogout'
import { ResetPassword } from '../modals/ResetPassword'

export const UserMenu = () => {
  const loginModal = useDisclosure()
  const signupModal = useDisclosure()
  const resetPasswordModal = useDisclosure()
  const { username, userIsLogin } = useUser()

  return (
    <>
    { userIsLogin &&
      <Stack direction='row' spacing={7}>
        <p>¡Hi <b>{username}</b>!</p>
        <Button onClick={useLogout} variant='ghost'><LogoutIcon /></Button>
      </Stack>
    }
    { !userIsLogin &&
      <>
        <Stack direction='row' spacing={7}>
          <Button onClick={signupModal.onOpen} variant='link'>Sign up</Button>
          <Center height='50px'>
            <Divider orientation='vertical' />
          </Center>
          <Button onClick={loginModal.onOpen} variant='link'>Log in</Button>
        </Stack>
        <Signup
          isOpen={signupModal.isOpen}
          onClose={signupModal.onClose}
          openLoginModal={loginModal.onOpen}
        />
        <Login
          isOpen={loginModal.isOpen}
          onClose={loginModal.onClose}
          openSignupModal={signupModal.onOpen}
          openResetPasswordModal={resetPasswordModal.onOpen}
        />
        <ResetPassword
          isOpen={resetPasswordModal.isOpen}
          onClose={resetPasswordModal.onClose}
          openLoginModal={loginModal.onOpen}
          openSignupModal={signupModal.onOpen}
        />
      </>
    }
    </>
  )
}