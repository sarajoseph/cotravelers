import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Flex, Box, Input, useToast } from '@chakra-ui/react'
import { IoSettingsSharp } from 'react-icons/io5'
import { useTrip } from '../hooks/useTrip'

export const AdminPanel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { deleteTrip } = useTrip()

  const handleDeleteUser = async () => {
    const userID = (document.getElementById('adminUserID') as HTMLInputElement).value
    const { success, errorMessage } = await deleteTrip(userID)
    toast({
      title: success ? 'Great!' : 'Ooops!',
      description: success ? 'The user has been deleted succesfully' : errorMessage,
      status: success ? 'success' : 'error',
      duration: 9000,
      isClosable: true,
    })
  }
  const handleDeleteTrip = async () => {
    const tripID = (document.getElementById('adminTripID') as HTMLInputElement).value
    const { success, errorMessage } = await deleteTrip(tripID)
    toast({
      title: success ? 'Great!' : 'Ooops!',
      description: success ? 'The trip has been deleted succesfully' : errorMessage,
      status: success ? 'success' : 'error',
      duration: 9000,
      isClosable: true,
    })
  }

  return (
    <>
      <Button colorScheme='purple' onClick={onOpen} leftIcon={<IoSettingsSharp />} position='fixed' left='0' top='0'>
        Open admin panel
      </Button>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Admin panel</DrawerHeader>
          <DrawerBody>
            <Flex direction='column' rowGap='8'>
              <Box>
                <Input mb='4' placeholder='Introduce la id del usuario' id='adminUserID' />
                <Button colorScheme='red' onClick={handleDeleteUser}>Delete user</Button>
              </Box>
              <Box>
                <Input mb='4' placeholder='Introduce la id del trip' id='adminTripID' />
                <Button colorScheme='red' onClick={handleDeleteTrip}>Delete trip</Button>
              </Box>
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}