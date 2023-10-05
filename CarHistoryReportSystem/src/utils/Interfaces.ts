export interface APIResponse {
    data?: any
    error?: string
}

export interface LoginResponse {
    isEmailVerified: boolean
    isSuspended: boolean
    isUserExist: boolean
    succeed: boolean
    token?: string
}

export interface Token {
    aud: string
    exp: number
    roles: string
    name: string
    nameidentifier: string
    email: string
    iss: string
}

export interface VerifyToken {
    token: string
}

export interface NavItem {
    label: string
    link?: string
    dropdownItems?: NavItem[]
}

