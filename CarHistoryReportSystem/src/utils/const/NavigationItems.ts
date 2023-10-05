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
    { label: 'Admin Car Model List', link: '/admin/models' },
    { label: 'Admin Manufacturer List', link: '/admin/manufacturers' },
    { label: 'Request List', link: '/admin/requests' },
    { label: 'Monetization Information', link: '/admin/monetization' }
]