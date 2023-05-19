import { useState, useEffect, useLayoutEffect } from 'react';
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useUserForgotPasswordMutation } from '../../redux/userApi';
import { Loader } from '../loader';

import imgArrow from '../../assets/auth/imgArrow.svg';
import imgArrowLeft from '../../assets/auth/imgArrowLeft.svg';
import { regex } from '../../helpers/regex';

export const ForgotPassEmail = () => {

    const [userForgotPassword, {data = {}, isLoading, error, isSuccess}] = useUserForgotPasswordMutation();

    const [regSuccess, setRegSuccess] = useState(false);
    const [isFocusEmail, setIsFocusEmail] = useState(false);

    const navigate = useNavigate();

    const { register,
        watch,
        handleSubmit,
        getFieldState,
        getValues,
        formState,
        formState: { isDirty, dirtyFields, errors},
    } = useForm({
        mode: 'all',
        criteriaMode: 'all',
            defaultValues: {
            email: '',
        }
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            const emailReset = {email: data.email}
            const user = await userForgotPassword(emailReset).unwrap();
            if(user){
                setRegSuccess(true);
            }
        } catch (err) {
            setRegSuccess(false);
        }
    })
    

    if (isSuccess) {
        return (
            <div data-test-id='auth' className='errorLogin'>
                <p className='errorLogin__company__title'>ISsoft</p>
                <div  data-test-id='status-block' className='errorLogin__container'>
                    <div className='errorLogin__container__inner'>
                        <p className='errorLogin__title'>Письмо выслано</p>
                        <p className='errorLogin__text send__email__success'>Перейдите в вашу почту, чтобы воспользоваться подсказками по восстановлению пароля</p>
                    </div>
                </div>
            </div>    
        );
    }

    return (
        <section className='auth' data-test-id='auth'>

            {isLoading && <Loader/>}

            <h1 className='company__title'>ISsoft</h1>
            <div className='auth__container'>
                <div className='auth__back'>
                    <Link to='/auth' className='auth__back__link'>
                        <img src={imgArrowLeft} alt='arrow'/>
                        <p className='auth__back__title'>ВХОД В ЛИЧНЫЙ КАБИНЕТ</p>
                    </Link>
                </div>
                <div className='forgot__container__inner'>
                    <p className='auth__title'>Восстановление пароля</p>
                    <form data-test-id='send-email-form' className='auth__form' onSubmit={onSubmit}>
                    <div className='auth__input__container'>
                        <input className='auth__input auth__input__email'
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
                        <span className="floating-label">Email</span>

                        {isFocusEmail && !getFieldState('email').isDirty && !error? 
                        <p data-test-id='hint' className='auth__input__validation'>Поле не может быть пустым</p> : null}

                        {!isFocusEmail && errors.email && errors.email.type === 'hasEmail' && !error ? 
                        <p data-test-id='hint' className='auth__input__validation'>Введите корректный e-mail</p> : null}
                        {isFocusEmail && errors.email && errors.email.type === 'hasEmail' && !error ? 
                        <p data-test-id='hint' className='auth__input__validation'>Введите корректный e-mail</p> : null}

                        {!isFocusEmail && !errors.email && !error? 
                        <p data-test-id='hint' className='register__input__gr'>На это email будет отправлено письмо с инструкциями по восстановлению пароля</p> : null}
                        {isFocusEmail && !errors.email && getFieldState('email').isDirty && !error ? 
                        <p data-test-id='hint' className='register__input__gr'>На это email будет отправлено письмо с инструкциями по восстановлению пароля</p> : null}

                        {error ? 
                        <p data-test-id='hint' className='auth__input__validation'>error</p> : null}

                    </div>

                    <button disabled={!getFieldState('email').isDirty || errors.email ? true : false} className='auth__submit' type='submit'>Восстановить</button>

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
    );

}