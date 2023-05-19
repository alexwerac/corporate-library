/* eslint-disable consistent-return */

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingModal } from '../../redux/slices/booking-slice';
import { Calendar } from '../calendar';
import { usePostBookingMutation } from '../../redux/bookingApi';
import { Loader } from '../loader';
import imgModalClose from '../../assets/modal/imgModalClose.svg'
import './booking-modal.css'

export const BookingModal = () => {
    const dispatch = useDispatch();
    const booking = useSelector((state) => state.booking);

    const modalRef = useRef(null);
    const modalBackgroundRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {document.body.style.overflow = "scroll"};
    });

    const setModalClose = () => {
        dispatch(setBookingModal({
            bookingMainModal: null,
            bookingPageModal: null,
        }))
    }

    useEffect(() => {
        const onClick = (e) => {
            if(!modalRef.current.contains(e.target) && modalBackgroundRef.current.contains(e.target)) {
                dispatch(setBookingModal({
                    bookingMainModal: null,
                    bookingPageModal: null,
                }))
            }
        };
 
        window.addEventListener('click', onClick);

        return () => window.removeEventListener('click', onClick);
    },[dispatch]);

    return (
        <div data-test-id='modal-outer' ref={modalBackgroundRef} className='booking__modal'>

            <div data-test-id='booking-modal' ref={modalRef} className='booking__modal__container'>
                <div className='booking__modal__container__inner'>
                    <button data-test-id='modal-close-button' type='button' className='booking__modal__close' onClick={setModalClose}>
                        <img src={imgModalClose} alt='close'/>
                    </button>
                    
                    {booking?.bookingId && 
                    <p data-test-id='modal-title' className='booking__modal__title'>Изменение даты <br/> бронирования</p>}
                    {!booking?.bookingId && 
                    <p data-test-id='modal-title' className='booking__modal__title'>Выбор даты <br/> бронирования</p>}
                    
                    <Calendar/>
                </div>
            </div>
        </div>
    );
}
