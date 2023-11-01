import React, { useEffect, useRef, useState } from 'react';
import '../../styles/GlobalNavigator.css'
import logo from '../../logo512.png';
import { NavItem } from '../../utils/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';

interface RequestNavigatorProps {
    items: NavItem[]
}

const RequestNavigator: React.FC<RequestNavigatorProps> = ({ items }) => {
    const [username, setUsername] = useState('')
    const [isAuthenticated, setAuthenticated] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (token) {
            setAuthenticated(true);
            const data = JWTDecoder(token)
            setUsername(data.name)
        }
    }, [token]);
    //TODO: bug redirect to register when logout
    function Logout() {
        console.log("Logging out...");
        dispatch(logout())
        setAuthenticated(false);
        navigate('/login')
        console.log("Should have navigated to /");
        return
    }
    return (
        <nav className="global-nav">
            <div className="left-section">
                <div className="logo-container">
                    <a href="/">
                        <img src={logo} alt="Company Logo" className="logo" />
                    </a>
                </div>
                <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                    ☰
                </button>
                <ul className={`nav-list ${isOpen ? 'open' : ''}`}>
                    {items.map((item, index) => (
                        <li key={index}>
                            {item.dropdownItems ? (
                                <div className="dropdown">
                                    <a onClick={() => setDropdownOpen(!dropdownOpen)}>
                                        {item.label}
                                    </a>
                                    {dropdownOpen && (
                                        <ul className="dropdown-menu">
                                            {item.dropdownItems.map((dropdownItem, idx) => (
                                                <li key={idx}>
                                                    <a href={dropdownItem.link}>{dropdownItem.label}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <a href={item.link}>{item.label}</a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {isAuthenticated ? (
                <div className="right-section">
                    <a href="/profile" className="nav-item">Hi, {username}</a>
                    <a className="nav-item" onClick={Logout}>Logout</a>
                </div>
            ): (
                <div className="right-section">
                    <a href="/login" className="nav-item">Login</a>
                    <a href="/register" className="nav-item">Register</a>
                </div >
            )}
        </nav>
    );
}

export default RequestNavigator;