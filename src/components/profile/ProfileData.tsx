import { LoadingProfile } from '../icons/LoadingProfile'
import { Avatar, Box, Card, CardBody, CardHeader, Flex, Heading, Tag, TagLabel, TagLeftIcon, Text } from '@chakra-ui/react'
import { Verified } from '../icons/Verified'
import { useUser } from '../../hooks/useUser'
import { useHobbies } from '../../hooks/useHobbies'
import { DocumentData } from 'firebase/firestore'
import { WorldMap } from '../WorldMap'

export const ProfileData = () => {
  const { userData } = useUser()
  const { hobbies } = useHobbies()
  if (userData === null) return <LoadingProfile />

  return (
    <Card>
      <CardHeader>
        <Heading as='h2' size='md'>Your profile</Heading>
      </CardHeader>
      <CardBody>
        <Flex columnGap='5'>
          <Avatar
            name={userData?.username}
            src={userData?.photoURL}
            size='2xl'
          />
          <Flex flexDirection='column' justifyContent='center'>
            <Flex columnGap='1'>
              <Text fontSize='xl' as='b'>@{userData?.username}</Text>
              {userData?.verified && <Verified />}
            </Flex>
            <p>{userData?.name +' '+ userData?.surname}</p>
            <p>{userData?.email}</p>
          </Flex>
        </Flex>

        <Flex flexDirection='column' rowGap='5' mt='10'>
          <Box>
            <Heading as='h3' size='xs' textTransform='uppercase' mb={3}>
              Bio
            </Heading>
            <Text>
              {userData?.bio}
            </Text>
          </Box>
          <Box>
            <Heading as='h3' size='xs' textTransform='uppercase' mb={3}>
              Hobbies
            </Heading>
            <Flex gap={4} wrap='wrap'>
              {
                (hobbies && userData.hobbies !== undefined) &&
                  (userData.hobbies).map((hobby: string) => {
                    const matchingHobby = hobbies.find((h: DocumentData) => h.id === hobby )
                    return matchingHobby && (
                      <Tag key={hobby} size='lg' colorScheme='gray' padding='3' variant='subtle'>
                        <TagLeftIcon as={matchingHobby.icon} />
                        <TagLabel pl={2}>{matchingHobby.name}</TagLabel>
                      </Tag>
                    )
                  }
                )
              }
            </Flex>
          </Box>
          <Box>
            <Heading as='h3' size='xs' textTransform='uppercase' mb={3}>
              Countries visited
            </Heading>
            <WorldMap countriesVisited={userData?.countries} />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  )
}