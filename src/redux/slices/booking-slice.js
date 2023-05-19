/* eslint-disable no-param-reassign  */
/* eslint-disable import/no-default-export  */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    bookingMainModal: null,
    bookingPageModal: null,
    successResponse: null,
    errorResponse: null,
    successUpdateResponse: null,
    errorUpdateResponse: null,
    successDeleteResponse: null,
    errorDeleteResponse: null,
    bookId: null,
    userId: null,
    bookingDate: null,
    bookingId: null,
}

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookingModal(state, action){
            state.bookingMainModal = action.payload.bookingMainModal;
            state.bookingPageModal = action.payload.bookingPageModal;
            state.successResponse = action.payload.successResponse;
            state.errorResponse = action.payload.errorResponse;
            state.successUpdateResponse = action.payload.successUpdateResponse;
            state.errorUpdateResponse = action.payload.errorUpdateResponse;
            state.successDeleteResponse = action.payload.successDeleteResponse;
            state.errorDeleteResponse = action.payload.errorDeleteResponse;
            state.bookId = action.payload.bookId;
            state.userId = action.payload.userId;
            state.bookingDate = action.payload.bookingDate;
            state.bookingId = action.payload.bookingId;
        },
        removeBookingModal(state){
            state.bookingMainModal = null;
            state.bookingPageModal = null;
            state.successResponse = null;
            state.errorResponse = null;
            state.successUpdateResponse = null;
            state.errorUpdateResponse = null;
            state.successDeleteResponse = null;
            state.errorDeleteResponse = null;
            state.bookId = null;
            state.userId = null;
            state.bookingDate = null;
            state.bookingId = null;
        }
    },
})

export const { setBookingModal, removeBookingModal } = bookingSlice.actions;

export default bookingSlice;