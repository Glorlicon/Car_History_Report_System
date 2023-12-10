export interface APIResponse {
    data?: any
    error?: string
    pages?: Paging
}

export interface Paging {
    CurrentPage: number
    TotalPages: number
    PageSize: number
    TotalCount: number
    HasPrevious: boolean
    HasNext: boolean
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
    maxReportNumber: number
    role: number
    roleName?: string
    isSuspended?: boolean
    dataProviderId?: number | null
    avatarImageLink?: string
    dataProvider?: DataProvider
}

export interface UserDataproviderId {
    id: string
    dataProviderId?: number | null
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
    lastModified?: string,
    modelOdometers: ModelMaintenance[]
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
    reviews?: Reviews[]
}

export interface EditDataProvider {
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
    licensePlateNumber?: string
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
    carAccidentHistories: CarCrash[];
    carInspectionHistories: CarInspectionHistory[];
    carInsurances: CarInsurance[];
    carStolenHistories: CarStolen[];
    carRegistrationHistories: CarRegistration[];
    generalCarHistories: GeneralCarHistory[];
}

export interface CarOwner {
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


export interface CarInspectionHistory {
    id?: string
    carId: string
    note?: string
    odometer: number
    reportDate: string
    source?: string
    description: string
    inspectionNumber: string
    inspectDate: string
    carInspectionHistoryDetail: CarInspectionDetail[]
}

export interface CarInspectionDetail {
    id?: number
    carInspectionHistoryId?: number
    inspectionCategory: string
    isPassed: boolean
    note?: string
}

export interface GeneralCarHistory {
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

export interface editWorkingTime {
    dayOfWeek: number
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
    isClosed: boolean
}

export interface Reviews {
    userId?: string
    description: string
    rating: number
    createdTime?: Date
}

export interface ModelMaintenance {
    modelId?: string
    maintenancePart: string
    odometerPerMaintainance: number,
    dayPerMaintainance: number
    recommendAction: string
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

export interface CarRecalls {
    id?: number
    modelId: string
    description: string
    recallDate?: Date
}

export interface RecallStatus {
    status: number
}

export interface ServiceCarRecalls {
    carId: string
    carRecallId: number
    description: string
    modelId: Date
    recallDate: Date
    status: string
}

export interface CarServices {
    id?: number
    source?: string
    carId: string
    otherServices: string
    serviceTime: Date
    reportDate: Date
    services: number
    servicesName?: string
    note: string
    odometer: number
    createdByUserId?: string
    modifiedByUserId?: string
    createdTime?: Date
    lastModified?: Date
    selectedServices: number[];
}

export interface Services {
    name: string
    value: number
}

export interface CarStolen {
    id?: number,
    description?: string,
    carId: string,
    note?: string,
    odometer: number,
    reportDate: string,
    status: number,
    source?: string,
    createdByUserId?: string,
    modifiedByUserId?: string,
    createdTime?: string,
    lastModified?: string
}

export interface CarCrash {
    id?: number,
    source?: string,
    location: string,
    carId: string,
    serverity: number,
    damageLocation: number,
    accidentDate: string,
    description: string,
    note: string,
    odometer?: number,
    reportDate: string,
    createdByUserId?: string,
    modifiedByUserId?: string,
    createdTime?: string,
    lastModified?: string
}

export interface CarRegistration {
    id?: number,
    carId: string,
    ownerName: string,
    registrationNumber: string,
    expireDate: string,
    licensePlateNumber: string,
    note?: string,
    odometer?: number,
    reportDate?: string,
    source?: string,
    createdByUserId?: string,
    modifiedByUserId?: string,
    createdTime?: string,
    lastModified?: string
}

export interface CarInsurance {
    id?: number,
    insuranceNumber: string,
    carId: string,
    startDate: string,
    endDate: string,
    description: string,
    note: string,
    odometer: number,
    reportDate: string,
    source?: string,
    createdByUserId?: string,
    modifiedByUserId?: string,
    createdTime?: string,
    lastModified?: string
    expired?: boolean
}

export interface CarInspectionSearchParams {
    carId: string
    inspectionNumber: string
    startDate: string
    endDate: string
}

export interface CarRegistrationSearchParams {
    carId: string
    ownerName: string
    registrationNumber: string
    expireDateStart: string
    expireDateEnd: string
    licensePlateNumber: string
}

export interface CarCrashSearchParams {
    vinId: string,
    minServerity: string,
    maxServerity: string,
    accidentStartDate: string,
    accidentEndDate: string,
}

export interface CarStolenSearchParams {
    vinID: string
    status: string
}

export interface AdminUserSearchParams {
    username: string
    email: string
    role: string
    dataProviderName: string
}

export interface CarModelSearchParams {
    modelId: string
    manuName: string
    releasedDateStart: string
    releasedDateEnd: string
}

export interface ManufacturerSearchParams {
    name: string
    email: string
}

export interface CarRecallSearchParams {
    modelId: string
    recallDateStart: string
    recallDateEnd: string
}

export interface CarInsuranceSearchParams {
    vinID: string
    insuranceNumber: string
    startInsuranceDateMin: string
    startInsuranceDateMax: string
    endInsuranceDateMin: string
    endInsuranceDateMax: string
}

export interface CarStorageSearchParams {
    vin: string
    manufacturer: string
    model: string
    odometerMin: string
    odometerMax: string
    releaseDateMin: string
    releaseDateMax: string
}
export interface CarSaleSearchParams {
    vin: string
    manufacturer: string
    model: string
    odometerMin: string
    odometerMax: string
    releaseDateMin: string
    releaseDateMax: string
    priceMin: string
    priceMax: string
}

export interface UserReport {
    userId: string
    carId: string
    createdDate: string
}

export interface OrderSearchParams {
    usedId: string
    orderOption: string
    transactionId: string
    createdDateStart: string
    createdDateEnd: string
}

export interface OrderResponse {
    id: number
    userId?: string
    orderOptionId: number
    transactionId: string
    createdDate: string
}
export interface CarSearchParams {
    make: string
    model: string
    yearstart?: number
    pricemax?: number
    milagemax?: number
}
export interface PartialPlateSearchParams {
    partialPlate: string
    partialVin: string
    manufacturer: string
    model: string
}

export interface VinAlert {
    carId: string
    userId: string
    isFollowing: boolean
    createdTime: string
}
export interface CarTracking {
    carId: string
    userId: string
}
