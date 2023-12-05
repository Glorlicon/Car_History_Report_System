import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { AdminRequest, APIResponse, Car, CarModel, UsersRequest } from '../../../utils/Interfaces';
import '../../../styles/AdminCars.css'
import { ResponseRequest, GetAllUserRequest } from '../../../services/api/Request';
import RequestAnsweringPage from '../../../components/forms/admin/Request/RequestAnsweringPage';

function AdminCarList() {
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
        const RequestListResponse: APIResponse = await GetAllUserRequest(token)
        if (RequestListResponse.error) {
            setError(RequestListResponse.error)
        } else {
            setRequestList(RequestListResponse.data)
        }
        console.log(RequestListResponse)
        setLoading(false)
    }
    //const handleSearchParameters = () => {

    //}

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchData();
    }, []);

  return (
      <div className="ad-car-list-page">
          <div className="ad-car-top-bar">
              <div className="ad-car-search-filter-container">
                  <input
                      type="text"
                      className="ad-car-search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
              </div>
          </div>
      <table className="ad-car-table">
          <thead>
              <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>created By User</th>
                      <th>modified By User</th>
                      <th>Status</th>
                      <th>Process Note</th>
                      <th>Action</th>
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
                          <td>{model.type}</td>
                          <td>{model.description}</td>
                          <td>{model.createdByUserId}</td>
                          <td>{model.modifiedByUserId}</td>
                          <td>{model.status}</td>
                          <td>{model.response}</td>
                                      <td onClick={() => { handleRequestAnswer(model) }}><button>Response</button></td>
                      </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan={5}>No cars found</td>
                  </tr>
              )}
          </tbody>
          </table>
          {editRequest && (
              <div className="ad-car-modal">
                  <div className="ad-car-modal-content">
                      <span className="ad-car-close-btn" onClick={() => { setEditRequest(null); setModalPage(1) }}>&times;</span>
                      <h2>Process Request</h2>
                      {modalPage === 1 && (
                          <RequestAnsweringPage
                              action="Edit"
                              model={editRequest}
                              handleInputChange={handleInputChange}
                          />
                      )}
                      <button onClick={handleResponseRequest} className="ad-car-prev-btn">
                          Add
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

export default AdminCarList;