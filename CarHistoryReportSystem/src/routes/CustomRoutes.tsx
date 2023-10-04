import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminHomePage from '../pages/admin/AdminHomePage';
import CarDealerHomePage from '../pages/car_dealer/CarDealerHomePage';
import CarSalesPage from '../pages/common/CarSalesPage';
import HomePage from '../pages/common/HomePage';
import LoginPage from '../pages/common/LoginPage';
import RegisterPage from '../pages/common/RegisterPage';
import InsuranceCompanyHomePage from '../pages/insurance_company/InsuranceCompanyHomePage';
import ManufacturerHomePage from '../pages/manufacturer/ManufacturerHomePage';
import PoliceHomePage from '../pages/police/PoliceHomePage';
import ServiceShopHomePage from '../pages/service_shop/ServiceShopHomePage';
import AccountVeryficationPage from '../pages/special/AccountVeryficationPage';
import VehicleRegistryHomePage from '../pages/vehicle_registry/VehicleRegistryHomePage';

const CustomRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sales" element={<CarSalesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/*Special*/}
                <Route path="/account-verify" element={<AccountVeryficationPage />} />
                {/*Admin*/}
                <Route path="/admin" element={<AdminHomePage />} />

                {/*Service Shop*/}
                <Route path="/service" element={<ServiceShopHomePage />} />
                {/*Insurance*/}
                <Route path="/insurance" element={<InsuranceCompanyHomePage />} />
                {/*Police*/}
                <Route path="/police" element={<PoliceHomePage />} />
                {/*Manufacturer*/}
                <Route path="/manufacturer" element={<ManufacturerHomePage />} />
                {/*Car Dealer*/}
                <Route path="/dealer" element={<CarDealerHomePage />} />
                {/*Vehicle Registry*/}
                <Route path="/vehicleregistry" element={<VehicleRegistryHomePage />} />
            </Routes>
        </Router>
    )
}
    
export default CustomRoutes;