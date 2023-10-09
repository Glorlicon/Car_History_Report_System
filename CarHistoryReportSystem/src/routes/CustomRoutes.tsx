import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpecialLayout from '../components/layout/SpecialLayout';
import UserLayout from '../components/layout/UserLayout';
import AdminHomePage from '../pages/admin/AdminHomePage';
import AdminCarModelList from '../pages/admin/car_model/AdminCarModelList';
import AdminManufacturerList from '../pages/admin/manufacturer/AdminManufacturerList';
import UserListPage from '../pages/admin/UserListPage';
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
import SuspendPage from '../pages/special/SuspendPage';
import VehicleRegistryHomePage from '../pages/vehicle_registry/VehicleRegistryHomePage';
import { AdminNavigation, UserNavigation } from '../utils/const/NavigationItems';

const CustomRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserLayout navItems={UserNavigation}> <HomePage /> </UserLayout>} />
                <Route path="/sales" element={<UserLayout navItems={UserNavigation}> <CarSalesPage /> </UserLayout>} />
                <Route path="/login" element={<UserLayout navItems={UserNavigation}> <LoginPage /> </UserLayout>} />
                <Route path="/register" element={<UserLayout navItems={UserNavigation}> <RegisterPage /> </UserLayout>} />
                <Route path="/account-verify" element={<UserLayout navItems={UserNavigation}> <AccountVeryficationPage /> </UserLayout>} />
                <Route path="/suspended" element={<UserLayout navItems={UserNavigation}> <SuspendPage /> </UserLayout>} />
                {/*Admin*/}
                <Route path="/admin" element={<SpecialLayout navItems={AdminNavigation}><AdminHomePage /></SpecialLayout>} />
                <Route path="/admin/users" element={<SpecialLayout navItems={AdminNavigation}><UserListPage /></SpecialLayout>} />
                <Route path="/admin/manufacturers" element={<SpecialLayout navItems={AdminNavigation}><AdminManufacturerList /></SpecialLayout>} />
                <Route path="/admin/car-models" element={<SpecialLayout navItems={AdminNavigation}><AdminCarModelList /></SpecialLayout>} />

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