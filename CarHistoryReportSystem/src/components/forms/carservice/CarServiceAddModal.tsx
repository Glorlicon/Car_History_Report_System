import React from 'react';
import { CarModel, CarRecalls, CarServices } from '../../../utils/Interfaces';

interface CarServiceAddModalCapacityProps {
    action: "Add" | "Edit"
    service: CarServices,
    services: string
    setServices: React.Dispatch<React.SetStateAction<string>>
    models?: CarModel[],
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleAddService: () => void
    handleRemoveService: (index: number) => void
}

const CarServiceAddModal: React.FC<CarServiceAddModalCapacityProps> = ({
    action,
    service,
    services,
    setServices,
    models,
    handleInputChange,
    handleAddService,
    handleRemoveService
}) => {
    return (
        <>
            <div className="manu-car-model-form-columns">
                    <div className="ad-car-model-form-column">
                        <label>Car ID</label>
                        <input type="text" name="description" onChange={handleInputChange} min="0" />
                    </div>
                    <div className="ad-car-model-form-column">
                        <label>Other Services</label>
                        <input type="text" name="description" onChange={handleInputChange} min="0" />
                    </div>
                <div className="ad-car-model-form-column">
                    <label>Service Date</label>
                    <input type="text" name="description" onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>Note</label>
                    <input type="text" name="description" onChange={handleInputChange} min="0" />
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>Odometer</label>
                    <input type="text" name="description" onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>Description</label>
                    <input type="text" name="description" onChange={handleInputChange} min="0" />
                </div>
                <div className="dealer-car-sales-form-column">
                    <label>Services: </label>
                    <input type="text" name="feature" value={services} onChange={e => setServices(e.target.value)} />
                    <button className="dealer-car-sales-add-feature-btn" type="button" onClick={handleAddService}>+Add Feature</button>
                    <ul className="dealer-car-sales-feature-list">
                        {model.features.map((f, index) => (
                            <li key={index} className="dealer-car-sales-feature-list-item">
                                <span style={{ marginRight: '10px' }}>{f}</span>
                                <button className="dealer-car-sales-remove-feature-btn" type="button" onClick={() => handleRemoveService(index)}>Remove Feature</button>
                            </li>
                        ))}
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