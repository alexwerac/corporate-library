import { configureStore } from '@reduxjs/toolkit'
import { booksApi } from './booksApi'
import bookingSlice from './slices/booking-slice';
import userSlice from './slices/user-slice';

export const store = configureStore({
    reducer: { 
        user: userSlice.reducer,
        booking: bookingSlice.reducer,
        [booksApi.reducerPath]: booksApi.reducer, 
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(booksApi.middleware)
});
