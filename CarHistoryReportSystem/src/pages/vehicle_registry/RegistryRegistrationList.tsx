import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RegistryRegistrationDetailsForm from '../../components/forms/registry/RegistryRegistrationDetailsForm';
import { AddCarRegistration, DownloadRegistrationExcelFile, EditCarRegistration, GetRegistrationExcel, ListCarRegistration } from '../../services/api/CarRegistration';
import { RootState } from '../../store/State';
import { APIResponse, CarRegistration, CarRegistrationSearchParams, Paging } from '../../utils/Interfaces';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/RegistryCarRegistration.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { Pagination } from '@mui/material';
function RegistryRegistrationList() {
    const { t, i18n } = useTranslation();
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [registrationList, setRegistrationList] = useState<CarRegistration[]>([]);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const [data, setData] = useState("")
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [newRegistration, setNewRegistration] = useState<CarRegistration>({
        ownerName: '',
        carId: '',
        registrationNumber: '',
        expireDate: '',
        licensePlateNumber: '',
        odometer: 0,
        note: '',
        reportDate: ''
    });
    const [openImport, setOpenImport] = useState(false)
    const [editRegistration, setEditRegistration] = useState<CarRegistration | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchCarID, setSearchCarId] = useState('')
    const [searchRegistrationNumber, setSearchRegistrationNumber] = useState('')
    const [searchExpireStartDate, setSearchExpireStartDate] = useState('')
    const [searchExpireEndDate, setSearchExpireEndDate] = useState('')
    const [searchOwnerName, setSearchOwnerName] = useState('')
    const [searchLicensePlateNumber, setSearchLicensePlateNumber] = useState('')
    const [template, setTemplate] = useState('')
    const [templateTrigger, setTemplateTrigger] = useState(0)
    const handleDownloadCsv = () => {
        const element = document.getElementById('excel')
        element?.click()
    }
    const handleDownloadTemplate = async () => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const res = await DownloadRegistrationExcelFile(token, connectAPIError, language)
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
        handleDownloadTemplateClick()
    }, [templateTrigger])

    const handleImportExcel = async () => {

    }
    const validateCarRegistration = (registration: CarRegistration): boolean => {
        if (!isValidVIN(registration.carId)) {
            setAddError("VIN is invalid");
            return false;
        }
        if (!isValidPlateNumber(registration.licensePlateNumber)) {
            setAddError("License Plate Number is invalid");
            return false;
        }
        if (!registration.carId) {
            setAddError("VIN must be filled out");
            return false;
        }
        if (!registration.ownerName) {
            setAddError("Owner Name must be filled out");
            return false;
        }
        if (!registration.odometer) {
            setAddError("Odometer must be chosen");
            return false;
        }
        if (!registration.expireDate) {
            setAddError("Expire Date must be chosen");
            return false;
        }
        if (!registration.reportDate) {
            setAddError("Report Date must be chosen");
            return false;
        }
        if (!registration.registrationNumber) {
            setAddError("Registration Number must be chosen");
            return false;
        }
        if (!registration.licensePlateNumber) {
            setAddError("License Plate Number must be chosen");
            return false;
        }
        return true;
    };
    const handleAddCarRegistration = async () => {
        if (validateCarRegistration(newRegistration)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarRegistration(newRegistration, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                fetchData();
            }
        }
    }

    const handleEditCarRegistration = async () => {
        if (editRegistration && validateCarRegistration(editRegistration)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarRegistration(editRegistration.carId, editRegistration, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditRegistration(null)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editRegistration) {
            setEditRegistration({
                ...editRegistration,
                [e.target.name]: value
            })
        } else {
            setNewRegistration({
                ...newRegistration,
                [e.target.name]: value,
            });
        }
    };
    const handleResetFilters = () => {
        setSearchCarId('')
        setSearchExpireEndDate('')
        setSearchExpireStartDate('')
        setSearchLicensePlateNumber('')
        setSearchOwnerName('')
        setSearchRegistrationNumber('')
        setResetTrigger(prev => prev + 1);
    }
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarRegistrationSearchParams = {
            carId: searchCarID,
            expireDateEnd: searchExpireEndDate,
            expireDateStart: searchExpireStartDate,
            licensePlateNumber: searchLicensePlateNumber,
            ownerName: searchOwnerName,
            registrationNumber: searchRegistrationNumber
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const carRegistrationResponse: APIResponse = await ListCarRegistration(id, token, page, connectAPIError, language, searchParams)
        if (carRegistrationResponse.error) {
            setError(carRegistrationResponse.error)
        } else {
            setRegistrationList(carRegistrationResponse.data)
            setPaging(carRegistrationResponse.pages)
            const responseCsv: APIResponse = await GetRegistrationExcel(id, token, page, connectAPIError, language, searchParams)
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
        <div className="reg-reg-list-page">
            <div className="reg-reg-top-bar">
                <button className="add-reg-reg-btn" onClick={() => setShowModal(true)}>+ {t('Add New Car Registration')}</button>
                <button className="add-reg-reg-btn" onClick={() => { handleDownloadTemplate() }}>&dArr; {t('Excel Template')}</button>
                <a
                    href={`data:text/csv;charset=utf-8,${escape(template)}`}
                    download={`template.csv`}
                    hidden
                    id="template"
                />
                <button className="add-reg-reg-btn" onClick={() => { }}>+ {t('Import From Excel')}</button>
            </div>
            <div className="reg-inspec-top-bar">
                <div className="reg-inspec-search-filter-container">
                    <div className="reg-inspec-search-filter-item">
                        <label>{t('Car ID')}</label>
                        <input
                            type="text"
                            className="reg-inspec-search-bar"
                            placeholder={t('Search by Car ID')}
                            value={searchCarID}
                            onChange={(e) => setSearchCarId(e.target.value)}
                        />
                    </div>
                    <div className="reg-inspec-search-filter-item">
                        <label>{t('Owner Name')}</label>
                        <input
                            type="text"
                            className="reg-inspec-search-bar"
                            placeholder={t('Search by Owner Name')}
                            value={searchOwnerName}
                            onChange={(e) => setSearchOwnerName(e.target.value)}
                        />
                    </div>
                    <div className="reg-inspec-search-filter-item">
                        <label>{t('Registration Number')}</label>
                        <input
                            type="text"
                            className="reg-inspec-search-bar"
                            placeholder={t('Search by Registration Number')}
                            value={searchRegistrationNumber}
                            onChange={(e) => setSearchRegistrationNumber(e.target.value)}
                        />
                    </div>
                    <div className="reg-inspec-search-filter-item">
                        <label>{t('License Plate Number')}</label>
                        <input
                            type="text"
                            className="reg-inspec-search-bar"
                            placeholder={t('Search by License Plate Number')}
                            value={searchLicensePlateNumber}
                            onChange={(e) => setSearchLicensePlateNumber(e.target.value)}
                        />
                    </div>
                    <div className="reg-inspec-search-filter-item-2">
                        <label>{t('Expire Date')}</label>
                        <div className="reg-inspec-search-filter-item-2-dates">
                            <label>{t('From')}: </label>
                            <input
                                type="date"
                                className="reg-inspec-search-bar"
                                value={searchExpireStartDate}
                                onChange={(e) => setSearchExpireStartDate(e.target.value)}
                            />
                            <label>{t('To')}: </label>
                            <input
                                type="date"
                                className="reg-inspec-search-bar"
                                value={searchExpireEndDate}
                                onChange={(e) => setSearchExpireEndDate(e.target.value)}
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
            <table className="reg-reg-table">
                <thead>
                    <tr>
                        <th>{t('Car VIN')}</th>
                        <th>{t('Registration Number')}</th>
                        <th>{t('License Plate Number')}</th>
                        <th>{t('Expire Date')}</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>
                                <div className="reg-reg-spinner"></div>
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>
                                {error}
                                <button onClick={fetchData} className="reg-reg-retry-btn">{t('Retry')}</button>
                            </td>
                        </tr>
                    ) : registrationList.length > 0 ? (
                        registrationList.map((model: CarRegistration, index: number) => (
                            <tr key={index}>
                                <td onClick={() => { setEditRegistration(model) }}>{model.carId} &#x270E;</td>
                                <td>{model.registrationNumber}</td>
                                <td>{model.licensePlateNumber}</td>
                                <td>{model.expireDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>{t('No car registrations found')}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showModal && (
                <div className="reg-reg-modal">
                    <div className="reg-reg-modal-content">
                        <span className="reg-reg-close-btn" onClick={() => { setShowModal(false) }}>&times;</span>
                        <h2>{t('Add Car Registration')}</h2>
                        <RegistryRegistrationDetailsForm
                            action="Add"
                            model={newRegistration}
                            handleInputChange={handleInputChange}
                        />
                        <button onClick={handleAddCarRegistration} disabled={adding} className="reg-reg-model-add-btn">
                            {adding ? (<div className="reg-reg-model-inline-spinner"></div>) : t('Finish')}
                        </button>
                        {addError && (
                            <p className="reg-reg-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
            {editRegistration && (
                <div className="reg-reg-modal">
                    <div className="reg-reg-modal-content">
                        <span className="reg-reg-close-btn" onClick={() => { setShowModal(false); setEditRegistration(null) }}>&times;</span>
                        <h2>{t('Edit Car Registration')}</h2>
                        <RegistryRegistrationDetailsForm
                            action="Edit"
                            model={editRegistration}
                            handleInputChange={handleInputChange}
                        />
                        <button onClick={handleEditCarRegistration} disabled={adding} className="reg-reg-model-add-btn">
                            {adding ? (<div className="reg-reg-model-inline-spinner"></div>) : t('Finish')}
                        </button>
                        {addError && (
                            <p className="reg-reg-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
            {openImport && (
                <div className="reg-reg-modal">
                    <div className="reg-reg-modal-content">
                        <span className="reg-reg-close-btn" onClick={() => { setOpenImport(false) }}>&times;</span>
                        <h2>{t('Edit Car Registration')}</h2>
                        <button onClick={handleEditCarRegistration} disabled={adding} className="reg-reg-model-add-btn">
                            {adding ? (<div className="reg-reg-model-inline-spinner"></div>) : t('Finish')}
                        </button>
                        {addError && (
                            <p className="reg-reg-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
            {paging && paging.TotalPages > 0 &&
                <>
                    <button className="export-reg-inspec-btn" onClick={handleDownloadCsv}>{t('Export to excel')}</button>
                    <a
                        href={`data:text/csv;charset=utf-8,${escape(data)}`}
                        download={`registration-${Date.now()}.csv`}
                        hidden
                        id="excel"
                    />
                    <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
                </>
            }
        </div>
    );
}

export default RegistryRegistrationList;