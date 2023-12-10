export const UserNavigation = [
    { label: 'Car Sale', link: '/sales' },
    { label: 'Car Reports', link: '/report' },
    {
        label: 'Car Maintenance', dropdownItems: [
            { label: 'Find A Service Shop', link: '/services/search' },
            { label: 'Track My Car Maintenance', link: '/maintenance' }
        ]
    }
]

export const RequestNavigation = [
    { label: 'My Requests', link: '/request' }
]


export const AdminNavigation = [
    { label: 'Users List', link: '/admin/users' },
    { label: 'Admin Car Model List', link: '/admin/car-models' },
    { label: 'Admin Manufacturer List', link: '/admin/manufacturers' },
    { label: 'Request List', link: '/admin/requests' },
    { label: 'Monetization Information', link: '/admin/monetization' }
]

export const ManufacturerNavigation = [
    { label: 'Manufacturer Details', link: '/manufacturer/details' },
    { label: 'Car Model List', link: '/manufacturer/car-models' },
    { label: 'Recall List', link: '/manufacturer/recalls' },
    { label: 'Car History Report', link: '/manufacturer/reports' },
    { label: 'Admin Request', link: '/manufacturer/requests' }
]

export const CarDealerNavigation = [
    { label: 'Dealer Details', link: '/dealer' },
    { label: 'Car Sale List', link: '/dealer/cars' },
    { label: 'Car Storage', link: '/dealer/storage' },
    { label: 'Admin Request', link: '/dealer/requests' }
]

export const ServiceShopNavigation = [
    { label: 'Service Shop Details', link: '/service' },
    { label: 'Car Service List', link: '/service/car-service' },
    { label: 'Recall List', link: '/service/recalls' },
    { label: 'Admin Request', link: '/service/requests' }
]

export const PoliceNavigation = [
    { label: 'Partial Plate Search', link: '/police/plate-search' },
    { label: 'VIN Alert', link: '/police/vin-alert' },
    { label: 'Car Crash Reports', link: '/police/crash' },
    { label: 'Car Stolen Reports', link: '/police/stolen' },
    { label: 'Admin Request', link: '/police/requests' }
]

export const InsuranceNavigation = [
    { label: 'Car Insurance', link: '/insurance/insurance-list' },
    { label: 'Car Crash Reports', link: '/insurance/crash' },
    { label: 'Car Stolen Reports', link: '/insurance/stolen' },
    { label: 'Car Reports', link: '/insurance/car-reports' },
    { label: 'Admin Request', link: '/insurance/requests' }
]

export const RegistryNavigation = [
    { label: 'Car Inspection', link: '/registry/inspection' },
    { label: 'Car Registration', link: '/registry/registration' },
    { label: 'Car Reports', link: '/registry/car-reports' },
    { label: 'Admin Request', link: '/registry/requests' }
]

