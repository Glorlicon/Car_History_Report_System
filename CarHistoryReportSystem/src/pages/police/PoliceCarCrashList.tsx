import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PoliceCarCrashDetailsForm from '../../components/forms/police/PoliceCarCrashDetailsForm';
import PoliceCarCrashIdentificationForm from '../../components/forms/police/PoliceCarCrashIdentificationForm';
import { AddCarCrash, DownloadCrashExcelFile, EditCarCrash, GetCrashExcel, ImportCrashFromExcel, ListCarCrash } from '../../services/api/CarCrash';
import { RootState } from '../../store/State';
import { APIResponse, CarCrash, CarCrashSearchParams, Paging } from '../../utils/Interfaces';
import { isValidVIN } from '../../utils/Validators';
import '../../styles/PoliceCrashCar.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { Pagination } from '@mui/material';

function PoliceCarCrashList() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [carCrashList, setCarCrashList] = useState<CarCrash[]>([]);
    const [modalPage, setModalPage] = useState(1);
    const [newCarCrashReport, setNewCarCrashReport] = useState<CarCrash>({
        description: '',
        carId: '',
        odometer: 0,
        serverity: 0,
        note: '',
        reportDate: '',
        damageLocation: 0,
        accidentDate: '',
        location: ''
    });
    const [searchVinId, setSearchVinId] = useState('')
    const [searchMinSeverity, setSearchMinSeverity] = useState('')
    const [searchMaxSeverity, setSearchMaxSeverity] = useState('')
    const [searchCrashStartDate, setSearchStartDate] = useState('')
    const [searchCrashEndDate, setSearchEndDate] = useState('')
    const [editCarCrashReport, setEditCarCrashReport] = useState<CarCrash | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")
    const [openImport, setOpenImport] = useState(false)
    const [template, setTemplate] = useState('')
    const [templateTrigger, setTemplateTrigger] = useState(0)
    const [importData, setImportData] = useState<FormData | null>(null)
    const isFirstRender = useRef(true);
    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }
    const handleDownloadTemplate = async () => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const res = await DownloadCrashExcelFile(token, connectAPIError, language)
        if (res.data) {
            setTemplate(res.data)
            setTemplateTrigger(prev => prev + 1)
        }
    }
    const handleDownloadTemplateClick = () => {
        const element = document.getElementById('template')
        element?.click()
    }
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            handleDownloadTemplateClick();
        }
    }, [templateTrigger])

    const handleImportExcel = async () => {
        if (importData) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await ImportCrashFromExcel(token, importData, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setOpenImport(false)
                setImportData(null)
                fetchData();
            }
        }
    }

    const handleImportClick = () => {
        document.getElementById('excel-file')?.click()
    }

    const handleAddDataFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files[0]) {
            const file = files[0]
            const reader = new FileReader()
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                    const fileContent = e.target.result
                    const formData = new FormData()
                    formData.append('file', file)
                    setImportData(formData)
                }
            }
            reader.readAsText(file);
        }
    }
    const validateCarCrashReport = (crashReport: CarCrash): boolean => {
        if (!isValidVIN(crashReport.carId)) {
            setAddError(t('VIN is invalid'));
            return false;
        }
        if (!crashReport.carId) {
            setAddError(t('VIN must be filled out'));
            return false;
        }
        if (!crashReport.description) {
            setAddError(t('Description must be filled out'));
            return false;
        }
        if (!crashReport.location) {
            setAddError(t('Location must be filled out'));
            return false;
        }
        if (!crashReport.odometer) {
            setAddError(t('Odometer must be chosen'));
            return false;
        }
        if (!crashReport.accidentDate) {
            setAddError(t('Accident Date must be chosen'));
            return false;
        }
        if (!crashReport.reportDate) {
            setAddError(t('Report Date must be chosen'));
            return false;
        }
        if (!crashReport.note) {
            setAddError(t('Note must be filled out'));
            return false;
        }
        if (crashReport.serverity <= 0) {
            setAddError(t('Severity must be higher than 0'));
            return false;
        }
        return true;
    };
    const handleDamageLocationChange = (sideValue: number) => {
        if (editCarCrashReport) {
            setEditCarCrashReport({
                ...editCarCrashReport,
                damageLocation: editCarCrashReport.damageLocation ^ sideValue
            })
        } else {
            setNewCarCrashReport({
                ...newCarCrashReport,
                damageLocation: newCarCrashReport.damageLocation ^ sideValue
            })
        }
    };


    const handleNextPage = () => {
        if (modalPage < 2) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editCarCrashReport) handleEditCarCrashReport();
            else handleAddCarCrashReport();
        }
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };
    const handleAddCarCrashReport = async () => {
        if (validateCarCrashReport(newCarCrashReport)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarCrash(newCarCrashReport, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                fetchData();
            }
        }
    }

    const handleEditCarCrashReport = async () => {
        if (editCarCrashReport && editCarCrashReport.id && validateCarCrashReport(editCarCrashReport)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarCrash(editCarCrashReport.id, editCarCrashReport, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditCarCrashReport(null)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCarCrashReport) {
            setEditCarCrashReport({
                ...editCarCrashReport,
                [e.target.name]: value
            })
        } else {
            setNewCarCrashReport({
                ...newCarCrashReport,
                [e.target.name]: value,
            });
        }
    };

    const handleResetFilters = () => {
        setSearchEndDate('')
        setSearchMaxSeverity('')
        setSearchMinSeverity('')
        setSearchStartDate('')
        setSearchVinId('')
        setResetTrigger(prev => prev + 1);
    }
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarCrashSearchParams = {
            vinId: searchVinId,
            accidentEndDate: searchCrashEndDate,
            accidentStartDate: searchCrashStartDate,
            minServerity: searchMinSeverity,
            maxServerity: searchMaxSeverity
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carCrashReportResponse: APIResponse = await ListCarCrash(id, token, page, connectAPIError, language, searchParams)
        if (carCrashReportResponse.error) {
            setError(carCrashReportResponse.error)
        } else {
            setCarCrashList(carCrashReportResponse.data)
            setPaging(carCrashReportResponse.pages)
            const responseCsv: APIResponse = await GetCrashExcel(id, token, page, connectAPIError, language, searchParams)
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
                <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>+ {t('Add New Crash Car Report')}</button>
                <button className="add-pol-crash-btn" onClick={() => { handleDownloadTemplate() }}>&dArr; {t('Excel Template')}</button>
                <a
                    href={`data:text/csv;charset=utf-8,${escape(template)}`}
                    download={`template.csv`}
                    hidden
                    id="template"
                />
                <button className="add-pol-crash-btn" onClick={() => { setOpenImport(true) }}>+ {t('Import From Excel')}</button>
            </div>
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
                    <div className="reg-inspec-search-filter-item-2">
                        <label>{t('Severity')}</label>
                        <div className="reg-inspec-search-filter-item-2-dates">
                            <label>{t('From')}: </label>
                            <input
                                type="number"
                                className="reg-inspec-search-bar"
                                value={searchMinSeverity}
                                onChange={(e) => setSearchMinSeverity(e.target.value)}
                                min="0"
                                step="0.01"
                                max="1"
                            />
                            <label>{t('To')}: </label>
                            <input
                                type="number"
                                className="reg-inspec-search-bar"
                                value={searchMaxSeverity}
                                onChange={(e) => setSearchMaxSeverity(e.target.value)}
                                min="0"
                                step="0.01"
                                max="1"
                            />
                        </div>
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
                                <td onClick={() => { setEditCarCrashReport(model) }}>{model.carId}</td>
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
            {showModal && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setShowModal(false); setModalPage(1) }}>&times;</span>
                        <h2>{t('Add Car Crash Report')}</h2>
                        {modalPage === 1 && (
                            <PoliceCarCrashIdentificationForm
                                action="Add"
                                model={newCarCrashReport}
                                handleInputChange={handleInputChange}
                            />
                        )}
                        {modalPage === 2 && (
                            <PoliceCarCrashDetailsForm
                                action="Add"
                                model={newCarCrashReport}
                                handleInputChange={handleInputChange}
                                handleDamageLocationChange={handleDamageLocationChange}
                            />
                        )}
                        {adding ? (<div className="pol-crash-model-inline-spinner"></div>) : (
                            <>
                                <button onClick={handlePreviousPage} disabled={modalPage === 1} className="pol-crash-model-prev-btn">
                                    {t('Previous')}
                                </button>
                                <button onClick={handleNextPage} disabled={adding} className="pol-crash-model-next-btn">
                                    {modalPage < 2 ? t('Next') : t('Finish')}
                                </button>
                            </>
                        )}
                        {addError && (
                            <p className="pol-crash-model-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
            {editCarCrashReport && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setShowModal(false); setEditCarCrashReport(null); setModalPage(1) }}>&times;</span>
                        <h2>{t('Edit Car Crash Report')}</h2>
                        {modalPage === 1 && (
                            <PoliceCarCrashIdentificationForm
                                action="Edit"
                                model={editCarCrashReport}
                                handleInputChange={handleInputChange}
                            />
                        )}
                        {modalPage === 2 && (
                            <PoliceCarCrashDetailsForm
                                action="Edit"
                                model={editCarCrashReport}
                                handleInputChange={handleInputChange}
                                handleDamageLocationChange={handleDamageLocationChange}
                            />
                        )}
                        {adding ? (<div className="pol-crash-model-inline-spinner"></div>) : (
                            <>
                                <button onClick={handlePreviousPage} disabled={modalPage === 1} className="pol-crash-model-prev-btn">
                                    {t('Previous')}
                                </button>
                                <button onClick={handleNextPage} disabled={adding} className="pol-crash-model-next-btn">
                                    {modalPage < 2 ? t('Next') : t('Finish')}
                                </button>
                            </>
                        )}
                        {addError && (
                            <p className="pol-crash-model-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
            {openImport && (
                <div className="reg-reg-modal">
                    <div className="reg-reg-modal-content">
                        <span className="reg-reg-close-btn" onClick={() => { setOpenImport(false); setImportData(null) }}>&times;</span>
                        <h2>{t('Import from csv')}</h2>
                        <div className="reg-reg-form-columns">
                            <div className="reg-reg-form-column-2">
                                <input type="file" id="excel-file" accept=".csv" className="csv-input" onChange={handleAddDataFromFile} />
                                <button onClick={handleImportClick} className="dealer-car-sales-form-image-add-button"> {t('Choose file')}</button>
                            </div>
                            {importData && (
                                <>
                                    <label>{t('Non-empty file is selected')}</label>
                                    <label className="reg-reg-error"> ! {t('Import file must have all data correct to be able to import')} !</label>
                                </>
                            )}
                            <button onClick={handleImportExcel} disabled={adding} className="reg-reg-model-add-btn">
                                {adding ? (<div className="reg-reg-inline-spinner"></div>) : t('Finish')}
                            </button>
                            {addError && (
                                <p className="reg-reg-error">{addError}</p>
                            )}
                        </div>
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

export default PoliceCarCrashList;