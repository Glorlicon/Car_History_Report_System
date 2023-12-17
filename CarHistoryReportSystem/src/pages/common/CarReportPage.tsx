/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetReport } from '../../services/api/Reports';
import { APIResponse, CarHistoryDetail, CarReport } from '../../utils/Interfaces';
import '../../styles/CarReportPage.css'
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { clearVerifyToken } from '../../store/authSlice';
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
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas';


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
        const report = getReport()
        if (report){
            html2canvas(report, { scale: 2, scrollY: -window.scrollY }).then((canvas) => {
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 295; // A4 height in mm
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
    
                const pdf = new jsPDF('p', 'mm');
                let position = 0;
    
                // Add the first page
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
    
                // Add new pages as long as there's content left
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
    
                pdf.save('car-report-details.pdf');
            });
        }
    }

    function getHistoryDetails(value: string): string | null {
        if (value === 'Car Service History') return t('Car Serviced')
        if (value === 'Car Accident History') return t('Accident Reported')
        if (value === 'Car Inspection History') return t('Inspection Performed')
        if (value === 'Car Insurance History') return t('Insurance Registered')
        if (value === 'Car Stolen History') return t('Stolen Accident Reported')
        if (value === 'Car Registration History') return t('Registration Issued Or Renewed')
        return null
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
            <button className="add-pol-crash-btn" onClick={handleDownloadPdf}>{t('Export PDF')}(WIP)</button>
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
                                <img src={logo} style={{ width: '10%', height: '10%', alignSelf: 'center' }} alt='' />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>{t('CHRS Car History Report')}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'auto', alignSelf: 'center' }}>
                                    <a style={{ color: 'gray' }}>
                                        <span style={{ fontWeight: 'bold', fontStyle: 'oblique' }}>{t('Report Date')}</span>: {date ? date : new Date().toISOString().split('T')[0]}
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
                                    <span>{t('Country of Assembly')}: </span>
                                    {report.model.country}
                                </a>
                                <a>
                                    <span>{t('Last Reported Odometer')}: </span>
                                    {report.currentOdometer} KM
                                </a>
                                <a>
                                    <span>{t('Current License Plate Number')}: </span>
                                    {report.licensePlateNumber ? report.licensePlateNumber : t('None')}
                                </a>
                            </div>
                        </div>
                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '35px', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <img src={accident} style={{ width: '70%', alignSelf: 'center' }} alt='' />
                                    <a>{report.numberOfAccidentRecords > 0 ? `${report.numberOfAccidentRecords} ${t('Accident Records Found')}` : t('No Accident Records Found')}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <img src={service} style={{ width: '70%', alignSelf: 'center' }} alt='' />
                                    <a>{report.numberOfServiceHistoryRecords > 0 ? `${report.numberOfServiceHistoryRecords} ${t('Service Records Found')}` : t('No Service Records Found')}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <img src={owner} style={{ width: '70%', alignSelf: 'center' }} alt='' />
                                    <a>{report.numberOfOwners > 0 ? `${report.numberOfOwners} ${t('Past Owners Found')}` : t('No Ownership Records Found')}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <img src={stolen} style={{ width: '70%', alignSelf: 'center' }} alt='' />
                                    <a>{report.numberOfStolenRecords > 0 ? `${report.numberOfStolenRecords} ${t('Stolen Records Found')}` : t('No Stolen Records Found')}</a>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <img src={recall} style={{ width: '70%', alignSelf: 'center' }} alt='' />
                                    <a>{report.numberOfOpenRecalls > 0 ? `${report.numberOfOpenRecalls} ${t('Open Recalls Found')}` : t('No Open Recalls Found')}</a>
                                </div>
                            </div>
                        </div>
                        <MuiAlert elevation={6} variant="filled" severity="info" sx={{ width: '80%', alignSelf: 'center', marginBottom: '5%' }}>
                            {t('This car history report is based on information that was reported and available to CHRS as of')}
                            {date ? date : new Date().toISOString().split('T')[0]}
                            {`. ${t('CHRS receives data records from many sources across Vietnam, and we receive new historical data records every day. There may be other information about this car that has not been reported to CHRS. When buying a used car, we always recommend using a CHRS Car History Report, to make an informed decision')}.`}

                        </MuiAlert>


                        <div style={{ paddingTop: '15px', paddingBottom: '15px', backgroundColor: '#fbfbfb' }}>
                            <div style={{ marginLeft: '5%', marginRight: '5%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', color: '#546875', textAlign: 'left' }}>
                                <h3 style={{ fontSize: '25px', textAlign: 'left' }}>{t('Car History Report')}</h3>
                            </div>
                        </div>

                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px', borderTop: '1px solid gray' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <img src={recall} style={{ width: '7%', height: '7%', alignSelf: 'center', marginRight: '5px' }} alt='' />
                                <h3 style={{ fontSize: '25px', textAlign: 'center' }}>{t('Car Recall History')}</h3>
                            </div>
                        </div>

                        <div style={{ marginLeft: '5%', marginRight: '5%', paddingTop: '15px', paddingBottom: '15px' }}>
                            {report.carRecallStatuses.length > 0 ? report.carRecallStatuses.map((recall, index) => {
                                return (
                                    <div style={{ border: '1px solid gray', borderLeft: recall.status === 'Open' ? '5px solid red' : '5px solid green', borderRadius: '5px', boxShadow: '1px 2px #888888', display: 'flex', flexDirection: 'column', margin: '5px', padding: '5px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                            <a>
                                                <span style={{ fontWeight: 'bold' }}>{t('NoRecall')} #: </span>{recall.carRecallId} | {recall.status === ' Open' ? t('OpenRecall') : t('ClosedRecall')}
                                            </a>
                                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'auto', alignSelf: 'center' }}>
                                                <a>
                                                    <span style={{ fontWeight: 'bold' }}>{t('Report Date')}</span>: {recall.recallDate}
                                                </a>
                                            </div>
                                        </div>
                                        <a style={{ color: 'gray', textAlign: 'left' }}>
                                            <span style={{ fontWeight: 'bold', fontStyle: 'oblique' }}>{t('Recall Description')}</span>
                                        </a>
                                        <p style={{ textAlign: 'left' }}>
                                            {recall.description}
                                        </p>
                                    </div>
                                )
                            }) :
                                <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '100%%', alignSelf: 'center' }}>
                                    {t("This car doesn't have any recored recalls")}
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
                                            <th>{t('Owner')}</th>
                                            <th>{t('Report Date')}</th>
                                            <th>{t('Mileage')}</th>
                                            <th>{t('Source')}</th>
                                            <th>{t('Details')}</th>
                                            <th>{t('Note')}</th>
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
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : t('Unknown')}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Address')}: </span>{detail.carOwner ? detail.carOwner.address : t('Unknown')}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Est. Length Owned')}: </span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + (detail.carOwner.endDate ? detail.carOwner.endDate : t('Now')) : t('Unknown')}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {general.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {general.odometer ? general.odometer + ' KM' : ''}
                                                            </td>
                                                            <td >
                                                                {general.source}
                                                            </td>
                                                            <td >
                                                                {getHistoryDetails(general.historyType)}
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
                                                                {general.odometer ? general.odometer + ' KM' : ''}
                                                            </td>
                                                            <td>
                                                                {general.source}
                                                            </td>
                                                            <td>
                                                                {getHistoryDetails(general.historyType)}
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
                                    {t('As of')} {date ? date : new Date().toISOString().split('T')[0]}, {t("this car doesn't have any records")}
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
                                            <th>{t('Owner')}</th>
                                            <th>{t('Report Date')}</th>
                                            <th>{t('Mileage')}</th>
                                            <th>{t('Source')}</th>
                                            <th>{t('Services')}</th>
                                            <th>{t('Note')}</th>
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
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : t('Unknown')}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Address')}: </span>{detail.carOwner ? detail.carOwner.address : t('Unknown')}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Est. Length Owned')}: </span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + (detail.carOwner.endDate ? detail.carOwner.endDate : t('Now')) : t('Unknown')}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {service.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {service.odometer ? service.odometer + ' KM' : ''}
                                                            </td>
                                                            <td >
                                                                {service.source}
                                                            </td>
                                                            <td>
                                                                <span>{t('Services Performed')}:</span>
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
                                                                {service.odometer ? service.odometer + ' KM' : ''}
                                                            </td>
                                                            <td>
                                                                {service.source}
                                                            </td>
                                                            <td>
                                                                <span>{t('Services Performed')}:</span>
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
                                    {t('As of')} {date ? date : new Date().toISOString().split('T')[0]}, {t("this car doesn't have any service records")}
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
                                            <th>{t('Owner')}</th>
                                            <th>{t('Report Date')}</th>
                                            <th>{t('Mileage')}</th>
                                            <th>{t('Source')}</th>
                                            <th>{t('Details')}</th>
                                            <th>{t('Note')}</th>
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
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : t('Unknown')}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Address')}: </span>{detail.carOwner ? detail.carOwner.address : t('Unknown')}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Est. Length Owned')}: </span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + (detail.carOwner.endDate ? detail.carOwner.endDate : t('Now')) : t('Unknown')}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {accident.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {accident.odometer ? accident.odometer + ' KM' : ''}
                                                            </td>
                                                            <td >
                                                                {accident.source}
                                                            </td>
                                                            <td >
                                                                <span>{t('Accident Details')}:</span>
                                                                <ul>
                                                                    <li>
                                                                        {t('Accident Date')}: {accident.accidentDate}
                                                                    </li>
                                                                    <li>
                                                                        {t('Estimated Severity')}: {accident.serverity * 100}%
                                                                    </li>
                                                                    <li>
                                                                        {t('Accident Location')}: {accident.location}
                                                                    </li>
                                                                    <li>
                                                                        {t('Damaged Car Sides')}: {getCarSides(accident.damageLocation)}
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
                                                                {accident.odometer ? accident.odometer + ' KM' : ''}
                                                            </td>
                                                            <td>
                                                                {accident.source}
                                                            </td>
                                                            <td>
                                                                <span>{t('Accident Details')}:</span>
                                                                <ul>
                                                                    <li>
                                                                        {t('Accident Date')}: {accident.accidentDate}
                                                                    </li>
                                                                    <li>
                                                                        {t('Estimated Severity')}: {accident.serverity * 100}%
                                                                    </li>
                                                                    <li>
                                                                        {t('Accident Location')}: {accident.location}
                                                                    </li>
                                                                    <li>
                                                                        {t('Damaged Car Sides')}: {getCarSides(accident.damageLocation)}
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
                                    {t('As of')} {date ? date : new Date().toISOString().split('T')[0]}, {t("this car doesn't have any accident records")}
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
                                            <th>{t('Owner')}</th>
                                            <th>{t('Report Date')}</th>
                                            <th>{t('Mileage')}</th>
                                            <th>{t('Source')}</th>
                                            <th>{t('Details')}</th>
                                            <th>{t('Note')}</th>
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
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : t('Unknown')}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Address')}: </span>{detail.carOwner ? detail.carOwner.address : t('Unknown')}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Est. Length Owned')}: </span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + (detail.carOwner.endDate ? detail.carOwner.endDate : t('Now')) : t('Unknown')}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {inspection.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {inspection.odometer ? inspection.odometer + ' KM' : ''}
                                                            </td>
                                                            <td >
                                                                {inspection.source}
                                                            </td>
                                                            <td >
                                                                <span>{t('Inpsection Details')}:</span>
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
                                                                <span>{t('Inpsection Details')}:</span>
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
                                    {t('As of')} {date ? date : new Date().toISOString().split('T')[0]}, {t("this car doesn't have any inspection records")}
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
                                            <th>{t('Owner')}</th>
                                            <th>{t('Report Date')}</th>
                                            <th>{t('Mileage')}</th>
                                            <th>{t('Source')}</th>
                                            <th>{t('Duration')}</th>
                                            <th>{t('Description')}</th>
                                            <th>{t('Note')}</th>
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
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : t('Unknown')}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Address')}: </span>{detail.carOwner ? detail.carOwner.address : t('Unknown')}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Est. Length Owned')}: </span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + (detail.carOwner.endDate ? detail.carOwner.endDate : t('Now')) : t('Unknown')}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {insurance.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {insurance.odometer ? insurance.odometer + ' KM' : ''}
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
                                                                {insurance.odometer ? insurance.odometer + ' KM' : ''}
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
                                    {t('As of')} {date ? date : new Date().toISOString().split('T')[0]}, {t("this car doesn't have any insurance records")}
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
                                            <th>{t('Owner')}</th>
                                            <th>{t('Report Date')}</th>
                                            <th>{t('Mileage')}</th>
                                            <th>{t('Source')}</th>
                                            <th>{t('Status')}</th>
                                            <th>{t('Description')}</th>
                                            <th>{t('Note')}</th>
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
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : t('Unknown')}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Address')}: </span>{detail.carOwner ? detail.carOwner.address : t('Unknown')}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Est. Length Owned')}: </span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + (detail.carOwner.endDate ? detail.carOwner.endDate : t('Now')) : t('Unknown')}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {stolen.reportDate.split('T')[0]}
                                                            </td>
                                                            <td >
                                                                {stolen.odometer ? stolen.odometer + ' KM' : ''}
                                                            </td>
                                                            <td >
                                                                {stolen.source}
                                                            </td>
                                                            <td >
                                                                {stolen.status === 1 ? t('Found') : t('Stolen')}
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
                                                                {stolen.odometer ? stolen.odometer + ' KM' : ''}
                                                            </td>
                                                            <td>
                                                                {stolen.source}
                                                            </td>
                                                            <td >
                                                                {stolen.status === 1 ? t('Found') : t('Stolen')}
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
                                    {t('As of')} {date ? date : new Date().toISOString().split('T')[0]}, {t("this car doesn't have any stolen accidents records")}
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
                            {!isHistoryEmpty(report, 'carStolenHistories') ?
                                <table style={{ border: '1px solid gray', borderRadius: '5px', boxShadow: '1px 2px #888888', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ minHeight: '300px' }}>
                                            <th>{t('Owner')}</th>
                                            <th>{t('Report Date')}</th>
                                            <th>{t('Mileage')}</th>
                                            <th>{t('Source')}</th>
                                            <th>{t('License Plate Number')}</th>
                                            <th>{t('Expire Date')}</th>
                                            <th>{t('Description')}</th>
                                            <th>{t('Note')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.carHistoryDetails.map((detail, index1) => {
                                            let count = detail.carRegistrationHistories.length
                                            return detail.carRegistrationHistories.map((reg, index2) => {
                                                if (index2 === 0) {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td rowSpan={count} style={{ display: 'flex', flexDirection: 'column', width: '150px', paddingLeft: '10px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                                    <img src={ownerOne} style={{ width: '10%', height: '10%', alignSelf: 'center' }} alt='' />
                                                                    <h3 style={{ fontSize: '15px', textAlign: 'center' }}>{detail.carOwner ? detail.carOwner.name : t('Unknown')}</h3>
                                                                </div>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Address')}: </span>{detail.carOwner ? detail.carOwner.address : t('Unknown')}
                                                                </a>
                                                                <a style={{ textAlign: 'left' }}>
                                                                    <span>{t('Est. Length Owned')}: </span>{detail.carOwner ? detail.carOwner.startDate + ' ' + t('to') + ' ' + (detail.carOwner.endDate ? detail.carOwner.endDate : t('Now')) : t('Unknown')}
                                                                </a>
                                                            </td>
                                                            <td >
                                                                {reg.reportDate ? reg.reportDate.split('T')[0] : ''}
                                                            </td>
                                                            <td >
                                                                {reg.odometer ? reg.odometer + ' KM' : ''}
                                                            </td>
                                                            <td >
                                                                {reg.source}
                                                            </td>
                                                            <td >
                                                                {reg.licensePlateNumber}
                                                            </td>
                                                            <td >
                                                                {reg.expireDate}
                                                            </td>
                                                            <td >
                                                                {t('Registration Issued')}
                                                            </td>
                                                            <td >
                                                                {reg.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr style={{ height: '100px', backgroundColor: index2 % 2 !== 0 ? 'white' : 'rgba(18,148,239,.03)' }}>
                                                            <td >

                                                            </td>
                                                            <td >
                                                                {reg.reportDate ? reg.reportDate.split('T')[0] : ''}
                                                            </td>
                                                            <td>
                                                                {reg.odometer ? reg.odometer + ' KM' : ''}
                                                            </td>
                                                            <td>
                                                                {reg.source}
                                                            </td>
                                                            <td >
                                                                {reg.licensePlateNumber}
                                                            </td>
                                                            <td >
                                                                {reg.expireDate}
                                                            </td>
                                                            <td >
                                                                {t('Registration Renewed')}
                                                            </td>
                                                            <td >
                                                                {reg.note}
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
                                    {t('As of')} {date ? date : new Date().toISOString().split('T')[0]}, {t("this car doesn't have any registration records")}
                                </MuiAlert>
                            }

                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CarReportPage;