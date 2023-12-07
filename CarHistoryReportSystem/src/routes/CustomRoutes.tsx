import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpecialLayout from '../components/layout/SpecialLayout';
import UserLayout from '../components/layout/UserLayout';
import AdminHomePage from '../pages/admin/AdminHomePage';
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
import CarServiceShoprProfile from '../pages/common/ServiceShopProfile';
import RegisterPage from '../pages/common/RegisterPage';
import InsuranceCompanyHomePage from '../pages/insurance_company/InsuranceCompanyHomePage';
import ManufacturerCarModelList from '../pages/manufacturer/car_model/ManufacturerCarModelList';
import ManufacturerHomePage from '../pages/manufacturer/ManufacturerHomePage';
import PoliceHomePage from '../pages/police/PoliceHomePage';
import ServiceShopHomePage from '../pages/service_shop/ServiceShopHomePage';
import AccountVeryficationPage from '../pages/special/AccountVeryficationPage';
import SuspendPage from '../pages/special/SuspendPage';
import UnauthorizedPage from '../pages/special/UnauthorizedPage';
import CarDealerRequest from '../pages/car_dealer/CarDealerRequestPage';
import ManufacturerRequest from '../pages/manufacturer/ManufacturerRequestPage';
import CarMaintenance from '../pages/user/CarMaintenancePage';
import UserProfile from '../pages/user/UserProfile';
import RequestPage from '../pages/user/UserRequest';
import AdminRequestPage from '../pages/admin/request/AdminRequestList'
import VehicleRegistryHomePage from '../pages/vehicle_registry/VehicleRegistryHomePage';
import { AdminNavigation, CarDealerNavigation, InsuranceNavigation, ServiceShopNavigation, ManufacturerNavigation, PoliceNavigation, RegistryNavigation, UserNavigation } from '../utils/const/NavigationItems';
import ProtectedRoute from '../utils/ProtectedRoute';
import CarHistoryReportPage from '../pages/common/CarHistoryReportPage';
import PaymentPage from '../pages/common/PaymentPage';
import PaymentReturnPage from '../pages/common/PaymentReturnPage';
import CarReportPage from '../pages/common/CarReportPage';
import CarMaintenanceDetails from '../pages/user/CarMaintenanceDetails';
import ManufacturerCarRecallList from '../pages/manufacturer/recall/ManufacturerCarRecallList'
import ServiceShopHistory from '../pages/service_shop/ServiceShopHistory'
import ServiceShopRecall from '../pages/service_shop/ServiceShopCarRecall'
import CarDealerCarStorage from '../pages/car_dealer/CarDealerCarStorage';
import PoliceStolenCarList from '../pages/police/PoliceStolenCarList';
import RegistryInspectionList from '../pages/vehicle_registry/RegistryInspectionList';
import RegistryRegistrationList from '../pages/vehicle_registry/RegistryRegistrationList';
import InsuranceCompanyInsuranceList from '../pages/insurance_company/InsuranceCompanyInsuranceList';
import PoliceCarCrashList from '../pages/police/PoliceCarCrashList';
import InsuranceCompanyCrashList from '../pages/insurance_company/InsuranceCompanyCrashList';
import InsuranceCompanyStolenList from '../pages/insurance_company/InsuranceCompanyStolenList';
import SearchCarDealer from '../pages/common/SearchDealer';
import SearchServiceShop from '../pages/common/SearchServiceShop';
import UserNotification from '../pages/user/UserNotification';
import AdminMonetizationPage from '../pages/admin/AdminMonetizationPage';



