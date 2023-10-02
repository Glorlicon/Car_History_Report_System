import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CarSalesPage from '../pages/common/CarSalesPage';
import HomePage from '../pages/common/HomePage';
import LoginPage from '../pages/common/LoginPage';
import RegisterPage from '../pages/common/RegisterPage';

const CustomRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sales" element={<CarSalesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </Router>
    )
}
    
export default CustomRoutes;