import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GetCarServiceHistory, GetMaintenanceDetails } from '../../services/api/CarMaintenance';
import { RootState } from '../../store/State';
import { APIResponse, CarServiceHistory, ModelMaintainanceDetails } from '../../utils/Interfaces';
import '../../styles/CarMaintenanceDetails.css'
import { useTranslation } from 'react-i18next';
import CreateIcon from '@mui/icons-material/Create';
import DoneIcon from '@mui/icons-material/Done';
import IconButton from "@mui/material/IconButton";
import brake from '../../images/brake.png'
import mrecall from '../../images/mrecall.png'
import oil from '../../images/oil.png'
import part from '../../images/part.png'
import tire from '../../images/tire.png'
import SpeedIcon from '@mui/icons-material/Speed';
import ConstructionIcon from '@mui/icons-material/Construction';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
function CarMaintenanceDetails() {
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    type RouteParams = {
        id: string
    }
    type ServiceInterval = {
        name: string
        interval: number
        action: string
    }
    const { id } = useParams<RouteParams>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [maintainanceDetails, setMaintainanceDetails] = useState<ModelMaintainanceDetails[]>()
    const [serviceHistory, setServiceHistory] = useState<CarServiceHistory[]>()
    const [maintenanceMilestones, setMaintenanceMilestones] = useState<Record<number, string[]>>()
    const [currentMaintenanceDetails, setCurrentMaintenanceDetails] = useState(0)
    const [section, setSection] = useState(0)
    const [currentOdometer, setCurrentOdometer] = useState(0)
    const [currentMilestone, setCurrentMilestone] = useState(0)


    const getImage = (index: number) => {
        switch (index) {
            case 0: return brake
            case 1: return part
            case 2: return oil
            case 3: return mrecall
            case 4: return tire
            default: return ''
        }
    }
    const calculateDays = (firstDate: string, lastDate: string) => {
        let lastServicedDate;
        if (lastDate) lastServicedDate = new Date(lastDate)
        else if (firstDate) lastServicedDate = new Date(firstDate)
        else lastServicedDate = new Date()
        let currentDate = new Date()
        let diffTime = Math.abs(currentDate.valueOf() - lastServicedDate.valueOf())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const [changeOdometer, setChangeOdometer] = useState(false)
    const [temp, setTemp] = useState(0)
    const handleChangeOdometer = (value: number) => {
        setChangeOdometer(false)
        setCurrentOdometer(value)
    }

    const getNextDate = (diff: number) => {
        let date = new Date();
        let newDate = new Date(date.valueOf() + diff * 1000 * 60 * 60 * 24);
        return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    }
    const getNextOdometer = (diff: number) => {
        return currentOdometer + diff
    }
    const goToServiceShops = (event: React.MouseEvent<HTMLButtonElement>) => {
        navigate('/services/search')
    }

    const getClosestHigherOdometer = (index: number, odometer: number): number => {
        if (odometer * index > currentOdometer) return odometer * index
        else return getClosestHigherOdometer(index + 1, odometer)
    }
    const handleScrollToService = (index: number) => {
        let element = document.getElementById(`service${index}`)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
    }

    const gcd = (a: number, b: number): number => {
        return b === 0 ? a : gcd(b, a % b)
    }

    const lcm = (a: number, b: number): number => {
        return (a * b) / gcd(a, b)
    }

    const getServicesPerformedList = (services: string) => {
        let servicesList = services.split(', ')
        return servicesList
    }

    const calculateServiceMilestones = (serviceIntervals: ServiceInterval[], cycleLength: number, current: number, milestoneCount: number) => {
        let milestones: Record<number, string[]> = {}
        let startKm = 0
        for (let km = 1; km <= current; km++) {
            let serviceDue = false;
            serviceIntervals.forEach(service => {
                if (km % service.interval === 0) {
                    serviceDue = true;
                }
            });
            if (serviceDue) {
                startKm = km;
            }
        }
        for (let km = startKm; Object.keys(milestones).length < milestoneCount; km++) {
            serviceIntervals.forEach(service => {
                if (km % service.interval === 0) {
                    if (!milestones[km]) {
                        milestones[km] = [];
                    }
                    milestones[km].push(service.action);
                }
            });
        }
        return milestones;
    }

    const setMaintenanceSchedule = (maintenanceDetails: ModelMaintainanceDetails[], odometer: number) => {
        let serviceIntervals: ServiceInterval[] = []
        maintenanceDetails?.forEach((detail: ModelMaintainanceDetails, index: number) => {
            serviceIntervals.push({
                name: detail.modelMaintainance.maintenancePart,
                interval: detail.modelMaintainance.odometerPerMaintainance,
                action: detail.modelMaintainance.recommendAction
            })
        })
        let cycleLength: number
        if (serviceIntervals.length > 0) {
            cycleLength = serviceIntervals.map(service => service.interval).reduce((a, b) => lcm(a, b))
        } else {
            cycleLength = 10000
        }
        let milestoneCount = 20
        const milestones = calculateServiceMilestones(serviceIntervals, cycleLength, odometer, milestoneCount)
        setMaintenanceMilestones(milestones)
    }
    const fetchData = async () => {
        setLoading(true)
        setError(null)
        if (!id) {
            setError("Not valid vin ID")
            setLoading(false)
            return
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const maintenanceDetailsResponse: APIResponse = await GetMaintenanceDetails(id, token, connectAPIError, language)
        if (maintenanceDetailsResponse.error) {
            setError(maintenanceDetailsResponse.error)
        } else {
            setMaintainanceDetails(maintenanceDetailsResponse.data)
            setCurrentOdometer(maintenanceDetailsResponse.data[0].currentOdometer)
            //setCurrentOdometer(13305)
            setMaintenanceSchedule(maintenanceDetailsResponse.data, maintenanceDetailsResponse.data[0].currentOdometer)
            const serviceHistoryResponse: APIResponse = await GetCarServiceHistory(id, token, connectAPIError, language)
            if (serviceHistoryResponse.error) {
                setError(serviceHistoryResponse.error)
            } else {
                setServiceHistory(serviceHistoryResponse.data)
            }

        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <div className="car-maintenance-details-page">
            {loading ? (
                <div className="car-maintenance-details-spinner"></div>
            ) : error ? (
                <div className="car-maintenance-details-load-error">
                    {error}
                    <button onClick={fetchData} className="car-maintenance-details-retry-btn">{t('Retry')}</button>
                </div>
            ) : (
                <div className="car-maintenance-details-main-page">
                    <div className="car-maintenance-details-navigator" style={{ borderCollapse: 'collapse', fontSize: "20px" }}>
                        <div onClick={() => { navigate('/maintenance') }} className="car-maintenance-details-navigator-a" style={{ display: 'flex', flexDirection: "column", alignContent: 'center' }}>
                            <a>&#8592;</a>
                            <a>{t('Garage')}</a>
                        </div>
                        <div onClick={() => setSection(0)} className="car-maintenance-details-navigator-a" style={{ display: 'flex', flexDirection: "column", alignContent: 'center', borderBottom: section === 0 ? '5px solid darkblue' : 'None' }}>
                            <a><SpeedIcon /></a>
                            <a>{t('Dashboard')}</a>
                        </div>
                        <div onClick={() => setSection(1)} className="car-maintenance-details-navigator-a" style={{ display: 'flex', flexDirection: "column", alignContent: 'center', borderBottom: section === 1 ? '5px solid darkblue' : 'None' }}>
                            <a><ConstructionIcon /></a>
                            <a>{t('Service History')}</a>
                        </div>
                        <div onClick={() => setSection(2)} className="car-maintenance-details-navigator-a" style={{ display: 'flex', flexDirection: "column", alignContent: 'center', borderBottom: section === 2 ? '5px solid darkblue' : 'None' }}>
                            <a><CalendarMonthIcon /></a>
                            <a>{t('Maintenance Schedule')}</a>
                        </div>
                    </div>
                    <div className="car-maintenance-details-section" style={{ justifyContent: "space-between" }}>
                        {section === 0 && maintainanceDetails ? (
                            <>
                                <table style={{ width: '35%', height: '100%', border: '1px solid #f8f8f8', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ display: 'flex', flexDirection: 'column', paddingLeft: '10px', paddingTop: '20px', borderBottom: '1px solid #f8f8f8' }}>
                                                <a style={{ textAlign: 'left' }}>
                                                    <span>{t('Car VIN')}: </span>{id}
                                                </a>
                                                <a style={{ textAlign: 'left' }}>
                                                    {changeOdometer ? (
                                                        <>
                                                            <span>{t('Current Odometer')}: </span>
                                                            <input
                                                                type="number"
                                                                value={temp}
                                                                min="0"
                                                                onChange={(e) => setTemp(Number(e.target.value))}
                                                                style={{ width: '100px', fontSize: '17px' }}
                                                            />
                                                            <IconButton onClick={() => { setChangeOdometer(false); handleChangeOdometer(temp) }}>
                                                                <DoneIcon />
                                                            </IconButton>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>{t('Current Odometer')}: </span>{currentOdometer} KM
                                                            <IconButton onClick={() => { setTemp(currentOdometer); setChangeOdometer(true); }}>
                                                                <CreateIcon style={{ alignSelf: 'center' }} />
                                                            </IconButton>
                                                        </>
                                                    )}
                                                </a>
                                            </td>
                                        </tr>
                                        {maintainanceDetails?.map((details: ModelMaintainanceDetails, index: number) => (
                                            <tr>
                                                <td style={{ borderRight: currentMaintenanceDetails === index ? '4px solid blue' : 'None', backgroundColor: currentMaintenanceDetails === index ? 'lightblue' : 'white', textAlign: 'left', borderBottom: '1px solid #f8f8f8', height: '50px', paddingLeft: '10px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} onClick={() => setCurrentMaintenanceDetails(index)}>
                                                        <img src={getImage(index)} style={{ width: '7%', height: '7%', alignSelf: 'center' }} alt='' />
                                                        <h3 style={{ textAlign: 'center', paddingLeft: '5px' }}>{t(details.modelMaintainance.maintenancePart)}</h3>: {
                                                            details.modelMaintainance.dayPerMaintainance - calculateDays(details.lastOwnerChangeDate, details.lastServicedDate) <= 0 ?
                                                                t('Overdue') : (
                                                                    currentLanguage === 'vn' ?
                                                                        `${t('left')} ${details.modelMaintainance.dayPerMaintainance - calculateDays(details.lastOwnerChangeDate, details.lastServicedDate)} ${t('Days')}` :
                                                                        `${details.modelMaintainance.dayPerMaintainance - calculateDays(details.lastOwnerChangeDate, details.lastServicedDate)} ${t('Days')} ${t('left')}`
                                                                )
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: "center", paddingRight: '5px' }}>
                                    <h3 style={{ fontSize: '30px' }}>
                                        {t(maintainanceDetails[currentMaintenanceDetails].modelMaintainance.maintenancePart)}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                        <div style={{ width: '40%', border: '1px solid #f8f8f8', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', padding: '10px' }}>
                                            <h4 style={{ textAlign: 'left', fontSize: '25px' }}>{t('Next Service')}</h4>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <a>{t('Date')}</a>
                                                    <a style={{ fontWeight: 'bold', fontSize: '20px' }}>{getNextDate(maintainanceDetails[currentMaintenanceDetails].modelMaintainance.dayPerMaintainance - calculateDays(maintainanceDetails[currentMaintenanceDetails].lastOwnerChangeDate, maintainanceDetails[currentMaintenanceDetails].lastServicedDate))}</a>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <a>{t('Odometer')}</a>
                                                    <a style={{ fontWeight: 'bold', fontSize: '20px' }}>{getNextOdometer(getClosestHigherOdometer(1, maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance) - currentOdometer)}</a>
                                                </div>
                                            </div>
                                            <button onClick={goToServiceShops} className="car-maintenance-details-dashboard-details-next-button">{t('View Service Shops')}</button>
                                        </div>
                                        <div style={{ width: '40%', border: '1px solid #f8f8f8', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', padding: '10px' }}>
                                            <h4 style={{ textAlign: 'left', fontSize: '25px' }}>{t('Since Last Service')}</h4>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                                                    <a style={{ textAlign: 'left', fontWeight: 'bold' }}>{t('Time elapsed')}</a>
                                                    <progress
                                                        style={{ width: '100%', alignSelf: 'center' }}
                                                        value={calculateDays(maintainanceDetails[currentMaintenanceDetails].lastOwnerChangeDate, maintainanceDetails[currentMaintenanceDetails].lastServicedDate)}
                                                        max={maintainanceDetails[currentMaintenanceDetails].modelMaintainance.dayPerMaintainance}
                                                    ></progress>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '20%' }}>
                                                    <a style={{ textAlign: 'center' }}>
                                                        {maintainanceDetails[currentMaintenanceDetails].modelMaintainance.dayPerMaintainance}
                                                    </a>
                                                    <a style={{ textAlign: 'center', color: 'gray' }}>
                                                        {t('days')}
                                                    </a>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                                                    <a style={{ textAlign: 'left', fontWeight: 'bold' }}>{t('Kilometers driven')}</a>
                                                    <progress
                                                        style={{ width: '100%', alignSelf: 'center' }}
                                                        value={maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance - getClosestHigherOdometer(1, maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance) + currentOdometer}
                                                        max={maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance}
                                                    ></progress>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignSelf: "flex-end", width: '20%' }}>
                                                    <a style={{ textAlign: 'center' }}>
                                                        {maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance}
                                                    </a>
                                                    <a style={{ textAlign: 'center', color: 'gray' }}>
                                                        km
                                                    </a>
                                                </div>
                                            </div>
                                            <a style={{ display: 'block', paddingTop: '5% ' }}>{t(maintainanceDetails[currentMaintenanceDetails].modelMaintainance.maintenancePart)}</a>
                                            <a style={{ fontWeight: 'bold' }}>{maintainanceDetails[currentMaintenanceDetails].modelMaintainance.dayPerMaintainance} {t('days')} | {maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance} km</a>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : section === 1 && serviceHistory ? (
                            <>
                                <table style={{ width: '40%', height: '100%', border: '1px solid #f8f8f8', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', borderCollapse: 'collapse' }}>
                                    <thead style={{ height: '50px', fontWeight: 'bold', fontSize: '20px', textAlign: "left" }}>
                                        <tr>
                                            <td style={{ width: '60%' }}>{t('Date')}</td>
                                            <td>{t('Odometer')}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serviceHistory.map((service: CarServiceHistory, index: number) => (
                                            <tr onClick={() => handleScrollToService(index)} style={{ textAlign: 'left', borderTop: '1px solid #f8f8f8' }}>
                                                <td>{service.reportDate} <br /> {service.source}</td>
                                                <td>{service.odometer} km</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={{ width: '55%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {serviceHistory.map((service: CarServiceHistory, index: number) => (
                                        <div id={`service${index}`} style={{ width: '80%', border: '1px solid #f8f8f8', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', borderCollapse: 'collapse', paddingLeft: '10px', marginBottom: '10px', alignSelf: 'center' }}>
                                            <h4 style={{ textAlign: 'left', fontSize: '25px' }}>{t('Source')}: {service.source}</h4>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <a>{t('Date')}</a>
                                                    <a style={{ fontWeight: 'bold', fontSize: '20px' }}>{service.reportDate}</a>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <a>{t('Odometer')}</a>
                                                    <a style={{ fontWeight: 'bold', fontSize: '20px' }}>{service.odometer}</a>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'left', marginTop: '10px' }}>
                                                <span>{t('Services Performed')}:</span>
                                                <ul>
                                                    {getServicesPerformedList(service.servicesName).map((serviceName: string, index2: number) => (
                                                        <li>
                                                            {t(serviceName)}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : section === 2 && maintenanceMilestones && (
                            <>
                                <table style={{ width: '40%', height: '100%', border: '1px solid #f8f8f8', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', borderCollapse: 'collapse' }}>
                                    <thead style={{ height: '50px', fontWeight: 'bold', fontSize: '20px', textAlign: "left" }}>
                                        <tr>
                                            <td style={{ width: '70%' }}>{t('See manufacturer recommended services for')}</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(maintenanceMilestones).map(([km, actions], index) => (
                                            <tr onClick={() => setCurrentMilestone(index)} style={{ textAlign: 'left', borderTop: '1px solid #f8f8f8', height: '30px', borderRight: currentMilestone === index ? '3px solid blue' : 'None' }}>
                                                <td>{km} km</td>
                                                <td style={{ textAlign: 'right', paddingRight: '10px' }}>{index === 0 ? t('Past') : index === 1 ? t('Upcoming') : ""}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ width: '55%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ width: '80%', border: '1px solid #f8f8f8', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', borderCollapse: 'collapse', paddingLeft: '10px', marginBottom: '10px', alignSelf: 'center', borderRadius:'5px' }}>
                                        <h4 style={{ textAlign: 'left', fontSize: '25px' }}>
                                            {t('Manufacturer recommended services at')} {Object.entries(maintenanceMilestones)[currentMilestone][0]} km
                                        </h4>
                                        <div style={{ textAlign: 'left', marginTop: '10px' }}>
                                            <ul>
                                                {Object.entries(maintenanceMilestones)[currentMilestone][1].map((action: string, index: number) => (
                                                    <li>
                                                        {t(action)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarMaintenanceDetails;