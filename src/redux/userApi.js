/* eslint-disable unicorn/filename-case */
/* eslint-disable no-undef */

import { booksApi } from "./booksApi";

const userApi = booksApi.injectEndpoints({
    endpoints: (build) => ({
        userLogin: build.mutation({
            query: (body) => ({
                url: '/api/auth/local',
                method: 'POST',
                body: {
                    identifier: body.identifier,
                    password: body.password,
                },
            }),
        }),
        userRegister: build.mutation({
            query: (body)=>({ 
                url: '/api/auth/local/register',
                method: 'POST',
                body: {
                    email: body.email,
                    username: body.username,
                    password: body.password,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    phone: body.phone,
                },
            }),
        }),
        userForgotPassword: build.mutation({
            query: (body)=>({ 
                url: '/api/auth/forgot-password',
                method: 'POST',
                body: {
                    email: body.email,
                },
            }),
        }),
        userResetPassword: build.mutation({
            query: (body)=>({ 
                url: '/api/auth/reset-password',
                method: 'POST',
                body: {
                    password: body.password,
                    passwordConfirmation: body.passwordConfirmation,
                    code: body.code,
                },
            }),
        }),
    }),
})

export const { useUserLoginMutation, useUserRegisterMutation, useUserForgotPasswordMutation, useUserResetPasswordMutation } = userApi;