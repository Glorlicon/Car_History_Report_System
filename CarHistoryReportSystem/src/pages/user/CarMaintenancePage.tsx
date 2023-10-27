import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AddCarMaintenance, ListCarMaintenance, RemoveCarMaintenance } from '../../services/api/CarMaintenance';
import { RootState } from '../../store/State';
import { APIResponse, CarMaintenance } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import carIcon from '../../car-icon.png'
import deleteIcon from '../../delete.png'
import '../../styles/CarMaintenance.css'
import { isValidVIN } from '../../utils/Validators';

function CarMaintenancePage() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).nameidentifier
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [list, setList] = useState<CarMaintenance[]>([])
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [adding, setAdding] = useState(false)
    const [addError, setAddError] = useState<string | null>(null)
    const [vin, setVin] = useState('')
    const [currentVin, setCurrentVin] = useState('')

    const handleAddButton = () => {
        setShowModal(true)
    }

    const handleDeleteButton = (vin: string) => {
        setShowDeleteModal(true)
        setCurrentVin(vin)
    }
    const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVin(e.target.value)
    }

    const validateVin = (vin: string): boolean => {
        if (!isValidVIN(vin)) {
            setAddError("VIN is invalid");
            return false;
        }

        if (!vin) {
            setAddError("VIN must be filled out");
            return false;
        }

        return true;
    };
    const handleAddCar = async () => {
        if (!validateVin(vin)) return
        setAdding(true)
        setAddError(null)
        const response: APIResponse = await AddCarMaintenance({
            carId: vin,
            userId: id
        }, token)
        if (response.error) {
            setAddError(response.error)
        } else {
            setShowModal(false)
            setVin('')
            fetchData()
        }
        setAdding(false)
    }

    const handleDeleteCar = async () => {
        setAdding(true)
        setAddError(null)
        const response: APIResponse = await RemoveCarMaintenance({
            carId: currentVin,
            userId: id
        }, token)
        if (response.error) {
            setAddError(response.error)
        } else {
            setShowDeleteModal(false)
            fetchData()
        }
        setAdding(false)
    }
    const fetchData = async () => {
        setLoading(true)
        setError(null)
        const response: APIResponse = await ListCarMaintenance(id, token)
        if (response.error) {
            setError(response.error)
        } else {
            setList(response.data)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData()
    },[])
    function handleCarMaintenanceDetails(vinId: any): void {
        console.log(vinId)
    }

  return (
      <div className="car-maintenance-page">
          <header className="car-maintenance-header">
              <span className="car-maintenance-icon">🚗</span>
              <h1>GARAGE</h1>
          </header>
          {loading ? (
              <div className="car-maintenance-spinner"></div>
          ): error ? (
                  <div className="car-maintenance-load-error">
                      {error}
                      <button onClick={fetchData} className="car-maintenance-retry-btn">Retry</button>
              </div>
              ) : list.length > 0 ? (
                      <>
                          <div className="car-maintenance-item" onClick={handleAddButton}>
                              🚘 Add Car
                          </div>
                          {list.map((car: any, index: number) => (
                              <div className="car-maintenance-item">
                                  <div className="car-maintenance-card" onClick={() => handleCarMaintenanceDetails(car.vinId)}>
                                      <img src={carIcon} alt="cat" />
                                      <span>{car.modelId}</span>
                                  </div>
                                  <div className="car-maintenance-btn" onClick={() => handleDeleteButton(car.vinId)}>
                                      <img src={deleteIcon} alt="cat" />
                                      <span>Delete</span>
                                  </div>
                              </div>
                          ))}
                      </>                 
          ) : (
              <>
                 <div className="car-maintenance-item" onClick={handleAddButton}>
                     🚘 Add Car
                 </div>
                 <span>No car in garage</span>
              </>
          )}
          {showModal && (
              <div className="car-maintenance-modal">
                  <div className="car-maintenance-modal-content">
                      <span className="car-maintenance-close-btn" onClick={() => { if (!adding) { setShowModal(false); setAddError('') } }}>&times;</span>
                      <h2>Add Car</h2>
                      <div className="car-maintenance-form-columns">
                          <div className="car-maintenance-form-column">
                              <label>Car VIN</label>
                              <input type="text" name="vin" onChange={handleVinChange} required />
                              OR
                              <br />
                              <br />
                              <label>License Plate (WIP)</label>
                              <input type="text" name="plate" />
                          </div>
                      
                      <button onClick={handleAddCar} disabled={adding} className="car-maintenance-add-btn">
                          {adding ? (<div className="car-maintenance-inline-spinner"></div>) : 'Add'}
                      </button>
                      {addError && (
                          <p className="car-maintenance-error">{addError}</p>
                          )}
                      </div>
                  </div>
              </div>
          )}
          {showDeleteModal && (
              <div className="car-maintenance-modal">
                  <div className="car-maintenance-modal-content">
                      <span className="car-maintenance-close-btn" onClick={() => { if (!adding) setShowDeleteModal(false); }}>&times;</span>
                      <h2>Delete Car</h2>
                      <p>Are you sure you want to delete {currentVin} from your garage?</p>

                      {adding ? (
                          <div className="car-maintenance-inline-spinner"></div>
                      ) : (
                              <>
                                  <button onClick={handleDeleteCar} className="car-maintenance-add-btn">Yes</button>
                                  <button onClick={() => { if (!adding) setShowDeleteModal(false); }} className="car-maintenance-add-btn">No</button>
                          </>
                      )}
                      {addError && (
                          <p className="car-maintenance-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
      </div>
  );
}

export default CarMaintenancePage;