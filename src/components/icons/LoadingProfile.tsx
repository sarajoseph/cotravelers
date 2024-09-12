import { Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

export const LoadingProfile = () => {
  return (
    <Box padding='6' boxShadow='lg' bg='white'>
      <SkeletonText mb='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      <SkeletonCircle size='150' />
      <SkeletonText mt='4' noOfLines={8} spacing='4' skeletonHeight='2' />
    </Box>
  )
}