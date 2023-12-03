import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import RegistryRegistrationDetailsForm from '../../../components/forms/registry/RegistryRegistrationDetailsForm';
import { AddCarRegistration, DownloadRegistrationExcelFile, EditCarRegistration, GetRegistrationExcel, ImportRegistrationFromExcel, ListCarRegistration } from '../../../services/api/CarRegistration';
import { RootState } from '../../../store/State';
import { APIResponse, CarModel, CarRecalls, CarRecallSearchParams, CarRegistration, CarRegistrationSearchParams, Paging } from '../../../utils/Interfaces';
import { isValidPlateNumber, isValidVIN } from '../../../utils/Validators';
import '../../../styles/ManufacturerCarRecall.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../../utils/JWTDecoder';
import { Pagination } from '@mui/material';
import { AddCarRecalls, EditCarRecall, ListManufacturerRecallss, ListManufaturerCarModels } from '../../../services/api/Recall';
import CarRecallAddModal from '../../../components/forms/manufacturer/Recall/CarRecallAddModal';
import CarRecallEditModal from '../../../components/forms/manufacturer/Recall/CarRecallEditModal';
function ManufacturerCarRecallList() {
    const { t, i18n } = useTranslation();
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [recallList, setRecallList] = useState<CarRecalls[]>([]);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [editRecalModel, setEditRecallModel] = useState<CarRecalls | null>(null)
    const [newRecall, setNewRecall] = useState<CarRecalls>({
        modelId: "",
        description: "",
        recallDate: new Date()
    })
    const [modelList, setModelList] = useState<CarModel[]>([]);
    const [editRecall, setEditRecall] = useState<CarRecalls | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchModelId, setSearchModelId] = useState('')
    const [searchRecallStartDate, setSearchRecallStartDate] = useState('')
    const [searchRecallEndDate, setSearchRecallEndDate] = useState('')



    const validateCarRegistration = (recall: CarRecalls): boolean => {
        if (!recall.modelId) {
            setAddError("VIN must be filled out");
            return false;
        }
        if (!recall.description) {
            setAddError("Description must be filled out");
            return false;
        }
        if (!recall.recallDate) {
            setAddError("Date must be filled out");
            return false;
        }
        return true;
    };
    const handleAddCarRegistration = async () => {
        if (validateCarRegistration(newRecall)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarRecalls(newRecall, token, connectAPIError, language);
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
        if (editRecall && editRecall.id && validateCarRegistration(editRecall)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarRecall(editRecall.id, editRecall, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditRecall(null)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editRecall) {
            setEditRecall({
                ...editRecall,
                [e.target.name]: value
            })
        } else {
            setNewRecall({
                ...newRecall,
                [e.target.name]: value,
            });
        }
    };
    const handleResetFilters = () => {
        setSearchModelId('')
        setSearchRecallEndDate('')
        setSearchRecallStartDate('')
        setResetTrigger(prev => prev + 1);
    }
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: CarRecallSearchParams = {
            modelId: searchModelId,
            recallDateEnd: searchRecallEndDate,
            recallDateStart: searchRecallStartDate
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const CarRecallReponse: APIResponse = await ListManufacturerRecallss(id, token, page, connectAPIError, language, searchParams)
        const carModelResponse: APIResponse = await ListManufaturerCarModels(id, token)
        if (CarRecallReponse.error) {
            setError(CarRecallReponse.error)
        } else if (carModelResponse.error) {
            setError(carModelResponse.error)
        } else {
            console.log("Model", carModelResponse.data)
            setRecallList(CarRecallReponse.data)
            setModelList(carModelResponse.data)
            setPaging(CarRecallReponse.pages)
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
                <button className="add-reg-reg-btn" onClick={() => setShowModal(true)}>+ {t('Add New Car Recall')}</button>
            </div>
            <div className="reg-inspec-top-bar">
                <div className="reg-inspec-search-filter-container">
                    <div className="reg-inspec-search-filter-item">
                        <label>{t('ModelID')}</label>
                        <input
                            type="text"
                            className="reg-inspec-search-bar"
                            placeholder={t('Search Recall By ModelID')}
                            value={searchModelId}
                            onChange={(e) => setSearchModelId(e.target.value)}
                        />
                    </div>
                    <div className="reg-inspec-search-filter-item-2">
                        <label>{t('RecallDate')}</label>
                        <div className="reg-inspec-search-filter-item-2-dates">
                            <label>{t('From')}: </label>
                            <input
                                type="date"
                                className="reg-inspec-search-bar"
                                value={searchRecallStartDate}
                                onChange={(e) => setSearchRecallStartDate(e.target.value)}
                            />
                            <label>{t('To')}: </label>
                            <input
                                type="date"
                                className="reg-inspec-search-bar"
                                value={searchRecallEndDate}
                                onChange={(e) => setSearchRecallEndDate(e.target.value)}
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
                        <th>{t('ModelID')}</th>
                        <th>{t('Description')}</th>
                        <th>{t('RecallDate')}</th>
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
                    ) : recallList.length > 0 ? (
                        recallList.map((model: CarRecalls, index: number) => (
                            <tr key={index}>
                                <td onClick={() => { setEditRecallModel(model) }}>{model.modelId} &#x270E;</td>
                                <td>{model.description}</td>
                                <td>{model.recallDate ? new Date(model.recallDate).toLocaleDateString() : 'Date not available'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>{t('No car recall found')}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showModal && (
                <div className="reg-reg-modal">
                    <div className="reg-reg-modal-content">
                        <span className="reg-reg-close-btn" onClick={() => { setShowModal(false) }}>&times;</span>
                        <h2>{t('Add Car Registration')}</h2>
                        <CarRecallAddModal
                            recall={newRecall}
                            models={modelList}
                            handleInputChange={handleInputChange}
                        />
                        <button onClick={handleAddCarRegistration} disabled={adding} className="reg-reg-model-add-btn">
                            {adding ? (<div className="reg-reg-inline-spinner"></div>) : t('Finish')}
                        </button>
                        {addError && (
                            <p className="reg-reg-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
            {editRecalModel && (
                <div className="reg-reg-modal">
                    <div className="reg-reg-modal-content">
                        <span className="reg-reg-close-btn" onClick={() => { setShowModal(false); setEditRecallModel(null) }}>&times;</span>
                        <h2>{t('Edit Car Registration')}</h2>
                        <CarRecallEditModal
                            action="Edit"
                            model={editRecalModel}
                            handleInputChange={handleInputChange}
                        />
                        <button onClick={handleEditCarRegistration} disabled={adding} className="reg-reg-model-add-btn">
                            {adding ? (<div className="reg-reg-inline-spinner"></div>) : t('Finish')}
                        </button>
                        {addError && (
                            <p className="reg-reg-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
            
            {paging && paging.TotalPages > 0 &&
                <>
                    <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
                </>
            }
        </div>
    );
}

export default ManufacturerCarRecallList;