import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import closeCross from '../../assets/alert/closeCross.svg'
import checkCircle from '../../assets/alert/checkCircle.svg'
import warningCircle from '../../assets/alert/warningCircle.svg'

export const AlertSuccess = ({onClick}) => {
    const booking = useSelector((state) => state.booking);

    const handleCloseClick = () => {
        onClick();
    }
    
    return (
        <div className='alert'>
            <div data-test-id='error' className={`${booking.successResponse ? 'success__alert' : ''} ${booking.errorResponse ? 'error__alert' : ''}`}>
                <div className='alert__inner'>
                    <div className='alert__inner__left'>
                        <img className='alert__img' src={booking.successResponse ? checkCircle : warningCircle} alt=''/>
                        {booking.successUpdateResponse && 
                        <p className='alert__text'>Изменения успешно сохранены!</p>}
                        {booking.successDeleteResponse && 
                        <p className='alert__text'>Бронирование книги успешно отменено!</p>}
                        {booking.successResponse && !booking.successUpdateResponse && !booking.successDeleteResponse &&
                        <p className='alert__text'>Книга забронирована. Подробности можно посмотреть на странице Профиль</p>}

                        {booking.errorUpdateResponse && 
                        <p className='alert__text'>Изменения не были сохранены. Попробуйте позже!</p>}
                        {booking.errorDeleteResponse && 
                        <p className='alert__text'>Не удалось снять бронирование книги. Попробуйте позже!</p>}
                        {booking.errorResponse && !booking.successUpdateResponse && !booking.successDeleteResponse &&
                        <p className='alert__text'>Что-то пошло не так, книга не забронирована. Попробуйте позже!</p>}
                    </div>
                    <button data-test-id='alert-close' type='button' className='alert__button' onClick={handleCloseClick}>
                        <img src={closeCross} alt=''/>
                    </button>
                </div>
            </div>
        </div>
    )
}