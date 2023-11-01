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

    const handleRefresh = async () => {
        //user hasn't logged in
        if (!token) return

        if (isTokenExpired()) {
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
    //initial run
    handleRefresh()
    const isTokenExpired = () => {
        const decodedToken = JWTDecoder(token);
        const currentTime = Date.now() / 1000;
        console.log("expired? ", decodedToken.exp < currentTime)
        return decodedToken.exp < currentTime;
    };



    useEffect(() => {
        let timer: string | number | NodeJS.Timer | undefined
        if (token) {
            const interval = 60000*4 //every 4 minutes
            timer = setInterval(handleRefresh, interval)
        }
        return () => {
            if (timer) clearInterval(timer)
        }

    }, [token])
  return null;
}

export default TokenRefresher;