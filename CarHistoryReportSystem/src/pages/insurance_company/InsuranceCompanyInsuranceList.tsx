import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InsuranceCompanyInsuranceDetailsForm from '../../components/forms/insurance/InsuranceCompanyInsuranceDetailsForm';
import { AddCarInsurance, EditCarInsurance, ListCarInsurance } from '../../services/api/CarInsurance';
import { RootState } from '../../store/State';
import { APIResponse, CarInsurance } from '../../utils/Interfaces';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/InsuranceCompanyInsurance.css'
function InsuranceCompanyInsuranceList() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [carInsuranceList, setCarInsuranceList] = useState<CarInsurance[]>([]);
    const [newCarInsurance, setNewCarInsurance] = useState<CarInsurance>({
        insuranceNumber: '',
        carId: '',
        startDate: '',
        endDate: '',
        description: '',
        odometer: 0,
        note: '',
        reportDate: ''
    });
    const [editCarInsurance, setEditCarInsurance] = useState<CarInsurance | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const validateCarInsurance = (insurance: CarInsurance): boolean => {
        if (!isValidVIN(insurance.carId)) {
            setAddError("VIN is invalid");
            return false;
        }
        if (!insurance.carId) {
            setAddError("VIN must be filled out");
            return false;
        }
        if (!insurance.insuranceNumber) {
            setAddError("Insurance Number must be filled out");
            return false;
        }
        if (!insurance.odometer) {
            setAddError("Odometer must be chosen");
            return false;
        }
        if (!insurance.startDate) {
            setAddError("Start Date must be chosen");
            return false;
        }
        if (!insurance.endDate) {
            setAddError("End Date must be chosen");
            return false;
        }
        if (!insurance.description) {
            setAddError("Description must be filled out");
            return false;
        }
        if (!insurance.note) {
            setAddError("Note must be filled out");
            return false;
        }
        if (!insurance.odometer) {
            setAddError("Odometer must be chosen");
            return false;
        }
        if (!insurance.reportDate) {
            setAddError("Report Date must be chosen");
            return false;
        }
        return true;
    };
    const handleAddCarInsurance = async () => {
        if (validateCarInsurance(newCarInsurance)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await AddCarInsurance(newCarInsurance, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                fetchData();
            }
        }
    }

    const handleEditCarInsurance = async () => {
        if (editCarInsurance && editCarInsurance.id && validateCarInsurance(editCarInsurance)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await EditCarInsurance(editCarInsurance.id, editCarInsurance, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setEditCarInsurance(null)
                fetchData();
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCarInsurance) {
            setEditCarInsurance({
                ...editCarInsurance,
                [e.target.name]: value
            })
        } else {
            setNewCarInsurance({
                ...newCarInsurance,
                [e.target.name]: value,
            });
        }
    };
    const filteredList = carInsuranceList.filter((item: any) => {
        const matchingQuery = item.carId.toLowerCase().includes(searchQuery.toLowerCase())
        return matchingQuery
    })
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carInsuranceResponse: APIResponse = await ListCarInsurance(token)
        if (carInsuranceResponse.error) {
            setError(carInsuranceResponse.error)
        } else {
            setCarInsuranceList(carInsuranceResponse.data)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
    }, []);
  return (
      <div className="ins-ins-list-page">
          <div className="ins-ins-top-bar">
              <button className="add-ins-ins-btn" onClick={() => setShowModal(true)}>+ Add New Car Insurance</button>
              <div className="ins-ins-search-filter-container">
                  <input
                      type="text"
                      className="ins-ins-search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
              </div>
          </div>
          <table className="ins-ins-table">
              <thead>
                  <tr>
                      <th>Car VIN</th>
                      <th>Insurance Number</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Expired</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              <div className="ins-ins-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                                  <button onClick={fetchData} className="ins-ins-retry-btn">Retry</button>
                          </td>
                      </tr>
                  ) : filteredList.length > 0 ? (
                      filteredList.map((model: CarInsurance, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditCarInsurance(model) }}>{model.carId}</td>
                              <td>{model.insuranceNumber}</td>
                              <td>{model.startDate}</td>
                              <td>{model.endDate}</td>
                              <td>{model.expired}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>No car insurances found</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {showModal && (
              <div className="ins-ins-modal">
                  <div className="ins-ins-modal-content">
                      <span className="ins-ins-close-btn" onClick={() => { setShowModal(false) }}>&times;</span>
                      <h2>Add Car Insurance</h2>
                      <InsuranceCompanyInsuranceDetailsForm
                          action="Add"
                          model={newCarInsurance}
                          handleInputChange={handleInputChange}
                      />
                      <button onClick={handleAddCarInsurance} disabled={adding} className="ins-ins-model-add-btn">
                          {adding ? (<div className="ins-ins-inline-spinner"></div>) : 'Add'}
                      </button>
                      {addError && (
                          <p className="ins-ins-model-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editCarInsurance && (
              <div className="ins-ins-modal">
                  <div className="ins-ins-modal-content">
                      <span className="ins-ins-close-btn" onClick={() => { setShowModal(false); setEditCarInsurance(null) }}>&times;</span>
                      <h2>Edit Car Insurance</h2>
                      <InsuranceCompanyInsuranceDetailsForm
                          action="Edit"
                          model={editCarInsurance}
                          handleInputChange={handleInputChange}
                      />
                      <button onClick={handleEditCarInsurance} disabled={adding} className="ins-ins-model-add-btn">
                          {adding ? (<div className="ins-ins-inline-spinner"></div>) : 'Update'}
                      </button>
                      {addError && (
                          <p className="ins-ins-model-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
      </div>
  );
}

export default InsuranceCompanyInsuranceList;