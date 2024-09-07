import { Link } from 'react-router-dom'
import { UserMenu } from './UserMenu'

export const Header = () => {
  return (
    <header className='flex flex-row justify-between'>
      <div>
        <Link to='/'><h1>Cotravelers</h1></Link>
      </div>
      <UserMenu />
    </header>
  )
}