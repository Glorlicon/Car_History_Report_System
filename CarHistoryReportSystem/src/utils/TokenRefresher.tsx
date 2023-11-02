import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RefreshToken } from '../services/auth/RefreshToken';
import { logout, setToken } from '../store/authSlice';
import { RootState } from '../store/State';
import { APIResponse } from './Interfaces';
import { JWTDecoder } from './JWTDecoder';

const TokenRefresher = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string

   

    const isTokenExpired = () => {
        const decodedToken = JWTDecoder(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    };

    useEffect(() => {
        let timer: string | number | NodeJS.Timer | undefined
        if (token) {
            const handleRefresh = async () => {
                //user hasn't logged in
                if (!token) {
                    console.log("No token")
                    return
                }

                if (isTokenExpired()) {
                    console.log("Logout")
                    dispatch(logout())
                    navigate('/login')
                    return
                }
                const response: APIResponse = await RefreshToken(token)
                if (response.error) {
                    //logout user if fail to refresh token to avoid errors
                    console.log("Failed to refresh token")
                    dispatch(logout())
                    navigate('/login')
                } else {
                    console.log("Refreshed token")
                    dispatch(setToken(response.data.token))
                }
            }

            const decodedToken = JWTDecoder(token);
            const currentTime = Date.now();
            const interval = 60000 //every 5-1=4 minutes
            timer = setInterval(handleRefresh, decodedToken.exp * 1000 - currentTime - interval)
        }
        return () => {
            if (timer) clearInterval(timer)
        }

    }, [token])
  return null;
}

export default TokenRefresher;