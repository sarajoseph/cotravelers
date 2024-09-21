import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './common/Home'
import { NotFound } from './common/NotFound'
import { Profile } from './user/Profile'
import { PrivateRoutes, PublicRoutes } from '../components/utils/ProtectedRoutes'
import { useUser } from '../hooks/useUser'
import { Loading } from '../components/icons/Loading'
import { EditProfile } from './user/EditProfile'
import { useUserStore } from '../store/userStore'
import { HowItWorks } from './common/HowItWorks'
import { Contact } from './common/Contact'
import { Faq } from './common/Faq'
import { urlContact, urlCreateTrip, urlEditProfile, urlEditTrip, urlFaq, urlGuides, urlHowitworks, urlMyTrips, urlProfile, urlTrip, urlTrips } from '../store/constantsStore'
import { EditTrip } from './trip/EditTrip'
import { CreateTrip } from './trip/CreateTrip'
import { MyTrips } from './trip/MyTrips'
import { Trip } from './trip/Trip'
import { Trips } from './trip/Trips'
import { Guides } from './guides/Guides'

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
          path: urlEditProfile,
          element: <EditProfile />,
          errorElement: <NotFound />
        },
        {
          path: urlCreateTrip,
          element: <CreateTrip />,
          errorElement: <NotFound />
        },
        {
          path: urlEditTrip+':tripID',
          element: <EditTrip />,
          errorElement: <NotFound />
        },
        {
          path: urlMyTrips,
          element: <MyTrips />,
          errorElement: <NotFound />
        },
      ]
    },
    {
      element: <PublicRoutes />,
      errorElement: <NotFound />,
      children: [
        {
          path: urlProfile+':uid',
          element: <Profile />,
          errorElement: <NotFound />
        },
        {
          path: urlTrip+':tripID',
          element: <Trip />,
          errorElement: <NotFound />
        },
        {
          path: urlTrips,
          element: <Trips />,
          errorElement: <NotFound />
        },
        {
          path: urlGuides,
          element: <Guides />,
          errorElement: <NotFound />
        },
        {
          path: urlHowitworks,
          element: <HowItWorks />,
          errorElement: <NotFound />
        },
        {
          path: urlContact,
          element: <Contact />,
          errorElement: <NotFound />
        },
        {
          path: urlFaq,
          element: <Faq />,
          errorElement: <NotFound />
        },
      ]
    },
  ])
  return <RouterProvider router={router} />
}