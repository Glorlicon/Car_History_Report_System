import React, { useEffect, useRef, useState } from 'react';
import '../../styles/GlobalNavigator.css'
import logo from '../../logo512.png';
import { NavItem } from '../../utils/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { useNavigate } from 'react-router-dom';
import { logout, setLanguage } from '../../store/authSlice';
import { useTranslation } from 'react-i18next';

interface GlobalNavigatorProps {
    items: NavItem[]
}

const GlobalNavigator: React.FC<GlobalNavigatorProps> = ({ items }) => {
    const [username, setUsername] = useState('')
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token)
    const navigate = useNavigate()
    const dispatch = useDispatch()

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

    useEffect(() => {
        if (token) {
            const data = JWTDecoder(token)
            setUsername(data.name)
        }
    }, [token]);
    //useEffect(() => {
    //    i18n.changeLanguage(currentLanguage)
    //})
    //TODO: bug redirect to register when logout
    function Logout() {
        console.log("Logging out...");
        dispatch(logout())
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
                </ul>
            </div>
            {token ? (
                <div className="right-section">
                    <input type="checkbox" id="languageSwitch" onChange={getLanguage} checked={i18n.language === 'vn' ? false : true} className="language-toggle-switch" />
                    <label className="language-toggle-switch" htmlFor="languageSwitch">Toggle Language</label>
                    <label className="currentLanguage">{i18n.language}</label>
                    <a href="/profile" className="nav-item">{t('Hi')}, {username}</a>
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