import { useState, useEffect, useLayoutEffect } from 'react';
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useUserForgotPasswordMutation, useUserResetPasswordMutation } from '../../redux/userApi';
import { Loader } from '../../components/loader';

import imgArrow from '../../assets/auth/imgArrow.svg';
import imgArrowLeft from '../../assets/auth/imgArrowLeft.svg';
import eyeOpen from '../../assets/auth/eyeOpen.svg';
import eyeClosed from '../../assets/auth/eyeClosed.svg';
import imgCheckmark from '../../assets/auth/imgCheckmark.svg'

import { ForgotPassEmail } from '../../components/forgot-pass-email';
import { ForgotPassPassword } from '../../components/forgot-pass-password';

import './forgot-pass-page.css';

export const ForgotPassPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    if (searchParams.get('code') === null) {
        return (
            <ForgotPassEmail/>
        );
    }

    if (searchParams.get('code') !== null) { 
        return (
            <ForgotPassPassword/>
        )
    }

    return <ForgotPassEmail/>
}