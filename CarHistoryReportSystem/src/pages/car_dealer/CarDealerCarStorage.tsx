import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CarCharacteristicPage from '../../components/forms/admin/Car/CarCharacteristicPage';
import CarIdentificationPage from '../../components/forms/admin/Car/CarIdentificationPage';
import { AddCar, AddOldCarToStorage, EditCar, ListDealerCarStorage } from '../../services/api/Car';
import { ListAllCarModels } from '../../services/api/CarModel';
import { RootState } from '../../store/State';
import { APIResponse, Car, CarModel, CarModelSearchParams, Paging } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/ManufacturerCars.css'
import { useTranslation } from 'react-i18next';
function CarDealerCarStorage() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const id = JWTDecoder(token).dataprovider
    const [error, setError] = useState<string | null>(null);
    const [carList, setCarList] = useState<Car[]>([]);
    const [modelList, setModelList] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalPage, setModalPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newCar, setNewCar] = useState<Car>({
        vinId: '',
        licensePlateNumber: '',
        color: 0,
        currentOdometer: 0,
        engineNumber: '',
        isCommercialUse: false,
        isModified: false,
        modelId: ''
    });
    const [editCar, setEditCar] = useState<Car | null>(null)
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [oldCarVin, setOldCarVin] = useState('')
    const [isBrandNewCar, setBrandNewCar] = useState(false)
    const validateCar = (car: Car): boolean => {
        if (!isValidVIN(car.vinId)) {
            setAddError("VIN is invalid");
            return false;
        }
        if (!isValidPlateNumber(car.licensePlateNumber)) {
            setAddError("License Plate Number is invalid");
            return false;
        }
        if (!car.vinId) {
            setAddError("VIN must be filled out");
            return false;
        }
        if (!car.licensePlateNumber) {
            setAddError("License Plate Number must be filled out");
            return false;
        }
        if (!car.modelId) {
            setAddError("Model must be chosen");
            return false;
        }
        if (!car.engineNumber) {
            setAddError("Engine Number must be filled out");
            return false;
        }
        return true;
    };
    const filteredCars = carList.filter((car: any) => {
        const matchingQuery = car.vinId.toLowerCase().includes(searchQuery.toLowerCase())
        return matchingQuery
    })

    const handleNextPage = () => {
        if (modalPage < 2) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editCar) handleEditCar();
            else handleAddCar();
        }
    };

    const handleAddCar = async () => {
        if (validateCar(newCar)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await AddCar(newCar, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setModalPage(1);
                fetchData();
            }
        }
    }
    const handleAddOldCar = async () => {
        if (!isValidVIN(oldCarVin)) {
            setAddError("VIN is invalid")
            return
        }
        if (!oldCarVin) {
            setAddError("VIN must be filled out");
            return;
        }
        setAdding(true);
        setAddError(null);
        const response: APIResponse = await AddOldCarToStorage(id, oldCarVin, token)
        setAdding(false);
        if (response.error) {
            setAddError(response.error);
        } else {
            setShowModal(false);
            setModalPage(1);
            fetchData();
        }
    }

    const handleEditCar = async () => {
        if (editCar != null && validateCar(editCar)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await EditCar(editCar, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditCar(null);
                setModalPage(1);
                fetchData();
            }
        }
    }

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };

    const handleBrandNewCarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (typeof value === "boolean") setBrandNewCar(value)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        if (editCar) {
            setEditCar({
                ...editCar,
                [e.target.name]: value
            })
        } else {
            setNewCar({
                ...newCar,
                [e.target.name]: value,
            });
        }
    };

    const handleOldCarVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOldCarVin(e.target.value)
    }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let unknownError = t('Something went wrong. Please try again')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchCarModelParams: CarModelSearchParams = {
            manuName: '',
            modelId: '',
            releasedDateEnd: '',
            releasedDateStart: ''
        }
        const carModelResponse: APIResponse = await ListAllCarModels(token, page, connectAPIError, unknownError, language, searchCarModelParams)
        if (carModelResponse.error) {
            setError(carModelResponse.error)
        } else {
            setModelList(carModelResponse.data)
            const carListResponse: APIResponse = await ListDealerCarStorage(token)
            if (carListResponse.error) {
                setError(carListResponse.error)
            } else {
                setCarList(carListResponse.data)
            }
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
    }, []);
  return (
      <div className="manu-car-list-page">
          <div className="manu-car-top-bar">
              <button className="add-manu-car-btn" onClick={() => setShowModal(true)}>+ Add Car</button>
              <div className="manu-car-search-filter-container">
                  <input
                      type="text"
                      className="manu-car-search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
              </div>
          </div>
          <table className="manu-car-table">
              <thead>
                  <tr>
                      <th>VIN</th>
                      <th>License Plate Number</th>
                      <th>Model ID</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              <div className="manu-car-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                              <button onClick={fetchData} className="manu-car-retry-btn">Retry</button>
                          </td>
                      </tr>
                  ) : filteredCars.length > 0 ? (
                      filteredCars.map((model: any, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditCar(model) }}>{model.vinId}</td>
                              <td>{model.licensePlateNumber}</td>
                              <td>{model.modelId}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>No cars found</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {showModal && (
              <div className="manu-car-modal">
                      <div className="manu-car-modal-content">
                      <span className="manu-car-close-btn" onClick={() => { setShowModal(false); setModalPage(1) }}>&times;</span>
                      <h2>Add Car</h2>
                          <div>
                              <label>Brand New Car?</label>
                              <input type="checkbox" name="isBrandNewCar" checked={isBrandNewCar} onChange={handleBrandNewCarChange} />
                          </div>
                      {isBrandNewCar ? (
                          <>
                              {modalPage === 1 && (
                                  <CarCharacteristicPage
                                      action="Add"
                                      model={newCar}
                                      handleInputChange={handleInputChange}
                                  />
                              )}
                              {modalPage === 2 && (
                                  <CarIdentificationPage
                                      action="Add"
                                      model={newCar}
                                      handleInputChange={handleInputChange}
                                      carModels={modelList}
                                  />
                              )}
                              <button onClick={handlePreviousPage} disabled={modalPage === 1} className="manu-car-prev-btn">
                                  Previous
                              </button>
                              <button onClick={handleNextPage} disabled={adding} className="manu-car-next-btn">
                                  {modalPage < 2 ? 'Next' : (adding ? (<div className="manu-car-inline-spinner"></div>) : 'Add')}
                              </button>
                              {addError && (
                                  <p className="manu-car-error">{addError}</p>
                              )}
                          </>
                      ) : (
                              <>
                                  <div className="ad-car-form-columns">
                                      <div className="ad-car-form-column">
                                          <label>VIN</label>
                                          <input type="text" name="oldCarVin" value={oldCarVin} onChange={handleOldCarVinChange} />
                                      </div>
                                  </div>
                                  <button onClick={handleAddOldCar} disabled={adding} className="manu-car-add-btn">
                                      {adding ? (<div className="manu-car-inline-spinner"></div>) : 'Add'}
                                  </button>
                                  {addError && (
                                      <p className="manu-car-error">{addError}</p>
                                  )}
                              </>
                      )}
                  </div>
              </div>
          )}
          {editCar && (
              <div className="manu-car-modal">
                  <div className="manu-car-modal-content">
                      <span className="manu-car-close-btn" onClick={() => { setEditCar(null); setModalPage(1) }}>&times;</span>
                      <h2>Edit Car</h2>
                      {modalPage === 1 && (
                          <CarCharacteristicPage
                              action="Edit"
                              model={editCar}
                              handleInputChange={handleInputChange}
                          />
                      )}
                      {modalPage === 2 && (
                          <CarIdentificationPage
                              action="Edit"
                              model={editCar}
                              handleInputChange={handleInputChange}
                              carModels={modelList}
                          />
                      )}
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="manu-car-prev-btn">
                          Previous
                      </button>
                      <button onClick={handleNextPage} disabled={adding} className="manu-car-model-next-btn">
                          {modalPage < 2 ? 'Next' : (adding ? (<div className="manu-car-model-inline-spinner"></div>) : 'Update')}
                      </button>
                      {addError && (
                          <p className="manu-car-model-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
      </div>
  );
}

export default CarDealerCarStorage;