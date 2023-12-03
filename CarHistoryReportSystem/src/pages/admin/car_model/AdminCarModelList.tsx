import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CarModelCapacityPage from '../../../components/forms/admin/CarModel/CarModelCapacityPage';
import CarModelModalEnginePage from '../../../components/forms/admin/CarModel/CarModelModalEnginePage';
import CarModelModalIdentificationPage from '../../../components/forms/admin/CarModel/CarModelModalIdentificationPage';
import CarModelModalPhysCharacteristicPage from '../../../components/forms/admin/CarModel/CarModelModalPhysCharacteristicPage';
import { AddCarModel, EditCarModel, ListAdminCarModels } from '../../../services/api/CarModel';
import { List } from '../../../services/api/DataProvider';
import { RootState } from '../../../store/State';
import { BODY_TYPES } from '../../../utils/const/BodyTypes';
import { FUEL_TYPES } from '../../../utils/const/FuelTypes';
import { APIResponse, CarModel, CarModelSearchParams, ManufacturerSearchParams, ModelMaintenance, Paging } from '../../../utils/Interfaces';
import '../../../styles/AdminCarModels.css'
import { useTranslation } from 'react-i18next';
import { Pagination } from '@mui/material';
import CarModelMaintenancePage from '../../../components/forms/admin/CarModel/CarModelMaintenancePage';

