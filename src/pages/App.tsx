import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './Home'
import { NotFound } from './NotFound'

export const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <NotFound />
    }
  ])

  return <RouterProvider router={router} />
}