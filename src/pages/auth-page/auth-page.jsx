import './auth-page.css';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { setUser } from '../../redux/slices/user-slice';

import { useUserLoginMutation } from '../../redux/userApi';
import { Loader } from '../../components/loader';

import imgArrow from '../../assets/auth/imgArrow.svg';
import eyeOpen from '../../assets/auth/eyeOpen.svg';
import eyeClosed from '../../assets/auth/eyeClosed.svg';

export const AuthPage = () => {

    const [loginUser, {data = {}, isLoading, error}] = useUserLoginMutation();

    const [regSuccess, setRegSuccess] = useState(false);
    const [inputData, setInputData] = useState(null);
    const [passwordShow, setPasswordShow] = useState(false);
    const [inputNoValue, setInputNoValue] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register,
        watch,
        handleSubmit,
        getFieldState,
        getValues,
        formState,
        formState: { isDirty, dirtyFields, errors },
    } = useForm({
        mode: 'onChange',
        criteriaMode: 'all',
        defaultValues: {  
            email: '',
    }});

    getFieldState("identifier", formState);

    const onSubmit = handleSubmit(async (data) => {
        try {
            localStorage.removeItem('user');
            setInputData(data);
            const user = await loginUser(data).unwrap();
            localStorage.setItem('user', JSON.stringify(user));
            await dispatch(setUser(user));
            navigate('/books/all');
        } catch (err) {
            setRegSuccess(false);
        }
    })

    if (error && error.status !== 400) return (
        <div data-test-id='auth' className='errorLogin'>
            <p className='errorLogin__company__title'>ISsoft</p>
            <div  data-test-id='status-block' className='errorLogin__container'>
                <div className='errorLogin__container__inner'>
                    <p className='errorLogin__title'>Вход не выполнен</p>
                    <p className='errorLogin__text'>Что-то пошло не так. Попробуйте ещё раз</p>
                    <button className='errorLogin__button' type='button' onClick={async(inputData)=>{
                        try {
                            const user = await loginUser(inputData).unwrap();
                            await dispatch(setUser(user));
                            navigate('/books/all');
                        } catch (err) {
                            setRegSuccess(false);
                        }
                    }}>ПОВТОРИТЬ</button>
                </div>
            </div>
        </div>    
    )

    return (
        <section className='auth' data-test-id='auth'>

            {isLoading && <Loader/>}

            <h1 className='company__title'>ISsoft</h1>
            <div className='auth__container'>
                <div className='auth__container__inner'>
                    <p className='auth__title'>Вход в личный кабинет</p>
                    <form data-test-id='auth-form' className='auth__form' onSubmit={onSubmit}>
                        <div className='auth__input__container'>
                            <input className={`auth__input auth__input__username ${error && error.status === 400 ? 'error__auth__input':''}`}
                            {...register('identifier', {required: true })} 
                            placeholder='&nbsp;'
                            onBlur={()=>setInputNoValue('Поле не может быть пустым')}
                            />
                            <span className="floating-label">Логин</span>
                            <p data-test-id='hint' className='auth__input__validation'>{!getFieldState('identifier').isDirty && inputNoValue}</p>
                        </div>
                        <div className='auth__input__container'>
                            <input className={`auth__input auth__input__password ${error && error.status === 400 ? 'error__auth__input':''}`}
                            {...register('password', {required: true})}
                            placeholder='&nbsp;' type={passwordShow ? 'text' : 'password'}
                            onBlur={()=>setInputNoValue('Поле не может быть пустым')}
                            />
                            <span className="floating-label">Пароль</span>
                            <p data-test-id='hint' className='auth__input__validation'>{!getFieldState('password').isDirty && inputNoValue}</p>
                            {getFieldState('password').isDirty ?
                            <button data-test-id={passwordShow ? 'eye-opened' : 'eye-closed'} className='password__view' type='button' onClick={() => setPasswordShow(!passwordShow)}>
                                <img src={passwordShow ? eyeOpen : eyeClosed} alt='eye'/>
                            </button> : ''}
                        </div>
                        {error && error.status === 400 ? <p className='auth__reset__error'><span data-test-id='hint' className='auth__reset__red'>Неверный логин или пароль!</span><br/>Восстановить?</p>:
                        <Link to='/forgot-pass' className='auth__reset'>Забыли логин или пароль?</Link>}
                        <button className='auth__submit' type='submit'>Вход</button>

                        <div className='auth__register'>
                            <p className='auth__register__text'>Нет учётной записи?</p>
                            <Link to='/registration' className='auth__register__container'>
                                <p className='auth__register__link'>РЕГИСТРАЦИЯ</p>
                                <img className='auth__register__img' src={imgArrow} alt='registration'/>
                            </Link>
                        </div>
                        
                    </form>
                </div>
            </div>
        </section>
    )
};