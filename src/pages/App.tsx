import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './Home'
import { NotFound } from './NotFound'
import { Profile } from './Profile'
import { PrivateRoutes, PublicRoutes } from '../components/utils/ProtectedRoutes'
import { useUser } from '../hooks/useUser'
import { Loading } from '../components/icons/Loading'
import { EditProfile } from './EditProfile'
import { useUserStore } from '../store/userStore'

export const App = () => {
  const { firebaseIsLoading } = useUser()
  const user = useUserStore((state) => ({
    userIsLogin: state.userIsLogin
  }))
  const userIsLogin = user.userIsLogin

  if (firebaseIsLoading) return <Loading />

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <NotFound />
    },
    {
      element: <PrivateRoutes userIsLogin={userIsLogin} />,
      errorElement: <NotFound />,
      children: [
        {
          path: '/edit-profile',
          element: <EditProfile />,
          errorElement: <NotFound />
        },
      ]
    },
    {
      element: <PublicRoutes />,
      errorElement: <NotFound />,
      children: [
        {
          path: '/profile/:uid',
          element: <Profile />,
          errorElement: <NotFound />
        },
      ]
    },
  ])
  return <RouterProvider router={router} />
}