function AdminCarModelList() {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const [paging, setPaging] = useState<Paging>()
    const [resetTrigger, setResetTrigger] = useState(0);
    const [searchModelId, setSearchModelId] = useState('')
    const [searchReleasedDateStart, setSearchReleasedDateStart] = useState('')
    const [searchReleasedDateEnd, setSearchReleasedDateEnd] = useState('')
    const [searchManuName, setSearchManuName] = useState('')
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [manufacturers, setManufacturers] = useState([])
    const [currentId, setCurrentId] = useState<string>("")
    const [carModels, setCarModels] = useState([])
    const [error, setError] = useState<string | null>(null);
    const [newManu, setNewManu] = useState(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalPage, setModalPage] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editModel, setEditModel] = useState<CarModel | null>(null)
    const [newModel, setNewModel] = useState<CarModel>({
        modelID: "",
        manufacturerId: 0,
        manufacturerName: "",
        wheelFormula: "",
        wheelTread: "",
        dimension: "",
        wheelBase: 0,
        weight: 0,
        releasedDate: "",
        country: "",
        fuelType: 0,
        bodyType: 0,
        ridingCapacity: 0,
        personCarriedNumber: 0,
        seatNumber: 0,
        layingPlaceNumber: 0,
        maximumOutput: 0,
        engineDisplacement: 0,
        rpm: 0,
        tireNumber: 0,
        modelOdometers: [
            {
                dayPerMaintainance: 0,
                maintenancePart: 'BrakeInspection',
                odometerPerMaintainance: 0,
                recommendAction: 'Inspect Brake System'
            },
            {
                dayPerMaintainance: 0,
                maintenancePart: 'ChangePart',
                odometerPerMaintainance: 0,
                recommendAction: 'Change Car Part'
            },
            {
                dayPerMaintainance: 0,
                maintenancePart: 'OilChange',
                odometerPerMaintainance: 0,
                recommendAction: 'Change Oil'
            },
            {
                dayPerMaintainance: 0,
                maintenancePart: 'RepairCarRecall',
                odometerPerMaintainance: 0,
                recommendAction: 'Repair Car Recall'
            },
            {
                dayPerMaintainance: 0,
                maintenancePart: 'TireRotation',
                odometerPerMaintainance: 0,
                recommendAction: 'Rotate Tire'
            }
        ]
    })


    const validateCarModel = (model: CarModel): boolean => {
        if (!model.modelID) {
            setAddError(t('Model ID must be filled out'));
            return false;
        }
        if (model.manufacturerId <= 0) {
            setAddError(t('Manufacturer must be chosen'));
            return false;
        }
        if (model.fuelType < 0) {
            setAddError(t('Fuel Type must be chosen'));
            return false;
        }
        if (model.bodyType < 0) {
            setAddError(t('Body Type must be chosen'));
            return false;
        }
        if (!model.country) {
            setAddError(t('Country must be filled out'));
            return false;
        }
        if (!model.releasedDate) {
            setAddError(t('Released Date must be chosen'));
            return false;
        }
        for (let i = 0; i < model.modelOdometers.length; i++) {
            const check = validateCarMaintenanceDetails(model.modelOdometers[i])
            if (!check) return false
        }
        return true;
    };

    const validateCarMaintenanceDetails = (detail: ModelMaintenance): boolean => {
        if (detail.dayPerMaintainance <= 0) {
            setAddError(t('Day Per Maintainance must be higher than 0'));
            return false;
        }
        if (detail.odometerPerMaintainance <= 0) {
            setAddError(t('Odometer Per Maintainance must be higher than 0'));
            return false;
        }

        return true
    }

    const handleNextPage = () => {
        if (modalPage < 5) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editModel) handleEditModel();
            else handleAddModel();
        }
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };

    const handleChangeDayPerMaintainance = (index: number, value: string) => {
        if (editModel) {
            setEditModel({
                ...editModel,
                modelOdometers: editModel.modelOdometers
                    .map((detail: ModelMaintenance, i) => i === index ? { ...detail, dayPerMaintainance: Number.parseInt(value) } : detail)
            })
        } else {
            setNewModel({
                ...newModel,
                modelOdometers: newModel.modelOdometers
                    .map((detail: ModelMaintenance, i) => i === index ? { ...detail, dayPerMaintainance: Number.parseInt(value) } : detail)
            })
        }
    }
    const handleChangeOdometerPerMaintainance = (index: number, value: string) => {
        if (editModel) {
            setEditModel({
                ...editModel,
                modelOdometers: editModel.modelOdometers
                    .map((detail: ModelMaintenance, i) => i === index ? { ...detail, odometerPerMaintainance: Number.parseInt(value) } : detail)
            })
        } else {
            setNewModel({
                ...newModel,
                modelOdometers: newModel.modelOdometers
                    .map((detail: ModelMaintenance, i) => i === index ? { ...detail, odometerPerMaintainance: Number.parseInt(value) } : detail)
            })
        }
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editModel) {
            setEditModel({
                ...editModel,
                [e.target.name]: e.target.value
            })
        } else {
            setNewModel({
                ...newModel,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleAddModel = async () => {
        if (validateCarModel(newModel)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await AddCarModel(newModel, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setModalPage(1);
                fetchData();
            }
        }
    };

    const handleEditModel = async () => {
        if (editModel != null && validateCarModel(editModel)) {
            setAdding(true);
            setAddError(null);
            let connectAPIError = t('Cannot connect to API! Please try again later')
            let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
            const response: APIResponse = await EditCarModel(editModel, token, connectAPIError, language);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditModel(null);
                setModalPage(1);
                fetchData();
            }
        }
    };
    const handleResetFilters = () => {
        setSearchManuName('')
        setSearchModelId('')
        setSearchReleasedDateEnd('')
        setSearchReleasedDateStart('')
        setResetTrigger(prev => prev + 1);
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        let connectAPIError = t('Cannot connect to API! Please try again later')
        let unknownError = t('Something went wrong. Please try again')
        let language = currentLanguage === 'vn' ? 'vi-VN,vn;' : 'en-US,en;'
        let searchParams: CarModelSearchParams = {
            manuName: searchManuName,
            modelId: searchModelId,
            releasedDateEnd: searchReleasedDateEnd,
            releasedDateStart: searchReleasedDateStart
        }
        let searchManuParams: ManufacturerSearchParams = {
            name: '',
            email: ''
        }
        const manuListResponse: APIResponse = await List(token, 1, connectAPIError, unknownError, language, searchManuParams);
        if (manuListResponse.error) {
            setError(manuListResponse.error);
        } else {
            setManufacturers(manuListResponse.data)
            const carModelResponse: APIResponse = await ListAdminCarModels(token, page, connectAPIError, unknownError, language, searchParams)
            if (carModelResponse.error) {
                setError(carModelResponse.error)
            } else {
                setCarModels(carModelResponse.data)
                setPaging(carModelResponse.pages)
            }
        }
        setLoading(false)
    };

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
      <div className="ad-car-model-list-page">
          <div className="ad-car-model-top-bar">
              <button className="add-ad-car-model-btn" onClick={() => setShowModal(true)}>+ {t('Add Car Model')}</button>
          </div>
          <div className="pol-crash-top-bar">
              <div className="reg-inspec-search-filter-container">
                  <div className="reg-inspec-search-filter-item">
                      <label>{t('Model ID')}</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Model ID')}
                          value={searchModelId}
                          onChange={(e) => setSearchModelId(e.target.value)}
                      />
                  </div>
                  <div className="reg-inspec-search-filter-item">
                      <label>{t('Manufacturer Name')}</label>
                      <input
                          type="text"
                          className="reg-inspec-search-bar"
                          placeholder={t('Search by Manufacturer Name')}
                          value={searchManuName}
                          onChange={(e) => setSearchManuName(e.target.value)}
                      />
                  </div>
                  <div className="reg-inspec-search-filter-item-2">
                      <label>{t('Released Date')}</label>
                      <div className="reg-inspec-search-filter-item-2-dates">
                          <label>{t('From')}: </label>
                          <input
                              type="date"
                              className="reg-inspec-search-bar"
                              value={searchReleasedDateStart}
                              onChange={(e) => setSearchReleasedDateStart(e.target.value)}
                          />
                          <label>{t('To')}: </label>
                          <input
                              type="date"
                              className="reg-inspec-search-bar"
                              value={searchReleasedDateEnd}
                              onChange={(e) => setSearchReleasedDateEnd(e.target.value)}
                          />
                      </div>
                  </div>
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
          <table className="ad-car-model-table">
              <thead>
                  <tr>
                      <th>{t('Model ID')}</th>
                      <th>{t('Manufacturer Name')}</th>
                      <th>{t('Released Date')}</th>
                      <th>{t('Country')}</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              <div className="ad-car-model-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                              <button onClick={fetchData} className="ad-car-model-retry-btn">{t('Retry')}</button>
                          </td>
                      </tr>
                  ) : carModels.length > 0 ? (
                      carModels.map((model: any, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditModel(model); setCurrentId(model.id) }}>{model.modelID}</td>
                              <td>{model.manufacturerName}</td>
                              <td>{model.releasedDate}</td>
                              <td>{model.country}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>{t('No car models found')}</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {/*Pop-up add window*/}
          {showModal && (
              <div className="ad-car-model-modal">
                  <div className="ad-car-model-modal-content">
                      <span className="ad-car-model-close-btn" onClick={() => {
                          setShowModal(false); setModalPage(1); setNewModel({
                              modelID: "",
                              manufacturerId: 0,
                              manufacturerName: "",
                              wheelFormula: "",
                              wheelTread: "",
                              dimension: "",
                              wheelBase: 0,
                              weight: 0,
                              releasedDate: "",
                              country: "",
                              fuelType: 0,
                              bodyType: 0,
                              ridingCapacity: 0,
                              personCarriedNumber: 0,
                              seatNumber: 0,
                              layingPlaceNumber: 0,
                              maximumOutput: 0,
                              engineDisplacement: 0,
                              rpm: 0,
                              tireNumber: 0,
                              modelOdometers: [
                                  {
                                      dayPerMaintainance: 0,
                                      maintenancePart: 'BrakeInspection',
                                      odometerPerMaintainance: 0,
                                      recommendAction: 'Inspect Brake System'
                                  },
                                  {
                                      dayPerMaintainance: 0,
                                      maintenancePart: 'ChangePart',
                                      odometerPerMaintainance: 0,
                                      recommendAction: 'Change Car Part'
                                  },
                                  {
                                      dayPerMaintainance: 0,
                                      maintenancePart: 'OilChange',
                                      odometerPerMaintainance: 0,
                                      recommendAction: 'Change Oil'
                                  },
                                  {
                                      dayPerMaintainance: 0,
                                      maintenancePart: 'RepairCarRecall',
                                      odometerPerMaintainance: 0,
                                      recommendAction: 'Repair Car Recall'
                                  },
                                  {
                                      dayPerMaintainance: 0,
                                      maintenancePart: 'TireRotation',
                                      odometerPerMaintainance: 0,
                                      recommendAction: 'Rotate Tire'
                                  }
                              ]
                          }) }}>&times;</span>
                      <h2>{t('Add Car Model')}</h2>
                      {modalPage === 1 && (
                          <CarModelModalIdentificationPage
                                  action="Add"
                                  model={newModel}
                                  manufacturers={manufacturers}
                                  handleInputChange={handleInputChange}
                                />
                          )}
                      {modalPage === 2 && (
                              <CarModelModalPhysCharacteristicPage
                                  model={newModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                      {modalPage === 3 && (
                              <CarModelModalEnginePage
                                  model={newModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                      {modalPage === 4 && (
                              <CarModelCapacityPage
                                  model={newModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                      {modalPage === 5 && (
                          <CarModelMaintenancePage
                              model={newModel}
                              handleChangeDayPerMaintainance={handleChangeDayPerMaintainance}
                              handleChangeOdometerPerMaintainance={handleChangeOdometerPerMaintainance}
                          />
                      )}
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="ad-car-model-prev-btn">
                          {t('Previous')}
                      </button>
                      {adding ? (<div className="ad-car-model-inline-spinner"></div>) : (
                          <>
                              <button onClick={handleNextPage} disabled={adding} className="ad-car-model-next-btn">
                                  {modalPage < 5 ? t('Next') : t('Finish')}
                              </button>
                          </>
                      )}
                      {addError && (
                          <p className="ad-car-model-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editModel && (
              <div className="ad-car-model-modal">
                  <div className="ad-car-model-modal-content">
                      <span className="ad-car-model-close-btn" onClick={() => { setEditModel(null); setModalPage(1)}}>&times;</span>
                      <h2>{t('Edit Car Model')}</h2>
                      {modalPage === 1 && (
                              <CarModelModalIdentificationPage
                                  action="Edit"
                                  model={editModel}
                                  manufacturers={manufacturers}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                      {modalPage === 2 && (
                              <CarModelModalPhysCharacteristicPage
                                  model={editModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                      {modalPage === 3 && (
                              <CarModelModalEnginePage
                                  model={editModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                      {modalPage === 4 && (
                              <CarModelCapacityPage
                                  model={editModel}
                                  handleInputChange={handleInputChange}
                              />
                          )}
                      {modalPage === 5 && (
                          <CarModelMaintenancePage
                              model={editModel}
                              handleChangeDayPerMaintainance={handleChangeDayPerMaintainance}
                              handleChangeOdometerPerMaintainance={handleChangeOdometerPerMaintainance}
                          />
                      )

                      }
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="ad-car-model-prev-btn">
                          {t('Previous')}
                      </button>
                      {adding ? (<div className="ad-car-model-inline-spinner"></div>) : (
                          <>
                              <button onClick={handleNextPage} disabled={adding} className="ad-car-model-next-btn">
                                  {modalPage < 4 ? t('Next') : t('Finish')}
                              </button>
                          </>
                      )}
                      {addError && (
                          <p className="ad-car-model-error">{addError}</p>
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

export default AdminCarModelList;