import { useState } from 'react'

import './error-component.css'

import imgError from '../../assets/error/imgError.svg'
import imgClose from '../../assets/error/imgClose.svg'

export const Error = () => {

    const [errorClose, setErrorClose] = useState(false);

    return (
        <div data-test-id='error' className={`error ${errorClose ? 'not__visible': ''}`}>
            <div className='error__container'>
                <div className='error__inner'>
                    <div className='error__left'>
                        <img src={imgError} alt='error' className='error__img'/>
                        <p className='error__text'>Что-то пошло не так. Обновите страницу через некоторое время.</p>
                    </div>
                    <button className='error__close' type='button' onClick={()=>setErrorClose(!errorClose)}>
                        <img src={imgClose} alt='close'/>
                    </button>
                </div>
            </div>
        </div>    
    )
} 
