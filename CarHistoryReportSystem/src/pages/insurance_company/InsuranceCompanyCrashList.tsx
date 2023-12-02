import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GetCrashInsuranceExcel, ListCarCrashInsurance } from '../../services/api/CarCrash';
import { RootState } from '../../store/State';
import { CAR_SIDES } from '../../utils/const/CarSides';
import { APIResponse, CarCrash, CarCrashSearchParams, Paging } from '../../utils/Interfaces';
import car from '../../car.jpg'

function InsuranceCompanyCrashList() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carCrashList, setCarCrashList] = useState<CarCrash[]>([]);
    const [modalPage, setModalPage] = useState(1);
    const [searchVinId, setSearchVinId] = useState('')
    const [searchSeverity, setSearchSeverity] = useState(0)
    const [searchCrashStartDate, setSearchStartDate] = useState('')
    const [searchCrashEndDate, setSearchEndDate] = useState('')
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")
    const [showCarCrashReport, setShowCarCrashReport] = useState<CarCrash | null>(null)
    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }

    const handleNextPage = () => {
        if (modalPage < 2) {
            setModalPage(prevPage => prevPage + 1);
        } 
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };

    const handleResetFilters = () => {
        setSearchEndDate('')
        setSearchSeverity(0)
        setSearchStartDate('')
        setSearchVinId('')
        setResetTrigger(prev => prev + 1);
    }
    const isSideColored = (sideValue: number): boolean => {
        if (showCarCrashReport)
            return (showCarCrashReport.damageLocation & sideValue) === sideValue;
        else return false
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarCrashSearchParams = {
            vinId: searchVinId,
            accidentEndDate: searchCrashEndDate,
            accidentStartDate: searchCrashStartDate,
            serverity: searchSeverity
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carCrashReportResponse: APIResponse = await ListCarCrashInsurance(token, page, connectAPIError, language, searchParams)
        if (carCrashReportResponse.error) {
            setError(carCrashReportResponse.error)
        } else {
            setCarCrashList(carCrashReportResponse.data)
            setPaging(carCrashReportResponse.pages)
            const responseCsv: APIResponse = await GetCrashInsuranceExcel(token, page, connectAPIError, language, searchParams)
            setData(responseCsv.data)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, []);
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, [page])
    useEffect(() => {
        fetchData();
    }, [resetTrigger]);
    return (
        <div className="pol-crash-list-page">
            <div className="pol-crash-top-bar">
                <div className="reg-inspec-search-filter-container">
                    <div className="reg-inspec-search-filter-item">
                        <label>{t('Car ID')}</label>
                        <input
                            type="text"
                            className="reg-inspec-search-bar"
                            placeholder={t('Search by Car ID')}
                            value={searchVinId}
                            onChange={(e) => setSearchVinId(e.target.value)}
                        />
                    </div>
                    <div className="reg-inspec-search-filter-item">
                        <label>{t('Severity')}</label>
                        <input
                            type="number"
                            className="reg-inspec-search-bar"
                            placeholder={t('Search by Severity')}
                            value={searchSeverity}
                            onChange={(e) => setSearchSeverity(Number.parseFloat(e.target.value))}
                            min="0"
                            step="0.01"
                            max="1"
                        />
                    </div>
                    <div className="reg-inspec-search-filter-item-2">
                        <label>{t('Accident Date')}</label>
                        <div className="reg-inspec-search-filter-item-2-dates">
                            <label>{t('From')}: </label>
                            <input
                                type="date"
                                className="reg-inspec-search-bar"
                                value={searchCrashStartDate}
                                onChange={(e) => setSearchStartDate(e.target.value)}
                            />
                            <label>{t('To')}: </label>
                            <input
                                type="date"
                                className="reg-inspec-search-bar"
                                value={searchCrashEndDate}
                                onChange={(e) => setSearchEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        className="search-reg-inspec-btn"
                        onClick={fetchData}
                    >
                        {t('Search...')}
                    </button>
                    <button
                        className="reset-reg-inspec-btn"
                        onClick={handleResetFilters}
                    >
                        {t('Reset Filters')}
                    </button>
                </div>
            </div>
            <table className="pol-crash-table">
                <thead>
                    <tr>
                        <th>{t('Car VIN')}</th>
                        <th>{t('Location')}</th>
                        <th>{t('Report Date')}</th>
                        <th>{t('Severity')}</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>
                                <div className="pol-crash-spinner"></div>
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                {error}
                                <button onClick={fetchData} className="pol-crash-retry-btn">{t('Retry')}</button>
                            </td>
                        </tr>
                    ) : carCrashList.length > 0 ? (
                        carCrashList.map((model: CarCrash, index: number) => (
                            <tr key={index}>
                                <td onClick={() => { setShowCarCrashReport(model) }}>{model.carId}</td>
                                <td>{model.location}</td>
                                <td>{model.reportDate}</td>
                                <td>{model.serverity}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>{t('No crash car reports found')}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showCarCrashReport && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setShowCarCrashReport(null); setModalPage(1) }}>&times;</span>
                        <h2>{t('Car Crash Report Details')}</h2>
                        {modalPage === 1 && (
                            <>
                                <div className="pol-crash-form-columns">
                                    <div className="pol-crash-form-column">
                                        <label>Id</label>
                                        <input type="text" name="id" value={showCarCrashReport.id} disabled />
                                    </div>
                                    <div className="pol-crash-form-column">
                                        <label>Description</label>
                                        <input type="text" name="description" value={showCarCrashReport.description} disabled />
                                    </div>
                                    <div className="pol-crash-form-column">
                                        <label>Car VIN id</label>
                                        <input type="text" name="carId" value={showCarCrashReport.carId} disabled />
                                    </div>
                                    <div className="pol-crash-form-column">
                                        <label>Note</label>
                                        <input type="text" name="note" value={showCarCrashReport.note} disabled />
                                    </div>
                                </div>
                                <div className="pol-crash-form-columns">
                                    <div className="pol-crash-form-column">
                                        <label>Odometer</label>
                                        <input type="number" name="odometer" value={showCarCrashReport.odometer} disabled />
                                    </div>
                                    <div className="pol-crash-form-column">
                                        <label>Accident Date</label>
                                        <input type="date" name="accidentDate" value={showCarCrashReport.accidentDate} disabled />
                                    </div>
                                    <div className="pol-crash-form-column">
                                        <label>Report Date</label>
                                        <input type="date" name="reportDate" value={showCarCrashReport.reportDate} disabled />
                                    </div>
                                </div>
                            </>
                        )}
                        {modalPage === 2 && (
                            <>
                                <div className="pol-crash-form-columns">
                                    <div className="pol-crash-form-column">
                                        <label>Location</label>
                                        <input type="text" name="location" value={showCarCrashReport.location} disabled />
                                    </div>
                                    <div className="pol-crash-form-column">
                                        <label>Severity</label>
                                        <input type="number" name="serverity" value={showCarCrashReport.serverity} disabled />
                                    </div>
                                </div>
                                <div className="pol-crash-form-columns">
                                    <div className="pol-crash-form-column">
                                        <label>Damage Location</label>
                                        <div className="pol-crash-car-container">
                                            <img src={car} alt="Car" className="pol-crash-car-image" style={{
                                                borderTop: `5px solid ${isSideColored(CAR_SIDES.Front) ? 'red' : 'black'}`,
                                                borderBottom: `5px solid ${isSideColored(CAR_SIDES.Rear) ? 'red' : 'black'}`,
                                                borderLeft: `5px solid ${isSideColored(CAR_SIDES.Left) ? 'red' : 'black'}`,
                                                borderRight: `5px solid ${isSideColored(CAR_SIDES.Right) ? 'red' : 'black'}`,
                                            }} />
                                        </div>
                                    </div>
                                    <div className="pol-crash-form-column">
                                        <div className="pol-crash-checkboxes">
                                            {Object.entries(CAR_SIDES).map(([key, value]) => (
                                                <label key={key}>
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                    <input
                                                        type="checkbox"
                                                        checked={isSideColored(value)}
                                                        disabled
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        <button onClick={handlePreviousPage} disabled={modalPage === 1} className="pol-crash-model-prev-btn">
                            {t('Previous')}
                        </button>
                        <button onClick={handleNextPage} disabled={modalPage === 2} className="pol-crash-model-next-btn">
                            {t('Next')}
                        </button>
                    </div>
                </div>
            )}
            {paging && paging.TotalPages > 0 &&
                <>
                    <button className="export-reg-inspec-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
                    <a
                        href={`data:text/csv;charset=utf-8,${escape(data)}`}
                        download={`crash-${Date.now()}.csv`}
                        hidden
                        id="excel"
                    />
                    <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
                </>
            }
        </div>
    )
}

export default InsuranceCompanyCrashList;