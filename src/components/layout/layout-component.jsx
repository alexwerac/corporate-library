/* eslint-disable prefer-destructuring */

import { Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect, useLayoutEffect } from 'react';
import { match } from 'assert';
import { useDispatch, useSelector } from 'react-redux';
import { SetReserve } from '../reserve/reserve-component';
import { setStars } from '../stars/stars-component';

import { useGetBooksQuery, useGetCategoriesQuery, booksApi} from '../../redux/booksApi';
import { Loader } from '../loader';
import { Error } from '../error';
import './layout-component.css'

import altBook from '../../assets/main/altBook.png'

export function useSelectLayout(layout, ratingSort, inputValue) {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const {data = [], error, isLoading, status} = useGetBooksQuery();

    const {data: categories = [], error: categoriesError, isLoading: categoriesLoading} = useGetCategoriesQuery({}, {refetchOnMountOrArgChange: false});

    const [category, setCategory] = useState('all');
    const [displayCategory, setDisplayCategory] = useState({name: '', path: '', id: '101'});
    const [booksCategory, setBooksCategory] = useState(data);
    const [booksRating, setBooksRating] = useState(data);
    const [booksSearch, setBooksSearch] = useState(data);

    const location = useLocation();

    // category of the page

    useEffect(() => {
        if (isLoading) return;
        if (error) return;
        if (location.pathname.split('/').reverse()[0] === '') {
            setCategory('all');
        } else {
            setCategory(location.pathname.split('/').reverse()[0]);
        }
        
    }, [isLoading, error, location]);

    // get object from categories api

    useLayoutEffect(() => {
        if (isLoading) return;
        if (error) return;

        if (category === 'all') {
            setDisplayCategory({name: 'Все книги', path: 'all', id: '100'});
        } else {
            setDisplayCategory(categories.find((item)=> (item.path === category)));
        }
    }, [isLoading, error, categories, category]);

    // filter books by category

    useLayoutEffect(() => {
        if (isLoading) return;
        if (error) return;
        const booksCategorySort = [...data];

        if (displayCategory?.name === 'Все книги') {
            setBooksCategory(booksCategorySort);
        } else {
            setBooksCategory(booksCategorySort?.filter((book)=>(book.categories[0] === displayCategory.name)));
        }
        
    }, [isLoading, error, data, displayCategory]);

    // filter books by rating

    useLayoutEffect(() => {
        if (isLoading) return;
        if (error) return;
        const booksRatingSort = [...booksCategory];

        if (ratingSort === true) {
            setBooksRating(booksRatingSort?.sort((a, b)=>(a.rating === null) - (b.rating === null) || -(a.rating > b.rating) || +(a.rating < b.rating)));
        } else {
            setBooksRating(booksRatingSort?.sort((a, b)=>(a.rating === null) - (b.rating === null) || -(a.rating > b.rating) || +(a.rating < b.rating)).reverse());
        }
        
    }, [isLoading, error, booksCategory, ratingSort]);

    // filter books by search

    useLayoutEffect(() => {
        if (isLoading) return;
        if (error) return;
        const booksSearchSort = [...booksRating];
        
        const insertHighlight = (booksHighlight, booksHighLightView) => {
            const booksResult = [];
            const booksArr = JSON.parse(JSON.stringify(booksHighlight));
            const booksTitles = JSON.parse(JSON.stringify(booksHighLightView));
        
            if(booksArr) {
                for (let i = 0; i < booksArr.length; i++) {   
                    booksArr[i].title = booksTitles[0];
                    booksTitles.shift()   
                    booksResult.push(booksArr[i]);
                }
                return booksResult;
            }
            return booksHighlight;
        }

        if (inputValue === '') {
            setBooksSearch(booksSearchSort);
        } else {
            const pattern = new RegExp(`${inputValue}`, 'ig')
            const booksHighlight = booksSearchSort.filter((book) => (book.title.match(pattern)));
            let booksHighLightView = [...booksHighlight]
            booksHighLightView = booksHighLightView.map(item => item.title.replace(pattern, match => `<span data-test-id='highlight-matches' classname='highlight'>${match}</span>`));

            setBooksSearch(insertHighlight(booksHighlight, booksHighLightView));  
        }
        
    }, [isLoading, error, booksRating, inputValue]);

    if (isLoading) return <Loader/>

    if (error) return <Error/>

    if (booksCategory.length === 0) {
        return <div data-test-id='empty-category' className='category__no__books'>В этой категории книг ещё нет</div>
    }

    if (booksSearch.length === 0) {
        return <div data-test-id='search-result-not-found' className='category__no__books'>По запросу ничего не найдено</div>
    }

    function checkImg(image) {
        if (image === null) {
            return altBook;
        }
        return `${image.url}`;
    }

    if(layout === 'true') {
        return (
            <section data-test-id='content' className='books__container'>
            {booksSearch?.map((item)=>
                    (
                        <Link to={`/books/${category}/${item.id}`} className='book' data-test-id='card' key={item.id}>
                            <div className='book__container'>
                                <div className='book__info'>
                                    <img src={checkImg(item.image)} alt='book' className='book__img'/>
                                    {setStars(item.rating, layout)}
                                </div>
                                <div className='book__title'
                                    dangerouslySetInnerHTML={{__html: item.title}}
                                />
                                <div className='book__add'>
                                    <p className='book__author'>{item.authors}</p>
                                    {SetReserve(item.id, item.booking, item.delivery, user, dispatch, layout)}
                                </div>
                            </div>
                        </Link>
                    )
                )
            }
        </section> 
        )
    }

    if(layout === 'false') {
        return (
            <section data-test-id='content' className='books__container__list'>
            {booksSearch?.map((item)=>
                    (
                        <Link to={`/books/all/${item.id}`} className='book__list' data-test-id='card' key={item.id}>
                            <div className='book__container__list'>
                                <img src={checkImg(item.image)} alt={item.title} className='book__img__list'/>
                                <div className='container__list__inner'>
                                    <div className='book__info__list'>
                                        <p className='book__title__list'>{item.title}</p>
                                        <p className='book__author__list'>{item.authors}</p>
                                    </div>
                                    <div className='book__add__list'>  
                                        {setStars(item.rating, layout)}
                                        {SetReserve(item.id, item.booking, item.delivery, user, dispatch, layout)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                )
            }
        </section> 
        )
    }

    return layout;
}