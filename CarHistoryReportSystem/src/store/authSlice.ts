import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    userData: {
        email: null,
        password: null
    },
    verifyToken: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.token = null;
        },
        setUserData: (state, action) => {
            state.userData.email = action.payload.email
            state.userData.password = action.payload.password
            console.log("State data: ", state.userData)
        },
        clearUserData: (state) => {
            state.userData = {
                email: null,
                password: null
            }
        },
        setVerifyToken: (state, action) => {
            state.verifyToken = action.payload
        },
        clearVerifyToken: (state) => {
            state.verifyToken = null
        }
    }
});

export const { setToken, logout, setUserData, clearUserData, setVerifyToken, clearVerifyToken } = authSlice.actions;
export default authSlice.reducer;