import { useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

import './set-swiper.css'

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

import { FreeMode, Navigation, Thumbs, Pagination } from "swiper";

import iconBook from '../../assets/books/iconBook.png';
import extraImg1 from '../../assets/books/extraImg1.png';

export const SetSwiper = () => {

    const [thumbsSwiper, setThumbsSwiper] = useState();

    return (
        <div className='book__swiper'>
                    <Swiper
                        data-test-id='slide-big'
                        initialSlide={1}
                        spaceBetween={10}
                        navigation={true}
                        modules={[Thumbs, Navigation, FreeMode, Pagination]}
                        pagination={{clickable:true}}
                        thumbs={{ swiper: thumbsSwiper }}
                        className='swiper__container'
                    >
                        <SwiperSlide>
                            <img src={extraImg1} alt='book' className='swiper__img'/>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={iconBook} alt='book' className='swiper__img'/>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={extraImg1} alt='book' className='swiper__img'/>
                        </SwiperSlide>
                    </Swiper>
                    <Swiper
                        spaceBetween={30}
                        modules={[Thumbs, Navigation, FreeMode, Pagination]}
                        centeredSlides={true}
                        freeMode={true}
                        onSwiper={setThumbsSwiper}
                        slidesPerView={3}
                        className='swiper__thumbs__container'
                        breakpoints={{

                            768: {
                                pagination: true,
                                spaceBetween: 8,
                                width: 768,
                                slidesPerView: 1,
                            },

                            320: {
                                spaceBetween: 8,
                                width: 320,
                                slidesPerView: 1,
                            },
                          }}
                    >
                        <SwiperSlide className='scroll__img' data-test-id='slide-mini'>
                            <img src={extraImg1} alt='book'/>
                        </SwiperSlide>
                        <SwiperSlide className='scroll__img' data-test-id='slide-mini'>
                            <img src={iconBook} alt='book'/>
                        </SwiperSlide>
                        <SwiperSlide className='scroll__img' data-test-id='slide-mini'>
                            <img src={extraImg1} alt='book'/>
                        </SwiperSlide>
                    </Swiper>
                </div>
    );
}