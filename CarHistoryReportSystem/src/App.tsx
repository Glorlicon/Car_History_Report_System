import React from 'react';
import GlobalNavigator from './components/navigator/GlobalNavigator';
import logo from '../public/logo512.png';
import './styles/App.css';
import Footer from './components/footer/Footer';

function App() {
    const navItems = [
        { label: 'Car Sale', link: '/' },
        { label: 'Car Reports', link: '/about' },
        {
            label: 'Car Maintenance', dropdownItems: [
                { label: 'Find A Service Shop', link: '/service1' },
                { label: 'Track My Car Maintenance', link: '/service2' }
            ]
        },
        { label: 'Car Values', link: '/contact' }
    ];
    return (
        <div className="App">
            <GlobalNavigator items={navItems} />
             
            <Footer/>
        </div>
    );
}

export default App;
