import { Button, useDisclosure, Avatar, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Text, Flex, IconButton } from '@chakra-ui/react'
import { Login } from '../modals/Login'
import { Signup } from '../modals/Signup'
import { LogoutIcon } from '../icons/LogoutIcon'
import { useLogout } from '../../hooks/useLogout'
import { ResetPassword } from '../modals/ResetPassword'
import { Link } from 'react-router-dom'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useUserStore } from '../../store/userStore'
import { urlProfile, urlHowitworks, urlContact, urlFaq, urlEditProfile, urlGuides, urlTrips, urlMyTrips, urlCreateTrip } from '../../store/constantsStore'
import { useTranslation } from 'react-i18next'

export const UserMenu = () => {
  const { t, i18n } = useTranslation()
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
  const setSelectedLanguage = useUserStore((state) => state.setSelectedLanguage)

  const changeLanguage = (language: 'es' | 'en') => {
    setSelectedLanguage(language)
    i18n.changeLanguage(language)
  }

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
      <MenuList pt='0' zIndex='5'>
      { !userIsLogin &&
      <>
        <MenuGroup>
          <Flex gap='4' direction='column' p='4' bgColor='#f5f5f5'>
            <Button onClick={signupModal.onOpen} size='lg' bgColor='white' colorScheme='teal' variant='outline' w='100%'>{t('signup')}</Button>
            <Button onClick={loginModal.onOpen} size='lg' colorScheme='teal' variant='solid' w='100%'>{t('log-in')}</Button>
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
              <Text>{t('greeting')} <Link to={urlProfile+uid}><Text as='b'>@{username}</Text></Link>!</Text>
              <Link to={urlEditProfile}>{t('editProfile')}</Link>
            </Flex>
          </Flex>
        </MenuGroup>
        <MenuGroup pt='4'>
          <MenuItem className='custom-menu-item'><Link to={urlProfile+uid}>{t('myAccount')}</Link></MenuItem>
          <MenuItem className='custom-menu-item'><Link to={urlMyTrips}>{t('myTrips')}</Link></MenuItem>
          <MenuItem className='custom-menu-item'><Link to={urlCreateTrip}>{t('createTrip')}</Link></MenuItem>
        </MenuGroup>
        <MenuDivider />
      </>
      }
        <MenuGroup title='Menu' mx='3'>
          <MenuItem className='custom-menu-item'><Link to={urlTrips}>{t('trips')}</Link></MenuItem>
          <MenuItem className='custom-menu-item'><Link to={urlGuides}>{t('guides')}</Link></MenuItem>
          <MenuItem className='custom-menu-item'><Link to={urlHowitworks}>{t('howItWorks')}</Link></MenuItem>
          <MenuItem className='custom-menu-item'><Link to={urlContact}>{t('contact')}</Link></MenuItem>
          <MenuItem className='custom-menu-item'><Link to={urlFaq}>{t('faq')}</Link></MenuItem>
        </MenuGroup>
        <MenuDivider />
        { userIsLogin &&
        <>
        <MenuGroup>
          <MenuItem className='custom-menu-item' onClick={useLogout} icon={<LogoutIcon />}>{t('logout')}</MenuItem>
        </MenuGroup>
        <MenuDivider />
        </>
        }
        <MenuGroup title='Languages' mx='3'>
          <MenuItem className='custom-menu-item' onClick={() => changeLanguage('en')}>{t('english')}</MenuItem>
          <MenuItem className='custom-menu-item' onClick={() => changeLanguage('es')}>{t('spanish')}</MenuItem>
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