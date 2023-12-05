import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { AdminRequest, APIResponse, Car, CarModel, Paging, RequestSearchParams, UsersRequest } from '../../../utils/Interfaces';
import '../../../styles/AdminCars.css'
import { ResponseRequest, GetAllUserRequest } from '../../../services/api/Request';
import RequestAnsweringPage from '../../../components/forms/admin/Request/RequestAnsweringPage';
import { t } from 'i18next';

function AdminRequestList() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalPage, setModalPage] = useState(1);
    const [adding, setAdding] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [RequestList, setRequestList] = useState<AdminRequest[]>([]);
    const [editRequest, setEditRequest] = useState<AdminRequest | null>();
    const [adminRequestValue, setAdminRequestValue] = useState<AdminRequest | null>({
        status: "1",
        response: "",
    });
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const filteredRequest = RequestList.filter((request: any) => {
        const matchingQuery = RequestList
        return matchingQuery
    })
    const [page, setPage] = useState(1)
    const [paging, setPaging] = useState<Paging>()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [requestType, setRequestType] = useState(-1)
    const [requestStatus, setRequestStatus] = useState(-1)
    const [sortByDate, setSortByDate] = useState(0)

    const handleResponseRequest = async () => {
        if (editRequest != null) {

            setAdding(true);
            setAddError(null);
            console.log(editRequest);
            const response: APIResponse = await ResponseRequest(editRequest, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditRequest(null);
                fetchData();
            }

        }
    }

    const handleResetFilters = () => {
        setRequestType(-1)
        setRequestStatus(-1)
        setSortByDate(0)
        setResetTrigger(prev => prev + 1);
    }

    const handleRequestAnswer = (model: AdminRequest) => {
        const newEditRequest = {
            ...model,
            status: "1"
        };

        setEditRequest(newEditRequest);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editRequest) {
            setEditRequest({
                ...editRequest,
                [e.target.name]: value
            })
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let searchParams: RequestSearchParams = {
            requestStatus: requestStatus,
            requestType: requestType,
            sortByDate: sortByDate
        }
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const RequestListResponse: APIResponse = await GetAllUserRequest(token, page, connectAPIError, language, searchParams)
        if (RequestListResponse.error) {
            setError(RequestListResponse.error)
        } else {
            setRequestList(RequestListResponse.data)
        }
        console.log(RequestListResponse)
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, []);

  return (
      <div className="ad-car-list-page">
          <div className="ad-car-top-bar">
              <div className="reg-inspec-top-bar">
                  <div className="reg-inspec-search-filter-container">
                      <div className="reg-inspec-search-filter-item">
                          <label>{t('Type')}</label>
                          <select className="reg-inspec-search-bar"
                              onChange={(e) => setRequestType(Number(e.target.value))}
                              value={requestType}
                          >
                              <option value="-1">{t('Any Type')}</option>
                              <option value="0">{t('Data Correction')}</option>
                              <option value="1">{t('Technical Support')}</option>
                              <option value="2">{t('Report Inaccuracy')}</option>
                              <option value="3">{t('Feedback')}</option>
                              <option value="4">{t('General')}</option>
                          </select>
                      </div>
                      <div className="reg-inspec-search-filter-item">
                          <label>{t('Status')}</label>
                          <select className="reg-inspec-search-bar"
                              onChange={(e) => setRequestStatus(Number(e.target.value))}
                              value={requestStatus}
                          >
                              <option value="-1">{t('Any Status')}</option>
                              <option value="0">{t('Pending')}</option>
                              <option value="1">{t('Approved')}</option>
                              <option value="2">{t('Rejected')}</option>
                          </select>
                      </div>
                      <div className="reg-inspec-search-filter-item">
                          <label>{t('Sort By Date')}</label>
                          <select className="reg-inspec-search-bar"
                              onChange={(e) => setSortByDate(Number(e.target.value))}
                              value={sortByDate}
                          >
                              <option value="0">{t('Descending')}</option>
                              <option value="1">{t('Ascending')}</option>
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
          </div>
      <table className="ad-car-table">
          <thead>
              <tr>
                      <th>{t('Type')}</th>
                      <th>{t('Description')}</th>
                      <th>{t('Created Date')}</th>
                      <th>{t('Changed Date')}</th>
                      <th>{t('Status')}</th>
                      <th>{t('Process Note')}</th>
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
                      ) : filteredRequest.length > 0 ? (
                              filteredRequest.map((model: any, index: number) => (
                      <tr key={index}>  
                          <td>{t(model.type)}</td>
                          <td>{model.description}</td>
                          <td>{model.createdByUserId}</td>
                          <td>{model.modifiedByUserId}</td>
                          <td>{t(model.status)}</td>
                          <td>{model.response}</td>
                          <td onClick={() => { handleRequestAnswer(model) }}><button>{t('Response')}</button></td>
                      </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan={5}>{t('No Request Found')}</td>
                  </tr>
              )}
          </tbody>
          </table>
          {editRequest && (
              <div className="ad-car-modal">
                  <div className="ad-car-modal-content">
                      <span className="ad-car-close-btn" onClick={() => { setEditRequest(null); setModalPage(1) }}>&times;</span>
                      <h2>{t('Process Request')}</h2>
                      {modalPage === 1 && (
                          <RequestAnsweringPage
                              action="Edit"
                              model={editRequest}
                              handleInputChange={handleInputChange}
                          />
                      )}
                      <button onClick={handleResponseRequest} className="ad-car-prev-btn">
                          {t('Response')}
                      </button>
                      {addError && (
                          <p className="ad-car-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          </div>
  );
}

export default AdminRequestList;