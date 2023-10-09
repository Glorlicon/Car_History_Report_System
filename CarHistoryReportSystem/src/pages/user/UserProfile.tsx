import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Get } from '../../services/api/Users';
import { RootState } from '../../store/State';
import '../../styles/UserProfile.css'
import { APIResponse } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';

function UserProfile() {
    const token = useSelector((state: RootState) => state.auth.token)
    const id = JWTDecoder(token as unknown as string).nameidentifier
    const [user, setUser] = useState({
        userName: '',
        email: '',
        firstName: '',
        phoneNumber: '',
        lastName: '',
        maxReports: 0,
        role: 1,
        address: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const response: APIResponse = await Get(id);
        setLoading(false);
        if (response.error) {
            setError(response.error);
        } else {
            setUser(response.data);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            {loading ? (
                <div className="spinner"></div>
            ) : error ? (
                    <>
                        <div className="error-message">{error}</div>
                        <button onClick={fetchData} className="retry-btn">Retry</button>
                    </>
                ) : (
                /*tempoary*/
                <div className="profile-page">
                <img src="" alt="User Profile" className="profile-pic" />
                <h1>{user.userName}</h1>
                <div className="profile-details">
                    <div className="profile-column">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                    </div>
                    <div className="profile-column">
                        <p><strong>Address:</strong> {user.address}</p>
                        <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default UserProfile;