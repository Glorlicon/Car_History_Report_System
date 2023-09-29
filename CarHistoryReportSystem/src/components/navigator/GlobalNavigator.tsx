import React, { useState } from 'react';
import '../../styles/GlobalNavigator.css'
import logo from '../../logo512.png';

interface NavItem {
    label: string
    link?: string
    dropdownItems?: NavItem[]
}

interface GlobalNavigatorProps {
    items: NavItem[]
}

const GlobalNavigator: React.FC<GlobalNavigatorProps> = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
        <nav className="global-nav">
            <div className="left-section">
                <div className="logo-container">
                    <img src={logo} alt="Company Logo" className="logo" />
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
            <div className="right-section">
                <a href="/login" className="nav-item">Login</a>
                <a href="/register" className="nav-item">Register</a>
            </div>
        </nav>
    );
}

export default GlobalNavigator;