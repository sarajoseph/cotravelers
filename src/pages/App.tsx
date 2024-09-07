import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './Home'
import { NotFound } from './NotFound'
import { Profile } from './Profile'
import { PrivateRoutes } from '../components/utils/ProtectedRoutes'
import { useUser } from '../hooks/useUser'
import { Loading } from '../components/icons/Loading'

export const App = () => {
  const { firebaseIsLoading, userIsLogin } = useUser()

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
          path: '/profile',
          element: <Profile />,
          errorElement: <NotFound />
        },
      ]
    },
  ])
  return <RouterProvider router={router} />
}