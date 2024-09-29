import { useNavigate } from 'react-router-dom'
import { getMonthName } from '../global/logic'
import { urlTrips } from '../store/constantsStore'

export const useTripFinder = () => {
  const navigate = useNavigate()

  const handleClickDepartureMonth = (monthName: string, year: number) => {
    (document.getElementById('findDate') as HTMLInputElement).value = monthName+' '+year
  }

  const handleFindTrip = async (toDate: string) => {
    const location = (document.getElementById('findLocation') as HTMLInputElement).value || ''
    let navigateTo = (location.length > 0 || toDate.length > 0) ? urlTrips+'?' : urlTrips
    navigateTo += location.length > 0 ? 'location='+location : ''
    navigateTo += (location.length > 0 && toDate.length > 0) ? '&' : ''
    navigateTo += toDate.length > 0 ? 'date='+toDate : ''
    navigate(navigateTo)
  }

  const setDepartureMonths = () => {
    const currentDate = new Date()
    const departureMonths = []

    for (let i = 0; i < 9; i++) {
      const monthNumber = ((currentDate.getMonth() + i) % 12) + 1
      const monthName = getMonthName(monthNumber)
      const year = currentDate.getFullYear() + Math.floor((currentDate.getMonth() + i) / 12)

      departureMonths.push({
        monthNumber,
        monthName,
        year
      })
    }
    return departureMonths
  }

  return {
    handleClickDepartureMonth,
    handleFindTrip,
    setDepartureMonths
  }
}