export const UserNavigation = [
    { label: 'Car Sale', link: '/sales' },
    { label: 'Car Reports', link: '/report' },
    {
        label: 'Car Maintenance', dropdownItems: [
            { label: 'Find A Service Shop', link: '/serviceshop' },
            { label: 'Track My Car Maintenance', link: '/maintenance' }
        ]
    },
    { label: 'Car Values', link: '/value' }
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
    { label: 'Car List', link: '/manufacturer/cars' },
    { label: 'Recall List', link: '/manufacturer/recalls' },
    { label: 'Car History Report', link: '/manufacturer/reports' }
]