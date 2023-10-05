import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavItem } from '../../utils/Interfaces';
import '../../styles/SideNavigator.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { JWTDecoder } from '../../utils/JWTDecoder';
import logo from '../../logo512.png'

interface SideNavigationBarProps {
    items: NavItem[];
}

const SideNavigator: React.FC<SideNavigationBarProps> = ({ items }) => {
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const data = useSelector((state: RootState) => state.auth.token)
    console.log(data)
    const decoded = JWTDecoder(data as unknown as string)
    const handleDropdownClick = (index: number) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };
    const handleLogout = () => {
        // Your logout logic here
    };

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
                    Welcome, {decoded.name}
                </div>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            {item.dropdownItems ? (
                                <>
                                    <span onClick={() => handleDropdownClick(index)}>
                                        {item.label}
                                    </span>
                                    {openDropdownIndex === index && (
                                        <ul className="dropdown-menu">
                                            {item.dropdownItems.map((dropdownItem, idx) => (
                                                <li key={idx}>
                                                    <Link to={dropdownItem.link || '#'}>{dropdownItem.label}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <Link to={item.link || '#'}>{item.label}</Link>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="logout-container">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>
        </div>
    );
};

export default SideNavigator;