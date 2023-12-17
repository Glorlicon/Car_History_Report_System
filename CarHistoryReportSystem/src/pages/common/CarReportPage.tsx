/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetReport } from '../../services/api/Reports';
import { APIResponse, CarCrash, CarHistoryDetail, CarInspectionDetail, CarInspectionHistory, CarInsurance, CarRecallStatus, CarRegistration, CarReport, CarServiceHistory, CarStolen } from '../../utils/Interfaces';
import '../../styles/CarReportPage.css'
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { clearVerifyToken } from '../../store/authSlice';
import car from '../../car.jpg'
import { CAR_SIDES } from '../../utils/const/CarSides';
import { useTranslation } from 'react-i18next';
import logo from '../../logoCHRS.png'
import accident from '../../accident.png'
import service from '../../service.png'
import owner from '../../owner.png'
import stolen from '../../stolen.png'
import recall from '../../recall.png'
import general from '../../general.png'
import ownerOne from '../../owner_one.png'
import inspection from '../../inspection.png'
import insurance from '../../insurance.png'
import registration from '../../registration.png'
import { FUEL_TYPES } from '../../utils/const/FuelTypes';
import { BODY_TYPES } from '../../utils/const/BodyTypes';
import MuiAlert from '@mui/material/Alert';

function CarReportPage() {
    type RouteParams = {
        vin: string
        date: string
    }
    const { t, i18n } = useTranslation();
    const verifyToken = useSelector((state: RootState) => state.auth.verifyToken) as unknown as string
    const token = useSelector((state: RootState) => state.auth.token)
    const dispatch = useDispatch()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const { vin, date } = useParams<RouteParams>()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [report, setReport] = useState<CarReport | null>(null)
    const getReport = () => document.getElementById('report')
    const handleDownloadPdf = () => {
        generatePDF(getReport, options)
    }
    function getFuelTypeName(value: number): string | null {
        for (const [key, val] of Object.entries(FUEL_TYPES)) {
            if (val === value) {
                return key;
            }
        }
        return null;
    }
    function getBodyTypeName(value: number): string | null {
        for (const [key, val] of Object.entries(BODY_TYPES)) {
            if (val === value) {
                return key;
            }
        }
        return null;
    }
    const options: Options = {
        filename: "report.pdf",
        method: "save",
        resolution: Resolution.EXTREME,
        page: {
            margin: Margin.LARGE,
            format: "letter",
            orientation: "landscape"
        },
        canvas: {
            mimeType: "image/jpeg",
            qualityRatio: 1
        },
        overrides: {
            pdf: {
                compress: true
            },
            canvas: {
                useCORS: true
            }
        }
    };
    const isHistoryEmpty = (carReport: CarReport, historyName: keyof CarHistoryDetail): boolean => {
        return carReport.carHistoryDetails.every(detail => {
            const history = detail[historyName]
            return Array.isArray(history) && history.length === 0
        })
    }
    const getCarSides = (value: number): string => {
        const sides: string[] = []
        if (value & CAR_SIDES.Front) {
            sides.push(t('Front'));
        }
        if (value & CAR_SIDES.Rear) {
            sides.push(t('Rear'));
        }
        if (value & CAR_SIDES.Left) {
            sides.push(t('Left'));
        }
        if (value & CAR_SIDES.Right) {
            sides.push(t('Right'));
        }

        return sides.join(', ');
    }
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let reportDate = date ? date : new Date().toISOString().split('T')[0]
        let response: APIResponse
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        if (token) {
            response = await GetReport(vin as string, token, reportDate, connectAPIError, language)
        } else {
            response = await GetReport(vin as string, verifyToken, reportDate, connectAPIError, language)
        }
        setLoading(false);
        if (response.error) {
            setError(response.error);
        } else {
            setReport(response.data)
            console.log(response.data)
            dispatch(clearVerifyToken())
        }
    }
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
        fetchData()
    }, [])

    return (
        <div className="car-report-details-page">
            <button className="add-pol-crash-btn">{t('Export PDF')}(WIP)</button>
            <div className="car-report-details-container" id="report">
                {loading ? (
                    <div className="car-report-details-spinner"></div>
                ) : error || !report ? (
                    <>
                        {error}
                        <button onClick={fetchData} className="dealer-car-sales-details-retry-btn">{t('Retry')}</button>
                    </>
                ) : (
                    <>
                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <img src={logo} style={{ width: '10%', height: '10%', alignSelf: 'center' }} />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>CHRS Car History Report</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'auto', alignSelf: 'center' }}>
                                    <a style={{ color: 'gray' }}>
                                        <span style={{ fontWeight: 'bold', fontStyle: 'oblique' }}>Report Date</span>: {date ? date : new Date().toISOString().split('T')[0]}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div style={{ paddingLeft: '5%', paddingRight: '5%', backgroundColor: '#fbfbfb', paddingBottom: '15px', paddingTop: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', color: '#546875', textAlign: 'left' }}>
                                <a style={{ fontSize: '30px' }}>{report?.model.releasedDate.split('-')[0]} {report?.model.manufacturerName.toUpperCase()} {report?.model.modelID.toUpperCase()}</a>
                                <a>{getBodyTypeName(report?.model.bodyType)} | {getFuelTypeName(report?.model.fuelType)}</a>
                                <a>{report.vinId}</a>
                                <a>
                                    <span>Country of Assembly: </span>
                                    {report.model.country}
                                </a>
                                <a>
                                    <span>Last Reported Odometer: </span>
                                    {report.currentOdometer} KM
                                </a>
                                <a>
                                    <span>Current License Plate Number: </span>
                                    {report.licensePlateNumber ? report.licensePlateNumber : t('None')}
                                </a>
                            </div>
                        </div>
                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '35px', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <img src={accident} style={{ width: '70%', alignSelf: 'center' }} />
                                    <a>{report.numberOfAccidentRecords > 0 ? `${report.numberOfAccidentRecords} Accident Records Found` : 'No Accident Records Found'}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <img src={service} style={{ width: '70%', alignSelf: 'center' }} />
                                    <a>{report.numberOfServiceHistoryRecords > 0 ? `${report.numberOfServiceHistoryRecords} Service Records Found` : 'No Service Records Found'}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <img src={owner} style={{ width: '70%', alignSelf: 'center' }} />
                                    <a>{report.numberOfOwners > 0 ? `${report.numberOfOwners} Past Owners Found` : 'No Ownership Records Found'}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <img src={stolen} style={{ width: '70%', alignSelf: 'center' }} />
                                    <a>{report.numberOfStolenRecords > 0 ? `${report.numberOfStolenRecords} Stolen Records Found` : 'No Stolen Records Found'}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <img src={recall} style={{ width: '70%', alignSelf: 'center' }} />
                                    <a>{report.numberOfOpenRecalls > 0 ? `${report.numberOfOpenRecalls} Open Recalls Found` : 'No Open Recalls Found'}</a>
                                </div>
                            </div>
                        </div>
                        <MuiAlert elevation={6} variant="filled" severity="info" sx={{ width: '80%', alignSelf: 'center' }}>
                            {t('This car history report is based on information that was reported and available to CHRS as of')}
                            {date ? date : new Date().toISOString().split('T')[0]}
                            {`. ${t('CHRS receives data records from many sources across Vietnam, and we receive new historical data records every day. There may be other information about this car that has not been reported to CHRS. When buying a used car, we always recommend using a CHRS Car History Report, to make an informed decision')}.`}

                        </MuiAlert>


                        <div style={{ paddingTop: '15px', paddingBottom: '15px', backgroundColor: '#fbfbfb' }}>
                            <div style={{ marginLeft: '5%', marginRight: '5%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', color: '#546875', textAlign: 'left' }}>
                                <h3 style={{ fontSize: '25px', textAlign: 'left' }}>Car History Report</h3>
                            </div>
                        </div>

                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px', borderTop: '1px solid gray' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <img src={recall} style={{ width: '7%', height: '7%', alignSelf: 'center', marginRight: '5px' }} />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>{t('Car Recall History')}</h3>
                            </div>
                        </div>

                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px' }}>
                            {report.carRecallStatuses.length > 0 ? report.carRecallStatuses.map((recall, index) => {
                                return (
                                    <div style={{ border: '1px solid gray', borderLeft: recall.status === 'Open' ? '5px solid red' : '5px solid green', borderRadius: '5px', boxShadow: '1px 2px #888888', display: 'flex', flexDirection: 'column', margin: '5px', padding: '5px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                            <a>
                                                <span style={{ fontWeight: 'bold' }}>Recall #: </span>{recall.carRecallId} | {recall.status}
                                            </a>
                                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'auto', alignSelf: 'center' }}>
                                                <a>
                                                    <span style={{ fontWeight: 'bold' }}>Report Date</span>: {recall.recallDate}
                                                </a>
                                            </div>
                                        </div>
                                        <a style={{ color: 'gray', textAlign: 'left' }}>
                                            <span style={{ fontWeight: 'bold', fontStyle: 'oblique' }}>Recall Description</span>
                                        </a>
                                        <p style={{ textAlign: 'left' }}>
                                            {recall.description}
                                        </p>
                                    </div>
                                )
                            }) :
                                <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%%', alignSelf: 'center' }}>
                                    This car doesn't have any recored recalls
                                </MuiAlert>
                            }
                        </div>


                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px', borderTop: '1px solid gray' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <img src={general} style={{ width: '7%', height: '7%', alignSelf: 'center', marginRight: '5px' }} alt="" />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>{t('Car General History')}</h3>
                            </div>
                        </div>


                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px' }} >
                            {!isHistoryEmpty(report, 'generalCarHistories') ?
                                <table style={{ border: '1px solid gray', borderRadius: '5px', boxShadow: '1px 2px #888888', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ minHeight: '300px' }}>
                                            <th>Owner</th>
                                            <th>Date</th>
                                            <th>Mileage</th>
                                            <th>Source</th>
                                            <th>Details</th>
                                            <th>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.carHistoryDetails.map((detail, index1) => {
                                            let count = detail.generalCarHistories.length
                                            return detail.generalCarHistories.map((general, index2) => {
                                                if (index2 === 0) {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td rowSpan={count} style={{ display: 'flex', flexDirection: 'column', width: '150px', paddingLeft: '10px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                    <img src={ownerOne} style={{ width: '10%', height: '10%', alignSelf: 'center' }} alt='' />
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : 'Unknown'}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Address:</span>{detail.carOwner ? detail.carOwner.address : 'Unknown'}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Est. Length Owned:</span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + detail.carOwner.endDate : 'Unknown'}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {general.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {general.odometer ? general.odometer + 'KM' : ''}
                                                            </td>
                                                            <td >
                                                                {general.source}
                                                            </td>
                                                            <td >
                                                                {general.historyType}
                                                            </td>
                                                            <td >
                                                                {general.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td >

                                                            </td>
                                                            <td >
                                                                {general.reportDate.split('T')[0]}
                                                            </td>
                                                            <td>
                                                                {general.odometer ? general.odometer + 'KM' : ''}
                                                            </td>
                                                            <td>
                                                                {general.source}
                                                            </td>
                                                            <td>
                                                                {general.historyType}
                                                            </td>
                                                            <td >
                                                                {general.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        })}
                                    </tbody>
                                </table>
                                :
                                <MuiAlert elevation={6} variant="filled" severity="info" sx={{ width: '90%', margin: 'auto' }}>
                                    As of {date ? date : new Date().toISOString().split('T')[0]}, this car doesn't have any records
                                </MuiAlert>
                            }

                        </div>

                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px', borderTop: '1px solid gray' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <img src={service} style={{ width: '7%', height: '7%', alignSelf: 'center', marginRight: '5px' }} alt="" />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>{t('Car Service History')}</h3>
                            </div>
                        </div>


                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px' }} >
                            {!isHistoryEmpty(report, 'carServiceHistories') ?
                                <table style={{ border: '1px solid gray', borderRadius: '5px', boxShadow: '1px 2px #888888', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ minHeight: '300px' }}>
                                            <th>Owner</th>
                                            <th>Date</th>
                                            <th>Mileage</th>
                                            <th>Source</th>
                                            <th>Services</th>
                                            <th>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.carHistoryDetails.map((detail, index1) => {
                                            let count = detail.carServiceHistories.length
                                            return detail.carServiceHistories.map((service, index2) => {
                                                if (index2 === 0) {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td rowSpan={count} style={{ display: 'flex', flexDirection: 'column', width: '150px', paddingLeft: '10px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                    <img src={ownerOne} style={{ width: '10%', height: '10%', alignSelf: 'center' }} alt='' />
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : 'Unknown'}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Address:</span>{detail.carOwner ? detail.carOwner.address : 'Unknown'}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Est. Length Owned:</span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + detail.carOwner.endDate : 'Unknown'}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {service.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {service.odometer ? service.odometer + 'KM' : ''}
                                                            </td>
                                                            <td >
                                                                {service.source}
                                                            </td>
                                                            <td>
                                                                <span>Services Performed:</span>
                                                                <ul>
                                                                    {service.servicesName.split(', ').map((s, index) => (
                                                                        <li>{t(s)}</li>
                                                                    ))}
                                                                    {service.otherServices &&
                                                                        <li>
                                                                            {service.otherServices}
                                                                        </li>}
                                                                </ul>
                                                            </td>
                                                            <td >
                                                                {service.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td >

                                                            </td>
                                                            <td >
                                                                {service.reportDate.split('T')[0]}
                                                            </td>
                                                            <td>
                                                                {service.odometer ? service.odometer + 'KM' : ''}
                                                            </td>
                                                            <td>
                                                                {service.source}
                                                            </td>
                                                            <td>
                                                                <span>Services Performed:</span>
                                                                <ul>
                                                                    {service.servicesName.split(', ').map((s, index) => (
                                                                        <li>{t(s)}</li>
                                                                    ))}
                                                                    {service.otherServices &&
                                                                        <li>
                                                                            {service.otherServices}
                                                                        </li>}
                                                                </ul>
                                                            </td>
                                                            <td >
                                                                {service.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        })}
                                    </tbody>
                                </table>
                                :
                                <MuiAlert elevation={6} variant="filled" severity="info" sx={{ width: '90%', margin: 'auto' }}>
                                    As of {date ? date : new Date().toISOString().split('T')[0]}, this car doesn't have any service records
                                </MuiAlert>
                            }

                        </div>

                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px', borderTop: '1px solid gray' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <img src={accident} style={{ width: '7%', height: '7%', alignSelf: 'center', marginRight: '5px' }} alt="" />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>{t('Car Accident History')}</h3>
                            </div>
                        </div>


                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px' }} >
                            {!isHistoryEmpty(report, 'carAccidentHistories') ?
                                <table style={{ border: '1px solid gray', borderRadius: '5px', boxShadow: '1px 2px #888888', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ minHeight: '300px' }}>
                                            <th>Owner</th>
                                            <th>Date</th>
                                            <th>Mileage</th>
                                            <th>Source</th>
                                            <th>Details</th>
                                            <th>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.carHistoryDetails.map((detail, index1) => {
                                            let count = detail.carAccidentHistories.length
                                            return detail.carAccidentHistories.map((accident, index2) => {
                                                if (index2 === 0) {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td rowSpan={count} style={{ display: 'flex', flexDirection: 'column', width: '150px', paddingLeft: '10px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                    <img src={ownerOne} style={{ width: '10%', height: '10%', alignSelf: 'center' }} alt='' />
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : 'Unknown'}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Address:</span>{detail.carOwner ? detail.carOwner.address : 'Unknown'}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Est. Length Owned:</span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + detail.carOwner.endDate : 'Unknown'}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {accident.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {accident.odometer ? accident.odometer + 'KM' : ''}
                                                            </td>
                                                            <td >
                                                                {accident.source}
                                                            </td>
                                                            <td >
                                                                <span>Accident Details:</span>
                                                                <ul>
                                                                    <li>
                                                                        Accident Date: {accident.accidentDate}
                                                                    </li>
                                                                    <li>
                                                                        Estimated Severity : {accident.serverity * 100}%
                                                                    </li>
                                                                    <li>
                                                                        Accident Location: {accident.location}
                                                                    </li>
                                                                    <li>
                                                                        Damaged Car Sides: {getCarSides(accident.damageLocation)}
                                                                    </li>
                                                                </ul>
                                                            </td>
                                                            <td >
                                                                {accident.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td >

                                                            </td>
                                                            <td >
                                                                {accident.reportDate.split('T')[0]}
                                                            </td>
                                                            <td>
                                                                {accident.odometer ? accident.odometer + 'KM' : ''}
                                                            </td>
                                                            <td>
                                                                {accident.source}
                                                            </td>
                                                            <td>
                                                                <span>Accident Details:</span>
                                                                <ul>
                                                                    <li>
                                                                        Accident Date: {accident.accidentDate}
                                                                    </li>
                                                                    <li>
                                                                        Estimated Severity : {accident.serverity * 100}%
                                                                    </li>
                                                                    <li>
                                                                        Accident Location: {accident.location}
                                                                    </li>
                                                                    <li>
                                                                        Damaged Car Sides: {getCarSides(accident.damageLocation)}
                                                                    </li>
                                                                </ul>
                                                            </td>
                                                            <td >
                                                                {accident.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        })}
                                    </tbody>
                                </table>
                                :
                                <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '90%', margin: 'auto' }}>
                                    As of {date ? date : new Date().toISOString().split('T')[0]}, this car doesn't have any accident records
                                </MuiAlert>
                            }

                        </div>

                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px', borderTop: '1px solid gray' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <img src={inspection} style={{ width: '7%', height: '7%', alignSelf: 'center', marginRight: '5px' }} alt="" />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>{t('Car Inspection History')}</h3>
                            </div>
                        </div>


                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px' }} >
                            {!isHistoryEmpty(report, 'carInspectionHistories') ?
                                <table style={{ border: '1px solid gray', borderRadius: '5px', boxShadow: '1px 2px #888888', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ minHeight: '300px' }}>
                                            <th>Owner</th>
                                            <th>Date</th>
                                            <th>Mileage</th>
                                            <th>Source</th>
                                            <th>Details</th>
                                            <th>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.carHistoryDetails.map((detail, index1) => {
                                            let count = detail.carInspectionHistories.length
                                            return detail.carInspectionHistories.map((inspection, index2) => {
                                                if (index2 === 0) {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td rowSpan={count} style={{ display: 'flex', flexDirection: 'column', width: '150px', paddingLeft: '10px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                    <img src={ownerOne} style={{ width: '10%', height: '10%', alignSelf: 'center' }} alt='' />
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : 'Unknown'}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Address:</span>{detail.carOwner ? detail.carOwner.address : 'Unknown'}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Est. Length Owned:</span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + detail.carOwner.endDate : 'Unknown'}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {inspection.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {inspection.odometer ? inspection.odometer + 'KM' : ''}
                                                            </td>
                                                            <td >
                                                                {inspection.source}
                                                            </td>
                                                            <td >
                                                                <span>Inpsection Details:</span>
                                                                <ul>
                                                                    {inspection.carInspectionHistoryDetail.map((detail) => (
                                                                        <li>
                                                                            {detail.inspectionCategory}: {detail.isPassed ? t('Passed') : t('Not passed')}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </td>
                                                            <td >
                                                                {inspection.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td >

                                                            </td>
                                                            <td >
                                                                {inspection.reportDate.split('T')[0]}
                                                            </td>
                                                            <td>
                                                                {inspection.odometer ? inspection.odometer + 'KM' : ''}
                                                            </td>
                                                            <td>
                                                                {inspection.source}
                                                            </td>
                                                            <td>
                                                                <span>Inpsection Details:</span>
                                                                <ul>
                                                                    {inspection.carInspectionHistoryDetail.map((detail) => (
                                                                        <li>
                                                                            {detail.inspectionCategory}: {detail.isPassed ? t('Passed') : t('Not passed')}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </td>
                                                            <td >
                                                                {inspection.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        })}
                                    </tbody>
                                </table>
                                :
                                <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '90%', margin: 'auto' }}>
                                    As of {date ? date : new Date().toISOString().split('T')[0]}, this car doesn't have any inspection records
                                </MuiAlert>
                            }

                        </div>





                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px', borderTop: '1px solid gray' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <img src={insurance} style={{ width: '7%', height: '7%', alignSelf: 'center', marginRight: '5px' }} alt="" />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>{t('Car Insurance History')}</h3>
                            </div>
                        </div>


                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px' }} >
                            {!isHistoryEmpty(report, 'carInsurances') ?
                                <table style={{ border: '1px solid gray', borderRadius: '5px', boxShadow: '1px 2px #888888', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ minHeight: '300px' }}>
                                            <th>Owner</th>
                                            <th>Date</th>
                                            <th>Mileage</th>
                                            <th>Source</th>
                                            <th>Duration</th>
                                            <th>Description</th>
                                            <th>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.carHistoryDetails.map((detail, index1) => {
                                            let count = detail.carInsurances.length
                                            return detail.carInsurances.map((insurance, index2) => {
                                                if (index2 === 0) {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td rowSpan={count} style={{ display: 'flex', flexDirection: 'column', width: '150px', paddingLeft: '10px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                    <img src={ownerOne} style={{ width: '10%', height: '10%', alignSelf: 'center' }} alt='' />
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : 'Unknown'}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Address:</span>{detail.carOwner ? detail.carOwner.address : 'Unknown'}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Est. Length Owned:</span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + detail.carOwner.endDate : 'Unknown'}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {insurance.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {insurance.odometer ? insurance.odometer + 'KM' : ''}
                                                            </td>
                                                            <td >
                                                                {insurance.source}
                                                            </td>
                                                            <td >
                                                                {t('From') + ' ' + insurance.startDate + ' ' + t('to') + ' ' + insurance.endDate}
                                                            </td>
                                                            <td >
                                                                {insurance.description}
                                                            </td>
                                                            <td >
                                                                {insurance.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td >

                                                            </td>
                                                            <td >
                                                                {insurance.reportDate.split('T')[0]}
                                                            </td>
                                                            <td>
                                                                {insurance.odometer ? insurance.odometer + 'KM' : ''}
                                                            </td>
                                                            <td>
                                                                {insurance.source}
                                                            </td>
                                                            <td >
                                                                {t('From') + ' ' + insurance.startDate + ' ' + t('to') + ' ' + insurance.endDate}
                                                            </td>
                                                            <td >
                                                                {insurance.description}
                                                            </td>
                                                            <td >
                                                                {insurance.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        })}
                                    </tbody>
                                </table>
                                :
                                <MuiAlert elevation={6} variant="filled" severity="info" sx={{ width: '90%', margin: 'auto' }}>
                                    As of {date ? date : new Date().toISOString().split('T')[0]}, this car doesn't have any insurance records
                                </MuiAlert>
                            }

                        </div>

                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px', borderTop: '1px solid gray' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <img src={stolen} style={{ width: '7%', height: '7%', alignSelf: 'center', marginRight: '5px' }} alt="" />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>{t('Car Stolen Accidents History')}</h3>
                            </div>
                        </div>


                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px' }} >
                            {!isHistoryEmpty(report, 'carStolenHistories') ?
                                <table style={{ border: '1px solid gray', borderRadius: '5px', boxShadow: '1px 2px #888888', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ minHeight: '300px' }}>
                                            <th>Owner</th>
                                            <th>Date</th>
                                            <th>Mileage</th>
                                            <th>Source</th>
                                            <th>Status</th>
                                            <th>Description</th>
                                            <th>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.carHistoryDetails.map((detail, index1) => {
                                            let count = detail.carStolenHistories.length
                                            return detail.carStolenHistories.map((stolen, index2) => {
                                                if (index2 === 0) {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td rowSpan={count} style={{ display: 'flex', flexDirection: 'column', width: '150px', paddingLeft: '10px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                    <img src={ownerOne} style={{ width: '10%', height: '10%', alignSelf: 'center' }} alt='' />
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : 'Unknown'}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Address:</span>{detail.carOwner ? detail.carOwner.address : 'Unknown'}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>Est. Length Owned:</span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + detail.carOwner.endDate : 'Unknown'}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {stolen.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {stolen.odometer ? stolen.odometer + 'KM' : ''}
                                                            </td>
                                                            <td >
                                                                {stolen.source}
                                                            </td>
                                                            <td >
                                                                {stolen.status === 1 ? t('Found') : ('Not found')}
                                                            </td>
                                                            <td >
                                                                {stolen.description}
                                                            </td>
                                                            <td >
                                                                {stolen.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td >

                                                            </td>
                                                            <td >
                                                                {stolen.reportDate.split('T')[0]}
                                                            </td>
                                                            <td>
                                                                {stolen.odometer ? stolen.odometer + 'KM' : ''}
                                                            </td>
                                                            <td>
                                                                {stolen.source}
                                                            </td>
                                                            <td >
                                                                {stolen.status === 1 ? t('Found') : ('Not found')}
                                                            </td>
                                                            <td >
                                                                {stolen.description}
                                                            </td>
                                                            <td >
                                                                {stolen.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        })}
                                    </tbody>
                                </table>
                                :
                                <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '90%', margin: 'auto' }}>
                                    As of {date ? date : new Date().toISOString().split('T')[0]}, this car doesn't have any stolen accidents records
                                </MuiAlert>
                            }

                        </div>
                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px', borderTop: '1px solid gray' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <img src={registration} style={{ width: '7%', height: '7%', alignSelf: 'center', marginRight: '5px' }} alt="" />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>{t('Car Registration History')}</h3>
                            </div>
                        </div>


                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px' }} >
                            {report.carRegistrationHistories.length > 0 ?
                                <table style={{ border: '1px solid gray', borderRadius: '5px', boxShadow: '1px 2px #888888', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ minHeight: '300px' }}>
                                            <th>Owner</th>
                                            <th>Date</th>
                                            <th>Mileage</th>
                                            <th>Source</th>
                                            <th>License Plate Number</th>
                                            <th>Expire Date</th>
                                            <th>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.carRegistrationHistories.map((reg, index1) => (
                                            <tr style={{ height: '100px', backgroundColor: index1 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                <td style={{ paddingLeft: '10px' }}>
                                                    {reg.ownerName}
                                                </td>
                                                <td>
                                                    {reg.reportDate}
                                                </td>
                                                <td>
                                                    {reg.odometer ? reg.odometer + 'KM' : ''}
                                                </td>
                                                <td>
                                                    {reg.source}
                                                </td>
                                                <td>
                                                    {reg.licensePlateNumber}
                                                </td>
                                                <td>
                                                    {reg.expireDate}
                                                </td>
                                                <td>
                                                    {reg.note}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                :
                                <MuiAlert elevation={6} variant="filled" severity="info" sx={{ width: '90%', margin: 'auto' }}>
                                    As of {date ? date : new Date().toISOString().split('T')[0]}, this car doesn't have any registration records
                                </MuiAlert>
                            }

                        </div>

                        {/* <div className="car-report-service-history">
                            <h3>{t('Car Registration History')}</h3>
                            <table className="car-report-service-history-table">
                                <thead>
                                    <tr>
                                        <th>Owner</th>
                                        <th>Date</th>
                                        <th>Mileage</th>
                                        <th>Source</th>
                                        <th>License Plate Number</th>
                                        <th>Expire Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report?.carHistoryDetails && report?.carHistoryDetails.length > 0 && !isHistoryEmpty(report, 'carRegistrationHistories') ? (
                                        report?.carHistoryDetails.map((history: CarHistoryDetail, index: number) => {
                                            const registrationCount = history.carRegistrationHistories?.length || 1;
                                            return (
                                                <>
                                                    <tr key={`${index}-0`}>
                                                        {history.carRegistrationHistories && history.carRegistrationHistories.length > 0 ? (
                                                            <>
                                                                <td className="car-report-service-history-table-ownership-data" rowSpan={registrationCount}>
                                                                    <a>Owner name: {history.carOwner ? history.carOwner.name : 'Unknown'}</a>
                                                                    <a>Owner address: {history.carOwner ? history.carOwner.address : 'Unknown'}</a>
                                                                    <a>Estimated length owned: {history.carOwner ? `${history.carOwner.startDate} to ${history.carOwner.endDate}` : 'Unknown'}</a>
                                                                </td>
                                                                <td>{history.carRegistrationHistories[0].reportDate}</td>
                                                                <td>{history.carRegistrationHistories[0].odometer}</td>
                                                                <td>{history.carRegistrationHistories[0].source}</td>
                                                                <td>{history.carRegistrationHistories[0].licensePlateNumber}</td>
                                                                <td>{history.carRegistrationHistories[0].expireDate}</td>
                                                            </>
                                                        ) : null}
                                                    </tr>
                                                    {history.carRegistrationHistories && history.carRegistrationHistories.length > 1 ? (
                                                        history.carRegistrationHistories.slice(1).map((registration: CarRegistration, index2: number) => (
                                                            <tr key={`${index}-${index2 + 1}`}>
                                                                <td></td>
                                                                <td>{registration.reportDate}</td>
                                                                <td>{registration.odometer}</td>
                                                                <td>{registration.source}</td>
                                                                <td>{registration.licensePlateNumber}</td>
                                                                <td>{registration.expireDate}</td>
                                                            </tr>
                                                        ))
                                                    ) : null}
                                                </>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5}>No stolen recorded</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div> */}
                    </>
                )}
            </div>
        </div>
    );
}

export default CarReportPage;