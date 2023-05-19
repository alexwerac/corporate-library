/* eslint-disable consistent-return */

import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './header-component.css'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/slices/user-slice';
import { Nav } from '../nav/nav-component'

import HeaderLogo from '../../assets/header/HeaderLogo.png'
import HeaderImg from '../../assets/header/HeaderImg.PNG'
import HeaderUserLogo from '../../assets/header/HeaderUserLogo.png'

export const Header = () => {
    const burgerMenuRef = useRef(null);
    const burgerUserRef = useRef(null);
    const burgerMenuButton = useRef(null);

    const [menuProfile, setMenuProfile] = useState(false)
    const [burgerMenu, setBurgerMenu] = useState(false);
    const [category, setCategory] = useState('all');

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      if (location.pathname.split('/').reverse()[0] === '') {
        setCategory('all');
      } else {
        setCategory(location.pathname.split('/').reverse()[0]);
      }
      
    }, [location]);

    const handleCategoryClick = () => {
        setBurgerMenu(!burgerMenu);
    }

    const userLogout = () => {
        localStorage.removeItem('user');
        dispatch(setUser({jwt: null, user: null}));
        navigate('/auth')
    }

    useEffect(() => {
        if(!burgerMenu) {
            return;
        }
        const onClick = (e) =>burgerUserRef.current.contains(e.target) || burgerMenuRef.current.contains(e.target) || burgerMenuButton.current.contains(e.target) || setBurgerMenu(!burgerMenu);
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, [burgerMenu]);

    const onClickNav = () => {
        userLogout(); 
        setBurgerMenu(!burgerMenu);
    }

    const onClickMenuProfile = () => {
        userLogout(); 
        setMenuProfile(!menuProfile);
    }

    if (category === 'auth' || category === 'registration' || category === 'forgot-pass') {
        return ''
    }

    return (
        <header className={`header ${menuProfile ? 'header__menu__open ' : ''}`}>
            <div className='container'>
                <Link to='/'><img src={HeaderImg} alt='Logo' className='header__logo'/></Link>
                
                <div data-test-id='button-burger' className='hamburger__menu'>
                    <input ref={burgerMenuButton} checked={`${burgerMenu === true ? 'checked' : ''}`} id='menu__toggle' type='checkbox' onChange={() => setBurgerMenu(!burgerMenu)}/>
                    <div className='menu__btn' htmlFor='menu__toggle'>
                        <span/>
                    </div>
                </div>

                {burgerMenu === true ? 
                    <nav ref={burgerMenuRef} className='nav__burger__container' data-test-id='burger-navigation'>
                        
                        <div className='nav__burger__container__inner'>
                            <Nav onClick={handleCategoryClick}/>
                        </div>
                        
                        <div ref={burgerUserRef} className='nav__user'>
                            <Link to='/profile' className='nav__link nav__profile'>Профиль</Link>
                            <button data-test-id='exit-button' type='button' className='nav__link nav__exit' onClick={onClickNav}>Выход</button>
                        </div>
                    </nav> : ''}

                <div className='container__inner'>
                    <h1 className='header__title'>
                        Библиотека
                    </h1>
                    <div className='header__user'>
                        <p type='button' className='header__user__text'>
                            Привет, Иван!
                        </p>
                        <button type='button' className='header__user__logo' onClick={()=>setMenuProfile(!menuProfile)}> 
                            <img src={HeaderUserLogo} alt='UserLogo' />
                        </button>
                        {menuProfile && <div className='menu__profile'>
                            <div className='menu__profile__inner'>
                                <Link to='/profile' className='nav__link nav__profile__menu'>Профиль</Link>
                                <button data-test-id='exit-button' type='button' className='nav__link nav__exit__menu' onClick={onClickMenuProfile}>Выход</button>
                            </div>    
                        </div>}
                    </div>
                </div>
    
            </div>
        </header>
    );
} 
