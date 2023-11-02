import React, { ReactNode } from 'react';
import { NavItem } from '../../utils/Interfaces';
import TokenRefresher from '../../utils/TokenRefresher';
import SideNavigator from '../navigator/SideNavigator';

type SpecialLayoutProps = {
    children: ReactNode
    navItems: NavItem[]
}
const SpecialLayout: React.FC<SpecialLayoutProps> = ({ children, navItems }) => {
    return (
        <div className="App">
            <TokenRefresher />
            <SideNavigator items={navItems} />
            <div className="special-page-content">
                {children}
            </div>
        </div>
    )
}

export default SpecialLayout;