import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLayout from '../components/layout/UserLayout';
import AdminHomePage from '../pages/admin/AdminHomePage';
import AdminCarModelList from '../pages/admin//AdminCarModelList';
import AdminDataProviderList from '../pages/admin/AdminDataProviderList';
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
import ManufacturerCarModelList from '../pages/manufacturer/ManufacturerCarModelList';
import ManufacturerHomePage from '../pages/manufacturer/ManufacturerHomePage';
import PoliceHomePage from '../pages/police/PoliceHomePage';
import ServiceShopHomePage from '../pages/service_shop/ServiceShopHomePage';
import AccountVeryficationPage from '../pages/special/AccountVeryficationPage';
import SuspendPage from '../pages/special/SuspendPage';
import CarMaintenance from '../pages/user/CarMaintenancePage';
import UserProfile from '../pages/user/UserProfile';
import RequestPage from '../pages/user/UserRequest';
import AdminRequestPage from '../pages/admin/AdminRequestList'
import UnauthorizedPage from '../pages/special/UnauthorizedPage';
import VehicleRegistryHomePage from '../pages/vehicle_registry/VehicleRegistryHomePage';
import { AdminNavigation, CarDealerNavigation, InsuranceNavigation, ServiceShopNavigation, ManufacturerNavigation, PoliceNavigation, RegistryNavigation, UserNavigation } from '../utils/const/NavigationItems';
import ProtectedRoute from '../utils/ProtectedRoute';
import CarHistoryReportPage from '../pages/common/CarHistoryReportPage';
import PaymentPage from '../pages/common/PaymentPage';
import PaymentReturnPage from '../pages/common/PaymentReturnPage';
import CarReportPage from '../pages/common/CarReportPage';
import CarMaintenanceDetails from '../pages/user/CarMaintenanceDetails';
import ManufacturerCarRecallList from '../pages/manufacturer/ManufacturerCarRecallList'
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
import SearchServiceShop from '../pages/common/SearchService';
import UserNotification from '../pages/user/UserNotification';
import AdminMonetizationPage from '../pages/admin/AdminMonetizationPage';
import PolicePartialPlateSearch from '../pages/police/PolicePartialPlateSearch';
import PoliceVinAlertPage from '../pages/police/PoliceVinAlertPage';
import ForgotPassword from '../pages/common/ForgottenPassword';
import ForgotPasswordInitiate from '../pages/common/ForgottenPasswordInitiate';
import ForgottenPasswordSuccess from '../pages/common/ForgottenPasswordSucess'
import PoliceSearchCarReport from '../pages/police/PoliceSearchCarReport';
import RegistrySearchCarReport from '../pages/vehicle_registry/RegistrySearchCarReport';
import ServiceShopDetailsPage from '../pages/service_shop/ServiceShopDetailsPage';
import ManufacturerCarReport from '../pages/manufacturer/ManufacturerCarReport';


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
                <Route path="/payment/" element={<UserLayout navItems={UserNavigation}> <PaymentPage /> </UserLayout>} />
                <Route path="/car-report/:vin/:date" element={<UserLayout navItems={UserNavigation}> <CarReportPage /> </UserLayout>} />
                <Route path="/car-report/:vin" element={<UserLayout navItems={UserNavigation}> <CarReportPage /> </UserLayout>} />
                <Route path="/payment-return" element={<UserLayout navItems={UserNavigation}> <PaymentReturnPage /> </UserLayout>} />
                <Route path="/sales/details/:id" element={<UserLayout navItems={UserNavigation}> <CarSalesDetailPage /> </UserLayout>} />
                <Route path="/sales/dealer/:id" element={<UserLayout navItems={UserNavigation}> <CarDealerProfile /> </UserLayout>} />
                <Route path="/service/:id" element={<UserLayout navItems={UserNavigation}> <CarServiceShoprProfile /> </UserLayout>} />
                <Route path="/dealers/search" element={<UserLayout navItems={UserNavigation}> <SearchCarDealer /> </UserLayout>} />
                <Route path="/services/search" element={<UserLayout navItems={UserNavigation}> <SearchServiceShop /> </UserLayout>} />
                <Route path="/forgotpassword" element={<UserLayout navItems={UserNavigation}> <ForgotPassword /> </UserLayout>} />
                <Route path="/forgotpassword/initiate/:email" element={<UserLayout navItems={UserNavigation}> <ForgotPasswordInitiate /> </UserLayout>} />
                <Route path="/forgotpassword/sucess" element={<UserLayout navItems={UserNavigation}> <ForgottenPasswordSuccess /> </UserLayout>} />
                {/*User*/}
                <Route path="/profile" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><UserProfile /></UserLayout>}></ProtectedRoute>} />
                <Route path="/maintenance" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><CarMaintenance /></UserLayout>}></ProtectedRoute>} />
                <Route path="/maintenance/:id" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><CarMaintenanceDetails /></UserLayout>}></ProtectedRoute>} />
                <Route path="/user/" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}><CarMaintenanceDetails /></UserLayout>}></ProtectedRoute>} />
                <Route path="/request" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}> <RequestPage /> </UserLayout>}></ProtectedRoute>} />
                <Route path="/notification" element={<ProtectedRoute roles={['User']} children={<UserLayout navItems={UserNavigation}> <UserNotification /> </UserLayout>}></ProtectedRoute>} />
                {/*Admin*/}
                <Route path="/admin" element={<ProtectedRoute roles={['Adminstrator']} children={<UserLayout navItems={AdminNavigation}><AdminHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute roles={['Adminstrator']} children={<UserLayout navItems={AdminNavigation}><UserListPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/admin/dataproviders" element={<ProtectedRoute roles={['Adminstrator']} children={<UserLayout navItems={AdminNavigation}><AdminDataProviderList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/admin/car-models" element={<ProtectedRoute roles={['Adminstrator']} children={<UserLayout navItems={AdminNavigation}><AdminCarModelList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/admin/requests" element={<ProtectedRoute roles={['Adminstrator']} children={<UserLayout navItems={AdminNavigation}><AdminRequestPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/admin/monetization" element={<ProtectedRoute roles={['Adminstrator']} children={<UserLayout navItems={AdminNavigation}><AdminMonetizationPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/admin/profile" element={<ProtectedRoute roles={['Adminstrator']} children={<UserLayout navItems={AdminNavigation}><UserProfile /></UserLayout>}></ProtectedRoute>} />
                <Route path="/admin/notification" element={<ProtectedRoute roles={['Adminstrator']} children={<UserLayout navItems={AdminNavigation}><UserNotification /></UserLayout>}></ProtectedRoute>} />
                {/*Service Shop*/}
                <Route path="/service" element={<ProtectedRoute roles={['ServiceShop']} children={<UserLayout navItems={ServiceShopNavigation}><ServiceShopHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/service/details" element={<ProtectedRoute roles={['ServiceShop']} children={<UserLayout navItems={ServiceShopNavigation}><ServiceShopDetailsPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/service/car-service" element={<ProtectedRoute roles={['ServiceShop']} children={<UserLayout navItems={ServiceShopNavigation}><ServiceShopHistory /></UserLayout>}></ProtectedRoute>} />
                <Route path="/service/recalls" element={<ProtectedRoute roles={['ServiceShop']} children={<UserLayout navItems={ServiceShopNavigation}><ServiceShopRecall /></UserLayout>}></ProtectedRoute>} />
                <Route path="/service/requests" element={<ProtectedRoute roles={['ServiceShop']} children={<UserLayout navItems={ServiceShopNavigation}><RequestPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/service/profile" element={<ProtectedRoute roles={['ServiceShop']} children={<UserLayout navItems={ServiceShopNavigation}><UserProfile /></UserLayout>}></ProtectedRoute>} />
                <Route path="/service/notification" element={<ProtectedRoute roles={['ServiceShop']} children={<UserLayout navItems={ServiceShopNavigation}><UserNotification /></UserLayout>}></ProtectedRoute>} />
                {/*Insurance*/}
                <Route path="/insurance" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><InsuranceCompanyHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/insurance-list" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><InsuranceCompanyInsuranceList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/crash" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><InsuranceCompanyCrashList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/requests" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><RequestPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/stolen" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><InsuranceCompanyStolenList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/profile" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><UserProfile /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/notification" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><UserNotification /></UserLayout>}></ProtectedRoute>} />
                <Route path="/insurance/car-report/:vin" element={<ProtectedRoute roles={['InsuranceCompany']} children={<UserLayout navItems={InsuranceNavigation}><CarReportPage /></UserLayout>}></ProtectedRoute>} />
                {/*Police*/}
                <Route path="/police" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/stolen" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceStolenCarList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/crash" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceCarCrashList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/plate-search" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PolicePartialPlateSearch /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/vin-alert" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceVinAlertPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/requests" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><RequestPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/profile" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><UserProfile /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/notification" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><UserNotification /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/reports" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><PoliceSearchCarReport /></UserLayout>}></ProtectedRoute>} />
                <Route path="/police/car-report/:vin" element={<ProtectedRoute roles={['PoliceOffice']} children={<UserLayout navItems={PoliceNavigation}><CarReportPage /></UserLayout>}></ProtectedRoute>} />
                {/*Manufacturer*/}
                <Route path="/manufacturer" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/car-models" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerCarModelList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/requests" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><RequestPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/recalls" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerCarRecallList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/profile" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><UserProfile /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/notification" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><UserNotification /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/car-report/:vin" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><CarReportPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/manufacturer/reports" element={<ProtectedRoute roles={['Manufacturer']} children={<UserLayout navItems={ManufacturerNavigation}><ManufacturerCarReport /></UserLayout>}></ProtectedRoute>} />
                {/*Car Dealer*/}
                <Route path="/dealer" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/details" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerShopDetailsPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/cars" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerCarList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/storage" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerCarStorage /></UserLayout>}></ProtectedRoute>} />
                {/* <Route path="/dealer/cars/:id" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarDealerCarDetails /></UserLayout>}></ProtectedRoute>} /> */}
                <Route path="/dealer/requests" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><RequestPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/profile" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><UserProfile /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/notification" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><UserNotification /></UserLayout>}></ProtectedRoute>} />
                <Route path="/dealer/sales/details/:id" element={<ProtectedRoute roles={['CarDealer']} children={<UserLayout navItems={CarDealerNavigation}><CarSalesDetailPage /></UserLayout>}></ProtectedRoute>} />
                {/*Vehicle Registry*/}
                <Route path="/registry" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><VehicleRegistryHomePage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/registry/inspection" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><RegistryInspectionList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/registry/registration" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><RegistryRegistrationList /></UserLayout>}></ProtectedRoute>} />
                <Route path="/registry/requests" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><RequestPage /></UserLayout>}></ProtectedRoute>} />
                <Route path="/registry/profile" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><UserProfile /></UserLayout>}></ProtectedRoute>} />
                <Route path="/registry/notification" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><UserNotification /></UserLayout>}></ProtectedRoute>} />
                <Route path="/registry/reports" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><RegistrySearchCarReport /></UserLayout>}></ProtectedRoute>} />
                <Route path="/registry/car-report/:vin" element={<ProtectedRoute roles={['VehicleRegistry']} children={<UserLayout navItems={RegistryNavigation}><CarReportPage /></UserLayout>}></ProtectedRoute>} />
            </Routes>
        </Router>
    )
}
    
export default CustomRoutes;