import { collection, DocumentData, getDocs } from 'firebase/firestore'
import { db } from '../firebase/client'
import { FirebaseError } from 'firebase/app'
import { useEffect, useState } from 'react'
import { Animals, CineAndTV, Concerts, Cooking, Dancing, Default, Food, Karaoke, Museums, Music, Nature, Reading, Restaurants, Sports, Videogames } from '../components/icons/Hobbies'

export const useHobbies = () => {
  const [hobbies, setHobbies] = useState<DocumentData | null>(null)
  useEffect(() => {
    const fetchHobbies = async () => {
      const hobbiesData = await getHobbies()
      setHobbies(hobbiesData)
    }
    fetchHobbies()
  }, [])

  const getHobbies = async () => {
    try {
      const hobbiesCollection = await getDocs(collection(db, 'hobbies'))
      const hobbies = hobbiesCollection.docs.map(doc => {
        const icon = getHobbieIcon(doc.id)
        return ({
          id: doc.id,
          icon,
          ...doc.data()
        })
      })
      return hobbies

    } catch (error) {
      const firebaseError = error as FirebaseError
      console.log(firebaseError)
      return null
    }
  }

  const getHobbieIcon = (hobbyID: string): () => JSX.Element =>  {
    let icon = Default
    switch (hobbyID) {
      case 'animals':
        icon = Animals
        break
      case 'cinema_and_tv':
        icon = CineAndTV
        break
      case 'concerts':
        icon = Concerts
        break
      case 'cooking':
        icon = Cooking
        break
      case 'dancing':
        icon = Dancing
        break
      case 'food':
        icon = Food
        break
      case 'karaoke':
        icon = Karaoke
        break
      case 'museums':
        icon = Museums
        break
      case 'music':
        icon = Music
        break
      case 'nature':
        icon = Nature
        break
      case 'reading':
        icon = Reading
        break
      case 'restaurants':
        icon = Restaurants
        break
      case 'sports':
        icon = Sports
        break
      case 'videogames':
        icon = Videogames
        break
      default:
        icon = Default
        break
    }
    return icon
  }

  return {
    hobbies
  }
}