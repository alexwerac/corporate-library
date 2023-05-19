/* eslint-disable unicorn/filename-case */
/* eslint-disable no-undef */

import { booksApi } from "./booksApi";

const bookingApi = booksApi.injectEndpoints({
    endpoints: (build) => ({
        postBooking: build.mutation({
            query: (body) => ({
                url: '/api/bookings',
                method: 'POST',
                body: {
                    data: body.data,
                },
            }),
            invalidatesTags: ['Books'],
        }),
        updateBooking: build.mutation({
            query: ({id, ...body}) => ({
                url: `/api/bookings/${id}`,
                method: 'PUT',
                body: {
                    data: body.data,
                },
            }),
            invalidatesTags: ['Books'],
        }),
        deleteBooking: build.mutation({
            query: ({id}) => ({
                url: `/api/bookings/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Books'],
        }),
    }),
})

export const { usePostBookingMutation, useUpdateBookingMutation, useDeleteBookingMutation } = bookingApi;