import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import RegistryRegistrationDetailsForm from '../../components/forms/registry/RegistryRegistrationDetailsForm';
import { AddCarRegistration, DownloadRegistrationExcelFile, EditCarRegistration, GetRegistrationExcel, ImportRegistrationFromExcel, ListCarRegistration } from '../../services/api/CarRegistration';
import { RootState } from '../../store/State';
import { APIResponse, CarRecalls, CarRecallSearchParams, CarRegistration, CarRegistrationSearchParams, Paging } from '../../utils/Interfaces';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/RegistryCarRegistration.css'
import { useTranslation } from 'react-i18next';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { Pagination } from '@mui/material';
import { ListServiceShopCarRecall } from '../../services/api/Recall';
function ServiceShopCarRecall() {
    const { t, i18n } = useTranslation();
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState<boolean>(false);
    const [recallList, setRecallList] = useState<CarRecalls[]>([]);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [searchModelId, setSearchModelId] = useState('')
    const [searchRecallStartDate, setSearchRecallStartDate] = useState('')
    const [searchRecallEndDate, setSearchRecallEndDate] = useState('')

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
        const CarRecallReponse: APIResponse = await ListServiceShopCarRecall(token, page, connectAPIError, language, searchParams)
        if (CarRecallReponse.error) {
            setError(CarRecallReponse.error)
        } else {
            setRecallList(CarRecallReponse.data)
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
                                    {/*<td onClick={() => { setEditRecallModel(model) }}>{model.modelId}</td>*/}
                                    <td>{model.modelId}</td>
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
            {paging && paging.TotalPages > 0 &&
                <>
                    <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
                </>
            }
        </div>
    );
}

export default ServiceShopCarRecall;