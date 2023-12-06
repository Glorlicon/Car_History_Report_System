import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AddRequest, GetUserRequest, GetUserRequests, ResponseRequest } from '../../services/api/Request';
import { RootState } from '../../store/State';
import { AdminRequest, APIResponse, Car, CarModel, Paging, RequestSearchParams, User, UserNotification, UserNotificationRead, UsersRequest } from '../../utils/Interfaces';
import '../../styles/Reqeuest.css'
import { JWTDecoder } from '../../utils/JWTDecoder';
import RequestCharacteristicPage from '../../components/forms/admin/User/RequestCharacteristicPage';
import { t } from 'i18next';
import { EditUserNotificationStatus, GetUserNotification } from '../../services/api/Notification';
import { Pagination } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import NotificationDetailPage from '../../components/forms/user/NotificationDetailPage';

function UserNotificationPage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [notificationList, setNotificationList] = useState<UserNotification[]>([]);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const filterNotification = notificationList.filter((request: any) => {
        const matchingQuery = notificationList
        return matchingQuery
    })
    const [page, setPage] = useState(1)
    const [paging, setPaging] = useState<Paging>()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const id = JWTDecoder(token).nameidentifier
    const [notificationDetail, setNotificationDetail] = useState<UserNotification | null>(null)
    const userNotificationRead = {
        notificationId: '',
        userId: id
    }
    const [readNotification, setReadNotification] = useState<UserNotification | null>(null)

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        //let searchParams: RequestSearchParams = {
        //    requestStatus: requestStatus,
        //    requestType: requestType,
        //    sortByDate: sortByDate
        //}
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const NotificationListResponse: APIResponse = await GetUserNotification(id, page, connectAPIError, language)
        if (NotificationListResponse.error) {
            setError(NotificationListResponse.error)
        } else {
            setNotificationList(NotificationListResponse.data)
        }
        console.log(NotificationListResponse)
        setLoading(false)
    }

    const handleNotificationClick = async (notification: UserNotification) => {
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await EditUserNotificationStatus({
            ...userNotificationRead,
            notificationId: notification.notificationId
        }, token, connectAPIError, language);
        if (response.error) {
            setAddError(response.error);
        } else {
            fetchData();
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="ad-car-list-page">
            {/*<div className="ad-car-top-bar">*/}
            {/*    <div className="reg-inspec-top-bar">*/}
            {/*        <div className="reg-inspec-search-filter-container">*/}
            {/*            <div className="reg-inspec-search-filter-item">*/}
            {/*                <label>{t('Type')}</label>*/}
            {/*                <select className="reg-inspec-search-bar"*/}
            {/*                    onChange={(e) => setRequestType(Number(e.target.value))}*/}
            {/*                    value={requestType}*/}
            {/*                >*/}
            {/*                    <option value="-1">{t('Any Type')}</option>*/}
            {/*                    <option value="0">{t('Data Correction')}</option>*/}
            {/*                    <option value="1">{t('Technical Support')}</option>*/}
            {/*                    <option value="2">{t('Report Inaccuracy')}</option>*/}
            {/*                    <option value="3">{t('Feedback')}</option>*/}
            {/*                    <option value="4">{t('General')}</option>*/}
            {/*                </select>*/}
            {/*            </div>*/}
            {/*            <div className="reg-inspec-search-filter-item">*/}
            {/*                <label>{t('Status')}</label>*/}
            {/*                <select className="reg-inspec-search-bar"*/}
            {/*                    onChange={(e) => setRequestStatus(Number(e.target.value))}*/}
            {/*                    value={requestStatus}*/}
            {/*                >*/}
            {/*                    <option value="-1">{t('Any Status')}</option>*/}
            {/*                    <option value="0">{t('Pending')}</option>*/}
            {/*                    <option value="1">{t('Approved')}</option>*/}
            {/*                    <option value="2">{t('Rejected')}</option>*/}
            {/*                </select>*/}
            {/*            </div>*/}
            {/*            <div className="reg-inspec-search-filter-item">*/}
            {/*                <label>{t('Sort By Date')}</label>*/}
            {/*                <select className="reg-inspec-search-bar"*/}
            {/*                    onChange={(e) => setSortByDate(Number(e.target.value))}*/}
            {/*                    value={sortByDate}*/}
            {/*                >*/}
            {/*                    <option value="0">{t('Descending')}</option>*/}
            {/*                    <option value="1">{t('Ascending')}</option>*/}
            {/*                </select>*/}
            {/*            </div>*/}
            {/*            <button className="add-ad-car-btn" onClick={() => setShowModal(true)}>{t('+ Add Request')}</button>*/}
            {/*            <button*/}
            {/*                className="search-reg-inspec-btn"*/}
            {/*                onClick={fetchData}*/}
            {/*            >*/}
            {/*                {t('Search...')}*/}
            {/*            </button>*/}
            {/*            <button*/}
            {/*                className="reset-reg-inspec-btn"*/}
            {/*                onClick={handleResetFilters}*/}
            {/*            >*/}
            {/*                {t('Reset Filters')}*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <table className="ad-car-table">
                <thead>
                    <tr>
                        <th>{t('Notification ID')}</th>
                        <th>{t('Title')}</th>
                        <th>{t('Description')}</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                <div className="ad-car-spinner"></div>
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                {error}
                                <button onClick={fetchData} className="ad-car-retry-btn">Retry</button>
                            </td>
                        </tr>
                        ) : filterNotification.length > 0 ? (
                                filterNotification.map((model: any, index: number) => (
                                    <tr key={index} className={model.isRead ? 'greyed-out-row' : ''}>
                                        <td
                                            onClick={() => {
                                                setNotificationDetail(model);
                                                handleNotificationClick(model);
                                            }}
                                        >
                                            {t(model.notificationId)} &#x1F6C8;
                                        </td>
                                        <td>{model.notification.title}</td>
                                        <td>{model.notification.description}</td>
                                    </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>{t('No Notification Found')}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div id="pagination">
                {paging && paging.TotalPages > 0 &&
                    <>
                        <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
                    </>
                }
            </div>
            {notificationDetail && (
                <div className="ad-car-modal" >
                    <div className="ad-car-modal-content" style={{ width: '700px' }}>
                        <span className="ad-car-close-btn" onClick={() => { setNotificationDetail(null) }}>&times;</span>
                        <h2>{t('Notification Detail')}</h2>
                        {(
                            <NotificationDetailPage
                                model={notificationDetail}
                            />
                        )}
                        {addError && (
                            <p className="ad-car-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserNotificationPage;