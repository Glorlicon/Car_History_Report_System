import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';

function AdminHomePage() {
    const data = useSelector((state: RootState) => state.auth.token)
    console.log(data)
    return (
        <p>Hello {data}</p>
    );
}

export default AdminHomePage;