import React from 'react';
import GlobalNavigator from './components/navigator/GlobalNavigator';
import logo from '../public/logo512.png';
import './styles/App.css';
import Footer from './components/footer/Footer';
import CustomRoutes from './routes/CustomRoutes';

function App() {
    const navItems = [
        { label: 'Car Sale', link: '/sales' },
        { label: 'Car Reports', link: '/report' },
        {
            label: 'Car Maintenance', dropdownItems: [
                { label: 'Find A Service Shop', link: '/serviceshop' },
                { label: 'Track My Car Maintenance', link: '/maintenance' }
            ]
        },
        { label: 'Car Values', link: '/value' }
    ];
    return (
        <div className="App">
            <header>
                <GlobalNavigator items={navItems} />
            </header>
            <CustomRoutes />
            <Footer/>
        </div>
    );
}

export default App;
