import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { APIResponse, CarModel, CarRecalls, CarServices, Services } from '../../utils/Interfaces';
import { JWTDecoder } from '../../utils/JWTDecoder';
import '../../styles/ManufacturerCarModels.css'
import { AddCarRecall, EditCarRecall, ListManufacturerRecalls } from '../../services/api/Recall';
import CarRecallAddModal from '../../components/forms/manufacturer/Recall/CarRecallAddModal';
import CarRecallEditModal from '../../components/forms/manufacturer/Recall/CarRecallEditModal';
import { ListManufaturerCarModels } from '../../services/api/CarModel';
import { CreateServiceHistory, ListServices, ListServiceShopHistory } from '../../services/api/CarServiceHistory';
import CarServiceAddModal from '../../components/forms/carservice/CarServiceAddModal';
import { isValidVIN } from '../../utils/Validators';

function ServiceShopHistory() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [carServiceHistory, seCarServiceHistory] = useState([]);;
    /*const [carList, setCarList] = useState<Car[]>([]);*/
    const [services, setServices] = useState<Services[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [service, setService] = useState<string>('');
    const [modalPage, setModalPage] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editRecalModel, setEditRecallModel] = useState<CarRecalls | null>(null)
    const serviceShopId = JWTDecoder(token).dataprovider
    const [availableServices, setAvailableServices] = useState<Services[]>([])
    console.log(serviceShopId);

    const [newServiceHistory, setNewServiceHistory] = useState<CarServices>({
        carId: "",
        note: "",
        odometer: 0,
        otherServices: "",
        serviceTime: new Date(),
        reportDate: new Date(),
        services: 0,
        selectedServices:[]
    })

    const handleAddService = () => {
        const serviceValue = parseInt(service);
        if (service && !newServiceHistory?.selectedServices?.includes(serviceValue)) {
            setNewServiceHistory(prevState => ({
                ...prevState,
                selectedServices: [...prevState.selectedServices, serviceValue]
            }));
            // Remove the added service from the available services list
            setAvailableServices(prevServices => prevServices?.filter(s => s.value !== serviceValue));
        }
        setService('');
    };

    const handleRemoveService = (serviceValue: number) => {
        setNewServiceHistory(prevState => ({
            ...prevState,
            selectedServices: prevState.selectedServices.filter(s => s !== serviceValue)
        }));
        // Add the removed service back to the available services list and sort by value
        const removedService = services.find(s => s.value === serviceValue);
        if (removedService) {
            setAvailableServices(prevServices => {
                // Add the removed service back
                const updatedServices = [...prevServices, removedService];
                // Sort the updated services array by value
                return updatedServices.sort((a, b) => a.value - b.value);
            });
        }
    };
    const validateCarService = (service: CarServices): boolean => {
        if (!isValidVIN(service.carId as unknown as string)) {
            setAddError("VIN is invalid");
            return false;
        }
        if (!service.carId) {
            setAddError("VIN must be filled out");
            return false;
        }
        return true;
    };

    const filteredcarRecalls = carServiceHistory.filter((models: any) => {
        const matchingQuery = models.carId.toLowerCase().includes(searchQuery.toLowerCase())
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
            setNewServiceHistory({
                ...newServiceHistory,
                [e.target.name]: e.target.value,
            });
            console.log(newServiceHistory);
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
    const handleServiceClick = async () => {
        if (newServiceHistory != null && validateCarService(newServiceHistory)) {
            const totalServicesValue = newServiceHistory.selectedServices.reduce((total, currentValue) => {
                return total + currentValue;
            }, 0);

            // Set the services total before submitting
            const updatedServiceHistory = {
                ...newServiceHistory,
                services: totalServicesValue,
            };

            console.log("submited:", updatedServiceHistory);

            setAdding(true);
            setAddError(null);
            const response: APIResponse = await CreateServiceHistory(updatedServiceHistory, token);
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

    //const handleRecallEdit = async () => {
    //    if (editRecalModel != null && validateCarService(editRecalModel)) {
    //        setAdding(true);
    //        setAddError(null);
    //        console.log("submitted edit ", editRecalModel);
    //        const response: APIResponse = await EditCarRecall(editRecalModel, token);
    //        setAdding(false);
    //        if (response.error) {
    //            setAddError(response.error);
    //        } else {
    //            setShowModal(false);
    //            setEditRecallModel(null);
    //            setModalPage(1);
    //            fetchData();
    //        }
    //    }
    //};
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const carServiceHistoryReponse: APIResponse = await ListServiceShopHistory()
        const carServicesReponse: APIResponse = await ListServices()
        if (carServiceHistoryReponse.error || carServicesReponse.error) {
            if (carServiceHistoryReponse.error)
                setError(carServiceHistoryReponse.error)
            else if (carServicesReponse.error)
                setError(carServicesReponse.error)
        } else {
            seCarServiceHistory(carServiceHistoryReponse.data)
            setServices(carServicesReponse.data)
            setAvailableServices(carServicesReponse.data);
        }
        setLoading(false)
    };
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="manu-car-model-list-page">
            <div className="manu-car-model-top-bar">
                <button className="add-manu-car-model-btn" onClick={() => setShowModal(true)}>+ Add Car Service History</button>
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
                        <th>Car ID</th>
                        <th>Services Name</th>
                        <th>Other Services</th>
                        <th>Service Time</th>
                        <th>Report Date</th>
                        <th>Odometer</th>
                        <th>Note</th>
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
                            <td colSpan={5}>No Car Service History found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showModal && (
                <div className="manu-car-model-modal">
                    <div className="manu-car-model-modal-content">
                        <span className="manu-car-model-close-btn" onClick={() => { setShowModal(false); setModalPage(1) }}>&times;</span>
                        <h2>Add Car Services</h2>
                        {modalPage === 1 && (
                            <CarServiceAddModal
                                action="Add"
                                CarHistoryservice={newServiceHistory}
                                services={services}
                                availableServices={availableServices}
                                setServices={setService}
                                newServiceHistory={newServiceHistory}
                                handleInputChange={handleInputChange}
                                handleAddService={handleAddService}
                                handleRemoveService={handleRemoveService }

                            />
                        )}
                        <button onClick={handleServiceClick} disabled={adding} className="manu-car-model-next-btn">
                            {modalPage < 1 ? 'Next' : (adding ? (<div className="manu-car-model-inline-spinner"></div>) : 'Add')}
                        </button>
                        {addError && (
                            <p className="manu-car-model-error">{addError}</p>
                        )}
                    </div>
                </div>
            )}
            {/*{editRecalModel && (*/}
            {/*    <div className="manu-car-model-modal">*/}
            {/*        <div className="manu-car-model-modal-content">*/}
            {/*            <span className="manu-car-model-close-btn" onClick={() => { setEditRecallModel(null); setModalPage(1) }}>&times;</span>*/}
            {/*            <h2>Add Car Recall</h2>*/}
            {/*            {modalPage === 1 && (*/}
            {/*                <CarRecallEditModal*/}
            {/*                    action="Edit"*/}
            {/*                    model={editRecalModel}*/}
            {/*                    handleInputChange={handleInputChange}*/}
            {/*                />*/}
            {/*            )}*/}
            {/*            <button onClick={handleRecallEdit} disabled={adding} className="manu-car-model-next-btn">*/}
            {/*                {modalPage < 1 ? 'Next' : (adding ? (<div className="manu-car-model-inline-spinner"></div>) : 'Create')}*/}
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

export default ServiceShopHistory;