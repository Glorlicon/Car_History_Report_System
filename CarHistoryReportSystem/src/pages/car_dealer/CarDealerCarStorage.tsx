import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CarCharacteristicPage from '../../components/forms/admin/Car/CarCharacteristicPage';
import CarIdentificationPage from '../../components/forms/admin/Car/CarIdentificationPage';
import { AddCar, AddOldCarToStorage, EditCar, ListDealerCarStorage } from '../../services/api/Car';
import { ListAllCarModels } from '../../services/api/CarModel';
import { RootState } from '../../store/State';
import { APIResponse, Car, CarModel, CarModelSearchParams, CarStorageSearchParams, Paging } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { isValidPlateNumber, isValidVIN } from '../../utils/Validators';
import '../../styles/ManufacturerCars.css'
import { useTranslation } from 'react-i18next';
import { Pagination } from '@mui/material';
function CarDealerCarStorage() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const [searchManufacturer, setSearchManufacturer] = useState('')
    const [searchVin, setSearchVin] = useState('')
    const [searchModel, setSearchModel] = useState('')
    const [searchOdometerMin, setSearchOdometerMin] = useState('')
    const [searchOdometerMax, setSearchOdometerMax] = useState('')
    const [searchReleaseDateMin, setSearchReleaseDateMin] = useState('')
    const [searchReleaseDateMax, setSearchReleaseDateMax] = useState('')
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
    const [oldCarVin, setOldCarVin] = useState('')
    const [isBrandNewCar, setBrandNewCar] = useState(false)
    const validateCar = (car: Car): boolean => {
        if (!isValidVIN(car.vinId)) {
            setAddError(t('VIN is invalid'));
            return false;
        }
        if (!car.vinId) {
            setAddError(t('VIN must be filled out'));
            return false;
        }
        if (!car.modelId || car.modelId === "notChosen") {
            setAddError(t('Model must be chosen'));
            return false;
        }
        if (!car.engineNumber) {
            setAddError(t('Engine Number must be filled out'));
            return false;
        }
        return true;
    };

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
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCar(newCar, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                const response2: APIResponse = await AddOldCarToStorage(id, newCar.vinId, token, connectAPIError, language)
                if (response2.error) {
                    setAddError(response2.error);
                } else {
                    setShowModal(false);
                    setModalPage(1);
                    setNewCar({
                        vinId: '',
                        color: 0,
                        currentOdometer: 0,
                        engineNumber: '',
                        isCommercialUse: false,
                        isModified: false,
                        modelId: ''
                    })
                    setBrandNewCar(false)
                    fetchData();
                }
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
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        const response: APIResponse = await AddOldCarToStorage(id, oldCarVin, token, connectAPIError, language)
        setAdding(false);
        if (response.error) {
            setAddError(response.error);
        } else {
            setShowModal(false);
            setModalPage(1);
            setOldCarVin('')
            fetchData();
        }
    }

    const handleEditCar = async () => {
        if (editCar != null && validateCar(editCar)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCar(editCar, token, connectAPIError, language);
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

    const handleResetFilters = () => {
        setSearchManufacturer('')
        setSearchModel('')
        setSearchOdometerMax('')
        setSearchOdometerMin('')
        setSearchReleaseDateMax('')
        setSearchReleaseDateMin('')
        setSearchVin('')
        setResetTrigger(prev => prev + 1);
    }

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
        let searchParams: CarStorageSearchParams = {
            vin: searchVin,
            manufacturer: searchManufacturer,
            model: searchModel,
            odometerMax: searchOdometerMax,
            odometerMin: searchOdometerMin,
            releaseDateMax: searchReleaseDateMax,
            releaseDateMin: searchReleaseDateMin
        }
        const carModelResponse: APIResponse = await ListAllCarModels(token, page, connectAPIError, unknownError, language, searchCarModelParams)
        if (carModelResponse.error) {
            setError(carModelResponse.error)
        } else {
            setModelList(carModelResponse.data)
            const carListResponse: APIResponse = await ListDealerCarStorage(token, page, connectAPIError, language, searchParams)
            if (carListResponse.error) {
                setError(carListResponse.error)
            } else {
                setCarList(carListResponse.data)
                setPaging(carListResponse.pages)
            }
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, []);
    useEffect(() => {
        fetchData();
        i18n.changeLanguage(currentLanguage)
    }, [page])
    useEffect(() => {
        fetchData();
    }, [resetTrigger]);
  return (
      <div className="manu-car-list-page">
          <div className="manu-car-top-bar">
              <button className="add-manu-car-btn" onClick={() => setShowModal(true)}>+ {t('Add Car To Storage')}</button>
          </div>
          <div className="reg-inspec-top-bar-2">
              <div className="reg-inspec-search-filter-container-3">
                  <div className="reg-inspec-search-filter-container-2">
                      <div className="reg-inspec-search-filter-item-2">
                          <label>{t('Release Year')}</label>
                          <div className="reg-inspec-search-filter-item-2-dates">
                              <label>{t('From')}: </label>
                              <input
                                  type="number"
                                  className="reg-inspec-search-bar"
                                  value={searchReleaseDateMin}
                                  onChange={(e) => setSearchReleaseDateMin(e.target.value)}
                                  min="1900"
                                  max="2099"
                                  step="1"
                              />
                              <label>{t('To')}: </label>
                              <input
                                  type="number"
                                  className="reg-inspec-search-bar"
                                  value={searchReleaseDateMax}
                                  onChange={(e) => setSearchReleaseDateMax(e.target.value)}
                                  min="1900"
                                  max="2099"
                                  step="1"
                              />
                          </div>
                      </div>
                      <div className="reg-inspec-search-filter-item-2">
                          <label>{t('Odometer')}</label>
                          <div className="reg-inspec-search-filter-item-2-dates">
                              <label>{t('From')}: </label>
                              <input
                                  type="number"
                                  className="reg-inspec-search-bar"
                                  value={searchOdometerMin}
                                  onChange={(e) => setSearchOdometerMin(e.target.value)}
                                  min="0"
                              />
                              <label>{t('To')}: </label>
                              <input
                                  type="number"
                                  className="reg-inspec-search-bar"
                                  value={searchOdometerMax}
                                  onChange={(e) => setSearchOdometerMax(e.target.value)}
                                  min="0"
                              />
                          </div>
                      </div>
                  </div>
                  <div className="reg-inspec-search-filter-container-2">
                      <div className="reg-inspec-search-filter-item">
                          <label>{t('Car ID')}</label>
                          <input
                              type="text"
                              className="reg-inspec-search-bar"
                              placeholder={t('Search by Car ID')}
                              value={searchVin}
                              onChange={(e) => setSearchVin(e.target.value)}
                          />
                      </div>
                      <div className="reg-inspec-search-filter-item">
                          <label>{t('Manufacturer')}(WIP)</label>
                          <input
                              type="text"
                              className="reg-inspec-search-bar"
                              placeholder={t('Search by Manufacturer Name')}
                              value={searchManufacturer}
                              onChange={(e) => setSearchManufacturer(e.target.value)}
                          />
                      </div>
                      <div className="reg-inspec-search-filter-item">
                          <label>{t('Car Model')}(WIP)</label>
                          <input
                              type="text"
                              className="reg-inspec-search-bar"
                              placeholder={t('Search by Car Model')}
                              value={searchModel}
                              onChange={(e) => setSearchModel(e.target.value)}
                          />
                      </div>
                  </div>
              </div>
              <div className="reg-inspec-search-filter-item-4">
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
          <table className="manu-car-table">
              <thead>
                  <tr>
                      <th>{t('VIN')}</th>
                      <th>{t('Manufacturer Name')}</th>
                      <th>{t('Model ID')}</th>
                      <th>{t('Odometer')}</th>
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
                              <button onClick={fetchData} className="manu-car-retry-btn">{t('Retry')}</button>
                          </td>
                      </tr>
                  ) : carList.length > 0 ? (
                      carList.map((model: Car, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditCar(model) }}>{model.vinId}</td>
                              <td>{model.model?.manufacturerName}</td>
                              <td>{model.modelId}</td>
                              <td>{model.currentOdometer}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>{t('No cars found')}</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {showModal && (
              <div className="manu-car-modal">
                  <div className="manu-car-modal-content">
                      <span className="manu-car-close-btn" onClick={() => {
                          setShowModal(false); setModalPage(1); setBrandNewCar(false); setOldCarVin(''); setNewCar({
                              vinId: '',
                              color: 0,
                              currentOdometer: 0,
                              engineNumber: '',
                              isCommercialUse: false,
                              isModified: false,
                              modelId: ''
                          }) }}>&times;</span>
                      <h2>{t('Add Car To Storage')}</h2>
                          <div className="manu-new-car-check">
                              <label>{t('Brand New Car')}?</label>
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
                              {adding ? (<div className="manu-car-inline-spinner"></div>) : (
                                  <>
                                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="manu-car-prev-btn">
                                          {t('Previous')}
                                      </button>
                                      <button onClick={handleNextPage} disabled={adding} className="manu-car-next-btn">
                                          {modalPage < 2 ? t('Next') : t('Finish')}
                                      </button>
                                  </>
                              )}
                              {addError && (
                                  <p className="manu-car-error">{addError}</p>
                              )}
                          </>
                      ) : (
                              <>
                                  <div className="ad-car-form-columns">
                                      <div className="ad-car-form-column">
                                          <label>{t('VIN')}</label>
                                          <input type="text" name="oldCarVin" value={oldCarVin} onChange={handleOldCarVinChange} />
                                      </div>
                                  
                                  <button onClick={handleAddOldCar} disabled={adding} className="manu-car-add-btn">
                                      {adding ? (<div className="manu-car-inline-spinner"></div>) : t('Finish')}
                                  </button>
                                  {addError && (
                                      <p className="manu-car-error">{addError}</p>
                                      )}
                                  </div>
                              </>
                      )}
                  </div>
              </div>
          )}
          {editCar && (
              <div className="manu-car-modal">
                  <div className="manu-car-modal-content">
                      <span className="manu-car-close-btn" onClick={() => { setEditCar(null); setModalPage(1) }}>&times;</span>
                      <h2>{t('Edit Car')}</h2>
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
                      {adding ? (<div className="manu-car-inline-spinner"></div>) : (
                          <>
                              <button onClick={handlePreviousPage} disabled={modalPage === 1} className="manu-car-prev-btn">
                                  {t('Previous')}
                              </button>
                              <button onClick={handleNextPage} disabled={adding} className="manu-car-next-btn">
                                  {modalPage < 2 ? t('Next') : t('Finish')}
                              </button>
                          </>
                      )}
                      {addError && (
                          <p className="manu-car-model-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {paging && paging.TotalPages > 0 &&
              <>
                  <Pagination count={paging.TotalPages} onChange={(e, value) => setPage(value)} />
              </>
          }
      </div>
  );
}

export default CarDealerCarStorage;