const CustomRoutes = () => {
    return (
        <Router>
            <Routes>
                {/*Guest*/}
                <Route path="/unauthorized" element={<UserLayout navItems={UserNavigation}> <UnauthorizedPage /> </UserLayout>} />
                <Route path="/" element={<UserLayout navItems={UserNavigation}> <HomePage /> </UserLayout>} />
                <Route path="/sales" element={<UserLayout navItems={UserNavigation}> <CarSalesPage /> </UserLayout>} />
                <Route path="/login" element={<UserLayout navItems={UserNavigation}> <LoginPage /> </UserLayout>} />
                <Route path="/register" element={<UserLayout navItems={UserNavigation}> <RegisterPage /> </UserLayout>} />
                <Route path="/account-verify" element={<UserLayout navItems={UserNavigation}> <AccountVeryficationPage /> </UserLayout>} />
                <Route path="/suspended" element={<UserLayout navItems={UserNavigation}> <SuspendPage /> </UserLayout>} />
                <Route path="/report" element={<UserLayout navItems={UserNavigation}> <CarHistoryReportPage /> </UserLayout>} />
                <Route path="/payment/:vin" element={<UserLayout navItems={UserNavigation}> <PaymentPage /> </UserLayout>} />
                <Route path="/car-report/:vin" element={<UserLayout navItems={UserNavigation}> <CarReportPage /> </UserLayout>} />
                <Route path="/payment-return" element={<UserLayout navItems={UserNavigation}> <PaymentReturnPage /> </UserLayout>} />
                <Route path="/sales/details/:id" element={<UserLayout navItems={UserNavigation}> <CarSalesDetailPage /> </UserLayout>} />
                <Route path="/sales/dealer/:id" element={<UserLayout navItems={UserNavigation}> <CarDealerProfile /> </UserLayout>} />
                <Route path="/service/:id" element={<UserLayout navItems={UserNavigation}> <CarServiceShoprProfile /> </UserLayout>} />
                <Route path="/dealers/search" element={<UserLayout navItems={UserNavigation}> <SearchCarDealer /> </UserLayout>} />
                <Route path="/services/search" element={<UserLayout navItems={UserNavigation}> <SearchServiceShop /> </UserLayout>} />
                {/*User*/}
                <Route path="/profile" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><UserProfile /></UserLayout>}></ProtectedRoute>} />
                <Route path="/maintenance" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><CarMaintenance /></UserLayout>}></ProtectedRoute>} />
                <Route path="/maintenance/:id" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><CarMaintenanceDetails /></UserLayout>}></ProtectedRoute>} />
                <Route path="/user/" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><CarMaintenanceDetails /></UserLayout>}></ProtectedRoute>} />
                <Route path="/request" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}> <RequestPage /> </UserLayout>}></ProtectedRoute>} />
                <Route path="/notification" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}> <UserNotification /> </UserLayout>}></ProtectedRoute>} />
                {/*Admin*/}
                <Route path="/admin" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><AdminHomePage /></SpecialLayout>}></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><UserListPage /></SpecialLayout>}></ProtectedRoute>} />
                <Route path="/admin/manufacturers" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><AdminManufacturerList /></SpecialLayout>}></ProtectedRoute>} />
                <Route path="/admin/car-models" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><AdminCarModelList /></SpecialLayout>}></ProtectedRoute>} />
                <Route path="/admin/requests" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><AdminRequestPage /></SpecialLayout>}></ProtectedRoute>} />
                <Route path="/admin/monetization" element={<ProtectedRoute roles={['Adminstrator']} children={<SpecialLayout navItems={AdminNavigation}><AdminMonetizationPage /></SpecialLayout>}></ProtectedRoute>} />
                {/*Service Shop*/}
                <Route path="/service" element={<ProtectedRoute roles={['ServiceShop']} children={<UserLayout navItems={ServiceShopNavigation}><ServiceShopHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/service/car-service" element={<ProtectedRoute roles={['ServiceShop']} children={<UserLayout navItems={ServiceShopNavigation}><ServiceShopHistory /></UserLayout>}></ProtectedRoute>} />
                <Route path="/service/recalls" element={<ProtectedRoute roles={['ServiceShop']} children={<UserLayout navItems={ServiceShopNavigation}><ServiceShopRecall /></UserLayout>}></ProtectedRoute>} />
                {/*Insurance*/}
                <Route path="/insurance" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><InsuranceCompanyHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/insurance-list" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><InsuranceCompanyInsuranceList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/crash" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><InsuranceCompanyCrashList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/stolen" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><InsuranceCompanyStolenList /></UserLayout>}></ProtectedRoute>} />
                {/*Police*/}
                <Route path="/police" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/stolen" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceStolenCarList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/crash" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceCarCrashList /></UserLayout>}></ProtectedRoute>} />
                {/*Manufacturer*/}
                <Route path="/manufacturer" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/car-models" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerCarModelList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/requests" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerRequest /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/recalls" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerCarRecallList /></UserLayout>}></ProtectedRoute>} />
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
            </Routes>
        </Router>
    )
}
    
export default CustomRoutes;