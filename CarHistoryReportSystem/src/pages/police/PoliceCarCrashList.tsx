import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PoliceCarCrashDetailsForm from '../../components/forms/police/PoliceCarCrashDetailsForm';
import PoliceCarCrashIdentificationForm from '../../components/forms/police/PoliceCarCrashIdentificationForm';
import { AddCarCrash, EditCarCrash, ListCarCrash } from '../../services/api/CarCrash';
import { RootState } from '../../store/State';
import { APIResponse, CarCrash } from '../../utils/Interfaces';
import { isValidVIN } from '../../utils/Validators';
import '../../styles/PoliceCrashCar.css'

function PoliceCarCrashList() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
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
    const [editCarCrashReport, setEditCarCrashReport] = useState<CarCrash | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const validateCarCrashReport = (crashReport: CarCrash): boolean => {
        if (!isValidVIN(crashReport.carId)) {
            setAddError("VIN is invalid");
            return false;
        }
        if (!crashReport.carId) {
            setAddError("VIN must be filled out");
            return false;
        }
        if (!crashReport.description) {
            setAddError("Description must be filled out");
            return false;
        }
        if (!crashReport.location) {
            setAddError("Location must be filled out");
            return false;
        }
        if (!crashReport.odometer) {
            setAddError("Odometer must be chosen");
            return false;
        }
        if (!crashReport.accidentDate) {
            setAddError("Accident Date must be chosen");
            return false;
        }
        if (!crashReport.reportDate) {
            setAddError("Report Date must be chosen");
            return false;
        }
        if (!crashReport.note) {
            setAddError("Note must be filled out");
            return false;
        }
        if (crashReport.serverity <= 0) {
            setAddError("Severity must be higher than 0");
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
            const response: APIResponse = await AddCarCrash(newCarCrashReport, token);
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
            const response: APIResponse = await EditCarCrash(editCarCrashReport.id, editCarCrashReport, token);
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
    const filteredList = carCrashList
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carCrashReportResponse: APIResponse = await ListCarCrash(token)
        if (carCrashReportResponse.error) {
            setError(carCrashReportResponse.error)
        } else {
            setCarCrashList(carCrashReportResponse.data)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="pol-crash-list-page">
            <div className="pol-crash-top-bar">
                <button className="add-pol-crash-btn" onClick={() => setShowModal(true)}>+ Add New Crash Car Report</button>
                <div className="pol-crash-search-filter-container">
                    <input
                        type="text"
                        className="pol-crash-search-bar"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <table className="pol-crash-table">
                <thead>
                    <tr>
                        <th>Car VIN</th>
                        <th>Location</th>
                        <th>Report Date</th>
                        <th>Severity</th>
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
                                    <button onClick={fetchData} className="pol-crash-retry-btn">Retry</button>
                            </td>
                        </tr>
                    ) : filteredList.length > 0 ? (
                                filteredList.map((model: CarCrash, index: number) => (
                            <tr key={index}>
                                <td onClick={() => { setEditCarCrashReport(model) }}>{model.id}</td>
                                <td>{model.location}</td>
                                <td>{model.reportDate}</td>
                                <td>{model.serverity}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No crash car reports found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showModal && (
                <div className="pol-crash-modal">
                    <div className="pol-crash-modal-content">
                        <span className="pol-crash-close-btn" onClick={() => { setShowModal(false); setModalPage(1) }}>&times;</span>
                        <h2>Add Car Crash Report</h2>
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
                                    Previous
                                </button>
                                <button onClick={handleNextPage} disabled={adding} className="pol-crash-model-next-btn">
                                    {modalPage < 2 ? 'Next' : 'Add'}
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
                        <h2>Edit Car Crash Report</h2>
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
                                    Previous
                                </button>
                                <button onClick={handleNextPage} disabled={adding} className="pol-crash-model-next-btn">
                                    {modalPage < 2 ? 'Next' : 'Update'}
                                </button>
                            </>
                        )}
                        {addError && (
                            <p className="pol-crash-model-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PoliceCarCrashList;