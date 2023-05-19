import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import './footer-component.css'
import FacebookIcon from '../../assets/footer/Facebook.svg'
import InstagramIcon from '../../assets/footer/Instagram.svg'
import VKIcon from '../../assets/footer/VK.svg'
import LinkedInIcon from '../../assets/footer/LinkedIn.svg'

export const Footer = () => { 
    const [category, setCategory] = useState('all');
    const location = useLocation();
    
    useEffect(() => {
      if (location.pathname.split('/').reverse()[0] === '') {
        setCategory('all');
      } else {
        setCategory(location.pathname.split('/').reverse()[0]);
      }
      
    }, [location]);

    if (category === 'auth' || category === 'registration' || category === 'forgot-pass') {
        return ''
    }

    return (
        <footer className='footer'>
            <div className='footer__container'>
                <div className='footer__copyright'> &copy; 2004-2023 ISsoft Solutions. Все права защищены.</div>
                <div className='footer__icons'>
                    <img src={FacebookIcon} alt='Facebook' className='footer__icon'/>
                    <img src={InstagramIcon} alt='Instagram' className='footer__icon'/>
                    <img src={VKIcon} alt='VK' className='footer__icon'/>
                    <img src={LinkedInIcon} alt='LinkedIn' className='footer__icon'/>
                </div>
            </div>
        </footer>
    )
};
