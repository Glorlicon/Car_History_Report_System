import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { JWTDecoder } from '../../utils/JWTDecoder';

function AdminHomePage() {
    const data = useSelector((state: RootState) => state.auth.token)
    const decoded = JWTDecoder(data as unknown as string)
    return (
        <p>Hello {decoded.name}</p>
    );
}

export default AdminHomePage;