import { LoadingProps } from '../../global/types'

export const Loading = ({ type = 'loading-spinner', size = 'loading-lg' }: LoadingProps) => {
  return <span className={`loading ${type} ${size} mx-auto`}></span>
}
