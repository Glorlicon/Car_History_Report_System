import React, { ReactNode } from 'react';
import { NavItem } from '../../utils/Interfaces';
import SideNavigator from '../navigator/SideNavigator';

type SpecialLayoutProps = {
    children: ReactNode
    navItems: NavItem[]
}
const SpecialLayout: React.FC<SpecialLayoutProps> = ({ children, navItems }) => {
    return (
        <div className="App">
            <SideNavigator items={navItems}/>
            {children}
        </div>
    )
}

export default SpecialLayout;