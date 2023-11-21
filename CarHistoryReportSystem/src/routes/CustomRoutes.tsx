import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpecialLayout from '../components/layout/SpecialLayout';
import UserLayout from '../components/layout/UserLayout';
import AdminHomePage from '../pages/admin/AdminHomePage';
import AdminCarList from '../pages/admin/car/AdminCarList';
import AdminCarModelList from '../pages/admin/car_model/AdminCarModelList';
import AdminManufacturerList from '../pages/admin/manufacturer/AdminManufacturerList';
import UserListPage from '../pages/admin/UserListPage';
import CarDealerCarDetails from '../pages/car_dealer/CarDealerCarDetails';
import CarDealerCarList from '../pages/car_dealer/CarDealerCarList';
import CarDealerHomePage from '../pages/car_dealer/CarDealerHomePage';
import CarDealerShopDetailsPage from '../pages/car_dealer/CarDealerShopDetailsPage';
import CarSalesPage from '../pages/common/CarSalesPage';
import CarSalesDetailPage from '../pages/common/CarSalesDetailPage';
import HomePage from '../pages/common/HomePage';
import LoginPage from '../pages/common/LoginPage';
import CarDealerProfile from '../pages/common/CarDealerProfile';
import RegisterPage from '../pages/common/RegisterPage';
import InsuranceCompanyHomePage from '../pages/insurance_company/InsuranceCompanyHomePage';
import ManufacturerCarList from '../pages/manufacturer/car/ManufacturerCarList';
import ManufacturerCarModelList from '../pages/manufacturer/car_model/ManufacturerCarModelList';
import ManufacturerHomePage from '../pages/manufacturer/ManufacturerHomePage';
import PoliceHomePage from '../pages/police/PoliceHomePage';
import ServiceShopHomePage from '../pages/service_shop/ServiceShopHomePage';
import AccountVeryficationPage from '../pages/special/AccountVeryficationPage';
import SuspendPage from '../pages/special/SuspendPage';
import UnauthorizedPage from '../pages/special/UnauthorizedPage';
import CarDealerRequest from '../pages/car_dealer/CarDealerRequestPage';
import ManufacturerRequest from '../pages/manufacturer/ManufacturerRequestPage';
import TestImage from '../pages/TestImage';
import TestImage2 from '../pages/TestImage2';
import CarMaintenance from '../pages/user/CarMaintenancePage';
import UserProfile from '../pages/user/UserProfile';
import RequestPage from '../pages/user/UserRequest';
import AdminRequestPage from '../pages/admin/request/AdminRequestList'
import VehicleRegistryHomePage from '../pages/vehicle_registry/VehicleRegistryHomePage';
import { AdminNavigation, CarDealerNavigation, InsuranceNavigation, ManufacturerNavigation, PoliceNavigation, RegistryNavigation, UserNavigation } from '../utils/const/NavigationItems';
import ProtectedRoute from '../utils/ProtectedRoute';
import CarHistoryReportPage from '../pages/common/CarHistoryReportPage';
import PaymentPage from '../pages/common/PaymentPage';
import PaymentReturnPage from '../pages/common/PaymentReturnPage';
import CarReportPage from '../pages/common/CarReportPage';
import CarMaintenanceDetails from '../pages/user/CarMaintenanceDetails';
import CarDealerCarStorage from '../pages/car_dealer/CarDealerCarStorage';
import PoliceStolenCarList from '../pages/police/PoliceStolenCarList';
import RegistryInspectionList from '../pages/vehicle_registry/RegistryInspectionList';
import RegistryRegistrationList from '../pages/vehicle_registry/RegistryRegistrationList';
import InsuranceCompanyInsuranceList from '../pages/insurance_company/InsuranceCompanyInsuranceList';
import PoliceCarCrashList from '../pages/police/PoliceCarCrashList';


const CustomRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/unauthorized" element={<UserLayout navItems={UserNavigation}> <UnauthorizedPage /> </UserLayout>} />
                <Route path="/" element={<UserLayout navItems={UserNavigation}> <HomePage /> </UserLayout>} />
                <Route path="/sales" element={<UserLayout navItems={UserNavigation}> <CarSalesPage /> </UserLayout>} />
                <Route path="/login" element={<UserLayout navItems={UserNavigation}> <LoginPage /> </UserLayout>} />
                <Route path="/request" element={<UserLayout navItems={UserNavigation}> <RequestPage /> </UserLayout>} />
                <Route path="/register" element={<UserLayout navItems={UserNavigation}> <RegisterPage /> </UserLayout>} />
                <Route path="/account-verify" element={<UserLayout navItems={UserNavigation}> <AccountVeryficationPage /> </UserLayout>} />
                <Route path="/suspended" element={<UserLayout navItems={UserNavigation}> <SuspendPage /> </UserLayout>} />
                <Route path="/report" element={<UserLayout navItems={UserNavigation}> <CarHistoryReportPage /> </UserLayout>} />
                <Route path="/payment/:vin" element={<UserLayout navItems={UserNavigation}> <PaymentPage /> </UserLayout>} />
                <Route path="/car-report/:vin" element={<UserLayout navItems={UserNavigation}> <CarReportPage /> </UserLayout>} />
                <Route path="/payment-return" element={<UserLayout navItems={UserNavigation}> <PaymentReturnPage /> </UserLayout>} />
                <Route path="/sales/details/:id" element={<UserLayout navItems={UserNavigation}> <CarSalesDetailPage /> </UserLayout>} />
                <Route path="/dealer/:id" element={<UserLayout navItems={UserNavigation}> <CarDealerProfile /> </UserLayout>} />
                {/*User*/}
                <Route path="/profile" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><UserProfile /></UserLayout>}></ProtectedRoute>} />
                <Route path="/maintenance" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><CarMaintenance /></UserLayout>}></ProtectedRoute>} />
                <Route path="/maintenance/:id" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><CarMaintenanceDetails /></UserLayout>}></ProtectedRoute>} />
                {/*Admin*/}
                <Route path="/admin" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><AdminHomePage /></SpecialLayout>}></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><UserListPage /></SpecialLayout>}></ProtectedRoute>} />
                <Route path="/admin/manufacturers" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><AdminManufacturerList /></SpecialLayout>}></ProtectedRoute>} />
                <Route path="/admin/car-models" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><AdminCarModelList /></SpecialLayout>}></ProtectedRoute>} />
                <Route path="/admin/cars" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><AdminCarList /></SpecialLayout>}></ProtectedRoute>} />
                <Route path="/admin/requests" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><AdminRequestPage /></SpecialLayout>}></ProtectedRoute>} />

                {/*Service Shop*/}
                <Route path="/service" element={<ServiceShopHomePage />} />
                {/*Insurance*/}
                <Route path="/insurance" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><InsuranceCompanyHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/insurance-list" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><InsuranceCompanyInsuranceList /></UserLayout>}></ProtectedRoute>} />
                {/*Police*/}
                <Route path="/police" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/stolen" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceStolenCarList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/crash" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceCarCrashList /></UserLayout>}></ProtectedRoute>} />
                {/*Manufacturer*/}
                <Route path="/manufacturer" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/car-models" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerCarModelList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/cars" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerCarList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/requests" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerRequest /></UserLayout>}></ProtectedRoute>} />
                {/*Car Dealer*/}
                <Route path="/dealer" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/details" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerShopDetailsPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/cars" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerCarList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/storage" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerCarStorage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/cars/:id" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerCarDetails /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/requests" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerRequest /></UserLayout>}></ProtectedRoute>} />
                {/*Vehicle Registry*/}
                <Route path="/registry" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><VehicleRegistryHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/registry/inspection" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><RegistryInspectionList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/registry/registration" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><RegistryRegistrationList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/test" element={<TestImage />} />
                <Route path="/test2" element={<TestImage2 />} />
            </Routes>
        </Router>
    )
}
    
export default CustomRoutes;