import { useDispatch, useSelector } from 'react-redux';
import { setBookingModal } from '../../redux/slices/booking-slice';
import './reserve-component.css'

export function SetReserve (id, booking, delivery, user, dispatch, layout) {

    let userData;

    if (user.user !== null) {
        userData = user
    } else {
        userData = JSON.parse(localStorage.getItem('user'));
    }

    const setBooking = (e) => {
        e.preventDefault();
        dispatch(setBookingModal({
            bookingMainModal: true,
            bookingPageModal: null,
            sendDate: null,
            bookId: id,
            userId: userData.user.id,
            bookingDate: null,
            bookingId: null,
        }))
    }
    
    const setBookingRecovery = (e) => {
        e.preventDefault();
        dispatch(setBookingModal({
            bookingMainModal: true,
            bookingPageModal: null,
            bookId: id,
            userId: userData.user.id,
            bookingDate: booking.dateOrder,
            bookingId: booking.id,
        }))
    }

    const getDate = (delivery) => {
        const handedTo = new Date(delivery?.dateHandedTo).toLocaleDateString('ru-ru').split('.');
        return [handedTo[0], handedTo[1]].join('.');
    }


    if (layout === 'true'){
        if (booking === null && delivery === null) {
            return (
                <button data-test-id='booking-button' type="button" className="book__order" onClick={(e) => setBooking(e)}>ЗАБРОНИРОВАТЬ</button>
            )
        }

        if (booking === null && delivery !== null) {
            return (
                <button data-test-id='booking-button' disabled = {true} type="button" className="book__reserved__other">ЗАНЯТА ДО {getDate(delivery)}</button>
            )
        }
    
        if (booking !== null && booking.customerId === userData?.user?.id) {
            return (
                <button data-test-id='booking-button' type="button" className="book__reserved" onClick={(e) => setBookingRecovery(e)}>ЗАБРОНИРОВАНА</button>
            )
        }

        if (booking !== null && booking.customerId !== userData?.user?.id) {
            return (
                <button data-test-id='booking-button' disabled = {true} type="button" className="book__reserved__other">ЗАБРОНИРОВАНА</button>
            )
        }

        return (
            <button type="button" className="book__booked">{booking}</button>
        )
    }

    if (layout === 'book'){
        if (booking === null && delivery === null) {
            return (
                <button data-test-id='booking-button' type="button" className="book__page__button" onClick={(e) => setBooking(e)}>ЗАБРОНИРОВАТЬ</button>
            )
        }

        if (booking === null && delivery !== null) {
            return (
                <button data-test-id='booking-button' disabled = {true} type="button" className="book__page__reserved__other">ЗАНЯТА ДО {getDate(delivery)}</button>
            )
        }
    
        if (booking !== null && booking.customerId === userData?.user?.id) {
            return (
                <button data-test-id='booking-button' type="button" className="book__page__reserved" onClick={(e) => setBookingRecovery(e)}>ЗАБРОНИРОВАНА</button>
            )
        }

        if (booking !== null && booking.customerId !== userData?.user?.id) {
            return (
                <button data-test-id='booking-button' disabled = {true} type="button" className="book__page__reserved__other">ЗАБРОНИРОВАНА</button>
            )
        }

        return (
            <button type="button" className="book__booked">{booking}</button>
        )
    }

    if (layout === 'false'){
        if (booking === null && delivery === null) {
            return (
                <button data-test-id='booking-button' type="button" className="book__order book__type__list" onClick={(e) => setBooking(e)}>ЗАБРОНИРОВАТЬ</button>
            )
        }

        if (booking === null && delivery !== null) {
            return (
                <button data-test-id='booking-button' disabled = {true} type="button" className="book__reserved__other book__type__list">ЗАНЯТА ДО {getDate(delivery)}</button>
            )
        }
    
        if (booking !== null && booking.customerId === userData?.user?.id) {
            return (
                <button data-test-id='booking-button' type="button" className="book__reserved book__type__list" onClick={(e) => setBookingRecovery(e)}>ЗАБРОНИРОВАНА</button>
            )
        }

        if (booking !== null && booking.customerId !== userData?.user?.id) {
            return (
                <button data-test-id='booking-button' disabled = {true} type="button" className="book__reserved__other book__type__list">ЗАБРОНИРОВАНА</button>
            )
        }

        return (
            <button type="button" className="book__booked">{booking}</button>
        )
    }
    
    return layout;
}