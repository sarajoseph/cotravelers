import { Button, useDisclosure, Avatar, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Text, Flex, IconButton } from '@chakra-ui/react'
import { Login } from '../modals/Login'
import { Signup } from '../modals/Signup'
import { LogoutIcon } from '../icons/LogoutIcon'
import { useLogout } from '../../hooks/useLogout'
import { ResetPassword } from '../modals/ResetPassword'
import { Link } from 'react-router-dom'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useUserStore } from '../../store/userStore'

export const UserMenu = () => {
  const loginModal = useDisclosure()
  const signupModal = useDisclosure()
  const resetPasswordModal = useDisclosure()
  const user = useUserStore((state) => ({
    avatar: state.avatar,
    uid: state.uid,
    userIsLogin: state.userIsLogin,
    username: state.username
  }))
  const avatar = user.avatar
  const uid = user.uid
  const userIsLogin = user.userIsLogin
  const username = user.username
  const userProfileLink = '/profile/'+uid
  return (
  <>
    <Menu closeOnSelect={false}>
    { !userIsLogin &&
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<HamburgerIcon />}
        variant='outline'
      />
    }
    { userIsLogin &&
      <MenuButton>
        <Avatar
          name={username}
          src={avatar}
          size='md'
        />
      </MenuButton>
    }
      <MenuList pt='0'>
      { !userIsLogin &&
      <>
        <MenuGroup>
          <Flex gap='4' direction='column' p='4' bgColor='#f5f5f5'>
            <Button onClick={signupModal.onOpen} size='lg' bgColor='white' colorScheme='teal' variant='outline' w='100%'>Sign up</Button>
            <Button onClick={loginModal.onOpen} size='lg' colorScheme='teal' variant='solid' w='100%'>Log in</Button>
          </Flex>
        </MenuGroup>
      </>
      }
      { userIsLogin &&
      <>
        <MenuGroup>
          <Flex bgColor='#f5f5f5' alignItems='center' w='100%' px='4' py='2'>
            <Avatar
              name={username}
              src={avatar}
              size='md'
            />
            <Flex direction='column' p='4'>
              <Text>Hi <Link to={userProfileLink}><Text as='b'>@{username}</Text></Link>!</Text>
              <Link to={'/edit-profile'}>Edit profile</Link>
            </Flex>
          </Flex>
        </MenuGroup>
        <MenuGroup pt='4'>
          <MenuItem className='custom-menu-item'><Link to={userProfileLink}>My Account</Link></MenuItem>
          <MenuItem className='custom-menu-item'>My trips</MenuItem>
          <MenuItem className='custom-menu-item'>Create a trip</MenuItem>
        </MenuGroup>
        <MenuDivider />
      </>
      }
        <MenuGroup title='Menu' mx='3'>
          <MenuItem className='custom-menu-item'>Trips</MenuItem>
          <MenuItem className='custom-menu-item'>Guides</MenuItem>
          <MenuItem className='custom-menu-item'>How it works?</MenuItem>
          <MenuItem className='custom-menu-item'>Contact</MenuItem>
          <MenuItem className='custom-menu-item'>FAQ</MenuItem>
        </MenuGroup>
        <MenuDivider />
        { userIsLogin &&
        <>
        <MenuGroup>
          <MenuItem className='custom-menu-item' onClick={useLogout} icon={<LogoutIcon />}>Log out</MenuItem>
        </MenuGroup>
        <MenuDivider />
        </>
        }
        <MenuGroup title='Languages' mx='3'>
          <MenuItem className='custom-menu-item'>English</MenuItem>
          <MenuItem className='custom-menu-item'>Spanish</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
    { !userIsLogin &&
    <>
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