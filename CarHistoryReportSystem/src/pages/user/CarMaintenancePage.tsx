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
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function CarMaintenancePage() {
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
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
    const navigate = useNavigate()
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
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await AddCarMaintenance({
            carId: vin,
            userId: id
        }, token, connectAPIError, language)
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
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await RemoveCarMaintenance({
            carId: currentVin,
            userId: id
        }, token, connectAPIError, language)
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
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let unknownError = t('Something went wrong. Please try again')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await ListCarMaintenance(id, token, connectAPIError, unknownError, language)
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
        navigate(`/maintenance/${vinId}`)
    }
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, []);

  return (
      <div className="car-maintenance-page">
          <header className="car-maintenance-header">
              <span className="car-maintenance-icon">🚗</span>
              <h1>{t('GARAGE')}</h1>
          </header>
          {loading ? (
              <div className="car-maintenance-spinner"></div>
          ): error ? (
                  <div className="car-maintenance-load-error">
                      {error}
                      <button onClick={fetchData} className="car-maintenance-retry-btn">{t('Retry')}</button>
              </div>
              ) : list.length > 0 ? (
                      <>
                          <div className="car-maintenance-item" onClick={handleAddButton}>
                              🚘 {t('Add Car')}
                          </div>
                          {list.map((car: any, index: number) => (
                              <div className="car-maintenance-item">
                                  <div className="car-maintenance-card" onClick={() => handleCarMaintenanceDetails(car.vinId)}>
                                      <img src={carIcon} alt="cat" />
                                      <span>{car.modelId}</span>
                                  </div>
                                  <div className="car-maintenance-btn" onClick={() => handleDeleteButton(car.vinId)}>
                                      <img src={deleteIcon} alt="cat" />
                                      <span>{t('Delete')}</span>
                                  </div>
                              </div>
                          ))}
                      </>                 
          ) : (
              <>
                 <div className="car-maintenance-item" onClick={handleAddButton}>
                     🚘 {t('Add Car')}
                 </div>
                 <span>{t('No car in garage')}</span>
              </>
          )}
          {showModal && (
              <div className="car-maintenance-modal">
                  <div className="car-maintenance-modal-content">
                      <span className="car-maintenance-close-btn" onClick={() => { if (!adding) { setShowModal(false); setAddError('') } }}>&times;</span>
                      <h2>{t('Add Car')}</h2>
                      <div className="car-maintenance-form-columns">
                          <div className="car-maintenance-form-column">
                              <label>{t('Car VIN')}</label>
                              <input type="text" name="vin" onChange={handleVinChange} required />
                          </div>
                      
                      <button onClick={handleAddCar} disabled={adding} className="car-maintenance-add-btn">
                          {adding ? (<div className="car-maintenance-inline-spinner"></div>) : t('Finish')}
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
                      <h2>{t('Delete Car')}</h2>
                      <p>{t('Are you sure you want to delete')} {currentVin} {t('from your garage')}?</p>

                      {adding ? (
                          <div className="car-maintenance-inline-spinner"></div>
                      ) : (
                              <>
                                  <button onClick={handleDeleteCar} className="car-maintenance-add-btn">{t('Yes')}</button>
                                  <button onClick={() => { if (!adding) setShowDeleteModal(false); }} className="car-maintenance-add-btn">{t('No')}</button>
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