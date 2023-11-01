import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AddCar, EditCar, ListAdminCar } from '../../services/api/Car';
import { AddRequest, GetUserRequest } from '../../services/api/Request';
import { RootState } from '../../store/State';
import { APIResponse, Car, CarModel, User, UsersRequest } from '../../utils/Interfaces';
import '../../styles/Reqeuest.css'
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import CarCharacteristicPage from '../../components/forms/admin/Car/CarCharacteristicPage';
import CarIdentificationPage from '../../components/forms/admin/Car/CarIdentificationPage';
import RequestCharacteristicPage from '../../components/forms/admin/User/RequestCharacteristicPage';

function UserRequest() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [carList, setCarList] = useState<Car[]>([]);
    const [modelList, setModelList] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalPage, setModalPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [RequestList, setRequestList] = useState<UsersRequest[]>([]);

    const [newRequest, setNewRequest] = useState<UsersRequest>({
        description: '',
        response: '',
        type: '',
        status: ''
    });

    const id = JWTDecoder(token).nameidentifier
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRequest = RequestList.filter((request: any) => {
        const matchingQuery = RequestList
        return matchingQuery
    })

    const handleAddRequest = async () => {
            setAdding(true);
            setAddError(null);
        const response: APIResponse = await AddRequest(newRequest, token);
            setAdding(false);
        if (response.error) {
            console.log(newRequest);
                setAddError(response.error);
            } else {
                setShowModal(false);
                setModalPage(1);
                fetchData();
            }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setNewRequest({
            ...newRequest,
            [e.target.name]: value,
         });
    };


    const fetchData = async () => {
            setLoading(true);
            setError(null);
        const RequestListResponse: APIResponse = await GetUserRequest(id, token)
        if (RequestListResponse.error) {
            setError(RequestListResponse.error)
            } else {
            setRequestList(RequestListResponse.data)
            }
        /*console.log(RequestListResponse)*/
        setLoading(false)
    }
    const handleSearchParameters = () => {

    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="ad-car-list-page">
            <div className="ad-car-top-bar">
                <button className="add-ad-car-btn" onClick={() => setShowModal(true)}>+ Add Request</button>
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
                        <th>Created Date</th>
                        <th>Changed Date</th>
                        <th>Status</th>
                        <th>Process Note</th>
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
                                        <td>{model.createdTimed}</td>
                                        <td>{model.lastModified}</td>
                                        <td>{model.status}</td>
                                        <td>{model.response}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No Request found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showModal && (
                <div className="ad-car-modal">
                    <div className="ad-car-modal-content">
                        <span className="ad-car-close-btn" onClick={() => { setShowModal(false)}}>&times;</span>
                        <h2>Add Request</h2>
                        {(
                            <RequestCharacteristicPage
                                action="Add"
                                model={newRequest}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        <button onClick={handleAddRequest} className="ad-car-prev-btn">
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

export default UserRequest;