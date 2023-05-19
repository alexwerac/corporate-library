/* eslint-disable no-param-reassign  */
/* eslint-disable import/no-default-export  */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    jwt: null,
    user: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action){
            state.jwt = action.payload.jwt;
            state.user = action.payload.user;
        },
        removeUser(state){
            state.jwt = null;
            state.user = null;
        }
    },
})

export const { setUser, removeUser } = userSlice.actions;

export default userSlice;