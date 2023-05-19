/* eslint-disable unicorn/filename-case */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://library-cleverland-2jfze.ondigitalocean.app/',
        prepareHeaders: (headers, { getState }) => {
            const jwtToken = getState().user.jwt;
            const localStorageToken = JSON.parse(localStorage.getItem('user'));

            if(jwtToken === null && localStorageToken !== null) {
                headers.set('authorization', `Bearer ${localStorageToken.jwt}`)
            }

            if (jwtToken) {
                headers.set('authorization', `Bearer ${jwtToken}`)
            }
            return headers
        },
    }),

    refetchOnMountOrArgChange: true,
    tagTypes: ['Books', 'Book'],
    endpoints: (build) => ({
        getBooks: build.query({
            query: () => ({
                url: '/api/books',
                method: 'GET',
            }),
            providesTags: ['Books'],
        }),   
        getBook: build.query({
            query: (id)=> ({
                url:`/api/books/${id}`,
                method: 'GET',
            }),
            providesTags: ['Book'],
        }),
        getCategories: build.query({
            query: ()=> '/api/categories',
            method: 'GET',
        }),
    })
});

export const {useGetBooksQuery, useGetBookQuery, useGetCategoriesQuery} = booksApi;