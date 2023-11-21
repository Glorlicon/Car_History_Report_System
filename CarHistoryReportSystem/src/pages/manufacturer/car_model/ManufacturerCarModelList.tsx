import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CarModelCapacityPage from '../../../components/forms/manufacturer/CarModel/CarModelCapacityPage';
import CarModelModalEnginePage from '../../../components/forms/manufacturer/CarModel/CarModelModalEnginePage';
import CarModelModalIdentificationPage from '../../../components/forms/manufacturer/CarModel/CarModelModalIdentificationPage';
import CarModelModalPhysCharacteristicPage from '../../../components/forms/manufacturer/CarModel/CarModelModalPhysCharacteristicPage';
import { AddCarModel, EditCarModel, ListManufaturerCarModels } from '../../../services/api/CarModel';
import { RootState } from '../../../store/State';
import { APIResponse, CarModel, CarRecalls } from '../../../utils/Interfaces';
import { JWTDecoder } from '../../../utils/JWTDecoder';
import '../../../styles/ManufacturerCarModels.css'
import { AddCarRecall } from '../../../services/api/Recall';
import CarRecallEditModal from '../../../components/forms/manufacturer/Recall/CarRecallEditModal';

function ManufacturerCarModelList() {
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
        tireNumber: 0
    })
    const [newRecall, setNewRecall] = useState<CarRecalls>({
        modelId: "",
        description: "",
        recallDate: new Date()
    })

    const validateCarModel = (model: CarModel): boolean => {
        if (!model.modelID) {
            setAddError("Model ID must be filled out");
            return false;
        }
        return true;
    };

    const validateCarRecall = (model: CarRecalls | null): boolean => {
        if (!model?.modelId) {
            setAddError("Model ID must be filled out");
            return false;
        }
        return true;
    };

    const filteredCarModels = carModels.filter((models: any) => {
        const matchingQuery = models.modelID.toLowerCase().includes(searchQuery.toLowerCase())
        return matchingQuery
    })

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editModel) {
            setEditModel({
                ...editModel,
                [e.target.name]: e.target.value,
            })
            console.log(editModel);
        } else if (addRecalModel) {
            setAddRecallModel({
                ...addRecalModel,
                [e.target.name]: e.target.value,
            });
            console.log(addRecalModel);
        }
        else {
            setNewModel({
                ...newModel,
                [e.target.name]: e.target.value,
            });
        }
    };
    const handleNextPage = () => {
        if (modalPage < 4) {
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
            const response: APIResponse = await AddCarModel(newModel, token);
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
            const response: APIResponse = await EditCarModel(editModel, token);
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
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carModelResponse: APIResponse = await ListManufaturerCarModels(manufacturerId,token)
        if (carModelResponse.error) {
            setError(carModelResponse.error)
        } else {
            setCarModels(carModelResponse.data)
        }
        setLoading(false)
    };
    useEffect(() => {
        fetchData()
    },[])

  return (
      <div className="manu-car-model-list-page">
          <div className="manu-car-model-top-bar">
              <button className="add-manu-car-model-btn" onClick={() => setShowModal(true)}>+ Add Car Model</button>
              <div className="manu-car-model-search-filter-container">
                  <input
                      type="text"
                      className="manu-car-model-search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
              </div>
          </div>
          <table className="manu-car-model-table">
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Released Date</th>
                      <th>Country</th>
                      <th>Action</th>
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
                              <button onClick={fetchData} className="manu-car-model-retry-btn">Retry</button>
                          </td>
                      </tr>
                  ) : filteredCarModels.length > 0 ? (
                      filteredCarModels.map((model: any, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditModel(model)}}>{model.modelID}</td>
                              <td>{model.releasedDate}</td>
                              <td>{model.country}</td>
                              <td>
                                  <button className="manu-car-model-recall-btn" onClick={() => setAddRecallModel({
                                      modelId: model.modelID,
                                      description: '',
                                      recallDate: new Date()
                                  })}>Create Recall</button>
                              </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>No car models found</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {/*Pop-up add window*/}
          {showModal && (
              <div className="manu-car-model-modal">
                  <div className="manu-car-model-modal-content">
                      <span className="manu-car-model-close-btn" onClick={() => { setShowModal(false); setModalPage(1) }}>&times;</span>
                      <h2>Add Car Model</h2>
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
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="manu-car-model-prev-btn">
                          Previous
                      </button>
                      <button onClick={handleNextPage} disabled={adding} className="manu-car-model-next-btn">
                          {modalPage < 4 ? 'Next' : (adding ? (<div className="manu-car-model-inline-spinner"></div>) : 'Add')}
                      </button>
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
                      <h2>Edit Car Model</h2>
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
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="manu-car-model-prev-btn">
                          Previous
                      </button>
                      <button onClick={handleNextPage} disabled={adding} className="manu-car-model-next-btn">
                          {modalPage < 4 ? 'Next' : (adding ? (<div className="manu-car-model-inline-spinner"></div>) : 'Update')}
                      </button>
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
      </div>
  );
}

export default ManufacturerCarModelList;