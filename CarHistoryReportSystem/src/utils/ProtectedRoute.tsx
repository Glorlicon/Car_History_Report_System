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
    let authorized = false
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    if (token) {
        const decodedToken = JWTDecoder(token)
        authorized = roles.includes(decodedToken.roles)
    } else {
        authorized = false
    }   
  return (
      <>
          {authorized ? (
              children
          ) : (
              <Navigate to="/unauthorized" replace />
          )}
      </>
  );
}

export default ProtectedRoute;