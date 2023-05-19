/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable object-shorthand */

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { SetSwiper } from '../../components/swiper/set-swiper';

import { Loader } from '../../components/loader';
import { Error } from '../../components/error';
import iconEmptyBook from '../../assets/books/iconEmptyBook.png';

import { setStars } from '../../components/stars/stars-component'
import { SetReserve } from '../../components/reserve/reserve-component';

import imgUser from '../../assets/books/imgUser.png';
import commentClose from '../../assets/comment/commentClose.svg';
import commentOpen from '../../assets/comment/commentOpen.svg';

import checkCircle from '../../assets/alert/checkCircle.svg'
import warningCircle from '../../assets/alert/warningCircle.svg'
import closeCross from '../../assets/alert/closeCross.svg'
import imgModalClose from '../../assets/modal/imgModalClose.svg'
import fullStar from '../../assets/main/fullStar.svg'
import emptyStar from '../../assets/main/emptyStar.svg'

import { BookingModal } from '../../components/booking-modal';
import { useGetBookQuery } from '../../redux/booksApi';
import { usePostCommentMutation } from '../../redux/commentsApi';

import './book-page.css';

export const BookPage = () => {

    const modalRef = useRef(null);
    const modalBackgroundRef = useRef(null);

    const monthArr = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ]

    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    let userData;

    if (user.user !== null) {
        userData = user
    } else {
        userData = JSON.parse(localStorage.getItem('user'));
    }

    const {data: book, error, isLoading} = useGetBookQuery(id);
    const [postComment, {data: commentData, error: commentError, isLoading: commentIsLoading}] = usePostCommentMutation();

    const location = useLocation();
    const [commentView, setCommentView] = useState(true);
    const [category, setCategory] = useState('all');

    const booking = useSelector((state) => state.booking);

    const [commentSort, setCommentSort] = useState()

    useLayoutEffect(()=>{
        if (isLoading) return;
        if(error) return;

        setCommentSort(book?.comments.slice().reverse())
    },[isLoading, error, book])

    useEffect(() => {
        if (isLoading) return;
        if (error) return;

        if (location.pathname.split('/').reverse()[1] === '') {
            setCategory('all');
        } else {
            setCategory(location.pathname.split('/').reverse()[1]);
        }
        
    }, [isLoading, error, location]);

    const checkImg = (book) =>{
        if (book.images === null) {
            return iconEmptyBook
        }
        return `https://strapi.cleverland.by${book.images[0].url}`
    }

    const [alertShown, setAlertShown] = useState(false)
    const [commentAlert, setCommentAlert] = useState(false)
    const closeAlertTimer = useRef()
    const closeCommentAlertTimer = useRef()

    const hideAlert = () => {
        setAlertShown(false);
    }

    const hideCommentAlert = () => {
        setCommentAlert(false);
    }

    const showCommentAlert = () => {
        setCommentAlert(true);
        closeCommentAlertTimer.current = setTimeout(hideCommentAlert, 4000)
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

    const [commentModal, setCommentModal] = useState(false)

    const handleCommentClick = () => {
        setCommentModal(true);
    }

    const setCommentModalClose = () => {
        setCommentModal(false);
    }

    useEffect(() => {
        const onClick = (e) => {
            if(!modalRef.current?.contains(e?.target) && modalBackgroundRef.current?.contains(e?.target)) {
                setCommentModal(false);
            }
        };
 
        window.addEventListener('click', onClick);

        return () => window.removeEventListener('click', onClick);
    },[commentModal]);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);

    function starRating() {
        return (
            <div data-test-id='rating' className="rating">
                {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <button
                        data-test-id='star'
                        type="button"
                        key={index}
                        className='rating__star'
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                    >
                        <img 
                            className='rating__star__img'
                            data-test-id={index <= (hover || rating) ? 'star-active' : ''} 
                            src={index <= (hover || rating) ? fullStar : emptyStar} 
                            alt='star'
                        />
                    </button>
                );
                })}
            </div>
        );
    };

    const sendCommentClick = () => {
        postComment({
            data: {
                rating: rating,
                text: comment,
                book: id,
                user: userData?.user?.id,
            }
        })

        setCommentModalClose();
        showCommentAlert();
    }

    if (isLoading) return <div><Loader/><div className='no-book'/></div>
    if (error) return <div><Error/><div className='no-book'>
            <div className="book__page__direction margin-top">
                <div className="book__page__direction__container">
                    <Link to={`/books/${category}`} className='book__page__direction__text'> {category === 'all' ? 'Все книги' : category} /</Link>
                </div>
            </div>
        </div>
    </div>

    return (
        <section className='book__page'>

            {booking.bookingMainModal && <BookingModal/>}
            {commentIsLoading && <div className='booking__loader'><Loader/></div>}

            {alertShown && booking.successResponse && 
                <div className='alert'>
                    <div data-test-id='error' className='success__alert'>
                        <div className='alert__inner'>
                            <div className='alert__inner__left'>
                                <img className='alert__img' src={checkCircle} alt=''/>
                                {booking.successUpdateResponse && 
                                <p className='alert__text'>Изменения успешно сохранены!</p>}
                                {booking.successDeleteResponse && 
                                <p className='alert__text'>Бронирование книги успешно отменено!</p>}
                                {booking.successResponse && !booking.successUpdateResponse && !booking.successDeleteResponse &&
                                <p className='alert__text'>Книга забронирована. Подробности можно посмотреть на странице Профиль</p>}
                            </div>
                            <button data-test-id='alert-close' type='button' className='alert__button' onClick={()=>hideAlert()}>
                                <img src={closeCross} alt=''/>
                            </button>
                        </div>
                    </div>
                </div>
            }

            {alertShown && booking.errorResponse && 
                <div className='alert'>
                    <div data-test-id='error' className='error__alert'>
                        <div className='alert__inner'>
                            <div className='alert__inner__left'>
                                <img className='alert__img' src={warningCircle} alt=''/>
                                {booking.errorUpdateResponse && 
                                <p className='alert__text'>Изменения не были сохранены. Попробуйте позже!</p>}
                                {booking.errorDeleteResponse && 
                                <p className='alert__text'>Не удалось снять бронирование книги. Попробуйте позже!</p>}
                                {booking.errorResponse && !booking.successUpdateResponse && !booking.successDeleteResponse &&
                                <p className='alert__text'>Что-то пошло не так, книга не забронирована. Попробуйте позже!</p>}
                            </div>
                            <button data-test-id='alert-close' type='button' className='alert__button' onClick={()=>hideCommentAlert()}>
                                <img src={closeCross} alt=''/>
                            </button>
                        </div>
                    </div>
                </div>
            }

            {commentAlert && commentData && <div className='alert'>
                    <div data-test-id='error' className='success__alert'>
                        <div className='alert__inner'>
                            <div className='alert__inner__left'>
                                <img className='alert__img' src={checkCircle} alt=''/>
                                <p className='alert__text'>Спасибо, что нашли время оценить книгу!</p>
                            </div>
                            <button data-test-id='alert-close' type='button' className='alert__button' onClick={()=>hideCommentAlert()}>
                                <img src={closeCross} alt=''/>
                            </button>
                        </div>
                    </div>
                </div>
            }

            {commentAlert && commentError && <div className='alert'>
                    <div data-test-id='error' className='error__alert'>
                        <div className='alert__inner'>
                            <div className='alert__inner__left'>
                                <img className='alert__img' src={warningCircle} alt=''/>
                                <p className='alert__text'>Оценка не была отправлена. Попробуйте позже!</p>
                            </div>
                            <button data-test-id='alert-close' type='button' className='alert__button' onClick={()=>hideAlert()}>
                                <img src={closeCross} alt=''/>
                            </button>
                        </div>
                    </div>
                </div>
            }

            {commentModal && <div data-test-id='modal-outer' ref={modalBackgroundRef} className='comment__modal'>
                <div data-test-id='modal-rate-book' ref={modalRef} className='comment__modal__container'>
                    <div className='comment__modal__container__inner'>
                        <button data-test-id='modal-close-button' type='button' className='comment__modal__close' onClick={()=>{setCommentModalClose()}}>
                            <img src={imgModalClose} alt='close'/>
                        </button>

                        <p data-test-id='modal-title' className='comment__modal__title'>Оцените книгу</p>
                        <p className='comment__modal__text'>Ваша оценка</p>

                        {starRating()}

                        <textarea onChange={(e)=>{setComment(e.target.value)}} data-test-id='comment' className='comment__modal__input' placeholder='Оставить отзыв'/>

                        <button onClick={()=>sendCommentClick()} data-test-id='button-comment' className='comment__modal__button' type='button'>Оценить</button>
                    </div>
                </div>
            </div>}

            <div className="book__page__direction">
                <div className="book__page__direction__container">
                    <Link data-test-id='breadcrumbs-link' 
                    to={`/books/${category}`} 
                    className='book__page__direction__text'>{category === 'all' ? 'Все книги' : book.categories[0]}</Link>
                    <span className='book__page__direction__text'>&nbsp;/&nbsp;</span>
                    <span className='book__page__direction__text' data-test-id='book-name'>{book.title || category}</span>
                </div>
            </div>

            <div className='book__page__main'>
                <div className='book__page__left'>
                    <img src={checkImg(book)} alt='book' className='book__page__img'/>
                    {/* {book.images.length > 1  ? SetSwiper() : ''} */}
                </div>
                <div className='book__page__right'>
                    <p data-test-id='book-title' className='book__page__name'>{book.title}</p>
                    <p className='book__page__author'>{book.authors}, {book.issueYear}</p>
                    {SetReserve(book.id, book.booking, book.delivery, user, dispatch, 'book')}
                    <p className='book__page__title'>О книге</p>
                    <p className='book__page__about'>{book.description}</p>
                </div>
            </div>

            <div className='book__page__rating'>
                <div className='book__page__rating__container'>
                    <p className='book__page__title__border'>Рейтинг</p>
                    <div className='book__page__rating__inner'>
                        {setStars(book.rating, 'book')}
                        <p className='book__page__rating__num'>{book.rating}</p>
                    </div>
                </div>
            </div>

            <div className='book__page__details'>
                <div className='book__page__details__container'>
                    <p className='book__page__title__border'>Подробная информация</p>
                    <div className='book__page__details__inner'>
                        <div className='book__page__details__left'>

                            <div className='book__page__details__column'>
                                <p className='book__page__details__title'>Издательство</p>
                                <p className='book__page__details__title'>Год издания</p>
                                <p className='book__page__details__title'>Страниц</p>
                                <p className='book__page__details__title'>Переплёт</p>
                                <p className='book__page__details__title'>Формат</p>
                            </div>

                            <div className='book__page__details__column'>
                                <p className='book__page__details__text'>{book.publish}</p>
                                <p className='book__page__details__text'>{book.issueYear}</p>
                                <p className='book__page__details__text'>{book.pages}</p>
                                <p className='book__page__details__text'>{book.cover}</p>
                                <p className='book__page__details__text'>{book.format}</p>
                            </div>

                        </div>

                        <div className='book__page__details__right'>

                            <div className='book__page__details__column'>
                                <p className='book__page__details__title mar'>Жанр</p>
                                <p className='book__page__details__title'>Вес</p>
                                <p className='book__page__details__title'>ISBN</p>
                                <p className='book__page__details__title'>Изготовитель</p>
                            </div>

                            <div className='book__page__details__column'>
                                <p className='book__page__details__text wider'>{book.categories[0]}</p>
                                <p className='book__page__details__text wider'>{book.weight}</p>
                                <p className='book__page__details__text wider'>{book.ISBN}</p>
                                <p className='book__page__details__text wider'>{book.producer}</p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <div className='book__page__review'>
                <div className='book__page__review__container'>
                    <div className='book__page__button__container'>
                        <p className='book__page__title__border'>Отзывы<span className='review__count'>{book.comments === null ? 0 : book.comments.length}</span>
                            {commentView === true ?
                            <button data-test-id='button-hide-reviews' type='button' className='comment__view__button' onClick={()=>{setCommentView(!commentView)}}>
                                <img src={commentClose} alt='close'/>
                            </button>:
                            <button data-test-id='button-hide-reviews' type='button' className='comment__view__button' onClick={()=>{setCommentView(!commentView)}}>
                                <img src={commentOpen} alt='open'/>
                            </button>
                                
                            }
                        </p>
                    </div>

                    {book.comments === null ? '' : 
                        <div data-test-id='reviews' className={`comments ${commentView === false? 'not__visible' : ''}`}>
                            {commentSort?.map((item)=>(
                                    <div data-test-id='comment-wrapper' className='book__page__review__user' key={item.id}>
                                        <div className='book__page__review__inner'>
                                            <img src={imgUser} alt='user' className='book__page__review__img'/>
                                            <div className='book__page__review__inner__column'>
                                                <p data-test-id='comment-author' className='book__page__review__username'>{item.user.firstName} {item.user.lastName}</p>
                                                <p data-test-id='comment-date' className='book__page__review__date'>{new Date(item.createdAt).getDate()} {monthArr[new Date(item.createdAt).getMonth()]} {new Date(item.createdAt).getFullYear()}</p>
                                            </div>
                                        </div>
                                        <div data-test-id='rating' className='book__page__review__inner'>
                                            {setStars(item.rating, 'book')}
                                        </div>
                                        <p data-test-id='comment-text' className='book__page__review__text'>{item.text}</p>
                                    </div>
                                )
                            )}
                        </div>
                    }
                    
                    <button data-test-id='button-rate-book' type='button' className='book__page__review__button' onClick={()=>handleCommentClick()}>ОЦЕНИТЬ КНИГУ</button>

                </div>
            </div>
        </section>
    );
}
