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
import { AddCarRecall, EditCarRecall, ListManufacturerRecalls } from '../../../services/api/Recall';
import CarRecallAddModal from '../../../components/forms/manufacturer/Recall/CarRecallAddModal';
import CarRecallEditModal from '../../../components/forms/manufacturer/Recall/CarRecallEditModal';

function ManufacturerCarRecallList() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [carRecalls, setcarRecalls] = useState([])
    const [error, setError] = useState<string | null>(null);
    const [modelList, setModelList] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalPage, setModalPage] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editRecalModel, setEditRecallModel] = useState<CarRecalls | null>(null)
    const manufacturerId = JWTDecoder(token).dataprovider
    console.log(manufacturerId);

    const [newRecall, setNewRecall] = useState<CarRecalls>({
        modelId: "",
        description: "",
        recallDate: new Date()
    })

    const validateCarRecall = (model: CarRecalls): boolean => {
        if (!model.modelId) {
            setAddError("Model ID must be filled out");
            return false;
        }
        return true;
    };

    const filteredcarRecalls = carRecalls.filter((models: any) => {
        const matchingQuery = models.modelId.toLowerCase().includes(searchQuery.toLowerCase())
        return matchingQuery
    })

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editRecalModel) {
            setEditRecallModel({
                ...editRecalModel,
                [e.target.name]: e.target.value,
            });
            console.log(editRecalModel);
        }
        else {
            setNewRecall({
                ...newRecall,
                [e.target.name]: e.target.value,
            });
            console.log(newRecall);
        }
    };

    //const handleAddModel = async () => {
    //    if (validateCarModel(newModel)) {
    //        setAdding(true);
    //        setAddError(null);
    //        const response: APIResponse = await AddCarModel(newModel, token);
    //        setAdding(false);
    //        if (response.error) {
    //            setAddError(response.error);
    //        } else {
    //            setShowModal(false);
    //            setModalPage(1);
    //            fetchData();
    //        }
    //    }
    //};
    ////TODO: car recall
    const handleRecallClick = async () => {
        if (newRecall != null && validateCarRecall(newRecall)) {
            setAdding(true);
            setAddError(null);
            const response: APIResponse = await AddCarRecall(newRecall, token);
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

    const handleRecallEdit = async () => {
        if (editRecalModel != null && validateCarRecall(editRecalModel)) {
            setAdding(true);
            setAddError(null);
            console.log("submitted edit ", editRecalModel);
            const response: APIResponse = await EditCarRecall(editRecalModel, token);
            setAdding(false);
            if (response.error) {
                setAddError(response.error);
            } else {
                setShowModal(false);
                setEditRecallModel(null);
                setModalPage(1);
                fetchData();
            }
        }
    };
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carRecallReponse: APIResponse = await ListManufacturerRecalls(manufacturerId, token)
        const carModelResponse: APIResponse = await ListManufaturerCarModels(manufacturerId, token)
        if (carRecallReponse.error) {
            setError(carRecallReponse.error)
        } else {
            setModelList(carModelResponse.data)
            setcarRecalls(carRecallReponse.data)
        }
        setLoading(false)
    };
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="manu-car-model-list-page">
            <div className="manu-car-model-top-bar">
                <button className="add-manu-car-model-btn" onClick={() => setShowModal(true)}>+ Add Car Recall</button>
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
                        <th>modelID</th>
                        <th>Description</th>
                        <th>Recall Date</th>
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
                        ) : filteredcarRecalls.length > 0 ? (
                                filteredcarRecalls.map((model: any, index: number) => (
                                    <tr key={index}>
                                <td onClick={() => { setEditRecallModel(model) }}>{model.modelId}</td>
                                <td>{model.description}</td>
                                <td>{model.recallDate}</td>
                                <td>
                                    {/*<button className="manu-car-model-recall-btn" onClick={() => setEditRecallModel({*/}
                                    {/*    modelId: model.modelID,*/}
                                    {/*    description: '',*/}
                                    {/*    recallDate: new Date()*/}
                                    {/*})}>Close Recall</button>*/}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No car Recalls found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showModal && (
                <div className="manu-car-model-modal">
                    <div className="manu-car-model-modal-content">
                        <span className="manu-car-model-close-btn" onClick={() => { setShowModal(false); setModalPage(1) }}>&times;</span>
                        <h2>Add Car Recall</h2>
                        {modalPage === 1 && (
                            <CarRecallAddModal
                                action="Add"
                                recall={newRecall}
                                models={modelList}
                                handleInputChange={handleInputChange}

                            />
                        )}
                        <button onClick={handleRecallClick} disabled={adding} className="manu-car-model-next-btn">
                            {modalPage < 1 ? 'Next' : (adding ? (<div className="manu-car-model-inline-spinner"></div>) : 'Add')}
                        </button>
                        {addError && (
                            <p className="manu-car-model-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
            {editRecalModel && (
                <div className="manu-car-model-modal">
                    <div className="manu-car-model-modal-content">
                        <span className="manu-car-model-close-btn" onClick={() => { setEditRecallModel(null); setModalPage(1) }}>&times;</span>
                        <h2>Add Car Recall</h2>
                        {modalPage === 1 && (
                            <CarRecallEditModal
                                action="Edit"
                                model={editRecalModel}
                                handleInputChange={handleInputChange}
                            />
                        )}
                        <button onClick={handleRecallEdit} disabled={adding} className="manu-car-model-next-btn">
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

export default ManufacturerCarRecallList;