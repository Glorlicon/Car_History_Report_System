import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route } from 'react-router-dom';
import { RootState } from '../store/State';
import { JWTDecoder } from './JWTDecoder';

interface AuthorizationProps {
    children: any
    roles: string[]
}
const ProtectedRoute: React.FC<AuthorizationProps> = ({
    children,
    roles
}) => {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    let redirectPath = '/unauthorized';
    let authorized = true
    if (token) {
        const decodedToken = JWTDecoder(token);
        if (roles.includes(decodedToken.roles)) {
            authorized = true
        } else {
            authorized = false
            const roleToPathMap: { [role: string]: string } = {
                'Adminstrator': '/admin/unauthorized',
                'User': '/unauthorized',
                'ServiceShop': '/service/unauthorized',
                'InsuranceCompany': '/insurance/unauthorized',
                'PoliceOffice': '/police/unauthorized',
                'Manufacturer': '/manufacturer/unauthorized',
                'CarDealer': '/dealer/unauthorized',
                'VehicleRegistry': '/registry/unauthorized',
            };
            redirectPath = roleToPathMap[decodedToken.roles] || '/unauthorized';
        }
    } else {
        if (roles.includes('Guest')) {
            authorized = true
        } else {
            authorized = false
        }
    }
    return (
        <>
            {authorized ? children : <Navigate to={redirectPath} replace />}
        </>
    );
}

export default ProtectedRoute;