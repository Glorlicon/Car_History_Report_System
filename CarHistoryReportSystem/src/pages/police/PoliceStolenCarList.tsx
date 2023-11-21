import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PoliceCarStolenDetailsForm from '../../components/forms/police/PoliceCarStolenDetailsForm';
import { AddCarStolenHistory, EditCarStolenHistory, ListCarStolen } from '../../services/api/CarStolen';
import { RootState } from '../../store/State';
import { APIResponse, CarStolen } from '../../utils/Interfaces';
import { isValidVIN } from '../../utils/Validators';
import '../../styles/PoliceStolenCar.css'
function PoliceStolenCarList() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [carStolenList, setcarStolenList] = useState<CarStolen[]>([]);
    const [newCarStolenReport, setNewCarStolenReport] = useState<CarStolen>({
        description: '',
        carId: '',
        odometer: 0,
        status: 0,
        note: '',
        reportDate: ''
    });
    const [editCarStolenReport, setEditCarStolenReport] = useState<CarStolen | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const validateCarStolenReport = (stolenReport: CarStolen): boolean => {
        if (!isValidVIN(stolenReport.carId)) {
            setAddError("VIN is invalid");
            return false;
        }
        if (!stolenReport.carId) {
            setAddError("VIN must be filled out");
            return false;
        }
        if (!stolenReport.description) {
            setAddError("Description must be filled out");
            return false;
        }
        if (!stolenReport.odometer) {
            setAddError("Odometer must be chosen");
            return false;
        }
        if (!stolenReport.note) {
            setAddError("Note must be filled out");
            return false;
        }
        return true;
    };
    const handleAddCarStolenReport = async () => {
        if (validateCarStolenReport(newCarStolenReport)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await AddCarStolenHistory(newCarStolenReport, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                fetchData();
            }
        }
    }

    const handleEditCarStolenReport = async () => {
        if (editCarStolenReport && editCarStolenReport.id && validateCarStolenReport(editCarStolenReport)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await EditCarStolenHistory(editCarStolenReport.id, editCarStolenReport, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditCarStolenReport(null)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCarStolenReport) {
            setEditCarStolenReport({
                ...editCarStolenReport,
                [e.target.name]: value
            })
        } else {
            setNewCarStolenReport({
                ...newCarStolenReport,
                [e.target.name]: value,
            });
        }
    };
    const filteredStolenList = carStolenList.filter((stolen: any) => {
        const matchingQuery = stolen.carId.toLowerCase().includes(searchQuery.toLowerCase())
        return matchingQuery
    })
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carStolenReportResponse: APIResponse = await ListCarStolen(token)
        if (carStolenReportResponse.error) {
            setError(carStolenReportResponse.error)
        } else {
            setcarStolenList(carStolenReportResponse.data)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
    }, []);
  return (
      <div className="pol-stolen-list-page">
          <div className="pol-stolen-top-bar">
              <button className="add-pol-stolen-btn" onClick={() => setShowModal(true)}>+ Add New Stolen Car Report</button>
              <div className="pol-stolen-search-filter-container">
                  <input
                      type="text"
                      className="pol-stolen-search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
              </div>
          </div>
          <table className="pol-stolen-table">
              <thead>
                  <tr>
                      <th>Car VIN</th>
                      <th>Odometer</th>
                      <th>Report Date</th>
                      <th>Status</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={4} style={{ textAlign: 'center' }}>
                              <div className="pol-stolen-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                              <button onClick={fetchData} className="pol-stolen-retry-btn">Retry</button>
                          </td>
                      </tr>
                  ) : filteredStolenList.length > 0 ? (
                      filteredStolenList.map((model: CarStolen, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditCarStolenReport(model) }}>{model.carId}</td>
                              <td>{model.odometer}</td>
                              <td>{model.reportDate}</td>
                              <td>{model.status}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>No stolen car reports found</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {showModal && (
              <div className="pol-stolen-modal">
                  <div className="pol-stolen-modal-content">
                      <span className="pol-stolen-close-btn" onClick={() => { setShowModal(false) }}>&times;</span>
                      <h2>Add Car Stolen Report</h2>
                      <PoliceCarStolenDetailsForm
                          action="Add"
                          model={newCarStolenReport}
                          handleInputChange={handleInputChange}
                      />
                      <button onClick={handleAddCarStolenReport} disabled={adding} className="pol-stolen-model-add-btn">
                          {adding ? (<div className="pol-stolen-model-inline-spinner"></div>) : 'Add'}
                      </button>
                      {addError && (
                          <p className="pol-stolen-model-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editCarStolenReport && (
              <div className="pol-stolen-modal">
                  <div className="pol-stolen-modal-content">
                      <span className="pol-stolen-close-btn" onClick={() => { setShowModal(false); setEditCarStolenReport(null) }}>&times;</span>
                      <h2>Edit Car Stolen Report</h2>
                      <PoliceCarStolenDetailsForm
                          action="Edit"
                          model={editCarStolenReport}
                          handleInputChange={handleInputChange}
                      />
                      <button onClick={handleEditCarStolenReport} disabled={adding} className="pol-stolen-model-add-btn">
                          {adding ? (<div className="pol-stolen-model-inline-spinner"></div>) : 'Update'}
                      </button>
                      {addError && (
                          <p className="pol-stolen-model-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
      </div>
  );
}

export default PoliceStolenCarList;