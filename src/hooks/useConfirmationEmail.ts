/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { authFirebase } from '../firebase/client'
import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'

export const useConfirmationEmail = () => {
  const [ confirmationEmailStatus, setConfirmationEmailStatus ] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    if (confirmationEmailStatus === 'success') {
      toast({
        title: 'Done!',
        description: "Email sent successfully",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

    } else if (confirmationEmailStatus !== null && confirmationEmailStatus !== 'loading' && confirmationEmailStatus !== 'success') {
      toast({
        title: 'Error',
        description: confirmationEmailStatus,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }, [confirmationEmailStatus])

  const sendConfirmationEmail = async (email: string, password: string) => {
    setConfirmationEmailStatus('loading')
    try {
      await signInWithEmailAndPassword(authFirebase, email, password)
      if (authFirebase.currentUser) {
        await sendEmailVerification(authFirebase.currentUser)
        setConfirmationEmailStatus('success')
      }
      await signOut(authFirebase)
    } catch (error: any) {
      console.log(error)
      setConfirmationEmailStatus(error)
    }
  }

  const handleSendEmailVerification = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const email = (document.getElementById('emailLogin') as HTMLInputElement).value
    const password = (document.getElementById('passwordLogin') as HTMLInputElement).value
    await sendConfirmationEmail(email, password)
  }

  return { handleSendEmailVerification }

}