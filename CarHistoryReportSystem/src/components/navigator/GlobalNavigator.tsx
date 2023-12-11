import React, { useEffect, useRef, useState } from 'react';
import '../../styles/GlobalNavigator.css'
import logo from '../../logoCHRS.png';
import { APIResponse, NavItem, UserNotification } from '../../utils/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { useNavigate } from 'react-router-dom';
import { logout, setLanguage } from '../../store/authSlice';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Fade, IconButton, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { GetAllUserNotification, GetUserNotification } from '../../services/api/Notification';

interface GlobalNavigatorProps {
    items: NavItem[]
}

const GlobalNavigator: React.FC<GlobalNavigatorProps> = ({ items }) => {
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState('')
    const [role, setUserRole] = useState('')
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [userNotification, setUserNotification] = useState<UserNotification[]>([]);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    type UserRole = 'User' | 'CarDealer' | 'InsuranceCompany' | 'ServiceShop' | 'Manufacturer' | 'VehicleRegistry' | 'PoliceOffice';

    const roleProfilePath: { [key in UserRole]: string } = {
        "User": "/profile",
        "CarDealer": "/dealer/profile",
        "InsuranceCompany": "/insurance/profile",
        "ServiceShop": "/service/profile",
        "Manufacturer": "/manufacturer/profile",
        "VehicleRegistry": "/registry/profile",
        "PoliceOffice": "/police/profile",
    };
    const roleNotificationPath: { [key in UserRole]: string } = {
        "User": "/notification",
        "CarDealer": "/dealer/notification",
        "InsuranceCompany": "/insurance/notification",
        "ServiceShop": "/service/notification",
        "Manufacturer": "/manufacturer/notification",
        "VehicleRegistry": "/registry/notification",
        "PoliceOffice": "/police/notification",
    };
    const profilePath = roleProfilePath[role as UserRole] || '/profile';
    const notificationPath = roleNotificationPath[role as UserRole] || '/notification';
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
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
    
    const fetchData = async () => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const userNotifcationResponse: APIResponse = await GetAllUserNotification(JWTDecoder(token).nameidentifier, connectAPIError, language)
        if (!userNotifcationResponse.error) {
            setUserNotification(userNotifcationResponse.data)
        }

    }

    useEffect(() => {
        if (token) {
            const data = JWTDecoder(token)
            setUsername(data.name)
            setUserRole(data.roles)
            setUserId(data.nameidentifier)
            setLoading(false);
            fetchData();
        } else {
            setLoading(false);
        }
    }, [token]);
    //useEffect(() => {
    //    i18n.changeLanguage(currentLanguage)
    //})
    //TODO: bug redirect to register when logout
    function Logout() {
        dispatch(logout())
        navigate('/login')
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
                                        {t(item.label)}
                                    </a>
                                    {dropdownOpen && (
                                        <ul className="dropdown-menu">
                                            {item.dropdownItems.map((dropdownItem, idx) => (
                                                <li key={idx}>
                                                    <a href={dropdownItem.link}>{t(dropdownItem.label)}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <a href={item.link}>{t(item.label)}</a>
                            )}
                        </li>
                    ))}
                    {role === "User" && (
                        <li>
                            <a href='/request'>{t('Admin Request')}</a>
                            <a onClick={handleClick} className="dropdown" style={{ cursor: 'pointer' }}>
                                {t('Search Shop')}
                            </a>
                        </li>

                    )}
                    {!token && (
                        <li>
                            <a onClick={handleClick} className="dropdown" style={{ cursor: 'pointer' }}>
                                {t('Search Shop')}
                            </a>
                        </li>
                    )}
                    <li>
                        <Menu
                            id="fade-menu"
                            MenuListProps={{
                                'aria-labelledby': 'fade-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                        >
                            <MenuItem onClick={() => navigate("/dealers/search")}>{t('Dealer Shop')}</MenuItem>
                        </Menu>
                    </li>
                </ul>
            </div>
            {token ? (
                <div className="right-section">
                    <input type="checkbox" id="languageSwitch" onChange={getLanguage} checked={i18n.language === 'vn' ? false : true} className="language-toggle-switch" />
                    <label className="language-toggle-switch" htmlFor="languageSwitch">Toggle Language</label>
                    <label className="currentLanguage">{i18n.language}</label>
                    <a href={profilePath} className="nav-item">{t('Hi')}, {username}</a>
                    <IconButton onClick={() => navigate(notificationPath)}>
                        <Badge color="secondary" badgeContent={userNotification?.filter(notification => !notification.isRead)?.length}>
                            <NotificationsIcon sx={{ color: 'white' }} />
                        </Badge>
                    </IconButton>
                    <a className="nav-item" onClick={Logout}>{t('Logout')}</a>
                </div>
            ): (
                    <div className="right-section">
                    <input type="checkbox" id="languageSwitch" onChange={getLanguage} checked={i18n.language === 'vn' ? false : true} className="language-toggle-switch" />
                    <label className="language-toggle-switch" htmlFor="languageSwitch">Toggle Language</label>
                    <label className="currentLanguage">{i18n.language}</label>
                    <a href="/login" className="nav-item">{t('Login')}</a>
                    <a href="/register" className="nav-item">{t('Register')}</a>
                </div >
            )}
        </nav>
    );
}

export default GlobalNavigator;