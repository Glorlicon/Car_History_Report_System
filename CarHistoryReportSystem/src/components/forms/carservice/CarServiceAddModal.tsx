import React from 'react';
import { CarModel, CarRecalls, CarServices, Services } from '../../../utils/Interfaces';

interface CarServiceAddModalCapacityProps {
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

const CarServiceAddModal: React.FC<CarServiceAddModalCapacityProps> = ({
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
    return (
        <>
            <div className="manu-car-model-form-columns">
                    <div className="ad-car-model-form-column">
                        <label>Car ID</label>
                    <input type="text" name="carId" onChange={handleInputChange} min="0" />
                    </div>
                    <div className="ad-car-model-form-column">
                        <label>Other Services</label>
                    <input type="text" name="otherServices" onChange={handleInputChange} min="0" />
                    </div>
                <div className="ad-car-model-form-column">
                    <label>Service Date</label>
                    <input type="date" name="serviceTime" onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>Note</label>
                    <input type="text" name="note" onChange={handleInputChange} min="0" />
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Odometer</label>
                    <input type="text" name="odometer" onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>Description</label>
                    <input type="text" name="description" onChange={handleInputChange} min="0" />
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

export default CarServiceAddModal;