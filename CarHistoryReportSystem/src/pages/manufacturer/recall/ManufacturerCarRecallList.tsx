import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ListManufacturerRecalls } from '../../../services/api/Recall';
import { RootState } from '../../../store/State';
import { APIResponse, CarModel, CarRecalls } from '../../../utils/Interfaces';
import { JWTDecoder } from '../../../utils/JWTDecoder';

function ManufacturerCarRecallList() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const dataProviderId = JWTDecoder(token).dataprovider 
    const [carModels, setCarModels] = useState([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalPage, setModalPage] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editRecall, setEditRecall] = useState<CarRecalls | null>(null)
    const manufacturerId = JWTDecoder(token).dataprovider
    const [newRecall, setNewRecall] = useState<CarRecalls>({
        modelId: "",
        description: ""
    })

    const validateCarModel = (Recall: CarRecalls): boolean => {
        if (!Recall.modelId) {
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
        if (editRecall) {
            setEditRecall({
                ...editRecall,
                [e.target.name]: e.target.value
            })
        } else {
            setNewRecall({
                ...newRecall,
                [e.target.name]: e.target.value,
            });
        }
    };
    const handleNextPage = () => {
        if (modalPage < 4) {
            setModalPage(prevPage => prevPage + 1);
        } else {
            if (editRecall) handleEditModel();
            else handleAddModel();
        }
    };

    const handlePreviousPage = () => {
        if (modalPage > 1) {
            setModalPage(prevPage => prevPage - 1);
        }
    };

    const handleAddModel = async () => {
        //if (validateCarModel(newRecall)) {
        //    setAdding(true);
        //    setAddError(null);
        //    const response: APIResponse = await AddCarModel(newRecall, token);
        //    setAdding(false);
        //    if (response.error) {
        //        setAddError(response.error);
        //    } else {
        //        setShowModal(false);
        //        setModalPage(1);
        //        fetchData();
        //    }
        //}
    };
    //TODO: car recall
    function handleRecallClick(model: any): void {
        throw new Error('Function not implemented.');
    }

    const handleEditModel = async () => {
        //if (editRecall != null && validateCarModel(editRecall)) {
        //    setAdding(true);
        //    setAddError(null);
        //    const response: APIResponse = await EditCarModel(editRecall, token);
        //    setAdding(false);
        //    if (response.error) {
        //        setAddError(response.error);
        //    } else {
        //        setShowModal(false);
        //        setEditModel(null);
        //        setModalPage(1);
        //        fetchData();
        //    }
        //}
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carModelResponse: APIResponse = await ListManufacturerRecalls(manufacturerId, token)
        if (carModelResponse.error) {
            setError(carModelResponse.error)
        } else {
            setCarModels(carModelResponse.data)
        }
        setLoading(false)
    };
    useEffect(() => {
        fetchData()
    }, [])

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
                      <th>ModelID</th>
                      <th>Description</th>
                      <th>Date</th>
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
                              <td onClick={() => { setEditRecall(model) }}>{model.id}</td>
                              <td>{model.modelId}</td>
                              <td>{model.description}</td>
                              <td>{model.recallDate}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5}>No Recalls found</td>
                      </tr>
                  )}
              </tbody>
          </table>
          {/*Pop-up add window*/}
          {/*{showModal && (*/}
          {/*    <div className="manu-car-model-modal">*/}
          {/*        <div className="manu-car-model-modal-content">*/}
          {/*            <span className="manu-car-model-close-btn" onClick={() => { setShowModal(false); setModalPage(1) }}>&times;</span>*/}
          {/*            <h2>Add Car Model</h2>*/}
          {/*            {modalPage === 1 && (*/}
          {/*                <CarModelModalIdentificationPage*/}
          {/*                    action="Add"*/}
          {/*                    model={newModel}*/}
          {/*                    handleInputChange={handleInputChange}*/}
          {/*                />*/}
          {/*            )}*/}
          {/*            {modalPage === 2 && (*/}
          {/*                <CarModelModalPhysCharacteristicPage*/}
          {/*                    model={newModel}*/}
          {/*                    handleInputChange={handleInputChange}*/}
          {/*                />*/}
          {/*            )}*/}
          {/*            {modalPage === 3 && (*/}
          {/*                <CarModelModalEnginePage*/}
          {/*                    model={newModel}*/}
          {/*                    handleInputChange={handleInputChange}*/}
          {/*                />*/}
          {/*            )}*/}
          {/*            {modalPage === 4 && (*/}
          {/*                <CarModelCapacityPage*/}
          {/*                    model={newModel}*/}
          {/*                    handleInputChange={handleInputChange}*/}
          {/*                />*/}
          {/*            )}*/}
          {/*            <button onClick={handlePreviousPage} disabled={modalPage === 1} className="manu-car-model-prev-btn">*/}
          {/*                Previous*/}
          {/*            </button>*/}
          {/*            <button onClick={handleNextPage} disabled={adding} className="manu-car-model-next-btn">*/}
          {/*                {modalPage < 4 ? 'Next' : (adding ? (<div className="manu-car-model-inline-spinner"></div>) : 'Add')}*/}
          {/*            </button>*/}
          {/*            {addError && (*/}
          {/*                <p className="manu-car-model-error">{addError}</p>*/}
          {/*            )}*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*)}*/}
          {/*{editModel && (*/}
          {/*    <div className="manu-car-model-modal">*/}
          {/*        <div className="manu-car-model-modal-content">*/}
          {/*            <span className="manu-car-model-close-btn" onClick={() => { setEditModel(null); setModalPage(1) }}>&times;</span>*/}
          {/*            <h2>Edit Car Model</h2>*/}
          {/*            {modalPage === 1 && (*/}
          {/*                <CarModelModalIdentificationPage*/}
          {/*                    action="Edit"*/}
          {/*                    model={editModel}*/}
          {/*                    handleInputChange={handleInputChange}*/}
          {/*                />*/}
          {/*            )}*/}
          {/*            {modalPage === 2 && (*/}
          {/*                <CarModelModalPhysCharacteristicPage*/}
          {/*                    model={editModel}*/}
          {/*                    handleInputChange={handleInputChange}*/}
          {/*                />*/}
          {/*            )}*/}
          {/*            {modalPage === 3 && (*/}
          {/*                <CarModelModalEnginePage*/}
          {/*                    model={editModel}*/}
          {/*                    handleInputChange={handleInputChange}*/}
          {/*                />*/}
          {/*            )}*/}
          {/*            {modalPage === 4 && (*/}
          {/*                <CarModelCapacityPage*/}
          {/*                    model={editModel}*/}
          {/*                    handleInputChange={handleInputChange}*/}
          {/*                />*/}
          {/*            )}*/}
          {/*            <button onClick={handlePreviousPage} disabled={modalPage === 1} className="manu-car-model-prev-btn">*/}
          {/*                Previous*/}
          {/*            </button>*/}
          {/*            <button onClick={handleNextPage} disabled={adding} className="manu-car-model-next-btn">*/}
          {/*                {modalPage < 4 ? 'Next' : (adding ? (<div className="manu-car-model-inline-spinner"></div>) : 'Update')}*/}
          {/*            </button>*/}
          {/*            {addError && (*/}
          {/*                <p className="manu-car-model-error">{addError}</p>*/}
          {/*            )}*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*)}*/}
      </div>
  );
}

export default ManufacturerCarRecallList;