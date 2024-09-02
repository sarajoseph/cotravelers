import { UserMenu } from './UserMenu'

export const Header = () => {
  return (
    <header className='flex flex-row justify-between'>
      <div>
        <h1>Cotravelers</h1>
      </div>
      <UserMenu />
    </header>
  )
}