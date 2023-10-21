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
import { APIResponse, CarModel } from '../../../utils/Interfaces';
import '../../../styles/AdminCarModels.css'

function AdminCarModelList() {
    //TODO: add case for new manufacturer
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
        tireNumber: 0
    })

    const filteredCarModels = carModels.filter((models: any) => {
        const matchingQuery = models.modelID.toLowerCase().includes(searchQuery.toLowerCase())
        return matchingQuery
    })

    const validateCarModel = (model: CarModel): boolean => {
        console.log(model)
        if (!model.modelID) {
            setAddError("Model ID must be filled out");
            return false;
        }
        if (model.manufacturerId <= 0) {
            setAddError("Manufacturer must be chosen");
            return false;
        }
        return true;
    };

    const handleNextPage = () => {
        if (modalPage < 4) {
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

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
        const manuListResponse: APIResponse = await List(token);
        if (manuListResponse.error) {
            setError(manuListResponse.error);
        } else {
            setManufacturers(manuListResponse.data)
            console.log(manuListResponse.data)
            const carModelResponse: APIResponse = await ListAdminCarModels(token)
            if (carModelResponse.error) {
                setError(carModelResponse.error)
            } else {
                console.log("Models",carModelResponse.data)
                setCarModels(carModelResponse.data)
            }
        }
        setLoading(false)
    };

    useEffect(() => {
        fetchData();
    }, []);
  return (
      <div className="ad-car-model-list-page">
          <div className="ad-car-model-top-bar">
              <button className="add-ad-car-model-btn" onClick={() => setShowModal(true)}>+ Add Car Model</button>
              <div className="ad-car-model-search-filter-container">
                  <input
                      type="text"
                      className="ad-car-model-search-bar"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                  />
              </div>
          </div>
          <table className="ad-car-model-table">
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Manufacturer Name</th>
                      <th>Released Date</th>
                      <th>Country</th>
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
                              <button onClick={fetchData} className="ad-car-model-retry-btn">Retry</button>
                          </td>
                      </tr>
                  ) : filteredCarModels.length > 0 ? (
                      filteredCarModels.map((model: any, index: number) => (
                          <tr key={index}>
                              <td onClick={() => { setEditModel(model); setCurrentId(model.id) }}>{model.modelID}</td>
                              <td>{model.manufacturerName}</td>
                              <td>{model.releasedDate}</td>
                              <td>{model.country}</td>
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
              <div className="ad-car-model-modal">
                  <div className="ad-car-model-modal-content">
                      <span className="ad-car-model-close-btn" onClick={() => { setShowModal(false); setModalPage(1)}}>&times;</span>
                      <h2>Add Car Model</h2>
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
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="ad-car-model-prev-btn">
                          Previous
                      </button>
                      <button onClick={handleNextPage} disabled={adding} className="ad-car-model-next-btn">
                          {modalPage < 4 ? 'Next' : (adding ? (<div className="ad-car-model-inline-spinner"></div>) : 'Add')}
                      </button>
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
                      <h2>Edit Car Model</h2>
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
                      <button onClick={handlePreviousPage} disabled={modalPage === 1} className="ad-car-model-prev-btn">
                          Previous
                      </button>
                      <button onClick={handleNextPage} disabled={adding} className="ad-car-model-next-btn">
                          {modalPage < 4 ? 'Next' : (adding ? (<div className="ad-car-model-inline-spinner"></div>) : 'Update')}
                      </button>
                      {addError && (
                          <p className="ad-car-model-error">{addError}</p>
                      )}
                  </div>
              </div>
          )}
      </div>
  );
}

export default AdminCarModelList;