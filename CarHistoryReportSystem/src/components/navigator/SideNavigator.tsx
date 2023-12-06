import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APIResponse, NavItem, UserNotification } from '../../utils/Interfaces';
import '../../styles/SideNavigator.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { JWTDecoder } from '../../utils/JWTDecoder';
import logo from '../../logo512.png'
import { logout, setLanguage } from '../../store/authSlice';
import { useTranslation } from 'react-i18next';
import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { GetAllUserNotification, GetUserNotification } from '../../services/api/Notification';

interface SideNavigationBarProps {
    items: NavItem[];
}

const SideNavigator: React.FC<SideNavigationBarProps> = ({ items }) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const data = useSelector((state: RootState) => state.auth.token)
    const decoded = JWTDecoder(data as unknown as string)
    const handleDropdownClick = (index: number) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };
    const [userNotification, setUserNotification] = useState<UserNotification[] | null>(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
        return
    };
    const fetchData = async () => {
        console.log("Notification get", userNotification)
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const userNotifcationResponse: APIResponse = await GetAllUserNotification(decoded.nameidentifier, connectAPIError, language)
        if (!userNotifcationResponse.error) {
            setUserNotification(userNotifcationResponse.data)
        }

    }
    useEffect(() => {
        userNotification ?? fetchData();
        
    });
    const getLanguage = () => {
        let currentLanguage = i18n.language;
        if (currentLanguage === 'vn') {
            i18n.changeLanguage('en')
            dispatch(setLanguage('en'))
        } else {
            i18n.changeLanguage('vn')
            dispatch(setLanguage('vn'))
        }
    }
    return (
        <div className="side-nav-container">
            <button className={`toggle-btn ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '←' :'→'}
            </button>
            <nav className={`side-nav ${isOpen ? 'open' : ''}`}>
                <div className="side-logo-container">
                    <img src={logo} alt="Company Logo" className="side-logo" />
                </div>
                <div className="welcome-message">
                    {t('Welcome')}, {decoded.name}
                    <IconButton onClick={() => { console.log('onClick'); }}>
                        <Badge color="secondary" badgeContent={userNotification?.filter(notification => !notification.isRead)?.length}>
                                <NotificationsIcon sx={{ color: 'white' }} />
                            </Badge>
                    </IconButton>
                </div>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            {item.dropdownItems ? (
                                <>
                                    <span onClick={() => handleDropdownClick(index)}>
                                        {t(item.label)}
                                    </span>
                                    {openDropdownIndex === index && (
                                        <ul className="dropdown-menu">
                                            {item.dropdownItems.map((dropdownItem, idx) => (
                                                <li key={idx}>
                                                    <Link to={dropdownItem.link || '#'}>{t(dropdownItem.label)}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <Link to={item.link || '#'}>{t(item.label)}</Link>
                            )}
                        </li>
                    ))}
                    <li>
                        <input type="checkbox" id="languageSwitch" onChange={getLanguage} checked={i18n.language === 'vn' ? false : true} className="language-toggle-switch" />
                        <label className="language-toggle-switch" htmlFor="languageSwitch">Toggle Language</label>
                        <label className="currentLanguage">{i18n.language}</label>
                    </li>
                </ul>
                <div className="logout-container">
                    <button onClick={handleLogout} className="logout-btn">{t('Logout')}</button>
                </div>
            </nav>
        </div>
    );
};

export default SideNavigator;