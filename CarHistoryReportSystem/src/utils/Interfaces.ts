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

export interface CarDealer {
    id: number
    userName: string
    dataProvider: DataProvider
}

export interface CarDealerImage {
    id?: string
    avatarImageLink?: string
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
    imagelink?: string
    workingTimes?: workingTimes[]
}

export interface EditDataProvider {
    name: string
    description?: string
    address?: string
    websiteLink?: string
    service?: string
    phoneNumber?: string
    email?: string
    type: number
    typeName: string
    imagelink?: string
    workingTimes: {
        dayOfWeek: number,
        startHour: number,
        startMinute: number,
        endHour: number,
        endMinute: number,
        isClosed: boolean
        }[]
}

export interface CarSalesInfo {
    description: string
    carId?: string
    features: string[]
    price: number
    carImages?: CarImages[]
    dataProvider?: DataProvider;
}

export interface CarSaleDetails {
    name: string
    phoneNumber: string
    carId: string
    address: string
    dob: string
    startDate: string
    note: string
}

    export interface CarImages {
        id?: number
        carId?: string
        imageLink: string

    }
export interface Car {
    vinId: string
    licensePlateNumber: string
    modelId: string
    color: number
    colorName?: string
    currentOdometer: number
    engineNumber: string
    isModified: boolean
    isCommercialUse: boolean
    model?: CarModel
    createdByUserId?: string;
    carSalesInfo?: CarSalesInfo
    carImages?: CarImages[]
}

export interface CarMaintenance {
    carId: string
    userId: string
}

export interface UsersRequest {
    description: string
    response: string
    type: string
    status: string
}

export interface AdminRequest {
    id?: number
    description?: string
    response: string
    type?: string
    status: string
    createdByUserId?: string
    modifiedByUserId?: string
}
export interface ReportPackage {
    title: string
    price: number
    pricePerReport: number
    type: "STANDARD" | "GOOD DEAL" | "BEST DEAL"
}

export interface Order {
    carId?: string
    userId?: string
    orderOptionId: number
    transactionId:  string
}
export interface AddReport {
    userId: string
    carId: string
}

export interface CarRecallStatus {
    carId: string,
    carRecallId: number,
    modelId: string,
    description: string,
    recallDate: string,
    status: string
}

export interface CarReport {
    vinId: string,
    licensePlateNumber: string,
    modelId: string,
    colorName: string,
    currentOdometer: number,
    numberOfOpenRecalls: number,
    numberOfAccidentRecords: number,
    numberOfStolenRecords: number,
    numberOfOwners: number,
    numberOfServiceHistoryRecords: number,
    engineNumber: string,
    isModified: boolean,
    isCommercialUse: boolean,
    model: CarModel,
    carRecallStatuses: CarRecallStatus[],
    carHistoryDetails: CarHistoryDetail[]
}

export interface CarHistoryDetail {
    startDate: string;
    endDate: string;
    carOwner: CarOwner;
    carServiceHistories: CarServiceHistory[];
    carAccidentHistories: CarAccidentHistory[];
    carInspectionHistories: CarInspectionHistory[];
    carInsurances: CarInsurance[];
    carStolenHistories: CarStolenHistory[];
    generalCarHistories: GeneralCarHistory[];
}

interface CarOwner {
    id: string;
    name: string;
    phoneNumber: string;
    address: string;
    dob: string;
    startDate: string;
    endDate: string;
    carId: string;
    note: string;
    dataSource: string;
    createdByUserId: string;
    modifiedByUserId: string;
    createdTime: string;
    lastModified: string;
}

export interface CarServiceHistory {
    id: number;
    carId: string;
    source: string;
    otherServices: string;
    serviceTime: string;
    reportDate: string;
    services: number;
    servicesName: string;
    note: string;
    odometer: number;
    createdByUserId: string;
    modifiedByUserId: string;
    createdTime: string;
    lastModified: string;
}

interface CarAccidentHistory {
    // Define properties for CarAccidentHistory here
}


interface CarInspectionHistory {
    // Define properties for CarInspectionHistory here
}

interface CarInsurance {
    // Define properties for CarInsurance here
}

interface CarStolenHistory {
    // Define properties for CarStolenHistory here
}

interface GeneralCarHistory {
    reportDate: string;
    odometer: number;
    historyType: string;
    source: string;
    note: string;
}


export interface ContactMail {
    firstName: string
    lastName: string
    zipCode: string
    phoneNumber: string
    email: string
    vinId: string
}

export interface dealerdataprovider {
    id: number;
    name: string
    description: string
    address: string
    websiteLink: string
    service: string
    phoneNumber: string
    email: string
    type: number
    typeName: string
    imagelink: string
    workingTimes: workingTimes[]
    Reviews: Reviews[]
}

export interface workingTimes {
    dayOfWeek: number
    startTime: string
    endTime: string
    isClosed: boolean
}

export interface Reviews {
    userId: string
    description: string
    rating: number
    //createdTime: Date
}

export interface ModelMaintainanceDetails {
    modelMaintainance: {
        modelId: string
        maintenancePart: string
        odometerPerMaintainance: number,
        dayPerMaintainance: number
        recommendAction: string
    },
    lastOdometer: number
    lastServicedDate: string
    currentOdometer: number
    lastOwnerChangeDate: string
}