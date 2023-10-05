import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavItem } from '../../utils/Interfaces';
import '../../styles/SideNavigator.css'

interface SideNavigationBarProps {
    items: NavItem[];
}

const SideNavigator: React.FC<SideNavigationBarProps> = ({ items }) => {
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleDropdownClick = (index: number) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    return (
        <div className="side-nav-container">
            <button className={`toggle-btn ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '←' :'→'}
            </button>
            <nav className={`side-nav ${isOpen ? 'open' : ''}`}>
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
            </nav>
        </div>
    );
};

export default SideNavigator;