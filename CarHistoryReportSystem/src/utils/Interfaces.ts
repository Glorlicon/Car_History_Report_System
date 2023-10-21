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
    dataprovider: number
}

export interface VerifyToken {
    token: string
}

export interface NavItem {
    label: string
    link?: string
    dropdownItems?: NavItem[]
}

export interface User {
    id: string
    userName: string
    email: string
    firstName: string
    phoneNumber: string
    lastName: string
    address?: string
    maxReports: number
    role: number
    isSuspended?: boolean
    dataProviderId?: number | null
    avatarImageLink?: string
    dataProvider?: {
        name: string
        description?: string
        address?: string
        websiteLink?: string
        service?: string
        phoneNumber?: string
        email?: string
        type: number
    }
}

export interface Manufacturer {
    id: number
    name: string
    description: string
    address?: string
    websiteLink?: string
    phoneNumber?: string
    email?: string
}

export interface CarModel {
    modelID: string,
    manufacturerId: number,
    manufacturerName: string,
    wheelFormula?: string,
    wheelTread?: string,
    dimension?: string,
    wheelBase?: number,
    weight?: number,
    releasedDate: string,
    country: string,
    fuelType: number,
    bodyType: number,
    ridingCapacity?: number,
    personCarriedNumber?: number,
    seatNumber?: number,
    layingPlaceNumber?: number,
    maximumOutput?: number,
    engineDisplacement?: number,
    rpm?: number,
    tireNumber?: number,
    createdByUserId?: string,
    modifiedByUserId?: string,
    createdTime?: string,
    lastModified?: string
}

export interface DataProvider {
    id: number
    name: string
    description?: string
    address?: string
    websiteLink?: string
    service?: string
    phoneNumber?: string
    email?: string
    type: number
    typeName: string
}

export interface CarSalesInfo {
    description: string
    features: string[]
    price: number
}

export interface CarImages {
    id: number
    imageLink: string
}
export interface Car {
    vinId: string
    licensePlateNumber: string
    modelId: string
    color: number
    colorName: string
    currentOdometer: number
    engineNumber: string
    isModified: boolean
    isCommercialUse: true
    model: CarModel
    carSalesInfo?: CarSalesInfo
    carImages?: CarImages
}

