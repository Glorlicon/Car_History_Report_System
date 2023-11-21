import React from 'react';
import { CarModel, CarRecalls, CarServices, Services } from '../../../utils/Interfaces';

interface CarServiceEditModalCapacityProps {
    action: "Add" | "Edit"
    CarHistoryservice: CarServices,
    services: Services[],
    availableServices: Services[],
    newServiceHistory: CarServices,
    setServices: React.Dispatch<React.SetStateAction<string>>
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleAddService: () => void
    handleRemoveService: (index: number) => void
}

const CarServiceEditModal: React.FC<CarServiceEditModalCapacityProps> = ({
    action,
    CarHistoryservice,
    setServices,
    services,
    availableServices,
    newServiceHistory,
    handleInputChange,
    handleAddService,
    handleRemoveService
}) => {
    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // month starts at 0
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`; // format to YYYY-MM-DD
    };

    return (
        <>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Car ID</label>
                    <input type="text" name="carId" onChange={handleInputChange} value={CarHistoryservice.carId} min="0" disabled />
                </div>
                <div className="ad-car-model-form-column">
                    <label>Other Services</label>
                    <input type="text" name="otherServices" value={CarHistoryservice.otherServices} onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>Service Date</label>
                    <input type="date" name="serviceTime" value={formatDate(CarHistoryservice.serviceTime)} onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>Note</label>
                    <input type="text" name="note" value={CarHistoryservice.note} onChange={handleInputChange} min="0" />
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Odometer</label>
                    <input type="text" name="odometer" value={CarHistoryservice.odometer} onChange={handleInputChange} min="0" />
                </div>
                <div className="dealer-car-sales-form-column">
                    <label>Services: </label>
                    <select name="service" onChange={e => setServices(e.target.value)}>
                        {availableServices.map((s, index) => (
                            <option key={index} value={s.value}>{s.name}</option>
                        ))}
                    </select>
                    <button className="dealer-car-sales-add-feature-btn" type="button" onClick={handleAddService}>
                        +Add Service
                    </button>
                    <ul className="dealer-car-sales-feature-list">
                        {newServiceHistory?.selectedServices.map((serviceValue, index) => {
                            const serviceName = services.find(s => s.value === serviceValue)?.name || '';
                            return (
                                <li key={index} className="dealer-car-sales-feature-list-item">
                                    <span style={{ marginRight: '10px' }}>{serviceName}</span>
                                    <button
                                        className="dealer-car-sales-remove-feature-btn"
                                        type="button"
                                        onClick={() => handleRemoveService(serviceValue)}>
                                        Remove Service
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {/*ẩn vì date có thể lấy ngày hiện tại luôn*/}
                {/*<div className="ad-car-model-form-column">*/}
                {/*    <label>Date</label>*/}
                {/*    <input type="date" name="recallDate" onChange={handleInputChange} min="0" />*/}
                {/*</div>*/}
            </div>
            <div> </div>
        </>
    );
}

export default CarServiceEditModal;