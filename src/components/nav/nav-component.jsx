import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useGetCategoriesQuery, useGetBooksQuery} from '../../redux/booksApi';
import navOpen from '../../assets/nav/navOpen.svg'
import navClose from '../../assets/nav/navClose.svg'

import './nav-component.css'

export const Nav = ({onClick}) => {
    const {data = [], error, isLoading} = useGetCategoriesQuery({}, {refetchOnMountOrArgChange: false});
    const {data: books, error: errorBooks, isLoading: isLoadingBooks} = useGetBooksQuery();

    const [width, setWidth] = useState(window.innerWidth);
    const [page, setPage] = useState('main');
    const [navView, setNavView] = useState(false);
    const [category, setCategory] = useState('all');

    const [categoryCount, setCategoryCount] = useState(data);

    const location = useLocation();

    const handleCategoryClick = () => {
        onClick(); 
    }

    useEffect(() => {
        if (isLoadingBooks) return;
        if (errorBooks) return;
        if (error) return;
        if (isLoading) return;
        const counter = {};
        const newCategoryData = [];

        books.forEach(element => {
            counter[element.categories[0]] = counter[element.categories[0]] + 1 || 1
        });

        data.forEach(element => {
            let count = 0;
            if (counter[element.name] !== undefined) {
                count = counter[element.name]
            } else {
                count = 0;
            }
            newCategoryData.push({...element, count})
        })

        setCategoryCount(newCategoryData);
        
    }, [isLoading, error, isLoadingBooks, errorBooks, books, data]);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (location.pathname.split('/').reverse()[0] === '') {
            setCategory('all');
        } else {
            setCategory(location.pathname.split('/').reverse()[0]);
        }
        
    }, [location]);

    return (
        <nav className='nav__container'>
            {isLoading ? <h1>Loading...</h1>: ''}
            <Link to='/books/all' 
            data-test-id={`${width <= 768 ? 'burger-showcase': 'navigation-showcase'}`} 
            className={`nav__toggle nav__link ${page==='main'? 'active__main__link border' : ''}`} 
            onClick={() => {setNavView(!navView); setPage('main');}}
            >
                <p>Витрина книг</p>
                {page === 'main' ? navView === false ? 
                <img src={navClose} alt='close' className='nav__open'/> : 
                <img src={navOpen} alt='open' className='nav__open'/> : ''}
            </Link>
            
            <div className={`nav__categories ${navView === false ? '': 'not__visible'}`}>   
                <Link to='/books/all' 
                data-test-id={`${width <= 768 ? 'burger-books' : 'navigation-books'}`} 
                className={`nav__category__title ${category === 'all' ? 'category__active' : ''}`}
                onClick={handleCategoryClick}
                >Все книги</Link>
                {categoryCount.map((item)=>
                    (
                        <NavLink to={`books/${item.path}`} 
                        className={({ isActive }) => (isActive ? 'nav__category nav__category__title category__active' : 'nav__category nav__category__title')} 
                        onClick={handleCategoryClick}
                        key={item.id}
                        >
                            <p>
                                <span data-test-id={width <= 768 ? `burger-${item.path}` : `navigation-${item.path}`}>{item.name}</span>
                                <span data-test-id={width <= 768 ? `burger-book-count-for-${item.path}` : `navigation-book-count-for-${item.path}`} 
                                className='nav__category__count'>{item.count}</span>
                            </p>
                        </NavLink>
                    )
                )}
            </div>
            
            <Link to='/rules' data-test-id={`${width <= 768 ? 'burger-terms': 'navigation-terms'}`} className={`nav__link nav__rules ${page==='rules'? 'active__main__link border' : ''}`} onClick={() => {setPage('rules'); setNavView(true)}}>Правила пользования</Link>
            <Link to='/terms' className={`nav__link nav__terms ${page==='terms'? 'active__main__link border' : ''}`} onClick={() => {setPage('terms'); setNavView(true)}}>Договор оферты</Link>
        </nav>
    );
}