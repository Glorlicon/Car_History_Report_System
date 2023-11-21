import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GetCarServiceHistory, GetMaintenanceDetails } from '../../services/api/CarMaintenance';
import { RootState } from '../../store/State';
import { APIResponse, CarServiceHistory, ModelMaintainanceDetails } from '../../utils/Interfaces';
import '../../styles/CarMaintenanceDetails.css'
function CarMaintenanceDetails() {
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
    const [maintenanceMilestones, setMaintenanceMilestones] = useState<Record<number,string[]>>()
    const [currentMaintenanceDetails, setCurrentMaintenanceDetails] = useState(0)
    const [section, setSection] = useState(0)
    const [currentOdometer, setCurrentOdometer] = useState(0)
    const [currentMilestone, setCurrentMilestone] = useState(0)

    const calculateDays = (firstDate: string, lastDate: string) => {
        let lastServicedDate;
        if (lastDate) lastServicedDate = new Date(lastDate)
        else if (firstDate) lastServicedDate = new Date(firstDate)
        else lastServicedDate = new Date()
        let currentDate = new Date()
        let diffTime = Math.abs(currentDate.valueOf() - lastServicedDate.valueOf())
        return Math.ceil(diffTime/(1000*60*60*24))
    }

    const getNextDate = (diff: number) => {
        let date = new Date()
        let newDate = new Date(date.valueOf() + diff * 1000 * 60 * 60 * 24)
        return `${newDate.getDay()}/${newDate.getMonth()}/${newDate.getFullYear()}`
    }
    const getNextOdometer = (diff: number) => {
        return currentOdometer + diff
    }
    const goToServiceShops = (event: React.MouseEvent<HTMLButtonElement>) => {
        //navigate('/')
        console.log("We go to service shops")
    }

    const addSpaceBeforeCapital = (str: string) => {
        return str.replace(/([a-z])([A-Z])/g, '$1 $2');
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
        return (a*b) / gcd(a,b)
    }

    const getServicesPerformedList = (services: string) => {
        let servicesList = services.split(',')
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
        console.log("Current", current)
        console.log(milestones)
        return milestones;
    }

    const setMaintenanceSchedule = (maintenanceDetails: ModelMaintainanceDetails[],odometer: number) => {
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
        const maintenanceDetailsResponse: APIResponse = await GetMaintenanceDetails(id, token)
        if (maintenanceDetailsResponse.error) {
            setError(maintenanceDetailsResponse.error)
        } else {
            setMaintainanceDetails(maintenanceDetailsResponse.data)
            setCurrentOdometer(maintenanceDetailsResponse.data[0].currentOdometer)
            //setCurrentOdometer(13305)
            setMaintenanceSchedule(maintenanceDetailsResponse.data, maintenanceDetailsResponse.data[0].currentOdometer)
            const serviceHistoryResponse: APIResponse = await GetCarServiceHistory(id, token)
            if (serviceHistoryResponse.error) {
                setError(serviceHistoryResponse.error)
            } else {
                setServiceHistory(serviceHistoryResponse.data)
            }

        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="car-maintenance-details-page">
            {loading ? (
                <div className="car-maintenance-details-spinner"></div>
            ) : error ? (
                    <div className="car-maintenance-details-load-error">
                        {error}
                        <button onClick={fetchData} className="car-maintenance-details-retry-btn">Retry</button>
                    </div>
            ): (
                <div className="car-maintenance-details-main-page">
                <div className="car-maintenance-details-navigator">
                    <a href="/maintenance">&#8592;Garage</a>
                    <a onClick={() => setSection(0)}>Dashboard</a>
                    <a onClick={() => setSection(1)}>Service History</a>
                    <a onClick={() => setSection(2)}>Maintenance Schedule</a>
                </div>
                <div className="car-maintenance-details-section">
                {section === 0 && maintainanceDetails  ? (
                    <>
                    <div className="car-maintenance-details-dashboard">
                    <a>Car VIN: {id}</a>
                    <a>Current Odometer: {currentOdometer}</a>
                        {maintainanceDetails?.map((details: ModelMaintainanceDetails, index: number) => (
                            <>
                                <a onClick={() => setCurrentMaintenanceDetails(index)}>{addSpaceBeforeCapital(details.modelMaintainance.maintenancePart)}: {
                                    details.modelMaintainance.dayPerMaintainance - calculateDays(details.lastOwnerChangeDate, details.lastServicedDate) > 0 ? 
                                    `${details.modelMaintainance.dayPerMaintainance - calculateDays(details.lastOwnerChangeDate, details.lastServicedDate)} days left` : 
                                    "Overdue"
                                }</a>
                            </>
                        ))}
                    </div>
                    <div className="car-maintenance-details-dashboard-details">
                        <h3>
                        {addSpaceBeforeCapital(maintainanceDetails[currentMaintenanceDetails].modelMaintainance.maintenancePart)}
                        </h3>
                        <div className="car-maintenance-details-dashboard-details-2">
                        <div className="car-maintenance-details-dashboard-details-next">
                        <h4>Next Service</h4>
                        <a>{`Date: ${getNextDate(maintainanceDetails[currentMaintenanceDetails].modelMaintainance.dayPerMaintainance - calculateDays(maintainanceDetails[currentMaintenanceDetails].lastOwnerChangeDate, maintainanceDetails[currentMaintenanceDetails].lastServicedDate))}`}</a>
                        <a>{`Odometer: ${getNextOdometer(getClosestHigherOdometer(1, maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance) - currentOdometer)}`}</a>
                        <button onClick={goToServiceShops}>View Service Shops</button>
                        </div> 


                        <div className="car-maintenance-details-dashboard-details-last">
                        <h4>Since Last Service</h4>
                        <h5>Time elapsed</h5>
                        <progress 
                            value={calculateDays(maintainanceDetails[currentMaintenanceDetails].lastOwnerChangeDate, maintainanceDetails[currentMaintenanceDetails].lastServicedDate)}
                            max={maintainanceDetails[currentMaintenanceDetails].modelMaintainance.dayPerMaintainance}
                            ></progress>
                        <h5>Kilometers driven</h5>
                        <progress 
                            value={maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance-getClosestHigherOdometer(1,maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance) + currentOdometer}
                            max={maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance}
                            ></progress>
                        <a>{addSpaceBeforeCapital(maintainanceDetails[currentMaintenanceDetails].modelMaintainance.maintenancePart)}</a>
                        <a>{maintainanceDetails[currentMaintenanceDetails].modelMaintainance.dayPerMaintainance} days | {maintainanceDetails[currentMaintenanceDetails].modelMaintainance.odometerPerMaintainance} kilometers</a>
                        </div>                  
                        </div>
                    </div>
                    </>
                ): section === 1 && serviceHistory ? (
                    <>
                    <div className="car-maintenance-details-brief-service-history">
                    <table>
                    <thead>
                    <tr>
                    <td>Date</td>
                    <td>Odometer</td>
                    </tr>
                    </thead>
                    <tbody>
                    {serviceHistory.map((service:CarServiceHistory, index:number) => (
                        <tr onClick={() => handleScrollToService(index)}>
                            <td>{service.reportDate} <br /> {service.source}</td>
                            <td>{service.odometer}km</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    </div>
                    <div className="car-maintenance-details-detailed-service-history">
                    {serviceHistory.map((service:CarServiceHistory, index:number) => (
                        <div id={`service${index}`}>
                            <table>
                                <thead>
                                    <tr>
                                    <td>{service.source}</td>
                                    <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>Date <br /> {service.reportDate}</td>
                                    <td>Odometer <br /> {service.odometer}</td>
                                    </tr>
                                    <tr>
                                    <td>Service Performed</td>
                                    <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {getServicesPerformedList(service.servicesName).map((serviceName: string, index2: number) => (
                                                <>
                                                    {addSpaceBeforeCapital(serviceName)}
                                                    <br />
                                                </>
                                            ))}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                    </div>
                    </>
                ): section === 2 && maintenanceMilestones && (
                    <>
                    <div className="car-maintenance-details-maintenance-milestones">
                    <table>
                    <thead>
                    <tr>
                    <td>See manufacturer recommended services for </td>
                    <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(maintenanceMilestones).map(([km,actions],index) => (
                        <tr onClick={() => setCurrentMilestone(index)}>
                        <td>{km} km</td>
                        <td>{index === 0 ? "Past" : index === 1 ? "Upcoming" : ""}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    </div>
                    <div className="car-maintenance-details-maintenance-milestone-details">
                    <h4>Manufacturer recommended services at {Object.entries(maintenanceMilestones)[currentMilestone][0]} km</h4>
                    {Object.entries(maintenanceMilestones)[currentMilestone][1].map((action: string, index: number) => (
                        <a>
                            {action}
                            <br/>
                        </a>
                    ))}
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