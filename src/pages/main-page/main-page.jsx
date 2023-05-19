import './main-page.css'
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSelectLayout } from '../../components/layout/layout-component';
import { useGetBooksQuery} from '../../redux/booksApi';

import imgSearch from '../../assets/main/imgSearch.svg'
import imgRating from '../../assets/main/imgRating.svg'
import imgRatingDecrease from '../../assets/main/imgRatingDecrease.svg'
import imgBar from '../../assets/main/imgBar.svg'
import imgBarChange from '../../assets/main/imgBarChange.svg'
import imgTable from '../../assets/main/imgTable.svg'
import imgTableChange from '../../assets/main/imgTableChange.svg'
import searchClose from '../../assets/main/searchClose.svg'

import { BookingModal } from '../../components/booking-modal';
import { AlertSuccess } from '../../components/alert-success';
import { Loader } from '../../components/loader';

export const MainPage = () => {
    const booking = useSelector((state) => state.booking);

    const {data = [], error, isLoading} = useGetBooksQuery();

    const [layout, setLayout] = useState('true');
    const [input, setInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [ratingSort, setRatingSort] = useState(true);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [alertShown, setAlertShown] = useState(false)
    const closeAlertTimer = useRef()

    const hideAlert = () => {
        setAlertShown(false);
    }

    useEffect(()=>{
    
        const showAlert = () => {
            setAlertShown(true);
            closeAlertTimer.current = setTimeout(hideAlert, 4000)
        }

        if(booking?.successResponse) {
            showAlert()
        }

        if(booking?.errorResponse) {
            showAlert()
        }

    },[booking])

    return ( 
        <section className='right__container'>

            {alertShown && <AlertSuccess onClick={hideAlert}/>}            
                
            {error || isLoading ? '' : 
                <section className='search'>
                    <div className={`${input === false ? 'search__name':'search__name__full'}`}>
                        <div className={`${input === false ? 'search__inner':'search__inner__full'}`}>
                            <div className='search__inner__left'>
                                <button data-test-id='button-search-open' 
                                type='button' className={`${input === false ? 'search__open':'search__open__none'}`} 
                                onClick={() => setInput(true)}
                                disabled={width > 320 ? true : false}
                                >
                                    <img src={imgSearch} alt='search' className='search__img'/>
                                </button>
                                <input data-test-id='input-search' 
                                className={`${input === false ? 'search__input':'search__input__full'}`} 
                                placeholder='Поиск книги или автора…'
                                onChange={(e) => setInputValue(e.target.value)}
                                />
                            </div>
                            
                            <button data-test-id='button-search-close' type='button' className='search__open' onClick={() => setInput(false)}>
                                <img src={searchClose}  alt='search' className={`search__close ${input === false ? 'not__visible' : ''}`}/>
                            </button>
                        </div>

                    </div>
        
                    <button data-test-id='sort-rating-button'
                        type='button' 
                        className={`${input === false ? 'search__rating':'not__visible'}`}
                        onClick={() => setRatingSort(!ratingSort)}
                    >
                        <img src={ratingSort === true ? imgRating : imgRatingDecrease} alt='rating' className='search__img'/>
                        <div className='search__rating__text'>По рейтингу</div>
                    </button>
        
                    <div className={`${input === false ? 'layout__buttons':'not__visible'}`}>
                        <button type='submit' className={`layout__button button__bar ${layout==='true' ? '' : 'active__table'}`} data-test-id='button-menu-view-window' onClick={()=>{setLayout('true')}}>
                            <img src={layout==='true'? imgBar : imgBarChange} alt='bar' className='layout__img'/>
                        </button>
                        <button type='submit' className={`layout__button button__table ${layout==='true' ? '' : 'active__bar'}`} data-test-id='button-menu-view-list' onClick={()=>{setLayout('false')}}>
                            <img src={layout==='true'? imgTable : imgTableChange} alt='table' className='layout__img'/>
                        </button>
                    </div>
                </section>
            }
            
    
            {useSelectLayout(layout, ratingSort, inputValue)}

            {booking.bookingMainModal && <BookingModal/>}

        </section>    
    )
} 