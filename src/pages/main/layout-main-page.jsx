import './layout-main-page.css';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'

import { Nav } from '../../components/nav/nav-component';
import { MainPage } from '../main-page';
import { RulesPage } from '../rules-page';
import { TermsPage } from '../terms-page';

export const LayoutMainPage = () => {

    const [width, setWidth] = useState(window.innerWidth);
    const [category, setCategory] = useState('/all')

    const handleCategoryClick = () => {
    }

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const location = useLocation();

    useEffect(() => {
        setCategory(`/${location.pathname.split('/').reverse()[0]}`)
    }, [location]);

    return (
        <section className='main'>
            <div className='main__container'>
                
                {width > 768 ? <div className='nav__container__inner'>
                    <Nav onClick={handleCategoryClick}/>
                </div> : ''}
                
                {category === '/'? <MainPage/> : ''}
                {category === '/all'? <MainPage/> : ''}
                {category === '/rules'? <RulesPage/> : ''}
                {category === '/terms'? <TermsPage/> : ''}

                {category.match(/[/]/) 
                && category !== '/' 
                && category !== '/all' 
                && category !== '/rules'
                && category !== '/terms'? <MainPage/> : ''}

            </div>
        </section>
    );
} 
