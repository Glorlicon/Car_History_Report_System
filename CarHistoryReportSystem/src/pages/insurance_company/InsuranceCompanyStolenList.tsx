import { Pagination } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GetStolenInsuranceExcel, ListCarStolenInsurance } from '../../services/api/CarStolen';
import { RootState } from '../../store/State';
import { CAR_STOLEN_STATUS } from '../../utils/const/CarStolenStatus';
import { APIResponse, CarStolen, CarStolenSearchParams, Paging } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';

function InsuranceCompanyStolenList() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [searchVinId, setSearchVinId] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [carStolenList, setcarStolenList] = useState<CarStolen[]>([]);
    const [showCarStolenReport, setShowCarStolenReport] = useState<CarStolen | null>(null)
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")

    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }

    
    const handleResetFilters = () => {
        setSearchStatus('')
        setSearchVinId('')
        setResetTrigger(prev => prev + 1);
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarStolenSearchParams = {
            vinID: searchVinId,
            status: searchStatus
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carStolenReportResponse: APIResponse = await ListCarStolenInsurance(token, page, connectAPIError, language, searchParams)
        if (carStolenReportResponse.error) {
            setError(carStolenReportResponse.error)
        } else {
            setcarStolenList(carStolenReportResponse.data)
            setPaging(carStolenReportResponse.pages)
            const responseCsv: APIResponse = await GetStolenInsuranceExcel(token, page, connectAPIError, language, searchParams)
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
        <div className="pol-stolen-list-page">
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
                        <label>{t('Status')}</label>
                        <select className="reg-inspec-search-bar" value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                            <option value=''>{t('All')}</option>
                            <option value={CAR_STOLEN_STATUS.Stolen}>{t('Stolen')}</option>
                            <option value={CAR_STOLEN_STATUS.Found}>{t('Found')}</option>
                        </select>
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
            <table className="pol-stolen-table">
                <thead>
                    <tr>
                        <th>{t('Car VIN')}</th>
                        <th>{t('Odometer')}</th>
                        <th>{t('Report Date')}</th>
                        <th>{t('Status')}</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>
                                <div className="pol-stolen-spinner"></div>
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                {error}
                                <button onClick={fetchData} className="pol-stolen-retry-btn">{t('Retry')}</button>
                            </td>
                        </tr>
                    ) : carStolenList.length > 0 ? (
                        carStolenList.map((model: CarStolen, index: number) => (
                            <tr key={index}>
                                <td onClick={() => { setShowCarStolenReport(model) }}>{model.carId}</td>
                                <td>{model.odometer}</td>
                                <td>{model.reportDate}</td>
                                <td>{model.status === 1 ? t('Found') : t('Stolen')}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>{t('No stolen car reports found')}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showCarStolenReport && (
                <div className="pol-stolen-modal">
                    <div className="pol-stolen-modal-content">
                        <span className="pol-stolen-close-btn" onClick={() => { setShowCarStolenReport(null) }}>&times;</span>
                        <h2>{t('Car Stolen Report Details')}</h2>
                        <>
                            <div className="pol-stolen-form-columns">
                                <div className="pol-stolen-form-column">
                                    <label>Id</label>
                                    <input type="text" name="id" value={showCarStolenReport.id} disabled />
                                </div>
                                <div className="pol-stolen-form-column">
                                    <label>{t('Description')}</label>
                                    <input type="text" name="description" value={showCarStolenReport.description} disabled/>
                                </div>
                                <div className="pol-stolen-form-column">
                                    <label>{t('Car VIN')}</label>
                                    <input type="text" name="carId" value={showCarStolenReport.carId}  disabled />
                                </div>
                                <div className="pol-stolen-form-column">
                                    <label>{t('Note')}</label>
                                    <input type="text" name="note" value={showCarStolenReport.note} disabled />
                                </div>
                            </div>
                            <div className="pol-stolen-form-columns">
                                <div className="pol-stolen-form-column">
                                    <label>{t('Odometer')}</label>
                                    <input type="number" name="odometer" value={showCarStolenReport.odometer} disabled />
                                </div>
                                <div className="pol-stolen-form-column">
                                    <label>{t('Report Date')}</label>
                                    <input type="date" name="reportDate" value={showCarStolenReport.reportDate} disabled />
                                </div>
                                <div className="pol-stolen-form-column">
                                    <label>{t('Status')}</label>
                                    <select name="status" value={showCarStolenReport.status ? showCarStolenReport.status : CAR_STOLEN_STATUS.Stolen} disabled>
                                        <option value={CAR_STOLEN_STATUS.Stolen}>{t('Stolen')}</option>
                                        <option value={CAR_STOLEN_STATUS.Found}>{t('Found')}</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            )}
            {paging && paging.TotalPages > 0 &&
                <>
                    <button className="export-reg-inspec-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
                    <a
                        href={`data:text/csv;charset=utf-8,${escape(data)}`}
                        download={`stolen-${Date.now()}.csv`}
                        hidden
                        id="excel"
                    />
                    <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
                </>
            }
        </div>
    );
}

export default InsuranceCompanyStolenList;