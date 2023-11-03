import GlobalNavigator from "../navigator/GlobalNavigator";
import React, { ReactNode } from 'react';
import { NavItem } from "../../utils/Interfaces";
import Footer from "../footer/Footer";
import TokenRefresher from "../../utils/TokenRefresher";

type UserLayoutProps = {
    children: ReactNode
    navItems: NavItem[]
}

const UserLayout: React.FC<UserLayoutProps> = ({ children, navItems }) => {
    return (
        <div className="App">
            <TokenRefresher/>
            <header>
                <GlobalNavigator items={navItems} />
            </header>
            {children}
            <Footer />
        </div>
    );
}
export default UserLayout;