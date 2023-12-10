import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CarModelCapacityPage from '../../../components/forms/manufacturer/CarModel/CarModelCapacityPage';
import CarModelModalEnginePage from '../../../components/forms/manufacturer/CarModel/CarModelModalEnginePage';
import CarModelModalIdentificationPage from '../../../components/forms/manufacturer/CarModel/CarModelModalIdentificationPage';
import CarModelModalPhysCharacteristicPage from '../../../components/forms/manufacturer/CarModel/CarModelModalPhysCharacteristicPage';
import { AddCarModel, EditCarModel, ListManufaturerCarModels } from '../../../services/api/CarModel';
import { RootState } from '../../../store/State';
import { APIResponse, CarModel, CarModelSearchParams, CarRecalls, ModelMaintenance, Paging } from '../../../utils/Interfaces';
import { JWTDecoder } from '../../../utils/JWTDecoder';
import '../../../styles/ManufacturerCarModels.css'
import { AddCarRecall } from '../../../services/api/Recall';
import CarRecallEditModal from '../../../components/forms/manufacturer/Recall/CarRecallEditModal';
import { useTranslation } from 'react-i18next';
import CarModelMaintenancePage from '../../../components/forms/manufacturer/CarModel/CarModelMaintenancePage';
import { Pagination } from '@mui/material';

function ManufacturerCarModelList() {
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
    const [carModels, setCarModels] = useState([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalPage, setModalPage] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editModel, setEditModel] = useState<CarModel | null>(null)
    const [addRecalModel, setAddRecallModel] = useState<CarRecalls | null>(null)
    const manufacturerId = JWTDecoder(token).dataprovider
    const [newModel, setNewModel] = useState<CarModel>({
        modelID: "",
        manufacturerId: manufacturerId,
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
    const [newRecall, setNewRecall] = useState<CarRecalls>({
        modelId: "",
        description: "",
        recallDate: new Date()
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

    const validateCarRecall = (model: CarRecalls | null): boolean => {
        if (!model?.modelId) {
            setAddError("Model ID must be filled out");
            return false;
        }
        return true;
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editModel) {
            setEditModel({
                ...editModel,
                [e.target.name]: e.target.value,
            })
        } else if (addRecalModel) {
            setAddRecallModel({
                ...addRecalModel,
                [e.target.name]: e.target.value,
            });
        }
        else {
            setNewModel({
                ...newModel,
                [e.target.name]: e.target.value,
            });
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
    const handleNextPage = () => {
        if (modalPage < 5) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editModel) handleEditModel();
            else if (addRecalModel) handleRecallClick();
            else handleAddModel();
        }
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
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
    //TODO: car recall
    const handleRecallClick = async () => {
        if (addRecalModel != null && validateCarRecall(addRecalModel)) {
            setAdding(true);
            setAddError(null);
            console.log("submitted:", addRecalModel);
            const response: APIResponse = await AddCarRecall(addRecalModel, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setAddRecallModel(null);
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
        const carModelResponse: APIResponse = await ListManufaturerCarModels(manufacturerId, token, page, connectAPIError, unknownError, language, searchParams)
        if (carModelResponse.error) {
            setError(carModelResponse.error)
        } else {
            setCarModels(carModelResponse.data)
            setPaging(carModelResponse.pages)
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
      <div className="manu-car-model-list-page">
          <div className="manu-car-model-top-bar">
              <button className="add-manu-car-model-btn" onClick={() => setShowModal(true)}>+ {t('Add Car Model')}</button>
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
          <table className="manu-car-model-table">
              <thead>
                  <tr>
                      <th>{t('Model ID')}</th>
                      <th>{t('Manufacturer Name')}</th>
                      <th>{t('Released Date')}</th>
                      <th>{t('Country')}</th>
                      <th>{t('Action')}</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              <div className="manu-car-model-spinner"></div>
                          </td>
                      </tr>
                  ) : error ? (
                      <tr>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                              {error}
                              <button onClick={fetchData} className="manu-car-model-retry-btn">{t('Retry')}</button>
                          </td>
                      </tr>
                  ) : carModels.length > 0 ? (
                      carModels.map((model: any, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditModel(model) }}>{model.modelID}</td>
                              <td>{model.manufacturerName}</td>
                              <td>{model.releasedDate}</td>
                              <td>{model.country}</td>
                              <td>
                                  <button className="manu-car-model-recall-btn" onClick={() => setAddRecallModel({
                                      modelId: model.modelID,
                                      description: '',
                                      recallDate: new Date()
                                  })}>{t('Create Recall')}</button>
                              </td>
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
              <div className="manu-car-model-modal">
                  <div className="manu-car-model-modal-content">
                      <span className="manu-car-model-close-btn" onClick={() => {
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
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="manu-car-model-prev-btn">
                          {t('Previous')}
                      </button>
                      {adding ? (<div className="manu-car-model-inline-spinner"></div>) : (
                          <>
                              <button onClick={handleNextPage} disabled={adding} className="manu-car-model-next-btn">
                                  {modalPage < 5 ? t('Next') : t('Finish')}
                              </button>
                          </>
                      )}
                      {addError && (
                          <p className="manu-car-model-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {editModel && (
              <div className="manu-car-model-modal">
                  <div className="manu-car-model-modal-content">
                      <span className="manu-car-model-close-btn" onClick={() => { setEditModel(null); setModalPage(1) }}>&times;</span>
                      <h2>{t('Edit Car Model')}</h2>
                      {modalPage === 1 && (
                          <CarModelModalIdentificationPage
                              action="Edit"
                              model={editModel}
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
                      )}
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="manu-car-model-prev-btn">
                          {t('Previous')}
                      </button>
                      {adding ? (<div className="manu-car-model-inline-spinner"></div>) : (
                          <>
                              <button onClick={handleNextPage} disabled={adding} className="manu-car-model-next-btn">
                                  {modalPage < 5 ? t('Next') : t('Finish')}
                              </button>
                          </>
                      )}
                      {addError && (
                          <p className="manu-car-model-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
          {addRecalModel && (
              <div className="manu-car-model-modal">
                  <div className="manu-car-model-modal-content">
                      <span className="manu-car-model-close-btn" onClick={() => { setAddRecallModel(null); setModalPage(1) }}>&times;</span>
                      <h2>Add Car Recall</h2>
                      {modalPage === 1 && (
                          <CarRecallEditModal
                              action="Add"
                              model={addRecalModel}
                              handleInputChange={handleInputChange}
                          />
                      )}
                      <button onClick={handleRecallClick} disabled={adding} className="manu-car-model-next-btn">
                          {modalPage < 1 ? 'Next' : (adding ? (<div className="manu-car-model-inline-spinner"></div>) : 'Create')}
                      </button>
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

export default ManufacturerCarModelList;