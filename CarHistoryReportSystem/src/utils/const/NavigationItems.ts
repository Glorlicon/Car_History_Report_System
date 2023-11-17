export const UserNavigation = [
    { label: 'Car Sale', link: '/sales' },
    { label: 'Car Reports', link: '/report' },
    {
        label: 'Car Maintenance', dropdownItems: [
            { label: 'Find A Service Shop', link: '/serviceshop' },
            { label: 'Track My Car Maintenance', link: '/maintenance' }
        ]
    },
    { label: 'Car Values', link: '/value' },
    { label: 'Request', link: '/request' }
]

export const RequestNavigation = [
    { label: 'My Request', link: '/request' }
]


export const AdminNavigation = [
    { label: 'Users List', link: '/admin/users' },
    { label: 'Admin Car List', link: '/admin/cars' },
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
    { label: 'Dealer Details', link: '/dealer/details' },
    { label: 'Car Sale List', link: '/dealer/cars' },
    { label: 'Car Storage', link: '/dealer/storage' },
    { label: 'Admin Request', link: '/dealer/requests' }
]

export const PoliceNavigation = [
    { label: 'Partitial Plate Search', link: '/police/plate-search' },
    { label: 'VIN Alert', link: '/police/vin-alert' },
    { label: 'Car Crash Reports', link: '/police/crash' },
    { label: 'Car Stolen Reports', link: '/police/stolen' },
    { label: 'Admin Request', link: '/police/requests' }
]
