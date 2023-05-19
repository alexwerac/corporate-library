import './register-page.css';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { useUserRegisterMutation } from '../../redux/userApi';
import { Loader } from '../../components/loader';

import imgArrow from '../../assets/auth/imgArrow.svg';
import eyeOpen from '../../assets/auth/eyeOpen.svg';
import eyeClosed from '../../assets/auth/eyeClosed.svg';
import imgCheckmark from '../../assets/auth/imgCheckmark.svg'

import { regex } from '../../helpers/regex';

export const RegisterPage = () => {
    const [registerUser, {data, isLoading, error, isSuccess }] = useUserRegisterMutation();

    const [passwordShow, setPasswordShow] = useState(false);

    const [regSuccess, setRegSuccess] = useState(false);

    const [inputData, setInputData] = useState(null);
    const [registerStage, setRegisterStage] = useState(1);
    const [inputNoValue, setInputNoValue] = useState('');

    const [isFocus, setIsFocus] = useState(false);
    const [isFocusPassword, setIsFocusPassword] = useState(false);
    const [isFocusFirstName, setIsFocusFirstName] = useState(false);
    const [isFocusLastName, setIsFocusLastName] = useState(false);
    const [isFocusPhone, setIsFocusPhone] = useState(false);
    const [isFocusEmail, setIsFocusEmail] = useState(false);

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
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            phone: '+375',
            email: '',
    }});

    const watchUsername = watch('username');
    const watchPassword = watch('password');
    const watchPhone = watch('phone');

    const onSubmit = handleSubmit(async(data)=>{
        try {
            setInputData(data);
            const user = await registerUser(data).unwrap();
            if(user){
                setRegSuccess(true);
            }
        } catch (err) {
            setRegSuccess(false);
        }
    })

    const passwordError = ()=>{
        let res = null;

        if (watchPassword.match(regex.upperLetter) && !watchPassword.match(regex.number) && watchPassword.length < 8) {
            res = <p data-test-id='hint' className='register__input__gr'>Пароль <span className='act'>не менее 8 символов</span>, с <span className='pass'>заглавной буквой</span> и <span className='act'>цифрой</span></p>
        } 
        if (watchPassword.match(regex.upperLetter) && watchPassword.match(regex.number) && watchPassword.length < 8) {
            res = <p data-test-id='hint' className='register__input__gr'>Пароль <span className='act'>не менее 8 символов</span>, с <span className='pass'>заглавной буквой</span> и <span className='pass'>цифрой</span></p>
        }
        if (watchPassword.match(regex.upperLetter) && !watchPassword.match(regex.number) && watchPassword.length >= 8) {
            res = <p data-test-id='hint' className='register__input__gr'>Пароль <span className='pass'>не менее 8 символов</span>, с <span className='pass'>заглавной буквой</span> и <span className='act'>цифрой</span></p>
        }
        if (!watchPassword.match(regex.upperLetter) && watchPassword.match(regex.number) && watchPassword.length < 8) {
            res = <p data-test-id='hint' className='register__input__gr'>Пароль <span className='act'>не менее 8 символов</span>, с <span className='act'>заглавной буквой</span> и <span className='pass'>цифрой</span></p>
        }
        if (!watchPassword.match(regex.upperLetter) && !watchPassword.match(regex.number) && watchPassword.length >= 8) {
            res = <p data-test-id='hint' className='register__input__gr'>Пароль <span className='pass'>не менее 8 символов</span>, с <span className='act'>заглавной буквой</span> и <span className='act'>цифрой</span></p>
        }
        if (!watchPassword.match(regex.upperLetter) && watchPassword.match(regex.number) && watchPassword.length >= 8) {
            res = <p data-test-id='hint' className='register__input__gr'>Пароль <span className='pass'>не менее 8 символов</span>, с <span className='act'>заглавной буквой</span> и <span className='pass'>цифрой</span></p>
        }
        return res
    }

    if (error && error.status === 400) {
        return (
            <div data-test-id='auth' className='errorLogin'>
                <p className='errorLogin__company__title'>ISsoft</p>
                <div  data-test-id='status-block' className='errorLogin__container'>
                    <div className='errorLogin__container__inner'>
                        <p className='errorLogin__title'>Данные не сохранились</p>
                        <p className='errorLogin__text'>Такой логин или e-mail уже записан в системе.<br/> Попробуйте зарегистрироваться по другому<br/> логину или e-mail.</p>
                        <button className='errorLogin__button' type='button' onClick={()=>{
                            navigate(0)
                        }}>НАЗАД К РЕГИСТРАЦИИ</button>
                    </div>
                </div>
            </div>    
        );
    }

    if (error && error.status !== 400) {
        return (
            <div data-test-id='auth' className='errorLogin'>
                <p className='errorLogin__company__title'>ISsoft</p>
                <div  data-test-id='status-block' className='errorLogin__container'>
                    <div className='errorLogin__container__inner'>
                        <p className='errorLogin__title'>Данные не сохранились</p>
                        <p className='errorLogin__text'>Что-то пошло не так и ваша регистрация не завершилась. Попробуйте ещё раз</p>
                        <button className='errorLogin__button' type='button' onClick={async(inputData)=>{
                            try {
                                const user = await registerUser(inputData).unwrap();
                                if (user) {
                                setRegSuccess(true);
                                navigate('/auth');
                            }
                            } catch (err) {
                                setRegSuccess(false);
                            }
                        }}>Повторить</button>
                    </div>
                </div>
            </div>    
        );
    }

    if (isSuccess) {
        return (
            <div data-test-id='auth' className='errorLogin'>
                <p className='errorLogin__company__title'>ISsoft</p>
                <div  data-test-id='status-block' className='errorLogin__container'>
                    <div className='errorLogin__container__inner'>
                        <p className='errorLogin__title'>Регистрация успешна</p>
                        <p className='errorLogin__text'>Регистрация прошла успешно.<br/>Зайдите  в личный кабинет,<br/>используя свои логин и пароль</p>
                        <button className='errorLogin__button' type='button' onClick={()=>{
                            navigate('/auth');
                        }}>ВХОД</button>
                    </div>
                </div>
            </div>    
        );
    }

    return (
        <section className='register' data-test-id='auth'>

            {isLoading && <Loader/>}

            <h1 className='company__title'>ISsoft</h1>
            <div className='register__container'>
                <div className='register__container__inner'>
                    <p className='register__title'>Регистрация</p>
                    <p className='register__stage'>{registerStage} шаг из 3</p>

                    <form data-test-id='register-form' className='register__form' onSubmit={onSubmit}>

                        { registerStage === 1 ? 
                            <div className='register__stage__container'>
                                <div className='register__input__container'>
                                    <input className='register__input register__input__top'
                                    {...register('username', {
                                        required: true, 
                                        validate: {
                                            hasLetter: (value) => (regex.lowerLetter).test(value),
                                            hasNumber: (value) => (regex.number).test(value),
                                        }
                                    })} 
                                    placeholder='&nbsp;'
                                    onBlur={()=>{setIsFocus(true)}}
                                    onFocus={()=>{setIsFocus(false)}}
                                    />
                                    <span className="floating-label">Придумайте логин для входа</span>

                                    {isFocus && !getFieldState('username').isDirty ? 
                                    <p data-test-id='hint' className='register__input__validation'>Поле не может быть пустым</p> : null}

                                    {isFocus && getFieldState('username').isDirty && errors.username ? 
                                    <p data-test-id='hint' className='register__input__validation'>Используйте для логина латинский алфавит и цифры</p> : null}
                                    {!isFocus && !getFieldState('username').isDirty && errors.username ? 
                                    <p data-test-id='hint' className='register__input__gr'>Используйте для логина латинский алфавит и цифры</p> : null}

                                    {getFieldState('username').isDirty && !errors.username ? 
                                    <p data-test-id='hint' className='register__input__gr'>Используйте для логина латинский алфавит и цифры</p> : null}

                                    {!isFocus && watchUsername.match(regex.number) && errors.username && errors.username.type === 'hasLetter' ? 
                                    <p data-test-id='hint' className='register__input__gr'>Используйте для логина <span className='act'>латинский алфавит</span> и <span className='pass'>цифры</span></p> : null}
                                    {!isFocus && !watchUsername.match(regex.number) && errors.username && errors.username.type === 'hasLetter' ? 
                                    <p data-test-id='hint' className='register__input__gr'>Используйте для логина <span className='act'>латинский алфавит</span> и <span className='act'>цифры</span></p> : null}
                                    {!isFocus && !watchUsername.match(regex.number) && errors.username && errors.username.type === 'hasNumber' ? 
                                    <p data-test-id='hint' className='register__input__gr'>Используйте для логина латинский алфавит и <span className='act'>цифры</span></p> : null} 

                                </div>

                                <div className='register__input__container'>
                                    <input className='register__input register__input__bot'
                                    {...register('password', {
                                        required: true, 
                                        validate: {
                                            hasUpperLetter: (value) => (regex.upperLetter).test(value),
                                            hasNumber: (value) => (regex.number).test(value),
                                            hasMinLength: (value) => value.length >= 8
                                          },
                                    })} 
                                    type={passwordShow ? 'text' : 'password'}
                                    placeholder='&nbsp;'
                                    onBlur={()=>{setIsFocusPassword(true)}}
                                    onFocus={()=>{setIsFocusPassword(false)}}
                                    />
                                    <span className="floating-label">Пароль</span>

                                    {isFocusPassword && !getFieldState('password').isDirty ? 
                                    <p data-test-id='hint' className='register__input__validation'>Поле не может быть пустым</p> : null}

                                    {isFocusPassword && getFieldState('password').isDirty && errors.password ? 
                                    <p data-test-id='hint' className='register__input__validation'>Пароль не менее 8 символов, с заглавной буквой и цифрой</p> : null}
                                    {!isFocusPassword && !getFieldState('password').isDirty && errors.password ? 
                                    <p data-test-id='hint' className='register__input__gr'>Пароль не менее 8 символов, с заглавной буквой и цифрой</p> : null}
                                    {!isFocusPassword && !watchPassword.match(regex.number) && watchPassword.length < 8 && errors.password && errors.password.type === 'hasUpperLetter' ? 
                                    <p data-test-id='hint' className='register__input__gr'>Пароль <span className='act'>не менее 8 символов</span>, с <span className='act'>заглавной буквой</span> и <span className='act'>цифрой</span></p> : null}

                                    {getFieldState('password').isDirty && !errors.password ? 
                                    <p data-test-id='hint' className='register__input__gr'>Пароль не менее 8 символов, с заглавной буквой и цифрой</p> : null}


                                    {getFieldState('password').isDirty && !errors.password ? <img className='checkmark__view' data-test-id='checkmark' src={imgCheckmark} alt='checkmark' /> : null}
                                    {getFieldState('password').isDirty ?
                                    <button data-test-id={passwordShow ? 'eye-opened' : 'eye-closed'} className='password__view' type='button' onClick={() => setPasswordShow(!passwordShow)}>
                                        <img src={passwordShow ? eyeOpen : eyeClosed} alt='eye'/>
                                    </button> : ''}
                                
                                    {!isFocusPassword && passwordError()}

                                </div>
                                
                                <button disabled={!getFieldState('username').isDirty || !getFieldState('password').isDirty || errors.username || errors.password ? true : false} className='register__button' type='button' onClick={()=>setRegisterStage(2)}>СЛЕДУЮЩИЙ ШАГ</button>

                            </div> : ''
                        }

                        { registerStage === 2 ? 
                            <div className='register__stage__container'>
                                <div className='register__input__container'>
                                    <input className='register__input register__input__top'
                                    {...register('firstName', {required: true })} 
                                        placeholder='&nbsp;'
                                        onBlur={()=>{setIsFocusFirstName(true)}}
                                        onFocus={()=>{setIsFocusFirstName(false)}}
                                    />
                                    <span className="floating-label">Имя</span>

                                    {isFocusFirstName && !getFieldState('firstName').isDirty ? <p data-test-id='hint' className='register__input__validation'>Поле не может быть пустым</p> : null}
                                </div>
                                <div className='register__input__container'>
                                    <input className='register__input register__input__bot'
                                    {...register('lastName', {required: true })} 
                                        placeholder='&nbsp;'
                                        onBlur={()=>{setIsFocusLastName(true)}}
                                        onFocus={()=>{setIsFocusLastName(false)}}
                                    />
                                    <span className="floating-label">Фамилия</span>
                                    {isFocusLastName && !getFieldState('lastName').isDirty ? <p data-test-id='hint' className='register__input__validation'>Поле не может быть пустым</p> : null}
                                </div>

                                <button disabled={!getFieldState('firstName').isDirty || !getFieldState('lastName').isDirty ? true : false} className='register__button' type='button' onClick={()=>setRegisterStage(3)}>ПОСЛЕДНИЙ ШАГ</button>

                            </div> : ''
                        }

                        { registerStage === 3 ? 
                            <div className='register__stage__container'>
                                <div className='register__input__container'>
                                    <InputMask className='register__input register__input__top'
                                    mask="+375 (99) 999-99-99"
                                    maskChar="x"
                                    {...register('phone', {
                                        required: true,
                                        validate: {
                                            hasPhone: (value) => (regex.phoneNumber).test(value),
                                        },
                                        
                                    })} 
                                    placeholder='&nbsp;'
                                    onBlur={()=>{setIsFocusPhone(true)}}
                                    onFocus={()=>{setIsFocusPhone(false)}}
                                    />
                                    <span className="floating-label">Номер телефона</span>

                                    {isFocusPhone && !getFieldState('phone').isDirty ? 
                                    <p data-test-id='hint' className='register__input__validation'>Поле не может быть пустым</p> : null}

                                    {!isFocusPhone && errors.phone && errors.phone.type === 'hasPhone' ? 
                                    <p data-test-id='hint' className='register__input__validation'>В формате +375 (xx) xxx-xx-xx</p> : null}
                                    {isFocusPhone && errors.phone && errors.phone.type === 'hasPhone' ? 
                                    <p data-test-id='hint' className='register__input__validation'>В формате +375 (xx) xxx-xx-xx</p> : null}
                                    {!isFocusPhone && !errors.phone ? 
                                    <p data-test-id='hint' className='register__input__gr'>В формате +375 (xx) xxx-xx-xx</p> : null}
                                    {isFocusPhone && !errors.phone && getFieldState('phone').isDirty ? 
                                    <p data-test-id='hint' className='register__input__gr'>В формате +375 (xx) xxx-xx-xx</p> : null}
                                    
                                </div>
                                <div className='register__input__container'>
                                    <input className='register__input register__input__bot'
                                    {...register('email', {
                                        required: true,
                                        validate: {
                                            hasEmail: (value) => (regex.email).test(value)
                                        }
                                    })} 
                                    placeholder='&nbsp;'
                                    onBlur={()=>{setIsFocusEmail(true)}}
                                    onFocus={()=>{setIsFocusEmail(false)}}
                                    />
                                    <span className="floating-label">E-mail</span>
                                    
                                    {isFocusEmail && !getFieldState('email').isDirty ? 
                                    <p data-test-id='hint' className='register__input__validation'>Поле не может быть пустым</p> : null}

                                    {!isFocusEmail && errors.email && errors.email.type === 'hasEmail' ? 
                                    <p data-test-id='hint' className='register__input__validation'>Введите корректный e-mail</p> : null}
                                    {isFocusEmail && errors.email && errors.email.type === 'hasEmail' ? 
                                    <p data-test-id='hint' className='register__input__validation'>Введите корректный e-mail</p> : null}
                                </div>
                                
                                <button disabled={!getFieldState('phone').isDirty || !getFieldState('email').isDirty || errors.phone || errors.email ? true : false} className='register__button' type='submit'>ЗАРЕГИСТРИРОВАТЬСЯ</button>

                            </div> : ''
                        }

                        <div className='auth__register'>
                            <p className='auth__register__text'>Есть учётная запись?</p>
                            <Link to='/auth' className='auth__register__container'>
                                <p className='auth__register__link'>ВОЙТИ</p>
                                <img className='auth__register__img' src={imgArrow} alt='auth'/>
                            </Link>
                        </div>
                    </form>
                    
                </div>
            </div>
        </section>
    );
};