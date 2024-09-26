import 'swiper/css'
import { Box, IconButton } from '@chakra-ui/react'
import { Swiper, useSwiper } from 'swiper/react'
import { ReactNode } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

const NavigationButtons = () => {
  const swiper = useSwiper()
  const buttonStyles = {
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    backgroundColor: 'transparent',
    color: 'white',
    opacity: .3,
    filter: 'drop-shadow(1px 1px 3px black)',
    _hover: {
      backgroundColor: 'transparent',
      opacity: .6,
    }
  }
  return (
    <>
    <IconButton icon={<FaChevronLeft size='40' />} onClick={() => swiper.slidePrev()} aria-label='Previous slide' left='0' position='absolute' {...buttonStyles} />
    <IconButton icon={<FaChevronRight size='40' />} onClick={() => swiper.slideNext()} aria-label='Next slide' right='0' position='absolute' {...buttonStyles} />
    </>
  )
}

export const SwiperCarousel = ({ children }: {children: ReactNode}) => {
  return (
    <Box mx='auto'>
      <Swiper
        navigation={false}
        spaceBetween={10}
        breakpoints={{
          768: { slidesPerView: 3, },
          0: { slidesPerView: 1, },
        }}
      >
        {children}
        <NavigationButtons/>
      </Swiper>
    </Box>
  )
}