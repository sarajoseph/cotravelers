import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoutes = ({ userIsLogin }: {userIsLogin: boolean}) => {
  if (!userIsLogin) {
    return <Navigate to={'/'} />
  }
  return <Outlet />
}

export const PublicRoutes = () => {
  return <Outlet />
}