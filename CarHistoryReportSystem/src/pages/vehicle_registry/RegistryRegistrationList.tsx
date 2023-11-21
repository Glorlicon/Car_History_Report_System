import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RegistryRegistrationDetailsForm from '../../components/forms/registry/RegistryRegistrationDetailsForm';
import { AddCarRegistration, EditCarRegistration, ListCarRegistration } from '../../services/api/CarRegistration';
import { RootState } from '../../store/State';
import { APIResponse, CarRegistration } from '../../utils/Interfaces';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/RegistryCarRegistration.css'
function RegistryRegistrationList() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [registrationList, setRegistrationList] = useState<CarRegistration[]>([]);
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
    const [editRegistration, setEditRegistration] = useState<CarRegistration | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

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
            const response: APIResponse = await AddCarRegistration(newRegistration, token);
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
            const response: APIResponse = await EditCarRegistration(editRegistration.carId, editRegistration, token);
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
    const filteredList = registrationList.filter((item: any) => {
        const matchingQuery = item.carId.toLowerCase().includes(searchQuery.toLowerCase())
        return matchingQuery
    })
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carRegistrationResponse: APIResponse = await ListCarRegistration(token)
        if (carRegistrationResponse.error) {
            setError(carRegistrationResponse.error)
        } else {
            setRegistrationList(carRegistrationResponse.data)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="reg-reg-list-page">
            <div className="reg-reg-top-bar">
                <button className="add-reg-reg-btn" onClick={() => setShowModal(true)}>+ Add New Car Registration</button>
                <div className="reg-reg-search-filter-container">
                    <input
                        type="text"
                        className="reg-reg-search-bar"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <table className="reg-reg-table">
                <thead>
                    <tr>
                        <th>Car VIN</th>
                        <th>Registration Number</th>
                        <th>License Plate Number</th>
                        <th>Expire Date</th>
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
                                <button onClick={fetchData} className="reg-reg-retry-btn">Retry</button>
                            </td>
                        </tr>
                    ) : filteredList.length > 0 ? (
                        filteredList.map((model: CarRegistration, index: number) => (
                            <tr key={index}>
                                <td onClick={() => { setEditRegistration(model) }}>{model.carId}</td>
                                <td>{model.registrationNumber}</td>
                                <td>{model.licensePlateNumber}</td>
                                <td>{model.expireDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>No car registrations found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showModal && (
                <div className="reg-reg-modal">
                    <div className="reg-reg-modal-content">
                        <span className="reg-reg-close-btn" onClick={() => { setShowModal(false) }}>&times;</span>
                        <h2>Add Car Registration</h2>
                        <RegistryRegistrationDetailsForm
                            action="Add"
                            model={newRegistration}
                            handleInputChange={handleInputChange}
                        />
                        <button onClick={handleAddCarRegistration} disabled={adding} className="reg-reg-model-add-btn">
                            {adding ? (<div className="reg-reg-model-inline-spinner"></div>) : 'Add'}
                        </button>
                        {addError && (
                            <p className="reg-reg-model-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
            {editRegistration && (
                <div className="reg-reg-modal">
                    <div className="reg-reg-modal-content">
                        <span className="reg-reg-close-btn" onClick={() => { setShowModal(false); setEditRegistration(null) }}>&times;</span>
                        <h2>Edit Car Registration</h2>
                        <RegistryRegistrationDetailsForm
                            action="Edit"
                            model={editRegistration}
                            handleInputChange={handleInputChange}
                        />
                        <button onClick={handleEditCarRegistration} disabled={adding} className="reg-reg-model-add-btn">
                            {adding ? (<div className="reg-reg-model-inline-spinner"></div>) : 'Update'}
                        </button>
                        {addError && (
                            <p className="reg-reg-model-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegistryRegistrationList;