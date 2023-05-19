/* eslint-disable no-plusplus */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { setBookingModal } from '../../redux/slices/booking-slice';
import { usePostBookingMutation, useUpdateBookingMutation, useDeleteBookingMutation } from '../../redux/bookingApi';
import { Loader } from '../loader';
import arrowDropDown from '../../assets/modal/arrowDropDown.svg'
import imgArrowUp from '../../assets/modal/imgArrowUp.svg'
import imgArrowDown from '../../assets/modal/imgArrowDown.svg'
import './calendar-component.css'

export const Calendar = () => {

    const booking = useSelector((state) => state.booking);
    const dispatch = useDispatch();
    const id = booking?.bookingId || false;
    console.log(id)
    const bookingDate = new Date(booking?.bookingDate) || false;

    const [updateDate, {data: updateBookingData, error: updateBookingError, isLoading: updateBookingIsLoading}] = useUpdateBookingMutation();
    const [deleteDate, {data: deleteBookingData, error: deleteBookingError, isLoading: deleteBookingIsLoading}] = useDeleteBookingMutation();
    const [postDate, {data: bookingData, error: bookingError, isLoading: bookingIsLoading}] = usePostBookingMutation();

    const monthArr = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ];

    const [sendDate, setSendDate] = useState({})
    const [date, setDate] = useState(new Date());
    const [openList, setOpenList] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(booking?.bookingDate));

    console.log(selectedDate, new Date(booking?.bookingDate))
    console.log(selectedDate.toISOString() === (new Date(booking?.bookingDate)).toISOString());

    const selectMonth = (month) => {
        setDate(new Date(date.getFullYear(), month));
    };

    const toggleList = () => {
        setOpenList(!openList);
    }

    const onListClick = (i) => {
        selectMonth(i);
        setOpenList(false);
    }

    const nextMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1));
    };
    
    const prevMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1));
    };

    const formDays = () => {
        const daysJSX = [];
        const enabledDates = getEnabledDates();
        const daysNameArr = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
        daysNameArr.forEach((item) => {
            daysJSX.push(
                <div className='days__ceil days__header' key={uuidv4()}>
                {item}
                </div>,
            );
        });
    
        function getEnabledDates() {
            const result = [];
            const newDate = new Date();
            const currentDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());

            switch (currentDate.getDay()) {
                case 6: result.push(
                    new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() + 2,
                    ).getTime(),
                );
                return result;

                case 0: result.push(
                    new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() + 1,
                    ).getTime(),
                );
                result.push(
                    new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() + 2,
                    ).getTime(),
                );
                return result;

                case 5: result.push(
                    currentDate.getTime(),
                    new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() + 3,
                    ).getTime(),
                );
                return result;

                default: result.push(
                    currentDate.getTime(),
                    new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() + 1,
                    ).getTime(),
                );
                return result;
            }
        }
    
        const getPrevDays = () => {
            const prevDate = new Date(date.getFullYear(), date.getMonth(), 0);
            for (let i = prevDate.getDay(); i > 0; i--) {
                daysJSX.push(
                <div
                    data-test-id="day-button"
                    key={uuidv4()}
                    className='days__ceil'>
                    <span>{prevDate.getDate() - i + 1}</span>
                </div>,
                );
            }
        };
    
        const handleClick = (date) => {
            if (enabledDates.includes(date.getTime())) {
                setSelectedDate(date);
            }
        };
    
        const getCurrentDays = () => {
            const lastDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            for (let i = 0; i < lastDateOfMonth; i++) {
                const day = new Date(date.getFullYear(), date.getMonth(), i + 1);
                daysJSX.push(
                <button
                    type='button'
                    data-test-id="day-button"
                    key={uuidv4()}
                    onClick={() => handleClick(day)}
                    className ={`days__ceil 
                        ${i + 1 === new Date().getDate() &&
                        date.getMonth() === new Date().getMonth() &&
                        date.getFullYear() === new Date().getFullYear() ? 'today' : ''}
                        ${selectedDate?.getTime() === day.getTime() ? 'selectedDay' : ''} 
                        ${day.getDay() === 0 || day.getDay() === 6 ? 'weekend' : ''} 
                        ${enabledDates.includes(day.getTime()) ? 'enabled' : ''} 
                    `}>
                    <span>{i + 1}</span>
                </button>,
                );
            }
        };

        const getNextDays = () => {
            let i = 1;

            while (daysJSX.length % 7) {
                const day = new Date(date.getFullYear(), date.getMonth() + 1, i);
                daysJSX.push(
                <button
                    type='button'
                    data-test-id="day-button"
                    key={uuidv4()}
                    onClick={() => handleClick(day)}
                    className ={`days__ceil 
                    ${enabledDates.includes(day.getTime()) ? 'enabled' : ''}
                    `}>
                    <span>{i}</span>
                </button>,
                );
                i++;
            }
        };

        getPrevDays();
        getCurrentDays();
        getNextDays();
        
        return daysJSX;
    };

    const onBookingSubmit = () => {
        if(booking?.bookingId) {
            updateDate({
                id,
                data: {
                    order: true,
                    dateOrder: selectedDate?.toISOString(),
                    book: booking.bookId,
                    customer: booking.userId,
                }
            })
            return;
        }

        postDate({
            data:{
                order: true,
                dateOrder: selectedDate?.toISOString(),
                book: booking.bookId,
                customer: booking.userId,
            }
        })
    }

    const onBookingDelete = () => {
        deleteDate({id})
    }

    useEffect(()=>{

        if (bookingData) {
            dispatch(setBookingModal({
                bookingMainModal: null,
                bookingPageModal: null,
                successResponse: true,
                errorResponse: null,
            }))
        }

        if (bookingError) {
            dispatch(setBookingModal({
                bookingMainModal: null,
                bookingPageModal: null,
                successResponse: null,
                errorResponse: true,
            }))
        }

        if (updateBookingData) {
            dispatch(setBookingModal({
                bookingMainModal: null,
                bookingPageModal: null,
                successResponse: true,
                successUpdateResponse: true,
                errorUpdateResponse: null,
            }))
        }

        if (updateBookingError) {
            dispatch(setBookingModal({
                bookingMainModal: null,
                bookingPageModal: null,
                successUpdateResponse: null,
                errorResponse: true,
                errorUpdateResponse: true,
            }))
        }

        if (deleteBookingData) {
            dispatch(setBookingModal({
                bookingMainModal: null,
                bookingPageModal: null,
                successResponse: true,
                successDeleteResponse: true,
                errorDeleteResponse: null,
            }))
        }

        if (deleteBookingError) {
            dispatch(setBookingModal({
                bookingMainModal: null,
                bookingPageModal: null,
                successDeleteResponse: null,
                errorResponse: true,
                errorDeleteResponse: true,
            }))
        }

    },[bookingData, bookingError, updateBookingData, updateBookingError, deleteBookingData, deleteBookingError, dispatch])

    return (
        <div className='calendar__form'>

            {bookingIsLoading && <div className='booking__loader'><Loader/></div>}
            {updateBookingIsLoading && <div className='booking__loader'><Loader/></div>}
            {deleteBookingIsLoading && <div className='booking__loader'><Loader/></div>}

            <div data-test-id='calendar' className='calendar'>

                <div className='calendar__header'>

                    <button data-test-id='month-select' type='button' className='calendar__month__list' onClick={()=>toggleList()}>
                        <p className='calendar__month__name'>
                            {monthArr[date.getMonth()]} {date.getFullYear()}
                        </p>
                        <img src={arrowDropDown} alt='btn'/>
                    </button>

                    {openList && (
                        <div className='month__list'>
                            {monthArr.map((item, i) => (
                                <button key={uuidv4()} type='button' className='month' onClick={()=>onListClick(i)}>
                                    {item}
                                </button>
                                ))
                            }
                        </div>   
                    )}

                    <div className='calendar__buttons'>
                        <button data-test-id='button-prev-month' type='button' className='calendar__button calendar__next' onClick={()=>prevMonth()}>
                            <img src={imgArrowUp} alt='prev'/>
                        </button>
                        <button data-test-id='button-next-month' type='button' className='calendar__button' onClick={()=>nextMonth()}>
                            <img src={imgArrowDown} alt='next'/>
                        </button>
                    </div>

                </div>

                <div className='calendar__days'>{formDays()}</div>  
            </div>

            {booking?.bookingId ?
            <button data-test-id='booking-button' 
                    disabled={selectedDate.toISOString() === (new Date(booking?.bookingDate)).toISOString()} type='button' 
                    className='booking__button' 
                    onClick={onBookingSubmit}>ЗАБРОНИРОВАТЬ
            </button> :
            <button data-test-id='booking-button' 
                    disabled={selectedDate.toISOString() === (new Date(booking?.bookingDate)).toISOString()} type='button' 
                    className='booking__button' 
                    onClick={onBookingSubmit}>ЗАБРОНИРОВАТЬ
            </button>}

            {booking?.bookingId ? <button data-test-id='booking-cancel-button' 
                    type='button' 
                    className='booking__cancel__button' 
                    onClick={onBookingDelete}>ОТМЕНИТЬ БРОНЬ
            </button> : ''}
        </div>
    )
}