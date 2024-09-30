/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useTrip } from '../../hooks/useTrip'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const CancelTripModal = ({tripID, isOpen, cancelRef, onClose}: {tripID: string, isOpen: boolean, cancelRef: any, onClose: () => void}) => {
  const { t } = useTranslation()
  const { cancelTrip } = useTrip()
  const navigate = useNavigate()
  const toast = useToast()
  const [ cancelIsLoading, setCancelIsLoading ] = useState<boolean>(false)

  const handleCancelTrip = async () => {
    if (!tripID) return
    setCancelIsLoading(true)
    const { success, errorMessage } = await cancelTrip(tripID)
    if (success) {
      navigate(0)
    } else {
      toast({
        title: 'Ooops!',
        description: errorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    setCancelIsLoading(false)
  }

  return (
    <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {t('cancelTrip')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('questionCancelTrip')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t('noCancelTrip')}
              </Button>
              <Button onClick={handleCancelTrip} isLoading={cancelIsLoading} colorScheme='red' ml={3}>
                {t('yesCancelTrip')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
  )
}