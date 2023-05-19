import { useState, useEffect, useLayoutEffect } from 'react';
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useUserResetPasswordMutation } from '../../redux/userApi';
import { Loader } from '../loader';

import imgArrow from '../../assets/auth/imgArrow.svg';
import imgArrowLeft from '../../assets/auth/imgArrowLeft.svg';
import eyeOpen from '../../assets/auth/eyeOpen.svg';
import eyeClosed from '../../assets/auth/eyeClosed.svg';
import imgCheckmark from '../../assets/auth/imgCheckmark.svg'
import { regex } from '../../helpers/regex';

export const ForgotPassPassword = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [userResetPassword, {data: dataReset, isLoading: isLoadingReset, error: errorReset, isSuccess: isSuccessReset}] = useUserResetPasswordMutation();

    const [submitDisable, setSubmitDisable] = useState(true);
    const [regSuccess, setRegSuccess] = useState(false);
    const [isFocusPassword, setIsFocusPassword] = useState(false);
    const [isFocusPasswordConfirmation, setIsFocusPasswordConfirmation] = useState(false);

    const [passwordShow, setPasswordShow] = useState(false);
    const [passwordConfirmationShow, setPasswordConfirmationShow] = useState(false);

    const navigate = useNavigate();

    const { register,
        watch,
        values,
        trigger,
        handleSubmit,
        getFieldState,
        getValues,
        formState,
        formState: {isDirty, isValid, dirtyFields, errors, isValidating, touchedFields },
    } = useForm({
        mode: 'all',
        criteriaMode: 'all',
        defaultValues: {
            password: '',
            passwordConfirmation: '',
        }
    });

    const watchPassword = watch('password');
    const watchPasswordConfirmation = watch('passwordConfirmation');

    const onSubmit = handleSubmit(async (data) => {
        try {
            const passwordReset = {password: data.password, passwordConfirmation: data.passwordConfirmation, code: searchParams.get('code')};
            const user = await userResetPassword(passwordReset).unwrap();
            if(user){
                setRegSuccess(true);
            }
        } catch (err) {
            setRegSuccess(false);
        }
    })

    const passwordError = ()=>{
        let res = null;
        if (watchPassword){
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
        }

        return res
    }

    if (isSuccessReset) {
        return (
            <div data-test-id='auth' className='errorLogin'>
                <p className='errorLogin__company__title'>ISsoft</p>
                <div  data-test-id='status-block' className='errorLogin__container'>
                    <div className='errorLogin__container__inner'>
                        <p className='errorLogin__title'>Новые данные сохранены</p>
                        <p className='errorLogin__text send__email__success'>Зайдите в личный кабинет,<br/> используя свои логин и новый пароль</p>
                        <button className='errorLogin__button' type='button' onClick={()=>{
                            navigate('/auth');
                        }}>ВХОД</button>
                    </div>
                </div>
            </div>    
        );
    }

    if (errorReset) {
        return (
            <div data-test-id='auth' className='errorLogin'>
                <p className='errorLogin__company__title'>ISsoft</p>
                <div  data-test-id='status-block' className='errorLogin__container'>
                    <div className='errorLogin__container__inner'>
                        <p className='errorLogin__title'>Данные не сохранились</p>
                        <p className='errorLogin__text'>Что-то пошло не так. Попробуйте ещё раз</p>
                        <button className='errorLogin__button' type='button' onClick={()=>{
                            navigate(0)
                        }}>ПОВТОРИТЬ</button>
                    </div>
                </div>
            </div>    
        );
    }

    return (
        <section className='auth' data-test-id='auth'>

            {isLoadingReset && <Loader/>}
            <h1 className='company__title'>ISsoft</h1>
            <div className='auth__container'>
                <div className='auth__container__inner'>
                    <p className='auth__title'>Восстановление пароля</p>
                    <form data-test-id='reset-password-form' className='auth__form' onSubmit={onSubmit}>
                    <div className='auth__input__container'>
                        <input className='auth__input forgot__input__password'
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
                        <span className="floating-label">Новый пароль</span>

                        {isFocusPassword && !getFieldState('password').isDirty ? 
                        <p data-test-id='hint' className='register__input__validation'>Поле не может быть пустым</p> : null}

                        {isFocusPassword && getFieldState('password').isDirty && errors.password ? 
                        <p data-test-id='hint' className='register__input__validation'>Пароль не менее 8 символов, с заглавной буквой и цифрой</p> : null}
                        {!isFocusPassword && !getFieldState('password').isDirty && errors.password ? 
                        <p data-test-id='hint' className='register__input__gr'>Пароль не менее 8 символов, с заглавной буквой и цифрой</p> : null}
                        {!isFocusPassword && watchPassword && !watchPassword.match(regex.number) && watchPassword.length < 8 && errors.password && errors.password.type === 'hasUpperLetter' ? 
                        <p data-test-id='hint' className='register__input__gr'>Пароль <span className='act'>не менее 8 символов</span>, с <span className='act'>заглавной буквой</span> и <span className='act'>цифрой</span></p> : null}

                        {getFieldState('password').isDirty && !errors.password ? 
                        <p data-test-id='hint' className='register__input__gr'>Пароль не менее 8 символов, с заглавной буквой и цифрой</p> : null}

                        {!isFocusPassword && !getFieldState('password').isDirty && !errors.password ? 
                        <p data-test-id='hint' className='register__input__gr'>Пароль не менее 8 символов, с заглавной буквой и цифрой</p> : null}

                        {getFieldState('password').isDirty && !errors.password ? <img className='checkmark__view' data-test-id='checkmark' src={imgCheckmark} alt='checkmark' /> : null}
                        {getFieldState('password').isDirty ?
                        <button data-test-id={passwordShow ? 'eye-opened' : 'eye-closed'} className='password__view' type='button' onClick={() => setPasswordShow(!passwordShow)}>
                            <img src={passwordShow ? eyeOpen : eyeClosed} alt='eye'/>
                        </button> : ''}
                    
                        {!isFocusPassword && passwordError()}

                    </div>

                    <div className='auth__input__container'>
                        <input className='auth__input forgot__input__passwordConfirmation'
                        {...register('passwordConfirmation', {
                            required: true, 
                            validate: {
                                hasMatch: (value) => value.includes(watchPassword),
                            },
                        })} 
                        type={passwordConfirmationShow ? 'text' : 'password'}
                        placeholder='&nbsp;'
                        onBlur={()=>{setIsFocusPasswordConfirmation(true)}}
                        onFocus={()=>{setIsFocusPasswordConfirmation(false)}}
                        />
                        <span className="floating-label">Повторите пароль</span>

                        {isFocusPasswordConfirmation && !getFieldState('passwordConfirmation').isDirty ? 
                        <p data-test-id='hint' className='register__input__validation'>Поле не может быть пустым</p> : null}

                        {isFocusPasswordConfirmation && getFieldState('passwordConfirmation').isDirty && errors.passwordConfirmation && errors.passwordConfirmation.type === 'hasMatch' ? 
                        <p data-test-id='hint' className='register__input__validation'>Пароли не совпадают</p> : null}

                        {getFieldState('passwordConfirmation').isDirty ?
                        <button data-test-id={passwordConfirmationShow ? 'eye-opened' : 'eye-closed'} className='password__view' type='button' onClick={() => setPasswordConfirmationShow(!passwordConfirmationShow)}>
                            <img src={passwordConfirmationShow ? eyeOpen : eyeClosed} alt='eye'/>
                        </button> : ''}
                    </div>

                    <button disabled={!isValid} className='auth__submit' type='submit'>СОХРАНИТЬ ИЗМЕНЕНИЯ</button>
                    <p className='forgot__register__text'>После сохранения войдите в библиотеку, используя новый пароль</p>

                </form>
                </div>
            </div>
        </section>
    )
    
}